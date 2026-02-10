const express = require('express');
const { auth } = require('../../guards/auth.guard');
const {
  getSettings,
  updateProfile,
  updateAppearance,
  updateAccount,
  updateNotifications,
} = require('./settings.controller');

const router = express.Router();

router.use(auth);

router.get('/', getSettings);
router.put('/profile', updateProfile);
router.put('/appearance', updateAppearance);
router.put('/account', updateAccount);
router.put('/notifications', updateNotifications);

module.exports = router;
