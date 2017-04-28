const graphql = require('graphql');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const GraphQLJSON = require('graphql-type-json');
const DocumentType = require('./document_type');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList
} = graphql;

const BranchType = new GraphQLObjectType({
    name: 'BranchType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        data: { type: GraphQLJSON },
        result: { type: GraphQLJSON },
        active: { type: GraphQLBoolean },
        createdBy: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.createdBy)
                    .then(user => user);
            }
        },
        createdAt: { type: GraphQLString },
        documents:{
            type: new GraphQLList(DocumentType),
            resolve(parentValue) {
                console.log(parentValue)
                /*return Project.findById(parentValue)
                    .then(project => {
                        return project.branches.documents
                    });*/
            }
        }
    })
});

module.exports = BranchType;