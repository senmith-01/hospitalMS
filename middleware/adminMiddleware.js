module.exports = function (req, res, next) {
    // Check if user exists (should be set by auth middleware)
    if (!req.user) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }

    // Check if user role is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    next();
};
