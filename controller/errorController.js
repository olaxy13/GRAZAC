const AppError = require("../utils/appError")

//  const handleCastErrorDB = error => {
//     const message = `Invalid ${error.path}: ${error.value}.`
//     return new AppError(message, 400)
//  }


 const sendErrorDev = (err,  res)=> {
   return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack
       })  
}

// const sendErrorProd = (err,  res)=> {
//     if (err.isOperational === "true") {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message
//            })
//     }
//     else {
//         console.log("ERRPR", err)
//         res.status(500).json({
//             status: "error",
//             message: "Something went wrong"
//            })
//     }
//    }


module.exports =  (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

   if(process.env.NODE_ENV === "development") { 
    sendErrorDev(err, res)
   }
//  else if (process.env.NODE_ENV === "production") {
//     let error = {...err }
//         if (error.name === "CastError") error = handleCastErrorDB(error);
//         sendErrorProd(error, res);
//        }

   }



//    module.exports =(err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'Error'
//     if(process.env === "development") {
//         res.status(err.statusCode).json({
//             status: err.status,
//             message: err.message,
//             stack: err.stack
//            })
//        }
//        else if (process.env === "production") {
//         res.status(err.statusCode).json({
//             status: err.status,

//         })
//        }

//    }