const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    // check for token
    if (!token)
        return res.status(403).json({ error: "Authorization denied, please login" });

    try {
        //verify token
        const decoded = jwt.verify(token, jwtSecret);
        // add user from token payload which contains the user id we attached to the token
        req.user = decoded;
    } catch (e) {
        res.status(400).json({ error: "Please log in" });
    }
    next()
};


module.exports = { auth };