const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql;
const User = mongoose.model('user');
const CompanyType = require('./company_type');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parentValue) {
        return User.findCompanies(parentValue.id);
      }
    }
  })
});

module.exports = UserType;