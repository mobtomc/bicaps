const model=require("../models/model")
const { ClientGroup, EntityType } = require('../models/model');
// get Category
async function get_Categories(req,res){
    // Here you can use various filters also, to get unique clients for ex
    let data=await model.categories.find({})

    return res.json(data);
}
// Get all client groups
const getClientGroups = async (req, res) => {
    try {
      const clientGroups = await ClientGroup.find();
      res.json(clientGroups);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  //post request for clientgroup
  const createClientGroup = async (req, res) => {
    try {
      console.log('Received request body:', req.body); // Log the request body for debugging
      const { groupName, personName, phoneNumber, email } = req.body;
      const newClientGroup = new ClientGroup({ groupName:req.body.groupName, personName:req.body.personName, phoneNo:req.body.phoneNo, email:req.body.email });
      await newClientGroup.save();
      res.status(201).json(newClientGroup);
    } catch (error) {
      console.error('Error creating client group:', error); // Log the error
      res.status(500).send(error.message);
    }
  };
  
  // Get all entity types
  const getEntityTypes = async (req, res) => {
    try {
      const entityTypes = await EntityType.find();
      res.json(entityTypes);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  const createEntityType = async (req, res) => {
    try {
      console.log('Request body:', req.body); // Log the request body to verify data
      const { entityName, description } = req.body;
      const newEntityType = new EntityType({ entityName:req.body.entityName, description:req.body.description });
      await newEntityType.save();
      res.status(201).json(newEntityType);
    } catch (error) {
      console.error('Error creating entity type:', error); // Log the error for debugging
      res.status(500).send(error.message);
    }
  };

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
    getClientGroups,
    createClientGroup, 
    getEntityTypes,
    createEntityType
}