const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Message, User } = require('../models');
const ROLE_PERMISSIONS = {
  Head: ['Manager', 'Assistant Manager', 'Executive', 'Trainee'],
  Manager: ['Head', 'Assistant Manager', 'Executive', 'Trainee'],
  'Assistant Manager': ['Manager', 'Executive'],
  Executive: ['Assistant Manager', 'Trainee'],
  Trainee: [] // Trainee is read-only
};
// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Message send failed', error: err });
  }
});

// GET /api/messages
router.get('/', async (req, res) => {
  const {
    userId, // logged-in user
    role,
    department,
    senderId,
    startDate,
    endDate,
    messageType,
    priority
  } = req.query;

  const where = {};

  try {
    // 🔍 1. Get logged-in user to apply permission
    const loggedUser = await User.findByPk(userId);
    if (!loggedUser) return res.status(404).json({ message: "User not found" });

    const allowedRoles = ROLE_PERMISSIONS[loggedUser.role] || [];

    // 🔍 2. Apply permission filter (user can only see messages where allowed role is involved)
    where[Op.or] = [
      { senderId: loggedUser.id },
      { receiverId: loggedUser.id },
      {
        '$Sender.role$': {
          [Op.in]: allowedRoles
        }
      },
      {
        '$Receiver.role$': {
          [Op.in]: allowedRoles
        }
      }
    ];

    // 📎 Additional filters
    if (role) where['$Sender.role$'] = role;
    if (department) where['department'] = department;
    if (senderId) where['senderId'] = senderId;
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (priority) where['priority'] = priority;
    if (messageType) where['messageType'] = messageType;

    const messages = await Message.findAll({
      where,
      include: [
        { model: User, as: 'Sender' },
        { model: User, as: 'Receiver' },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(messages);
  } catch (err) {
    console.error("❌ Message fetch error:", err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
