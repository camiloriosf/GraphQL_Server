const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList
} = graphql;
const User = mongoose.model('user');
const Company = mongoose.model('company');
const Project = mongoose.model('project');
const BranchType = require('./branch_type');

const ProjectType = new GraphQLObjectType({
    name: 'ProjectType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        createdBy: {
            type: require('./user_type'),
            resolve(parentValue) {
                return User.findById(parentValue.createdBy)
                    .then(user => user);
            }
        },
        company: {
            type: require('./company_type'),
            resolve(parentValue) {
                return Company.findById(parentValue.company)
                    .then(company => company);
            }
        },
        branches: {
            type: new GraphQLList(BranchType),
            resolve(parentValue) {
                return Project.findById(parentValue)
                    .then(project => {
                        return project.branches
                    });
            }
        }
    })
});

module.exports = ProjectType;