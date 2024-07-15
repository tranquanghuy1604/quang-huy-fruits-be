const Product = require('../models/product');
const Category = require('../models/category');
const Property = require('../models/productProperty');
const multer = require('multer');
module.exports = {
  async createCategory(req, res) {
    try {
      const category = new Category(req.body);
      await category.save();

      res.status(200).send(category);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async deleteCategory(req, res) {
    try {
      const product = await Product.findOne({ category_id: req.params.categoryId });
      if (product) return res.status(405).send({ error: 'You must delete all products in category!!' });
      await Category.findByIdAndDelete(req.params.categoryId);

      return res.status(200).send();
    } catch (error) {
      return res.status(404).send(error);
    }
  },
  async listAllCategory(req, res) {
    try {
      const categories = await Category.find();

      res.status(200).send(categories);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async createProduct(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Không có hình ảnh nào được gửi đến' });
      }

      const data = req.body;
      const imageFile = req.files[0];
      const product = new Product({
        name: data.name,
        category_id: data.category_id,
        cost_price: Number(data.cost_price),
        price: Number(data.price),
        amount: Number(data.amount),
        description: data.description,
        images: imageFile.path,
        unit: data.unit,
        properties: data.properties,
      });

      await product.save();

      res.status(201).json({ message: 'Thêm sản phẩm thành công', product: product });
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async editProduct(req, res) {
    try {
      const imageFile = req.files[0];

      const product = {
        name: req.body.name,
        category_id: req.body.category_id,
        cost_price: Number(req.body.cost_price),
        price: Number(req.body.price),
        amount: Number(req.body.amount),
        description: req.body.description,
        unit: req.body.unit,
        properties: req.body.properties,
      };
      if (imageFile) {
        const images = imageFile.path;
        product['images'] = images;
      }
      await Product.findByIdAndUpdate(req.params.productId, product, { new: true });

      res.status(200).json({ product });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async deleteProduct(req, res) {
    try {
      await Product.findByIdAndDelete(req.params.productId);

      res.status(200).send();
    } catch (error) {
      res.status(404).send();
    }
  },
  async listAllProduct(req, res) {
    try {
      const products = await Product.find().populate('category_id');

      res.status(200).send(products);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.productId);

      res.status(200).send(product);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async createProductProp(req, res) {
    try {
      const property = new Property(req.body);
      const product = await Product.findById(req.params.productId);
      await property.save();
      product.properties.push(property._id);
      await product.save();

      res.status(200).send(property);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async deleteProductProp(req, res) {
    try {
      await Property.findByIdAndDelete(req.params.propertyId);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getProductByCategoryPrice(req, res) {
    try {
      const { startPrice, endPrice } = req.body;
      const conditionObject = {
        category_id: req.body.category_id,
        price: {
          $gte: startPrice || 0,
          $lte: endPrice || 100000000,
        },
      };

      const products = await Product.find(conditionObject);

      res.status(200).send(products);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async getProductByCategory(req, res) {
    try {
      const conditionObject = {
        category_id: req.body.category_id,
      };

      const products = await Product.find(conditionObject);

      res.status(200).send(products);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listProductByCondition(req, res) {
    try {
      let conditionObjet = {};
      if (req.body.name) {
        conditionObjet = Object.assign(conditionObjet, { name: { $regex: req.body.name, $options: 'i' } });
      }
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = parseFloat(req.query.skip, 10) || 1;
      const [products, totalProducts] = await Promise.all([
        Product.find(conditionObjet)
          .sort({ created_at: -1 })
          .skip(limit * skip - limit)
          .limit(limit),
        Product.find(conditionObjet).countDocuments(),
      ]);

      res.status(200).send({ products, totalProducts });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  // async getTotalProductPrice(req, res) {

  // },
};
