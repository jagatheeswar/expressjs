const jwt = require('jsonwebtoken')
const Register = require('../models/registers')

const auth = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt
        const verifyuser = jwt.verify(token,"lksfowieplkfdjnvoiwsdffsdfwerwrewweopewnpogpo")
        console.log(verifyuser + " verify ")
        const user = await Register.findOne({_id:verifyuser._id})
        console.log(user)
        next()
    }
    catch(error){
        res.status(401).send(error)
    }
}

module.exports = auth;