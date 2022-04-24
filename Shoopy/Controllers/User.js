const User = require("../Models/User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")


exports.SignUp=async(req,res)=>{
    try {
        const {email,password} = req.body
        const found = await User.findOne({email})
        if (found){return res.status(400).send({errors:[{msg:'Email already exist'}]})}
        const newUser = new User(req.body)
        const salt = 10
        const hashedPassword = bcrypt.hashSync(password,salt)
        newUser.password = hashedPassword
        const payload = {id : newUser._id}
        var token = jwt.sign(payload,process.env.privatekey,{ expiresIn: '24h' })
        newUser.save()
        res.status(200).send({msg:'User registered with success',newUser,token})
    } catch (error) {
        res.status(500).send({errors : [{msg : 'Failed to Register'}]})
    }
}

exports.SignIn=async(req,res)=>{
    try {
        const{email,password}=req.body
        const found = await User.findOne({email})
        if (!found){return res.status(400).send({errors:[{msg:'Wrong email'}]})}
        const match = await bcrypt.compare(password, found.password);
        if (!match){return res.status(400).send({errors:[{msg:'Wrong Password'}]})}
        const payload = {id : found._id}
        var token = jwt.sign(payload,process.env.privatekey, { expiresIn: '24h' });
        res.status(200).send({msg:'Logged in',token,found})
    } catch (error) {
        res.status(500).send({errors:[{msg: 'Failed to Login'}]})
    }
}
