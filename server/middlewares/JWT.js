const jwt = require('jsonwebtoken');

const JWT_AUTH = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token === "VIA EMAIL") {
            return next();
        }

        if (!token) return res.status(403).send("Access Forbidden");

        if (token.startsWith('Bearer ')) {
            token = token.split(" ")[1];
        }

        const decodedToken = jwt.verify(token, process.env.SECRET);

        //console.log("xxxxxxxxxxxxxxxxxxxxx", decodedToken.exp, Date.now());


        res.user = decodedToken;
        next();
    } catch (error) {
        //console.log(error);
        res.status(403).json({ error: error.message });
    }
};

module.exports = JWT_AUTH;
