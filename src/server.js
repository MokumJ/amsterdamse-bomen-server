const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { ApolloServer } = require("apollo-server-express");
const {
  ApiElasticSearchClient,
  checkConnection,
} = require("./server.elasticsearch");
const { createIndex } = require("./server.es.create");
const madeExecutableSchema = require("./server.graphql");

// PORT
const PORT = process.env.PORT || 3100;

const server = new ApolloServer({
  schema: madeExecutableSchema,
  playground: true,
});

// TODO Use the BodyParser as a middleware
app.use(bodyParser.json());

// TODO Set port for the app to listen on
app.set("port", process.env.PORT || 3001);

// TODO Set path to serve static files
app.use(express.static(path.join(__dirname, "public")));

// TODO Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Access-Control-Request-Method"
  );
  next();
});

// Define the `/search` route that should return elastic search results
app.get("/search", ApiElasticSearchClient);
app.listen(PORT, function () {
  console.log(`Express server listening on port :${PORT}${server.graphqlPath}`);
});

server.applyMiddleware({ app });

(async function main() {
  const isElasticReady = await checkConnection();
  if (isElasticReady) {
    createIndex();
  }
  console.log(isElasticReady);
})();
