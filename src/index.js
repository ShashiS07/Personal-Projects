
const express= require('express')
const { default: mongoose } = require('mongoose')
const route= require('./routes/route')
const multer=require('multer')
const cors = require('cors')
const app = express()

const { AppConfig } = require('aws-sdk');
app.use(multer().any())
app.use(cors());

app.use (
  function (req, res, next) {
      res.setHeader("Access-Control-Allow-Origin",'*')
      next();
}
);

app.use(express.json())
mongoose
  .connect(
    "mongodb+srv://Shashi_Shekhar_Singh:Shashi0708@myproject.mb3u3za.mongodb.net/BookManagement?authSource=admin&replicaSet=atlas-lhj98j-shard-0&readPreference=primary&ssl=true",
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



app.listen(process.env.PORT ||3001,function(){
    console.log('Express App Running on Port: ' + (process.env.PORT || 3001))
})




