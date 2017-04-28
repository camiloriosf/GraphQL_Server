const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList
} = graphql;
const User = mongoose.model('user');
const Project = mongoose.model('project');
const Memory = mongoose.model('memory');
const BranchType = require('./branch_type');

const MemoryType = new GraphQLObjectType({
    name: 'MemoryType',
    fields: () => ({
        id: { type: GraphQLID },
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
        project: { 
            type: require('./project_type'),
            resolve(parentValue) {
                return Project.findById(parentValue.project)
                    .then(project => project);
            }
         },
        branches: { 
            type: new GraphQLList(BranchType),
            resolve(parentValue) {
                return Memory.findById(parentValue)
                    .then(memory => {
                        return memory.branches
                    });
            }
         }
    })
});

module.exports = MemoryType;