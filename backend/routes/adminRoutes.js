const express = require('express');
const { createUser, updateUser, deleteUser } = require('../controllers/adminController.js');
const { protect, authorize } = require('../middlewares/authMiddleware.js');
const router = express.Router();
router.use(protect, authorize('admin'));
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
export default router;
