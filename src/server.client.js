const ElasticSearch = require("elasticsearch");
require("dotenv").config();

/**
 * *** ElasticSearch *** client
 * @type {Client}
 */
const client = new ElasticSearch.Client({
  hosts: [
    process.env.ENV !== "DEVELOPMENT"
      ? process.env.ELASTIC_URL
      : "http://localhost:9200",
  ],
});

module.exports = client;
