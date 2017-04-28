const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList
} = graphql;
const Company = mongoose.model('company');
const CollaboratorType = require('./collaborator_type');
const TransferType = require('./transfer_type');

const CompanyType = new GraphQLObjectType({
    name: 'CompanyType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        owner: {
            type: require('./user_type'),
            resolve(parentValue) {
                return Company.findById(parentValue).populate('owner')
                    .then(company => {
                        return company.owner
                    });
            }
        },
        transfers: {
            type: new GraphQLList(TransferType),
            resolve(parentValue) {
                return Company.findById(parentValue)
                    .then(company => {
                        return company.transfers
                    });
            }
        },
        collaborators: {
            type: new GraphQLList(CollaboratorType),
            resolve(parentValue) {
                return Company.findCollaborators(parentValue.id);
            }
        }
    })
});

module.exports = CompanyType;