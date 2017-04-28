const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;
const ProjectType = require('../../types/project_type');
const AuthService = require('../../../services/auth');
const Project = mongoose.model('project');

module.exports = {
  type: ProjectType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, { id, name, token }, req) {
    return AuthService.checkUser({ token, req })
      .then(user => {
        if (user) {
          return Project.add(id, name, user.email, user._id)
        }
      })
  }
};