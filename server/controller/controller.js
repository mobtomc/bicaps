const model=require("../models/model")

// get Category
async function get_Categories(req,res){
    // Here you can use various filters also, to get unique clients for ex
    let data=await model.categories.find({})

    return res.json(data);
}



// Post categories
async function create_Categories(req,res){
    const Create=new model.categories({
        // these are hard coded we should get these fields from the form
        type:"Manager",
        colour:"Blue"
    })

    await Create.save()
    res.json(Create)
}


module.exports={
    get_Categories,
    create_Categories,
}