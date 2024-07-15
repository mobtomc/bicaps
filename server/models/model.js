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
  //schema for projectType
  const ProjectTypeSchema = new mongoose.Schema({
    projectType: {
      type: String,
      required: true
    },
    timePeriod: {
      type: String,
      required: true,
      enum: ["Monthly", "Quaterly", "Semi-annual,Annual"]
    }
  });


// mongoose.model("name mentioned here","structure mentioned here")

const Category=mongoose.model("Category",CategorySchema);
const ClientGroup = mongoose.model('ClientGroup', ClientGroupSchema);
const EntityType = mongoose.model('EntityType', EntityTypeSchema);
const ProjectType = mongoose.model('ProjectType',ProjectTypeSchema);

module.exports={
    Category,
    ClientGroup,
    EntityType,
    ProjectType,
}

