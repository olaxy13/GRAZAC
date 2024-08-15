const { MongoTimeoutError } = require("mongodb");
const Book = require("../models/bookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const { validateCreateBook } = require("../validator/bookValidation.js");



       exports.getAllBooks = catchAsync(async (req, res, next) => {
           // Get page and limit from query parameters, default to page 1 and limit 10
           const page = parseInt(req.query.page, 10) || 1;
           const limit = parseInt(req.query.limit, 3) || 3;
           const skip = (page - 1) * limit;
       
           // Fetch total number of books
           const numBooks = await Book.countDocuments();
       
           // Check if the requested page exists
           if (skip >= numBooks) {
               return res.status(404).json({
                   status: 'fail',
                   message: 'This page does not exist'
               });
           }
           // Fetch books with pagination
           const books = await Book.find().skip(skip).limit(limit);
       
           // Respond with paginated books
           res.status(200).json({
               status: 'success',
               results: books.length,
               data: {
                   books,
                   totalPages: Math.ceil(numBooks / limit),
                   currentPage: page
               }
           });
       });
           
      
exports.getBook = catchAsync(async (req, res, next) => {
        const book = await Book.findById(req.params.id);
        if(!book) {
            console.log("BOOK", book)
        return  next(new AppError("No book found with that ID", 404))
        }
            res.status(200).json({
                status: "Success",
                data: {
                    book
                }
            })
    }
)

// exports.createBook = catchAsync(async (req, res, next)=> {
//         const newBook = await Book.create(req.body)
//         res.status(201).json({
//             status: "Success",
//             message: "Book created",
//             data: {
//                 book: newBook
//             }
//         })
//     }
// )



// Create a book
exports.createBook = catchAsync(async (req, res, next) => {
const { error, value } = validateCreateBook(req.body);
console.log("Error:", error)
if (error) {
    console.log(error)
    return next(new AppError(error.details, 400));

}    
// Proceed with creating the book
    const newBook = await Book.create(value);
    res.status(201).json({
        status: 'success',
        data: {
            book: newBook
        }
    });
});


exports.updateBook = catchAsync(async(req, res, next) => {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!book) {
            return  next(new AppError("No book found with that ID", 404))
            }
        res.status(200).json({
            status: "Success",
            message: "Book updated",
            data: {
                book
            }
        })

    })

exports.deleteBook = catchAsync(async (req, res, next)=> {
        const book = await Book.findByIdAndDelete(req.params.id)  
        if(!book) {
            return  next(new AppError("No book found with that ID", 404))
            }
            res.status(204).json({
                status: "success",
                data: null
            })
    })












       //    let query ={}
    //     const page =req.query.page *1 || 1;
    //     const limit = req.query.limit *1 || 10
    //     const skip = (page -1) * limit
       
    //     query = query.skip(skip).limit;
    //     if(req.query.page) {
    //        const numBooks = await Book.countDocuments()
    //        if (skip >= numBooks) {
    //         return res.status(404).json({
    //             status: 'fail',
    //             message: 'This page does not exist'
    //         });
    //     }
    //     }
    //     const books = await query
    //     res.status(200).json({
    //         status: "Success",
    //         results: books.length,
    //         data: {
    //             books
    //         }
        //})