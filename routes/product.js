const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const catchAsync = require('../utils/catchAsync');

router.get('/', productController.index);

router.route('/create')
    .get(catchAsync(productController.create)) // GETリクエスト
    .post(catchAsync(productController.createPost)); // POSTリクエスト

router.route('/:id')
    .get(catchAsync(productController.edit))
    .put(catchAsync(productController.update))
    .delete(catchAsync(productController.delete))

module.exports = router;