const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const catchAsync = require('../utils/catchAsync');

router.get('/',catchAsync(orderController.index));

router.route('/create')
    .get(catchAsync(orderController.create)) // GETリクエスト
    .post(catchAsync(orderController.createPost)); // POSTリクエスト


module.exports = router;