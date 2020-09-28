const client = require("./server.client");
function deleteIndex() {
  return new Promise(async (resolve) => {
    client.indices.delete(
      {
        index: "bomen",
      },
      (error, response, status) => {
        if (!error) {
          console.info("🚀 Deleted index");
          console.info(response);
          resolve(true);
        } else {
          console.info(error);
        }
      }
    );
  });
}

deleteIndex();

module.exports = { deleteIndex };
