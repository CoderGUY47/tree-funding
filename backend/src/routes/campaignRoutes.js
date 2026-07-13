const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  approveCampaign,
  rejectCampaign
} = require('../controllers/campaignController');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.post('/', verifyToken, verifyRole(['Creator']), createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', verifyToken, verifyRole(['Creator']), updateCampaign);
router.delete('/:id', verifyToken, verifyRole(['Creator', 'Admin']), deleteCampaign);
router.patch('/:id/approve', verifyToken, verifyRole(['Admin']), approveCampaign);
router.patch('/:id/reject', verifyToken, verifyRole(['Admin']), rejectCampaign);

module.exports = router;
