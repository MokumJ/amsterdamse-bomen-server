const _ = require("lodash");
const client = require("./server.client");
const BOMEN1 = require("../json/bomen1.json").features;
const BOMEN2 = require("../json/bomen2.json").features;
const BOMEN3 = require("../json/bomen3.json").features;
const BOMEN4 = require("../json/bomen4.json").features;

/**
 * Generate own bulk schema:
 * {index: {_index: "catalog"}}
 * {name: "Some name of product", brand: "Name Brand", ...}
 */

function indexExists() {
  client.indices.exists(
    {
      index: "bomen",
    },
    (err, res, status) => {
      if (res) {
        console.log("index already exists");
        return true;
      } else {
        return false;
      }
    }
  );
}

let initialBulk = { index: { _index: "bomen" } };

function getBulk1() {
  console.log("...started indexing bomen 1, this may take a while");
  let collectionBulk1 = [];
  _.map(_.keys(BOMEN1), (uuid) => {
    collectionBulk1 = [...collectionBulk1, initialBulk, BOMEN1[uuid]];
  });
  return collectionBulk1;
}

function getBulk2() {
  console.log("...started indexing bomen 2, this may take a while");
  let collectionBulk2 = [];
  _.map(_.keys(BOMEN2), (uuid) => {
    collectionBulk2 = [...collectionBulk2, initialBulk, BOMEN2[uuid]];
  });
  return collectionBulk2;
}

function getBulk3() {
  console.log("...started indexing bomen 3, this may take a while");
  let collectionBulk3 = [];
  _.map(_.keys(BOMEN3), (uuid) => {
    collectionBulk3 = [...collectionBulk3, initialBulk, BOMEN3[uuid]];
  });
  return collectionBulk3;
}

function getBulk4() {
  console.log("...started indexing bomen 4, this may take a while");
  let collectionBulk4 = [];
  _.map(_.keys(BOMEN4), (uuid) => {
    collectionBulk4 = [...collectionBulk4, initialBulk, BOMEN4[uuid]];
  });
  return collectionBulk4;
}

function bulkCollection() {
  client
    .bulk({ body: getBulk1() })
    .then(
      console.log(
        `🚀 Successfully imported bomen 1, ${
          _.keys(BOMEN1).length
        } items are indexed \n`
      )
    )
    .then(
      client
        .bulk({ body: getBulk2() })
        .then(
          console.log(
            `🚀 Successfully imported bomen 2 ${_.keys(BOMEN2).length} items \n`
          )
        )
        .then(
          client
            .bulk({ body: getBulk3() })
            .then(
              console.log(
                `🚀 Successfully imported bomen 3 ${
                  _.keys(BOMEN3).length
                } items \n`
              )
            )
            .then(
              client
                .bulk({ body: getBulk4() })
                .then(
                  console.log(
                    `🚀 Successfully imported bomen 4 ${
                      _.keys(BOMEN4).length
                    } items \n`
                  )
                )
            )
        )
    );
}

module.exports = { bulkCollection, indexExists };
