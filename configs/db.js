const mongoose = require('mongoose');

module.exports = async () => {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(error);
  }
};
