const { addBookHandler, getAllBooks, getBookById } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: '/GET',
    path: '/books/{id}',
    handler: getBookById,
  },
];

module.exports = routes;
