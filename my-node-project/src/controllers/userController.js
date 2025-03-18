const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // استبعاد كلمة المرور عند الإرجاع
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, country, role, password } = req.body;

        // تحقق مما إذا كان البريد الإلكتروني مسجلاً بالفعل
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // إنشاء مستخدم جديد
        const newUser = new User({ firstName, lastName, email, phone, address, country, role, password });
        await newUser.save();

        // توليد التوكن
        const token = newUser.generateAuthToken();
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email is not registered' });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate token and return user data
        const token = user.generateAuthToken();
        res.json({ user, token });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'An unexpected error occurred during login' });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};


module.exports = { getUsers, createUser, loginUser, deleteUser };
