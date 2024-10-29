const express = require('express');
const router = express.Router();
const serverController = require('../controllers/server');
const catchAsync = require('../utils/catchAsync');

router.get('/order', serverController.getAllOrders);

module.exports = router;