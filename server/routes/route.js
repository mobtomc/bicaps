const routes=require('express').Router();
const controller=require('../controller/controller')

routes.route('/api/categories')
    .get(controller.getCategories)
    .post(controller.createCategory)


routes.route('/api/clientgroups')
    .get(controller.getClientGroups)
    .post(controller.createClientGroup)

    
routes.route('/api/entitytypes') 
    .get(controller.getEntityTypes)
    .post(controller.createEntityType);
module.exports=routes;