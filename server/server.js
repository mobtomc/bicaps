const express=require("express")
const app=express();

const cors=require('cors')


require('dotenv').config({path:"./config.env"})
const port=process.env.PORT || 5000;

// using middlewares
app.use(cors())
app.use(express.json());

// using Routes
app.use(require('./routes/route'))
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// MongoDB Connection
const con=require('./db/connection')
con.then(db=>{
    if(!db) return process.exit(1)

    app.listen(port,()=>{
        console.log(`Server running on Port:${port}`)
    })
})





