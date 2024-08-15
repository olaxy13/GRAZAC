const mongoose = require("mongoose");
const dotenv =require("dotenv")
const app = require("./app")

process.on("uncaughtException", err=> {
    console.log('UNCAUGHT EXCEPTION!,  SHUTTING DOWN........');
    console.log(err)
    console.log(err.name, err.message)
      process.exit(1)
})

dotenv.config({ path: './config.env'})//to configure the variable in the config.env file to save to the node process so we can access them anywhere without having to require it
console.log(app.get("env"))

//to protect our database password
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

mongoose
.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
     
}).then(()=> {
    console.log("MongoDB connection successful")
})

const port = process.env.PORT

const server = app.listen(port, ()=> {
    console.log(`App running on port ${port}....`)
})

process.on("unhandledRejection", err=> {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION!!! SHUTTING DOWN...");
    server.close(()=> {
        process.exit(1) 
    })
    
})