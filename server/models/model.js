const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const CategorySchema=new Schema({
      groupName:[ {
      type: String,
      required: true
    }],
    entityName: {
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
    pan:{
      type:String,
      required:true
    },
    email: {
      type: String,
      required: true
    }
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

const Category=mongoose.model("Category",CategorySchema);
const ClientGroup = mongoose.model('ClientGroup', ClientGroupSchema);
const EntityType = mongoose.model('EntityType', EntityTypeSchema);

module.exports={
    Category,
    ClientGroup,
    EntityType
    
}

