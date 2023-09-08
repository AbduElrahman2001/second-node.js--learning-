const express = require("express")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.post("/user" , (req,res)=>{
    console.log(req.body)
    const user = new User(req.body)
    user.save()
    .then((user)=>{res.status(200).send(user)})
    .catch((e)=>{res.status(400).send(e)})
})
////////////////////////////////////////////////////
router.get("/user",(req ,res)=>{
    User.find()
    .then((data)=>{res.status(200).send(data)})
    .catch((e)=>{res.status(200).send(e)})
})
//////////////////////////////////////////
router.get("/user/:id" , (req,res)=>{
    const _id = req.params.id
    User.findById(_id)
    .then((data)=>{
        if(!data){
            res.status(405).send("not fund")
        }res.status(200).send(data)
    })
    .catch((e)=>{res.status(200).send("user not exist")})
})
/////////////////////////////////////////////////////////////////
router.patch("/user/:id" , async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const user = await User.findById(_id)
        // const user = await User.findByIdAndUpdate(_id , req.body , {
        //     new : true,
        //     runValidators : true
        // }) 

        if(!user){
            return res.status(405).send("user not Exeist")
        }
        updates.forEach((ele)=>(user[ele] = req.body[ele]))
        await user.save()
        res.status(200).send(user)
    }
    catch(e){res.status(400).send(e)}
})
////////////////////////////////////////////
// login
router.post("/login" , async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateToken()
        res.status(200).send({user , token})
    }
    catch(e){res.status(200).send(e.message)}
})
/////////////////////////////////////////////////////
router.post("/user" , async(req , res)=>{
    try{
        const user = new User (req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(200).send({user , token})
    }catch(e){res.status(400).send(e)}
})


module.exports = router