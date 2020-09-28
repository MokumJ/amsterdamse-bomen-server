const client = require("./server.client");
const params = require("../json/es.settings-mappings");
const { bulkCollection, bulkLabels } = require("./server.es.bulk");

function createIndex() {
  client.indices.exists({ index: "bomen" }, (err, res, status) => {
    if (res) {
      console.info("index already existss");
    } else {
      client.indices.create(
        {
          index: "bomen",
          body: params,
        },
        (error, response, status) => {
          if (!error) {
            console.info("\n🚀 Created a new index");
            console.info(response);
            console.info("\n");
            bulkCollection();
          } else {
            console.info(error);
          }
        }
      );
    }
  });
}

module.exports = { createIndex };
