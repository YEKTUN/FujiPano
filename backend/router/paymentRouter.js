const router = require('express').Router();
const paymentController = require('../controller/paymentController');

router.post('/create-payment', paymentController.createPayment);
router.post('/get-payment', paymentController.getPayment);
router.post('/start-3d-payment', paymentController.start3DPayment);
router.post('/complete-3d-payment', paymentController.complete3DPayment);



module.exports = router;