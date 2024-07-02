const mongoose=require('mongoose')

const conn = mongoose.connect(process.env.ATLAS_URI)
    .then(db=>{
        console.log("Database Connection-Success")
        return db
    }).catch(err=>{
        console.log("Database Connection-Faulty")
})

module.exports=conn;
        