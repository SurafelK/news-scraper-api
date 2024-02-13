const express = require('express');
const { getNews } = require('../Controller/newsController');

const router = express.Router();

router.get('/business-fana-news', getNews);

module.exports = router;
