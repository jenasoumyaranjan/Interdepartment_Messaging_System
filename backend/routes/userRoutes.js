const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/users/allowed
router.get('/allowed', async (req, res) => {
  const { userId } = req.query;

  try {
    const currentUser = await db.User.findByPk(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const rolePermissions = {
      Head: ['Manager', 'Assistant Manager', 'Executive', 'Trainee'],
      Manager: ['Head', 'Assistant Manager', 'Executive', 'Trainee'],
      'Assistant Manager': ['Manager', 'Executive'],
      Executive: ['Assistant Manager', 'Trainee'],
      Trainee: []
    };

    const allowedRoles = rolePermissions[currentUser.role] || [];

    const users = await db.User.findAll({
      where: {
        department: currentUser.department,
        role: allowedRoles,
        id: { [db.Sequelize.Op.ne]: userId } // exclude self
      },
      attributes: ['id', 'name', 'role']
    });

    res.json(users);
  } catch (err) {
    console.error('❌ User fetch error:', err);
    res.status(500).json({ message: 'Error fetching allowed users' });
  }
});

module.exports = router;
