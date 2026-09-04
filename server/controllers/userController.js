const User = require('../models/User');
const IssuedBook = require('../models/IssuedBook');

// @desc    Get all users (with optional role filter)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { registerNumber: searchRegex },
        { department: searchRegex },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID with borrowing history
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get borrowing history
    const history = await IssuedBook.find({ student: user._id })
      .populate('book', 'title author isbn category shelfNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student/user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, department, registerNumber, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      department: department ? department.trim() : 'General',
      registerNumber: registerNumber ? registerNumber.trim() : `REG-${Date.now().toString().slice(-6)}`,
      role: role && ['Admin', 'Student'].includes(role) ? role : 'Student',
      password,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        registerNumber: user.registerNumber,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student/user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, phone, department, registerNumber, role } = req.body;

    user.name = name !== undefined ? name.trim() : user.name;
    user.email = email !== undefined ? email.toLowerCase().trim() : user.email;
    user.phone = phone !== undefined ? phone.trim() : user.phone;
    user.department = department !== undefined ? department.trim() : user.department;
    user.registerNumber = registerNumber !== undefined ? registerNumber.trim() : user.registerNumber;
    user.role = role !== undefined ? role : user.role;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
