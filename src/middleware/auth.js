const jwt = require('jsonwebtoken')
const Register = require('../models/register')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyuser = jwt.verify(token,process.env.SECREAT)
        console.log(verifyuser,"verifueddd")
        const user = await Register.findOne({ _id: verifyuser._id, })
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth