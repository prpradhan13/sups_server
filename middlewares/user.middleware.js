import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('-password -resetPasswordToken');

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: user not found!' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong!' });
    }
};

export const authorizeAdmin = async (req, res, next) => {
    try {
        const user = req.user;

        if (user.isAdmin !== true) {
            return res.status(403).json({ message: 'Forbidden: Admins only!' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong!: Admin can not authorized!' });
    }
};