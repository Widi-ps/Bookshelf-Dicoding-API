const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const response = res.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });

  response.code(201);
  return response;
};

const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter(book => {
    return book.name.toLowerCase().includes(name.toLowerCase());
  });
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter(book => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(book => book.finished === isFinished);
  }

  return res.response({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  }).code(200);
};

const getBookById = (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404);
  }

  return res.response({
      status: 'success',
      data: {
          book: book
      }
  });
}

const updateBookById = (req, res) => {
  const { id } = req.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (!name) {
    return res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  
  books[bookIndex] = {
    ...books[bookIndex],
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    reading: reading,
    finished: finished,
    updatedAt: updatedAt,
  };

  return res.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};


const deleteBooksByIdHandler = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id)

  if(index === -1){
    const response = res.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
    return response
  }

  books.splice(index, 1)
  const response = res.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  })
  return response
}
module.exports = {
  addBookHandler,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBooksByIdHandler
};
