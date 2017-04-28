const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = graphql;
const UserType = require('../user_type');
const AuthService = require('../../../services/auth');

module.exports = {
    type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(parentValue, {token}, req) {
        return AuthService.checkUser({ token, req });
      }
};