// eslint-disable-next-line no-unused-vars
const { default: axios } = require('axios');
const dayjs = require('dayjs');
const qs = require('qs');

const VNPay = require('node-vnpay');
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

let globalAppTransId = null;

module.exports = {
  async createPaymentUrl(req, res) {
    const embed_data = {
      redirecturl: 'https://quang-huy-fruit.vercel.app',
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: req.body.total,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: '',
      callback_url: 'https://bb43-58-187-59-51.ngrok-free.app/payment/callback',
    };

    globalAppTransId = app_trans_id;

    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, {
        params: order,
        trans_app_id: `${moment().format('YYMMDD')}_${transID}`,
      });
      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
    }
  },

  async callback(req, res) {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);

      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id']);

        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      result.return_code = 0;
      result.return_message = ex.message;
    }

    res.json(result);
  },
  async orderStatus(req, res) {
    const app_trans_id = globalAppTransId;
    let postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: 'post',
      url: 'https://sb-openapi.zalopay.vn/v2/query',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);
      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
    }
  },
};
