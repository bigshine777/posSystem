const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const catchAsync = require('../utils/catchAsync');

router.get('/', productController.index);

router.route('/create')
    .get(catchAsync(productController.create)) // GETリクエスト
    .post((productController.createPost)); // POSTリクエスト

router.route('/:id')
    .get(catchAsync(productController.edit))
    .put((productController.update))
    .delete(catchAsync(productController.delete))

router.route('/:id/delete-image')
    .delete(catchAsync(productController.deleteImage))

module.exports = router;