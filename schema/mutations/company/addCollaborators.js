const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = graphql;
const CompanyType = require('../../types/company_type');
const AuthService = require('../../../services/auth');
const Company = mongoose.model('company');

module.exports = {
    type: CompanyType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        emails: { type: new GraphQLList(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, { id, emails, token }, req) {
        return AuthService.checkUser({ token, req })
            .then(user => {
                if (user) {
                    return Company.addCollaborators(id, emails)
                }
            })
    }
};