const graphql = require('graphql');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean
} = graphql;

const DeviceType = new GraphQLObjectType({
    name: 'DeviceType',
    fields: () => ({
        id: { type: GraphQLID },
        userAgent: { type: GraphQLString },
        token: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        phrase: { type: GraphQLString },
        sentAt: { type: GraphQLString },
        acceptedAt: { type: GraphQLString },
        createdAt: { type: GraphQLString }
    })
});

module.exports = DeviceType;