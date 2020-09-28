const client = require("./server.client");
const elasticSearchSchema = require("./server.es.schema");

/**
 * TODO Ping the CLIENT to be sure
 * *** ElasticSearch *** is up
 */
function checkConnection() {
  return new Promise(async (resolve) => {
    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;
    while (!isConnected) {
      try {
        await client.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;
        // eslint-disable-next-line no-empty
      } catch (err) {
        console.log("not healthy");
      }
    }
    resolve(true);
  });
}

function ElasticSearchClient(index, body) {
  console.log(index, body);
  // perform the actual search passing in the index, the search query and the type
  return client.search({ index: index, body: body });
}

function ApiElasticSearchClient(req, res) {
  // perform the actual search passing in the index, the search query and the type
  ElasticSearchClient({ ...elasticSearchSchema })
    .then((r) => res.send(r["hits"]["hits"]))
    .catch((e) => {
      console.error(e);
      res.send([]);
    });
}

function ApiElasticSearchClientByUrl(req, res) {
  // perform the actual search passing in the index, the search query and the type
  ElasticSearchClient(req)
    .then((r) => res.send(r["hits"]["hits"]))
    .catch((e) => {
      console.error(e);
      res.send([]);
    });
}

function ApiElasticSearchClientCompare(req, res) {
  // perform the actual search passing in the index, the search query and the type
  ElasticSearchClient(req)
    .then((r) => res.send(r["hits"]["hits"]))
    .catch((e) => {
      console.error(e);
      res.send([]);
    });
}

module.exports = {
  ApiElasticSearchClient,
  checkConnection,
  ElasticSearchClient,
  ApiElasticSearchClientByUrl,
  ApiElasticSearchClientCompare,
};
