const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();
const { graphqlUploadExpress } = require('graphql-upload');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;

const corsOptions = {
  origin: ['https://social-space-615b764ada9e.herokuapp.com', 'http://localhost:3000'],
  credentials: true,
  methods: ["GET", "POST"],
};


app.use(cors(corsOptions));

const getUserFromToken = async (token) => {
  if (!token) {
    console.log("Token not provided");
    return null;
  }
  try {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const { data } = jwt.verify(token, jwtSecret);
    const user = await User.findById(data._id);
    return user;
  } catch (err) {
    console.error("Error in getUserFromToken:", err);
    return null;
  }
};

(async function () {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUserFromToken(token);
      return { user };
    },
    uploads: false,
  });

  await server.start();

  app.use((req, res, next) => {
    if (req.is('text/*')) {
      req.text().then(txt => {
        console.log('Request body:', txt);
        next();
      });
    } else {
      next();
    }
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Add middleware for handling uploads
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Apply Apollo Server middleware with CORS
  server.applyMiddleware({ app, cors: corsOptions });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
  }

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
        
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();
