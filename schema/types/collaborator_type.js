const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean
} = graphql;

const CollaboratorType = new GraphQLObjectType({
    name: 'CollaboratorType',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        sentAt: { type: GraphQLString },
        acceptedAt: { type: GraphQLString },
        rejectedAt: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        dismissed: { type: GraphQLBoolean },
        leftAt: { type: GraphQLString },
        user: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findOne({ email: parentValue.email })
                    .then(user => {
                        return user
                    });
            }
        }
    })
});

module.exports = CollaboratorType;