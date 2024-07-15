const axios = require('axios');
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const helper = require('../helper/helper');
const { MyError } = require('../configs/myError');
const User = require('../models/user');
const Rate = require('../models/rate');

module.exports = {
  async getAllOrder(req, res) {
    try {
      const orders = await Order.find().populate(['products.product', 'shipper_name']);
      const rates = await Rate.find();

      const ratesByOrderId = rates.reduce((acc, rate) => {
        if (!acc[rate.order_id]) {
          acc[rate.order_id] = [];
        }
        acc[rate.order_id].push(rate);
        return acc;
      }, {});

      const ordersWithRates = orders.map((order) => ({
        ...order.toObject(),
        rates: ratesByOrderId[order._id] || [],
      }));
      res.status(200).send(ordersWithRates);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getOrder(req, res) {
    try {
      const order = await Order.findById(req.params.orderId);
      res.status(200).send(order);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getAllListOrderShip(req, res) {
    try {
      const orderList = await Order.find({ status: 'waiting-delivery' });
      res.status(200).send(orderList);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getOrderDetail(req, res) {
    try {
      const orderDetail = await OrderDetail.find({
        order_id: req.body.orderId,
      }).populate('product');

      res.status(200).send(orderDetail);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async changeStatusOrder(req, res) {
    try {
      const order = await Order.findById(req.body.orderId);
      order.status = req.body.status;

      res.status(200).send(order);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listOrderByCondition(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = parseFloat(req.query.skip, 10) || 1;
      const [orders, totalOrders] = await Promise.all([
        Order.find()
          .sort({ created_at: -1 })
          .skip(limit * skip - limit)
          .limit(limit),
        Order.find().countDocuments(),
      ]);

      res.status(200).send({ orders, totalOrders });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async createOrder(req, res) {
    try {
      const order = new Order(req.body);
      await order.save();
      const productArr = [];
      const orderDetail = req.body.products.map((r) => ({
        order_id: order._id,
        product: r.product,
        quantity: r.quantity,
      }));

      req.body.products.forEach((r) => productArr.push(helper.updateProuctQuantity(r.product, r.quantity)));
      const responseData = await Promise.all([...productArr]);

      const errorMessages = responseData.filter((msg) => typeof msg === 'string');
      if (errorMessages.length > 0) {
        const errorMessage = 'Xin lỗi\n' + errorMessages.join('\n');
        throw new MyError(409, errorMessage);
      }

      await OrderDetail.insertMany(orderDetail);
      res.status(200).send(order);
    } catch (error) {
      if (error.code === 409) {
        res.status(error.code).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  },
  async deleteOrder(req, res) {
    try {
      await Promise.all([
        await OrderDetail.deleteMany({ order_id: req.params.orderId }),
        await Order.findByIdAndDelete(req.params.orderId),
      ]);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async updateOrder(req, res) {
    try {
      const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });

      res.status(200).send(order);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async cancelOrder(req, res) {
    try {
      const orders = await OrderDetail.find({ order_id: req.body.orderId });

      const productArr = [];
      orders.forEach(async (r) => {
        productArr.push(await helper.returnProuctQuantity(r.product, r.quantity));
      });
      await Promise.all(productArr);
      await Promise.all([
        await OrderDetail.deleteMany({ order_id: req.body.orderId }),
        await Order.findByIdAndDelete(req.body.orderId),
      ]);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getFeeShip(req, res) {
    try {
      const services = await axios.default.post(
        'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
        {
          shop_id: 1601630,
          from_district: 3303,
          to_district: req.body.to_district_id,
        },
        {
          headers: {
            Token: process.env.GHN_TOKEN,
          },
        },
      );
      const feeShip = await axios.default.post(
        'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          service_id: services.data.data[0].service_id,
          to_district_id: req.body.to_district_id,
          to_ward_code: req.body.to_ward_code,
          height: 10,
          length: 2,
          weight: 2,
          width: 2,
          insurance_fee: 10000,
          coupon: null,
        },
        {
          headers: {
            Token: process.env.GHN_TOKEN,
            shopId: 1601630,
          },
        },
      );

      res.status(200).send(feeShip.data);
    } catch (error) {
      res.status(500).send(error.data);
    }
  },
  async findOrder(req, res) {
    try {
      const { startDate, endDate, name } = req.body;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = parseFloat(req.query.skip, 10) || 1;
      let findObject = {};
      if (name) {
        findObject = Object.assign(findObject, {
          'customer.fullname': { $regex: name, $options: 'i' },
        });
      }

      if (startDate && endDate) {
        findObject = Object.assign(findObject, {
          created_at: {
            $gte: new Date(startDate).getTime(),
            $lte: new Date(endDate).getTime() + 86400000,
          },
        });
      }

      const [orders, totalOrders] = await Promise.all([
        Order.find(findObject)
          .sort({ created_at: -1 })
          .skip(limit * skip - limit)
          .limit(limit),
        Order.find(findObject).countDocuments(),
      ]);

      res.status(200).send({ orders, totalOrders });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async createShipOrder(req, res) {
    try {
      const services = await axios.default.post(
        'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
        {
          shop_id: 1601630,
          from_district: 3303,
          to_district: req.body.districtId,
        },
        {
          headers: {
            Token: process.env.GHN_TOKEN,
          },
        },
      );
      const response = await axios.default.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create',
        {
          shop_id: 79957,
          payment_type_id: req.body.paymentMethod === 'online' ? 1 : 2,
          note: req.body.note || '',
          required_note: 'KHONGCHOXEMHANG',
          return_phone: '0968626797',
          return_address: 'Số 40',
          return_district_id: 3303,
          return_ward_code: '1B2726',
          client_order_code: '',
          to_name: req.body.fullname,
          to_phone: req.body.phone,
          to_address: req.body.address,
          to_ward_code: req.body.wardCode,
          to_district_id: req.body.districtId,
          cod_amount: req.body.paymentMethod === 'online' ? 0 : req.body.total + req.body.feeShip,
          content: req.body.content || '',
          height: 10,
          length: 2,
          weight: 2,
          width: 2,
          deliver_station_id: null,
          insurance_value: 100000,
          service_id: services.data.data[0].service_id,
          coupon: null,
          pick_shift: [2],
          items: req.body.products.map((p) => ({
            name: p.product.name,
            quantity: p.quantity,
            price: p.product.price,
            length: 5,
            width: 5,
            height: 1,
          })),
        },
        {
          headers: {
            Token: '2ff9021b-b3d6-11eb-8080-c61f6a6501ca',
            ShopId: 79957,
          },
        },
      );
      const order = await Order.findByIdAndUpdate(
        req.body.orderId,
        { ship_code: response.data.data.order_code },
        { new: true },
      );

      return res.status(200).send(order);
    } catch (error) {
      if (error.response.data.code === 400) {
        return res.status(500).send(error.response.data.code_message_value);
      }
      return res.status(500).send(error);
    }
  },
  async listOrderByStatus(req, res) {
    try {
      const order = await Order.find({ status: { $in: ['waiting-delivery', 'pending'] } });

      res.status(200).send(order);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async takeOrder(req, res) {
    try {
      const order = await Order.findOneAndUpdate({ _id: req.body._id }, { status: 'waiting-delivery' }, { new: true });
      const user = await User.findOneAndUpdate(
        { _id: order.customer_id },
        { status: 'waiting-delivery' },
        { new: true },
      );

      if (!order) {
        return res.status(400).json({ error: 'Cannot update order status' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Cannot update user status' });
      }

      res.send({ order, user });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async onDelivering(req, res) {
    try {
      const order = await Order.findOne({ _id: req.body._id }).populate(['shipper_name', 'customer_id']);

      order.status = 'pending';
      order.shipper_name = req.body.shipper_id;
      await order.save();
      const user = await User.findOneAndUpdate({ _id: order.customer_id }, { status: 'pending' }, { new: true });
      if (!order) {
        return res.status(400).json({ error: 'Cannot update order status' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Cannot update shipper status' });
      }
      const shipper = await User.find({ _id: order.shipper_name });
      res.send({ order, user, shipper });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async onDelivered(req, res) {
    try {
      const order = await Order.findOneAndUpdate({ _id: req.body._id }, { status: 'finish' }, { new: true });

      if (!order) {
        return res.status(400).json({ error: 'Cannot update order status' });
      }

      res.send(order);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getUserOrder(req, res) {
    try {
      const orders = await Order.find({ customer_id: req.body.userId });
      const rates = await Rate.find();

      const ratesByOrderId = rates.reduce((acc, rate) => {
        if (!acc[rate.order_id]) {
          acc[rate.order_id] = [];
        }
        acc[rate.order_id].push(rate);
        return acc;
      }, {});

      const ordersWithRates = orders.map((order) => ({
        ...order.toObject(),
        rates: ratesByOrderId[order._id] || [],
      }));
      res.status(200).send(ordersWithRates);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getOrderFinish(req, res) {
    try {
      const orders = await Order.find({ customer_id: req.body.customer_id, status: 'finish' });

      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getOrderConfirm(req, res) {
    try {
      const orders = await Order.find({ customer_id: req.body.customer_id, status: 'waiting-confirm' });

      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteOrderFromUser(req, res) {
    try {
      const orders = await Order.findByIdAndUpdate({ _id: req.body._id }, { status: 'deleted' }, { new: true });

      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
