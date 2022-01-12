var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

var resultados=[];

async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.city.findMany();
  resultados=allUsers;
}

main()
  .catch((e) => {
    console.log("an error has happened: " + e.message)
  }).finally(async () => {
    await prisma.$disconnect()
  })


 var schema = buildSchema(`
  type Query {
    ID: [Int!]
    Name: [String!]
  }
`);


var root = {
  ID:() => {
    var indices=[];
    for (let index = 0; index < resultados.length; index++) {
      indices.push(resultados[index].ID)
    }
    return indices;
  },
  Name:() => {
    var city_name=[];
    for (let index = 0; index < resultados.length; index++) {
      city_name.push(resultados[index].Name)
    }
    return city_name;
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');