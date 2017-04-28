const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull 
} = graphql;
const ProjectType = require('../project_type');
const AuthService = require('../../../services/auth');
const Project = mongoose.model('project');

module.exports = {
    type: ProjectType,
      args: {
        token: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, {token, id}, req) {
         return Project.findById(id);
      }
};