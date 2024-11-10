const express = require('express');
const router = express.Router();
const maidController = require('../controllers/maid');
const catchAsync = require('../utils/catchAsync');

router.get('/', maidController.index);

router.route('/create')
    .get(catchAsync(maidController.create)) // GETリクエスト
    .post((maidController.createPost)); // POSTリクエスト

router.route('/:id')
    .get(catchAsync(maidController.edit))
    .put((maidController.update))
    .delete(catchAsync(maidController.delete))

router.route('/:id/delete-image')
    .delete(catchAsync(maidController.deleteImage))

module.exports = router;