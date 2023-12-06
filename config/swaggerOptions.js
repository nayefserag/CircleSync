// const options = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'Todo List API',
//         version: '1.0.0',
//         description: 'A simple Todo List API using Swagger and Node.js',
//       },
//     },
//     apis: ['../routes/*.js'],
//     servers: [
//         {
//           url: "http://localhost:5000/todos", // url
//           description: "Local server", // name
//         },
//         {
//           url: "http://ec2-54-165-7-9.compute-1.amazonaws.com:8080/todos", // url
//           description: "Public server", // name    
//         }
//       ],
//   };
// const specs = swaggerJsdoc(options);
// module.exports = options , specs
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CircleSync',
      version: '1.0.0',
      description: 'API documentation for your authentication endpoints.',
    },
  },
  apis: ['./routes/auth.js', './routes/users.js', './routes/posts.js'], // Replace with the path to your route file
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};