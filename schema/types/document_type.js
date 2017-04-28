const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt
} = graphql;

const VaultType = new GraphQLObjectType({
    name: 'VaultType',
    fields: () => ({
        id: { type: GraphQLID },
        path: { type: GraphQLString },
        name: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        createdBy: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.createdBy)
                    .then(user => user);
            }
        },
        createdAt: { type: GraphQLString },
        size: { type: GraphQLInt }
    })
});

module.exports = VaultType;