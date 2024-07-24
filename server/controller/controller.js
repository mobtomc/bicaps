

const mongoose = require('mongoose');
const { ClientGroup, EntityType, Category, ProjectType, Project,Timesheet } = require('../models/model');
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
    const newCategory = new Category({ groupName: req.body.groupName, entityName: req.body.entityName, personName: req.body.personName, phoneNo: req.body.phoneNo, pan: req.body.pan, email: req.body.email });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a category by Id
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
// Search categories by personName
const searchCategoriesByName = async (req, res) => {
  try {
    const { personName } = req.params;
    const categories = await Category.find({ personName: { $regex: personName, $options: 'i' } }); // Case-insensitive search
    res.status(200).json(categories);
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
    console.log('Received request body:', req.body);
    const newClientGroup = new ClientGroup({ groupName: req.body.groupName, personName: req.body.personName, phoneNo: req.body.phoneNo, email: req.body.email });
    await newClientGroup.save();
    res.status(201).json(newClientGroup);
  } catch (error) {
    console.error('Error creating client group:', error);
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
// post request for entities
const createEntityType = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body to verify data
    // const { entityName, description } = req.body;
    const newEntityType = new EntityType({ entityName: req.body.entityName, description: req.body.description });
    await newEntityType.save();
    res.status(201).json(newEntityType);
  } catch (error) {
    console.error('Error creating entity type:', error);
    res.status(500).send(error.message);
  }
};
const updateClientGroup = async (req, res) => {
  try {
    const { oldGroupName, newGroupName } = req.body;

    // Update group name in ClientGroup schema
    const updatedClientGroups = await ClientGroup.updateMany(
      { groupName: oldGroupName },
      { $set: { groupName: newGroupName } }
    );

    // Update group name in Category schema
    const updatedCategories = await Category.updateMany(
      { groupName: oldGroupName },
      { $set: { "groupName.$[element]": newGroupName } },
      { arrayFilters: [{ "element": { $eq: oldGroupName } }] }  // Only update matching element
    );

    res.status(200).json({
      message: `Group name updated successfully in ${updatedClientGroups.nModified} client groups and ${updatedCategories.nModified} categories.`,
    });
  } catch (error) {
    console.error('Error updating group name:', error);
    res.status(500).json({ message: 'Failed to update group name' });
  }
};
//post for ProjectTypeSchema
const createProjectType = async (req, res) => {
  const { projectType, timePeriods } = req.body;

  try {
    const newProjectType = new ProjectType({ projectType, timePeriods });
    await newProjectType.save();
    res.status(201).json(newProjectType);
  } catch (error) {
    console.error('Error creating project type:', error);  // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

//get for ProjectTypeSchema
const getProjectTypes = async (req, res) => {
  try {
    const projectTypes = await ProjectType.find();
    res.status(200).json(projectTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//post for project
const createProject = async (req, res) => {
  const { clientGroupPerson, projectType, period, year, quarter, month, } = req.body;

  console.log(clientGroupPerson, projectType, period, year, quarter, month);

  try {
    const newProject = new Project({ clientGroupPerson, projectType, period, year, quarter, month, });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: "Harcoded Error Occured" });
  }
};
//timesheet dropdown

// Handler for GET request to /api/project
const getProjects = async (req, res) => {
  console.log('Received GET request for /api/project');
  try {
    const projects = await Project.find().select('clientGroupPerson projectType year semester month quarter period');
    console.log('Fetched projects:', projects); // Log the fetched projects

    const projectOptions = projects.map(project => ({
      value: project._id.toString(),
      label: `${project.clientGroupPerson} - ${project.projectType} (${project.year} ${project.semester} ${project.quarter} ${project.month})`
    }));

    console.log('Formatted project options:', projectOptions); // Log the formatted options
    res.status(200).json(projectOptions);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: error.message });
  }
};



//for the project dropdowns
const getClientGroupsAndCategories = async (req, res) => {
  try {
    const clientGroups = await ClientGroup.find();
    const categories = await Category.find();
    res.status(200).json({ clientGroups, categories });
  } catch (error) {
    res.status(500).json({ error: "error.message" });
  }
};
//timesheet post 
const submitTimesheet = async (req, res) => {
  const { userId, entries } = req.body;

  if (!userId || !entries || !entries.length) {
    return res.status(400).json({ error: 'User ID and entries are required' });
  }

  try {
    const formattedEntries = entries.map(entry => ({
      userId,
      project: entry.project,
      startTime: entry.startTime,
      endTime: entry.endTime,
      date: new Date().toLocaleDateString('en-GB'),
      month: new Date().toLocaleString('en-GB', { month: 'long' }),
      year: new Date().getFullYear()
    }));

    const savedEntries = await Timesheet.insertMany(formattedEntries);
    res.status(201).json(savedEntries);
  } catch (error) {
    console.error('Error submitting timesheet:', error.message);
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  searchCategoriesByName,
  getClientGroups,
  createClientGroup,
  getEntityTypes,
  createEntityType,
  updateClientGroup,
  createProjectType,
  getProjectTypes,
  createProject,
  getProjects,
  getClientGroupsAndCategories,
  submitTimesheet

}