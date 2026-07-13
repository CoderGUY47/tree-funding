const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  reportCampaign,
  getAllReports,
  deleteReport
} = require('../controllers/adminController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.get('/stats', verifyToken, verifyRole(['Admin']), getAdminStats);
router.get('/users', verifyToken, verifyRole(['Admin']), getAllUsers);
router.put('/users/:id/role', verifyToken, verifyRole(['Admin']), updateUserRole);
router.delete('/users/:id', verifyToken, verifyRole(['Admin']), deleteUser);

router.post('/report', verifyToken, verifyRole(['Supporter']), reportCampaign);
router.get('/reports', verifyToken, verifyRole(['Admin']), getAllReports);
router.delete('/reports/:id', verifyToken, verifyRole(['Admin']), deleteReport);

module.exports = router;
