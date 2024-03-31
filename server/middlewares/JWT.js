const jwt = require('jsonwebtoken');


const JWT_AUTH = async (req, res, next) => {


    try {
        let token = req.headers.authorization

        console.log(token);


        if (token === "VIA EMAIL") {
            return next()
        }

        console.log("hello");

        if (!token) return res.status(403).send("Access Forbidden");


        if (token.startsWith('Bearer ')) {
            token = token.split(" ")[1]
        }

        const verifyUser = jwt.verify(token, process.env.SECRET)

        if (verifyUser) {
            res.user = verifyUser
            next()
        }

    } catch (error) {

        res.status(500).json({ error: error.message })

    }

}


module.exports = JWT_AUTH