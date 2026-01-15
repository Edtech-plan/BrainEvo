const express = require('express');
const { getDashboard, getCourseAnalytics } = require('./analytics.controller');
const { auth, authorize } = require('../../guards/auth.guard');

const router = express.Router();

router.use(auth);

router.get('/dashboard', authorize('organization_admin', 'teacher'), getDashboard);
router.get('/course/:courseId', authorize('organization_admin', 'teacher'), getCourseAnalytics);

module.exports = router;
