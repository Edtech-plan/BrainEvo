const express = require('express');
const { getDashboard, getCourseAnalytics, getTeacherDashboard } = require('./analytics.controller');
const { auth, authorize } = require('../../guards/auth.guard');

const router = express.Router();

router.use(auth);

router.get('/teacher-dashboard', authorize('teacher', 'organization_admin'), getTeacherDashboard);
router.get('/dashboard', authorize('organization_admin', 'teacher'), getDashboard);
router.get('/course/:courseId', authorize('organization_admin', 'teacher'), getCourseAnalytics);

module.exports = router;
