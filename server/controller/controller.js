const mongoose = require('mongoose');
const { ClientGroup, EntityType, Category, ProjectType, Project,Timesheet,Cost,LiveData,Attendance } = require('../models/model');
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
// New function to get projects by name
const getProjectsByName = async (req, res) => {
  console.log('Received GET request for /api/projects-by-name');
  try {
    const projects = await Project.find().select('clientGroupPerson projectType year semester month quarter period');
    console.log('Fetched projects:', projects);
    
    const projectOptions = projects.map(project => {
      const projectName = `${project.clientGroupPerson} - ${project.projectType} (${project.year} ${project.semester} ${project.quarter} ${project.month})`;
      return {
        value: projectName,
        label: projectName
      };
    });
    
    console.log('Formatted project options:', projectOptions);
    res.status(200).json(projectOptions);
  } catch (error) {
    console.error('Error fetching projects by name:', error.message);
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
// Submit timesheet
const submitTimesheet = async (req, res) => {
  const { userId, userName, entries } = req.body;

  if (!userId || !entries || !entries.length) {
    return res.status(400).json({ error: 'User ID, user name, and entries are required' });
  }

  try {
    const formattedEntries = entries.map(entry => ({
      userId,
      userName,
      project: entry.project,
      startTime: new Date(entry.startTime), // Convert to Date object
      endTime: new Date(entry.endTime),     // Convert to Date object
      date: new Date(entry.date),           // Convert to Date object
      month: new Date(entry.date).toLocaleString('en-GB', { month: 'long' }),
      year: new Date(entry.date).getFullYear()
    }));

    const savedEntries = await Timesheet.insertMany(formattedEntries);
    res.status(201).json(savedEntries);
  } catch (error) {
    console.error('Error submitting timesheet:', error.message);
    res.status(500).json({ error: error.message });
  }
};


//getTimesheet
const getTimesheets = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const timesheets = await Timesheet.find({ userId });
    res.status(200).json(timesheets);
  } catch (error) {
    console.error('Error fetching timesheets:', error.message);
    res.status(500).json({ error: error.message });
  }
};
//username
const getUniqueStaffNames = async (req, res) => {
  try {
    const staffNames = await Timesheet.distinct('userName');
    res.status(200).json(staffNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Filter timesheets
// Controller to filter timesheets
const filterTimesheets = async (req, res) => {
  const { staffNames, fromDate, toDate, projectSubstring } = req.query;

  try {
    // Convert staffNames to an array if it's a comma-separated string
    const staffNamesArray = staffNames === 'all' || !staffNames
      ? []
      : staffNames.split(',');

    // Call the getFilteredTimesheets function
    const result = await getFilteredTimesheets(staffNamesArray, fromDate, toDate, projectSubstring);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching filtered timesheets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Ensure getFilteredTimesheets handles the project filter if provided
const getFilteredTimesheets = async (staffNames, fromDate, toDate, projectSubstring) => {
  try {
    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;

    // Build query
    const query = {};

    if (startDate && endDate) {
      endDate.setHours(23, 59, 59, 999);
      query.startTime = { $gte: startDate, $lte: endDate };
    }

    if (staffNames.length > 0 && staffNames[0] !== 'all') {
      query.userName = { $in: staffNames };
    }

    if (projectSubstring) {
      // Split the search term into substrings
      const substrings = projectSubstring.split(' ').map(term => term.trim()).filter(term => term);

      // Create a regex pattern to match all substrings
      const regexPattern = substrings.map(term => `(?=.*${term})`).join('');
      query.project = { $regex: new RegExp(regexPattern, 'i') }; // Case-insensitive match
    }

    // Fetch timesheets
    const timesheets = await Timesheet.find(query).exec();

    // Calculate total duration
    const totalDuration = timesheets.reduce((acc, sheet) => {
      const start = new Date(sheet.startTime);
      const end = new Date(sheet.endTime);
      const duration = (end - start) / (1000 * 60); // duration in minutes
      return acc + (isNaN(duration) ? 0 : duration);
    }, 0);

    return {
      timesheets,
      totalDuration
    };
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
};







//cost page controller 
// Get all costs
const getCosts = async (req, res) => {
  try {
    const costs = await Cost.find();
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//create and update
// Create or update cost for a user
const upsertCost = async (req, res) => {
  const { userNames, perHourCost } = req.body;

  if (!userNames || !Array.isArray(userNames) || userNames.length === 0 || perHourCost === undefined) {
    return res.status(400).json({ message: 'userNames (array) and perHourCost are required' });
  }

  try {
    // Iterate over each userName and create/update cost
    const results = [];
    for (const userName of userNames) {
      const cost = await Cost.findOneAndUpdate(
        { userName },
        { perHourCost },
        { new: true, upsert: true }
      );
      results.push(cost);
    }
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a cost entry
const deleteCost = async (req, res) => {
  const { userName } = req.params;

  try {
    const cost = await Cost.findOneAndDelete({ userName });
    if (!cost) {
      return res.status(404).json({ message: 'Cost not found' });
    }
    res.status(200).json({ message: 'Cost deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//live
const getLiveData = async (req, res) => {
  try {
    const liveData = await LiveData.find();
    
    // Format the data if necessary
    const formattedData = liveData.map(data => ({
      staffName: data.staffName,
      project: data.project,
      workDescription: data.workDescription,
      startTime: data.startTime
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//post
const postLiveData = async (req, res) => {
  try {
    const { userId, staffName, project, workDescription, startTime } = req.body;

    // Create a new LiveData entry
    const newLiveData = new LiveData({
      userId,
      staffName,
      project,
      workDescription,
      startTime
    });

    // Save the entry to the database
    await newLiveData.save();

    res.status(201).json({ message: 'Live data saved successfully', data: newLiveData });
  } catch (error) {
    console.error('Error saving live data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//deleting ended task
// Sample controller for DELETE request
const deleteLiveData = async (req, res) => {
  try {
    const { project, startTime } = req.body;
    
    // Convert startTime to Date object to match schema format if necessary
    const startTimeDate = new Date(startTime);

    const result = await LiveData.deleteOne({ project, startTime: startTimeDate });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ error: 'Live data not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logAttendance = async (req, res) => {
  try {
    console.log(req.body);  // Log the request body to see what's being received
    
    const { userId, email, userName } = req.body;
    console.log('Logging Attendance:', { userId, email, userName });
    const today = new Date().setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({ userId, date: today });

    if (!existingAttendance) {
      const attendance = new Attendance({ userId, email, userName, date: today });
      await attendance.save();
      console.log('Logging Attendance:', { userId, email, userName });
      return res.status(200).send('Attendance logged successfully.');
    }

    res.status(200).send('Attendance already logged for today.');
    console.log('Logging Attendance:', { userId, email, userName });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).send('Failed to log attendance.');
  }
};

const getAttendanceLog = (req, res) => {
  res.status(200).send('Attendance log API is reachable.');
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
  getProjectsByName,
  getClientGroupsAndCategories,
  submitTimesheet,
  getTimesheets,
  getUniqueStaffNames,
  filterTimesheets,
  getCosts,
  upsertCost,
  deleteCost,
  getLiveData,
  postLiveData,
  deleteLiveData,
  logAttendance,
  getAttendanceLog
}