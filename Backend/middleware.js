const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({ msg: "Tokens are not generated!Access denied" });
    }
    try{
        //decode the token to original json message {username:"xyz",id:"23fk1kmdl"} using *****jwt.verify(token,secret_key);********
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        //token contains username and id which is stored in req
        req.user = decodedToken;
        next();
    }
    catch(err){
        res.status(401).json({ msg: "Invalid token" });
    }
}
module.exports = {verifyToken};