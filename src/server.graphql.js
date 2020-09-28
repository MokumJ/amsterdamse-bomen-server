const {
  ElasticSearchClient,
  ApiElasticSearchClientByUrl,
} = require("./server.elasticsearch");
const elasticSearchSchema = require("./server.es.schema");
const { makeExecutableSchema } = require("graphql-tools");

// "properties":{"Soortnaam_NL":"Gewone esdoorn","Boomnummer":529478,"Soortnaam_WTS":"Acer pseudoplatanus","Boomtype":"Boom niet vrij uitgroeiend","Boomhoogte":"15 tot 18 m.","Plantjaar":1950,"Eigenaar":"Gemeente Amsterdam","Beheerder":"Stadsdeel Zuid","Categorie":"Acer","SOORT_KORT":"Acer","SDVIEW":"K","RADIUS":5

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Properties {
    Soortnaam_NL: String
    Soortnaam_WTS: String
    Boomtype: String
    Boomhoogte: String
    Plantjaar: Int
    Eigenaar: String
    Beheerder: String
    Categorie: String
    SOORT_KORT: String
    RADIUS: Int
  }
  type Geometry {
    type: String
    coordinates: [Float]
  }
  type Tree {
    id: Int
    geometry: Geometry
    properties: Properties
  }
  type Query {
    trees: [Tree]
    treesByCoordinate(coordinates: [Float]): [Tree]
    treeById(id: Int): Tree
  }
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    trees: () =>
      new Promise((resolve, reject) => {
        ElasticSearchClient("bomen", { ...elasticSearchSchema }).then((r) => {
          let _source = r["hits"]["hits"];
          _source.map((item, i) => (_source[i] = item._source));
          resolve(_source);
        });
      }),
    treesByCoordinate: (_, { coordinates }, { dataSources }) =>
      new Promise((resolve, reject) => {
        ElasticSearchClient("bomen", {
          query: {
            bool: {
              must: {
                match_all: {},
              },
              filter: {
                geo_distance: {
                  distance: "300m",
                  "geometry.coordinates": coordinates,
                },
              },
            },
          },
          size: 1000,
        })
          .then((r) => {
            let _source = r["hits"]["hits"];
            console.log(_source);
            _source.map((item, i) => (_source[i] = item._source));
            resolve(_source);
          })
          .catch((err) => reject(err));
      }),
    treeById: (_, { id }, { dataSources }) =>
      new Promise((resolve, reject) => {
        ElasticSearchClient("bomen", {
          query: {
            match: {
              id: {
                query: id,
              },
            },
          },
        })
          .then((r) => {
            let _source = r["hits"]["hits"];

            _source.map((item, i) => (_source[i] = item._source));
            console.log(_source);
            resolve(_source[0]);
          })
          .catch((err) => reject(err));
      }),
  },
};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers,
});
