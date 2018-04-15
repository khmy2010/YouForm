module.exports = (req, res, next) => {
    if (!req.user) {
        return res
            .status(401)
            .send({ error: 'Login is required to perform this operation.' });
    }

    next();
};
