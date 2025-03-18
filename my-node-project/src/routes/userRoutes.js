const express = require('express');
const { getUsers, createUser, loginUser,deleteUser } = require('../controllers/userController');
const router = express.Router();
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', deleteUser); // ✅ تأكد من وجود مسار الحذف

router.post('/login', loginUser);

module.exports = router;