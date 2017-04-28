const mongoose = require('mongoose');
const graphql = require('graphql');
const GraphQLJSON = require('graphql-type-json');
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        data: { type: GraphQLJSON },
        result: { type: GraphQLJSON },
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, { id, name, data, result, token }, req) {
        return AuthService.checkUser({ token, req })
            .then(user => {
                if (user) {
                    return Memory.addBranch(id, name, data, result, user._id)
                }
            })
    }
};