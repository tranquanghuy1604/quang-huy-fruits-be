const generator = require('generate-password');

const generatePassword = () =>
  generator.generate({
    length: 10,
    numbers: true,
  });

module.exports = {
  generatePassword,
};
