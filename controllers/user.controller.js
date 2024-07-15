const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generatePassword = require('../configs/generatePassword');
const { sendMail } = require('../configs/mailjet');

module.exports = {
  async createUser(req, res) {
    try {
      const password = req.body.password ? req.body.password : generatePassword.generatePassword();
      const user = new User({
        ...req.body,
        password,
        active_code: req.body.password ? generatePassword.generatePassword() : password,
        role: 'customer',
      });
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async createShipper(req, res) {
    try {
      const password = req.body.password ? req.body.password : generatePassword.generatePassword();
      const user = new User({
        ...req.body,
        password,
        active_code: req.body.password ? generatePassword.generatePassword() : password,
        role: 'shipper',
      });
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async createUserAdmin(req, res) {
    try {
      const password = req.body.password ? req.body.password : generatePassword.generatePassword();
      const user = new User({
        ...req.body,
        password,
        active_code: req.body.password ? generatePassword.generatePassword() : password,
        role: 'customer',
      });
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      res.status(409).send(error);
    }
  },
  async listUser(req, res) {
    try {
      let findObject = {};
      if (req.query.role) {
        findObject = Object.assign(findObject, { role: req.query.role });
      }
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = parseFloat(req.query.skip, 10) || 1;
      const [users, totalUsers] = await Promise.all([
        User.find(findObject)
          .skip(limit * skip - limit)
          .limit(limit),
        User.find(findObject).countDocuments(),
      ]);

      res.status(200).send({ users, total: totalUsers });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.userId);

      res.status(200).send();
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body);

      res.status(200).send(user);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listAllCustomer(req, res) {
    try {
      const shipper = await User.find({ role: 'shipper' });

      res.status(200).send(shipper);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listAllUser(req, res) {
    try {
      const customer = await User.find({ role: 'customer' });

      res.status(200).send(customer);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async listAllShipper(req, res) {
    try {
      const customer = await User.find({ role: 'shipper' });

      res.status(200).send(customer);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();

      res.status(200).send({ user, token });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);

      if (user.role === 'customer') {
        return res.status(500).send();
      }
      const token = await user.generateAuthToken();

      return res.status(200).send({ user, token });
    } catch (error) {
      return res.status(404).send(error);
    }
  },
  async loginShipper(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByCredentials(email, password);

      if (user.role === 'customer' || user.role === 'admin') {
        return res.status(500).send();
      }
      const token = await user.generateAuthToken();

      return res.status(200).send({ user, token });
    } catch (error) {
      return res.status(404).send(error);
    }
  },
  async getUser(req, res) {
    try {
      res.status(200).send(req.user);
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async findUserByName(req, res) {
    try {
      const limit = Number(req.query.limit) || 10;
      const skip = Number(req.query.skip) || 1;
      const regex = new RegExp(req.query.text, 'i');

      const users = await User.aggregate([
        { $project: { fullname: { $concat: ['$first_name', ' ', '$last_name'] }, doc: '$$ROOT' } },
        { $match: { fullname: regex } },
        {
          $facet: {
            data: [{ $skip: skip - 1 }, { $limit: limit }],
            pagination: [{ $count: 'total' }],
          },
        },
      ]);

      res.status(200).send({ users: users[0].data, total: users[0].pagination.total });
    } catch (error) {
      res.status(404).send(error);
    }
  },
  async changePass(req, res) {
    try {
      const isMatchPassword = await bcrypt.compare(req.body.oldPass, req.user.password);
      if (isMatchPassword) {
        req.user.password = req.body.newPass;
        await req.user.save();
      }

      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  },
  async forgotPasswordAdmin(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email, role: 'employee' });
      if (!user) {
        return res.status(404).send();
      }
      const newPass = generatePassword.generatePassword();
      user.password = newPass;
      await user.save();
      await sendMail(user.first_name + user.last_name, user.email, newPass);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  async forgotPassword(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email, role: 'customer' });
      if (!user) {
        return res.status(404).send();
      }
      const newPass = generatePassword.generatePassword();
      user.password = newPass;
      await user.save();
      await sendMail(user.email, newPass);

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
