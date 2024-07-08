
const model=require("../models/model")
const { ClientGroup, EntityType, Category } = require('../models/model');
// Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({ groupName:req.body.groupName, entityName:req.body.entityName, personName:req.body.personName, phoneNo:req.body.phoneNo, pan:req.body.pan, email:req.body.email });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error.message });
  }
};
// Fetch category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update category by ID
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      // const { groupName, personName, phoneNumber, email } = req.body;
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
      // const { entityName, description } = req.body;
      const newEntityType = new EntityType({ entityName:req.body.entityName, description:req.body.description });
      await newEntityType.save();
      res.status(201).json(newEntityType);
    } catch (error) {
      console.error('Error creating entity type:', error); // Log the error for debugging
      res.status(500).send(error.message);
    }
  };




module.exports={
    getCategories,
    createCategory,
    deleteCategory,
    getCategoryById,
    updateCategory,
    getClientGroups,
    createClientGroup, 
    getEntityTypes,
    createEntityType
}