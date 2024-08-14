const mongoose=require('mongoose')
const Schema=mongoose.Schema;
//add clients is category
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
    timePeriods: [String]  // Array of strings
  });


  const projectSchema = new mongoose.Schema({
    clientGroupPerson: {
      type: String,
      ref: 'ClientGroup',
      required: true
    },
    projectType: {
      type: String,
      ref: 'ProjectType',
      required: true
    },
    period: {
      type: [String],  // Ensure period is an array of strings
      required: true
    },
    year: {
      type: Number,
      default: ""
    },
    semester: { type: String, default: "" },
    month: { type: String, default: "" },
    quarter: { type: String, default: "" }
  });
  
 //timesheetschema
 const timesheetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  project: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: Date, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true }
});

// Define schema for Cost
const CostSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  perHourCost: {
    type: Number,
    required: true
  }
  
  
});
const LiveDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  project: {
    type: String,
    required: true
  },
  workDescription: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  }
});
const Category=mongoose.model("Category",CategorySchema);
const ClientGroup = mongoose.model('ClientGroup', ClientGroupSchema);
const EntityType = mongoose.model('EntityType', EntityTypeSchema);
const ProjectType = mongoose.model('ProjectType',ProjectTypeSchema);
const Project= mongoose.model('Project',projectSchema)
const Timesheet=mongoose.model('Timesheet',timesheetSchema)
const Cost = mongoose.model('Cost', CostSchema);
const LiveData = mongoose.model('LiveData', LiveDataSchema);
module.exports={
    Category,
    ClientGroup,
    EntityType,
    ProjectType,
    Project,
    Timesheet,
    Cost,
    LiveData
}