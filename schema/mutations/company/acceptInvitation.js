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
//const CompanyType = require('../../types/company_type');
const Company = mongoose.model('company');

module.exports = {
    type: UserType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        token: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, { id, token }, req) {
        return AuthService.checkUser({ token, req })
            .then(user => {
                if (user) {
                    return Company.acceptInvitation(id, user.id)
                }
            })
    }
};