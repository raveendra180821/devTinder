const express = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');
const {validateSignupData, checkIsUserAlreadyExist} = require('../helpers/validator')

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try{
        const body = req.body
        validateSignupData(body);
        
        const {email} = body
        await checkIsUserAlreadyExist(email)

        const password = body.password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({...body, password: hashedPassword});
        res.send(`${user.firstName} profile is created`);
    }catch(e){  
        res.status(400).send("ERROR: " + e.message)
    }
})

authRouter.post('/login',  async (req, res) =>{
    try{
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user){
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            const token = await user.getJWT()

            res.cookie("token", token, {maxAge: 60 * 60 * 1000})
            res.send(user.firstName + ' logged in successfully');
        }else{
            throw new Error("Invalid credentials")
        }
    }catch(e){
        res.status(400).send("ERROR: " + e.message)
    }
});

authRouter.post('/logout', (req,res) => {
    res.cookie('token', null, {expires: new Date(Date.now())})
    res.send("Logged out successfully !")
})

module.exports = authRouter;