const express = require('express');
const router = express.Router();
const {
  createWithdrawalRequest,
  getCreatorWithdrawals,
  getAllWithdrawals,
  approveWithdrawalPayment
} = require('../controllers/withdrawalController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.post('/', verifyToken, verifyRole(['Creator']), createWithdrawalRequest);
router.get('/creator', verifyToken, verifyRole(['Creator']), getCreatorWithdrawals);
router.get('/', verifyToken, verifyRole(['Admin']), getAllWithdrawals);
router.patch('/:id/payout', verifyToken, verifyRole(['Admin']), approveWithdrawalPayment);

module.exports = router;
