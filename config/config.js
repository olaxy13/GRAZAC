module.exports = {
  //   env: envVars.NODE_ENV,
  //   port: envVars.PORT,
  mongoose: {
    //url: "mongodb://127.0.0.1:27017/node-boilerplate-test", //create a test db url and replace this
   // url: "mongodb+srv://olaxy:GTsuDrTjtxFWEeYg@grazac.64a0n.mongodb.net/grazac?retryWrites=true&w=majority&appName=Grazac", //create a test db url and replace this
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
 