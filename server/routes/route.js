const routes=require('express').Router();
const controller=require('../controller/controller')

routes.route('/api/categories')
    .get(controller.getCategories)
    .post(controller.createCategory);
routes.route('/api/categories/:id')
    .delete(controller.deleteCategory) 
    .get(controller.getCategoryById)
    .put(controller.updateCategory);
routes.route('/api/categories/search/:personName')
    .get(controller.searchCategoriesByName);

routes.route('/api/clientgroups')
    .get(controller.getClientGroups)
    .post(controller.createClientGroup);
routes.route('/api/clientgroups/update-group-name')
    .patch(controller.updateClientGroup);
    
routes.route('/api/entitytypes') 
    .get(controller.getEntityTypes)
    .post(controller.createEntityType);

routes.route('/api/projecttypes')
   .get(controller.getProjectTypes)
   .post(controller.createProjectType);

routes.route('/api/project')   
   .get(controller.getProjects)
   .post(controller.createProject);

routes.route('/api/client-groups-and-categories')   
   .get(controller.getClientGroupsAndCategories);
//for the timesheet
routes.route('/api/submit')   
   .post(controller.submitTimesheet)
   .get(controller.submitTimesheet);

routes.route('/api/staff-names')
   .get(controller.getUniqueStaffNames);
 
routes.route('/api/filter-timesheets')
   .get(controller.filterTimesheets);
 
module.exports=routes;