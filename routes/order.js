const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(orderController.index));

router.route('/create')
    .get(catchAsync(orderController.create)) // GETリクエスト
    .post(catchAsync(orderController.createPost)); // POSTリクエスト

router.route('/:id')
    .get(catchAsync(orderController.edit)) // GETリクエスト
    .put(catchAsync(orderController.update)) // PUTリクエスト
    .delete(catchAsync(orderController.delete)) // DELETEリクエスト
    .patch(catchAsync(orderController.toggleIsServed))


module.exports = router;