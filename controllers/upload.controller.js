module.exports = {
  uploadImage(req, res) {
    try {
      res.send(req.file);
    } catch (err) {
      res.status(400).send({
        status: false,
        message: err.message,
      });
    }
  },
};
