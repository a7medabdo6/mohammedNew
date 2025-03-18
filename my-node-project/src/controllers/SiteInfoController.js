const SiteInfo = require('../models/siteInfo');

// ✅ تحديث بيانات الموقع (إنشاء أو تحديث)
const updateSiteInfo = async (req, res) => {
    try {
        const updates = req.body;

        // البحث عن أي بيانات موجودة، وإن لم تكن موجودة يتم إنشاؤها
        let siteInfo = await SiteInfo.findOne();

        if (siteInfo) {
            // تحديث البيانات إذا كانت موجودة
            siteInfo = await SiteInfo.findOneAndUpdate({}, updates, { new: true });
            return res.json({ message: '✅ تم تحديث بيانات الموقع بنجاح', siteInfo });
        } else {
            // إنشاء بيانات جديدة إذا لم تكن موجودة
            const newSiteInfo = new SiteInfo(updates);
            await newSiteInfo.save();
            return res.status(201).json({ message: '✅ تم إنشاء بيانات الموقع بنجاح', siteInfo: newSiteInfo });
        }
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء تحديث بيانات الموقع', error: error.message });
    }
};

// ✅ جلب بيانات الموقع
const getSiteInfo = async (req, res) => {
    try {
        const siteInfo = await SiteInfo.findOne();
        if (!siteInfo) {
            return res.status(404).json({ message: '❌ لا توجد بيانات متاحة للموقع' });
        }
        res.json(siteInfo);
    } catch (error) {
        res.status(500).json({ message: '❌ حدث خطأ أثناء جلب بيانات الموقع', error: error.message });
    }
};

module.exports = { updateSiteInfo, getSiteInfo };
