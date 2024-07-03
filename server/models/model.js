const mongoose=require('mongoose')
const Schema=mongoose.Schema;

// Category=> fields => [type,colour]
// Aise karke unlimited fields banale which you require
const categories_model=new Schema({
    type: {type:String, default:"kuch b daal de"},
    colour: {type:String, default:"kuch b 2"}
})
// Define schema for ClientGroup
const ClientGroupSchema = new Schema({
    groupName: {
      type: String,
      required: true
    },
    personName: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  });
  
  // Define schema for EntityType
  const EntityTypeSchema = new Schema({
    entityName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  });
  


// mongoose.model("name mentioned here","structure mentioned here")
const categories=mongoose.model("categories",categories_model);
const ClientGroup = mongoose.model('ClientGroup', ClientGroupSchema);
const EntityType = mongoose.model('EntityType', EntityTypeSchema);

module.exports={
    categories,
    ClientGroup,
    EntityType
    
}

