
const express= require('express')
const { default: mongoose } = require('mongoose')
const route= require('./routes/route')

const app = express()

app.use(express.json())
mongoose
  .connect(
    "mongodb+srv://palsubodh:Palsubodh@cluster0.mhegah9.mongodb.net/group2Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is Connected."))
  .catch((error) => console.log(error));


app.use("/",route)

app.use(function (req, res) {
  var err = new Error("Not Found.")
  err.status = 404
  return res.status(404).send({ status: "404", msg: "Path not Found." })
})

app.listen(process.env.PORT ||3000,function(){
    console.log('Express App Running on Port: ' + (process.env.PORT || 3000))
})




