const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean
} = graphql;

const TransferType = new GraphQLObjectType({
    name: 'TransferType',
    fields: () => ({
        id: { type: GraphQLID },
        createdAt: { type: GraphQLString },
        cancelledAt: { type: GraphQLString },
        rejectedAt: { type: GraphQLString },
        acceptedAt: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        user: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.user)
                    .then(user => {
                        return user
                    });
            }
        }
    })
});

module.exports = TransferType;