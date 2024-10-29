const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(checkoutController.index));

router.route('/create')
    .get(catchAsync(checkoutController.create))
    .post(catchAsync(checkoutController.createPost));

router.route('/:id')
    .get(catchAsync(checkoutController.show))
    .put(catchAsync(checkoutController.update))
    .patch(catchAsync(checkoutController.paid))
    .delete(catchAsync(checkoutController.delete));

router.route('/:id/edit')
    .get(catchAsync(checkoutController.edit));

module.exports = router;