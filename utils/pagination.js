// exports.pagnitedResult =  (model) => catchAsync( async (req, res, next) => {
        
//     const page =parseInt(req.query.page, 10) || 1;
//     const limit = req.query.limit *1 || 10
    
    
//     const startIndex = (page -1) * limit
//     const endIndex = page * limit
    
//     const pages = {}
//     if(endIndex < model.length ) {
//         pages.next = {
//             pager: page +1,
//             limit: limit
//         }
//     }
    
//     if(startIndex> 0) {
//         pages.prev ={
//             pager: page -1,
//             limit: limit
//         }
//     }
    
//     try{
//         pages.resultModel = model.find().limit(limit).skip(startIndex).exec()
//         res.finalResults = pages
//         next()
        
//     } catch(err) {
//         return next(new AppError('There was an Error sending the Email, Try again later'),
//         500
//          )
//     }
    
    
//         }
//     )

function pagnitedResult (model) {
    return async (req, res, next) => {
        
const page =req.query.page *1 || 1;
const limit = req.query.limit *1 || 10


const startIndex = (page -1) * limit
const endIndex = page * limit

const pages = {}
if(endIndex < model.length ) {
    pages.next = {
        pager: page +1,
        limit: limit
    }
}

if(startIndex> 0) {
    pages.prev ={
        pager: page -1,
        limit: limit
    }
}

try{
    pages.resultmodel = model.find().limit(limit).skip(startIndex).exec()
    res.finalResults = pages
    next()
    
} catch(err) {
    return next(new AppError('There was an Error sending the Email, Try again later'),
    500
     )
}


    }
}
