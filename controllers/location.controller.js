const axios = require('axios');

module.exports = {
  async getProvince(req, res) {
    try {
      const { data } = await axios.default.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
      });

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getDistrict(req, res) {
    try {
      const { data } = await axios.default.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        province_id: parseInt(req.query.provinceId, 10),
      },
      {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
      });
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getWard(req, res) {
    try {
      const { data } = await axios.default.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id', {
        district_id: parseInt(req.query.districtId, 10),
      },
      {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
      });

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
