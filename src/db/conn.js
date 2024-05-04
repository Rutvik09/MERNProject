const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/registeration',).then((res)=>{
    console.log(res,"success connection established");
}).catch((err)=>{   console.log(err,"error ")})