const mongoose=require('mongoose')
const Schema=mongoose.Schema;

// Category=> fields => [type,colour]
// Aise karke unlimited fields banale which you require
const categories_model=new Schema({
    type: {type:String, default:"kuch b daal de"},
    colour: {type:String, default:"kuch b 2"}
})


// mongoose.model("name mentioned here","structure mentioned here")
const categories=mongoose.model("categories",categories_model);

module.exports={
    categories,
    
}

