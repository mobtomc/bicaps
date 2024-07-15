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
   .post(controller.createProjectType)

module.exports=routes;