const request = require('supertest');
const app = require("../app"); // Import your Express app
const Book = require("../models/bookModel");

describe('GET /api/books/:id', () => {
  it('should return a book by its ID', async () => {
    const book = await Book.create({
      title: 'Test Book',
      author: 'Test Author',
      publicationYear: 2022,
      isbn: '1234567890',
      genre: 'Fiction',
    });

    const res = await request(app)
      .get(`/api/v1/books/${book.id}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.book.title).toBe('Test Book');
    expect(res.body.data.book.author).toBe('Test Author');
    expect(res.body.data.book.publicationYear).toBe(2022);
    expect(res.body.data.book.isbn).toBe('1234567890');
    expect(res.body.data.book.genre).toBe('Fiction');
  });

  it('should return a 404 status if the book is not found', async () => {
    const res = await request(app)
      .get('/api/v1/books/invalid-id')
      .send();

    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Book not found');
  });
});