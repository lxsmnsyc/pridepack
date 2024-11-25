// ANCHOR Server
import SERVER from '../server';

SERVER.get(
  '/',
  async (req, res) => {
    req.log.info('Hello there!');

    return res.send({
      home_url: "https://service.trylyon.com/",
    });
  },
);
