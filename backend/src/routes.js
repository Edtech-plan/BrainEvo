const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const courseRoutes = require('./modules/course/course.routes');
const assignmentRoutes = require('./modules/assignment/assignment.routes');
const submissionRoutes = require('./modules/submission/submission.routes');
const liveClassRoutes = require('./modules/liveClass/liveClass.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const settingsRoutes = require('./modules/settings/settings.routes');
const invitationRoutes = require('./modules/invitation/invitation.routes');
const organizationRoutes = require('./modules/organization/organization.routes');
const batchRoutes = require('./modules/batch/batch.routes');
const enrollmentRoutes = require('./modules/enrollment/enrollment.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/live-classes', liveClassRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/invitations', invitationRoutes);
router.use('/organizations', organizationRoutes);
router.use('/batches', batchRoutes);
router.use('/enrollments', enrollmentRoutes);

module.exports = router;
