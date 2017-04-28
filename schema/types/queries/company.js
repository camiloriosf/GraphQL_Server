const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull 
} = graphql;
const CompanyType = require('../company_type');
const AuthService = require('../../../services/auth');
const Company = mongoose.model('company');

module.exports = {
    type: CompanyType,
      args: {
        token: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, {token, id}, req) {
         return Company.findById(id);
      }
};