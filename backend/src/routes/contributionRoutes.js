const express = require('express');
const router = express.Router();
const {
  createContribution,
  getSupporterContributions,
  getCreatorContributions,
  approveContribution,
  rejectContribution
} = require('../controllers/contributionController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.post('/', verifyToken, verifyRole(['Supporter']), createContribution);
router.get('/supporter', verifyToken, verifyRole(['Supporter']), getSupporterContributions);
router.get('/creator', verifyToken, verifyRole(['Creator']), getCreatorContributions);
router.patch('/:id/approve', verifyToken, verifyRole(['Creator']), approveContribution);
router.patch('/:id/reject', verifyToken, verifyRole(['Creator']), rejectContribution);

module.exports = router;
