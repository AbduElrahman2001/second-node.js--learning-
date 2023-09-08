const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()


const port = 3000

require("./db/mongoose")
app.use(express.json())
const userRouter = require("./routers/users")

app.use(userRouter)

app.listen(port , ()=>{console.log(`app listening On ${port}`)})


