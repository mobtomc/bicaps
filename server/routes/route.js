const routes=require('express').Router();
const controller=require('../controller/controller')

routes.route('/api/categories')
    .get(controller.get_Categories)
    .post(controller.create_Categories)


routes.route('/api/clientgroups')
    .get(controller.getClientGroups)
    .post(controller.createClientGroup)
routes.route('/api/entitytypes') 
    .get(controller.getEntityTypes)
    .post(controller.createEntityType);
module.exports=routes;