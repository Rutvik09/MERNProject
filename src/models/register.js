const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const studentschema = new mongoose.Schema({
   

  fullname: {
    type: "string",
    required: true,
   
  },
  email:{
    type: "string",
    required: true,
    trim: true,
    unique: [true, "email is present"],
    validate(value) {
      if (!validate.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password:{
    type: "string",
    required: true,
   
  },
  tokens :[{token: {
    type: "string",
    required: true,
  }}]
});

studentschema.methods.generateAuthToken = async function ()
{
  try {
    const token = await jwt.sign({ _id: this._id },process.env.SECREAT) 
    this.tokens = this.tokens.concat({token: token})
    return token;
  }
  catch (error) {
    console.log(error)
  }
}
studentschema.pre('save', async function(next){
  this.password=  await bcrypt.hash(this.password,10)
  next()
})

const Register = new mongoose.model("Student", studentschema);

module.exports = Register