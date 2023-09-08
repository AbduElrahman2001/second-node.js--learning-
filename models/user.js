const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
    {
        username :{
            type :String,
            required: true,
            trim :true
        },
        password:{
            type : String,
            required :true,
            minlength :true,
            trim: true,
            validate(value){
                const password =new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")
                if(!password.test(password)){
                    throw new Error("pass must include [a-z],[A-Z],[0-9],[!@#$%^&*]")
                }
            }
        },
        email:{
            type: String,
            required: true,
            lowercase :true,
            unique :true,
            trim : true,
            // validate(val){
            //     if(!validator.isEmail(val)){
            //         throw new Error("inValid")
            //     }
            // }
        },
        tokens :[{
            type :String,
            required : true
        }]
    }
)
userSchema.pre("save" , async function (){
    const user = this
    console.log (user)
    if(user.isModified("password")){
    user.password = await bcryptjs.hash(user.password , 8)}
})
/////////////////////////////////////////////////
userSchema.statics.findByCredentials = async(em , pass)=>{
    const user = await User.findOne({email : em})
    if(!user){
        throw new Error("Wrong Email")
    }
    const isMatch = await bcryptjs.compare(pass , user.password)
    if(!isMatch){
        throw new Error('Wrong Password')
    }
    return user
}
/////////////////////////////////////////////////////////////////
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id :user._id.toString()} , "abdo")
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}

////////////////////////////////////////////////
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}


////////////////////////////////////////////////////////////
const User = mongoose.model("user" , userSchema )

module.exports = User