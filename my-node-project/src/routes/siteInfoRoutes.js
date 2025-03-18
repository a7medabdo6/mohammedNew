const express = require('express');
const router = express.Router();
const { updateSiteInfo, getSiteInfo } = require('../controllers/SiteInfoController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware ');

// ✅ جلب بيانات الموقع
router.get('/', getSiteInfo);

// ✅ تحديث بيانات الموقع (للمسؤول فقط)
router.put('/', authMiddleware, adminMiddleware, updateSiteInfo);

module.exports = router;
