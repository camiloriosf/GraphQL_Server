const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;
const MemoryType = require('../../types/memory_type');
const AuthService = require('../../../services/auth');
const Memory = mongoose.model('memory');

module.exports = {
  type: MemoryType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, { id, branch, token }, req) {
    return AuthService.checkUser({ token, req })
      .then(user => {
        if (user) {
          return Memory.deactivateBranch(id)
        }
      })
  }
};