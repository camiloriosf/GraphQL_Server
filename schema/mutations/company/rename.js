const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} = graphql;
const UserType = require('../../types/user_type');
const AuthService = require('../../../services/auth');
const CompanyType = require('../../types/company_type');
const Company = mongoose.model('company');

module.exports = {
    type: CompanyType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, { id, name, token }, req) {
        return AuthService.checkUser({ token, req })
            .then(user => {
                if (user) {
                    return Company.rename(id, name, user.id)
                }
            })
    }
};