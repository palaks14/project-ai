const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/explain', aiController.generateExplanation);
router.post('/quiz', aiController.generateQuiz);
router.get('/job/:jobId', aiController.getJobStatus);

module.exports = router;
