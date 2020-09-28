const client = require("./server.client");

client.indices.putMapping(
  {
    index: "bomen",
    body: {
      properties: {
        geometry: { type: "geo_point" },
      },
    },
  },
  (err, resp, status) => {
    if (err) {
      console.error(err, status);
    } else {
      console.log("Successfully Created Index", status, resp);
    }
  }
);
