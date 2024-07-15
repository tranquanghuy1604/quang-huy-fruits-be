const User = require('../models/user');

const initUser = async () => {
  const user = await User.findOne({ email: 'admin@gmail.com' });
  if (!user) await admin.save();

  const admin = new User({
    email: 'admin@gmail.com',
    password: '1234',
    active: true,
    role: 'admin',
    active_code: null,
    first_name: 'Admin',
    last_name: '',
  });

  // for (let i = 1; i < 4; i++) {
  //   const shipper = new User({
  //     email: `shipper${i}@gmail.com`,
  //     password: '12345',
  //     active: true,
  //     role: 'shipper',
  //     active_code: null,
  //     first_name: 'Shipper',
  //     last_name: i,
  //   });
  //   const shipperMain = await User.findOne({ email: `shipper${i}@gmail.com` });

  //   if (!shipperMain) {
  //     await shipper.save();
  //   }
  // }
};

module.exports = initUser;
