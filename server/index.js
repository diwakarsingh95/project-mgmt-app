const express = require("express");
require("colors");
const cors = require("cors");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

const app = express();

// CORS
app.use(cors());

// Connect to database
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`.cyan.bold));
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);
