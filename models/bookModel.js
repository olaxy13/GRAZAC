// const mongoose = require("mongoose")
// const validator = require("validator")

// const bookSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: [true, "Book must have a title"]
//     }, 
//     author: {
//         type: String,
//         required: [true, "Author's name must be included"]
//     },
//     publicationYear: {
//         type: Date,
//         required: [true, "Publication Year must be included"]
//     },
//     isbn: {
//         type: String,
//         required: [true, "ISBN must be included"],
//         unique: [true, "ISBN already exist in the database"],
//         validate: [validator.isISBN, "Please provide a valid ISBN"]
//     },
//     genre: {
//         type:String,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now()  
//     }
// })

// const Book = mongoose.model("Book", bookSchema)
// module.exports = Book;


const mongoose = require("mongoose")
const validator = require("validator")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, 
    author: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Date,
        required: true
    },
    isbn: {
        type: String,
        required:    true
        //validate: [validator.isISBN, "Please provide a valid ISBN"]
    },
    genre: {
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now()  
    }
})

const Book = mongoose.model("Book", bookSchema)
module.exports = Book;
