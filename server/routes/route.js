const routes = require('express').Router();
const controller = require('../controller/controller');

// Category Routes
routes.route('/api/categories')
    .get(controller.getCategories)
    .post(controller.createCategory);
routes.route('/api/categories/:id')
    .delete(controller.deleteCategory) 
    .get(controller.getCategoryById)
    .put(controller.updateCategory);
routes.route('/api/categories/search/:personName')
    .get(controller.searchCategoriesByName);

// Client Groups Routes
routes.route('/api/clientgroups')
    .get(controller.getClientGroups)
    .post(controller.createClientGroup);
routes.route('/api/clientgroups/update-group-name')
    .patch(controller.updateClientGroup);

// Entity Types Routes
routes.route('/api/entitytypes') 
    .get(controller.getEntityTypes)
    .post(controller.createEntityType);

// Project Types Routes
routes.route('/api/projecttypes')
    .get(controller.getProjectTypes)
    .post(controller.createProjectType);

// Project Routes
routes.route('/api/project')   
    .get(controller.getProjects)
    .post(controller.createProject);
routes.route('/api/projects-by-name')   
    .get(controller.getProjectsByName);
routes.route('/api/client-groups-and-categories')   
    .get(controller.getClientGroupsAndCategories);

// Timesheet Routes
routes.route('/api/submit')
    .post(controller.submitTimesheet)
    .get(controller.submitTimesheet);
routes.route('/api/unique-staff-names')
    .get(controller.getUniqueStaffNames);
routes.route('/api/filter-timesheets')
    .get(controller.filterTimesheets);
routes.route('/api/timesheets/filter')
    .get(controller.filterTimesheets);

// Cost Routes
routes.route('/api/costs')
    .get(controller.getCosts)   
    .post(controller.upsertCost);
routes.route('/api/costs/:userName')
    .delete(controller.deleteCost);

// Live Data Routes
routes.route('/api/live-data')
    .get(controller.getLiveData);
routes.route('/api/live')
    .post(controller.postLiveData)
    .delete(controller.deleteLiveData);

// Attendance Routes
routes.route('/api/attendance-log')
    .get(controller.getAttendanceLog)
    .post(controller.logAttendance);
    
// New Filter Attendance Route
routes.route('/api/filter-attendance')
    .get(controller.filterAttendance);

module.exports = routes;
