const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(checkoutController.index));

router.route('/create')
    .get(catchAsync(checkoutController.create))
    .post(catchAsync(checkoutController.createPost));

router.post('/sendEmail/:date', checkoutController.sendEmail);

router.route('/:id')
    .get(catchAsync(checkoutController.show))
    .patch(catchAsync(checkoutController.paid))
    .delete(catchAsync(checkoutController.delete));

router.route('/:id/edit')
    .get(catchAsync(checkoutController.edit))
    .put(catchAsync(checkoutController.update))

module.exports = router;