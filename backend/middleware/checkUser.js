const Auth = require('../model/authModel');
const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        

        const user = await Auth.findById(verifyUser.id); 

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("JWT Verification Error:", error.message); 
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { checkUser };
