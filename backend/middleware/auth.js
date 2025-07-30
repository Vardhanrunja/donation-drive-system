// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function auth(requiredRole = null) {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            if (requiredRole && decoded.userType !== requiredRole) {
                return res.status(403).json({ message: 'Access denied: insufficient role' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
    };
}

module.exports = auth;
