
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
