const graphql = require('graphql');
const {
  GraphQLObjectType
} = graphql;
const user = require('./queries/user');
const company = require('./queries/company.js')
const project = require('./queries/project.js')

const rootFields = Object.assign({},
  {
    user,
    company,
    project
  }
);

module.exports = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => rootFields
});