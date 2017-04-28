const graphql = require('graphql');
const { GraphQLObjectType } = graphql;
const signup = require('./authentication/signup');
const login = require('./authentication/login');
const companyAdd = require('./company/add');
const companyRename = require('./company/rename');
const companyDeactivate = require('./company/deactivate');
const companyActivate = require('./company/activate');
const companyAddCollaborators = require('./company/addCollaborators');
const companyDismissCollaborators = require('./company/dismissCollaborators');
const companyAcceptInvitation = require('./company/acceptInvitation');
const companyLeave = require('./company/leave');
const companyTransfer = require('./company/transfer');
const companyCancelTransfer = require('./company/cancelTransfer');
const companyRejectTransfer = require('./company/rejectTransfer');
const companyAcceptTransfer = require('./company/acceptTransfer');
const projectAdd = require('./project/add');
const projectRename = require('./project/rename');
const projectDeactivate = require('./project/deactivate');
const projectActivate = require('./project/activate');
const memoryAdd = require('./memory/add');
const memoryRename = require('./memory/rename');
const memoryDeactivate = require('./memory/deactivate');
const memoryActivate = require('./memory/activate');
const memoryAddBranch = require('./memory/addBranch');
const memoryRenameBranch = require('./memory/renameBranch');
const memoryDeactivateBranch = require('./memory/deactivateBranch');
const memoryActivateBranch = require('./memory/activateBranch');

const rootFields = Object.assign({},
  {
    signup,
    login,
    companyAdd,
    companyRename,
    companyDeactivate,
    companyActivate,
    companyAddCollaborators,
    companyDismissCollaborators,
    companyAcceptInvitation,
    companyLeave,
    companyTransfer,
    companyCancelTransfer,
    companyRejectTransfer,
    companyAcceptTransfer,
    projectAdd,
    projectRename,
    projectDeactivate,
    projectActivate,
    memoryAdd,
    memoryRename,
    memoryDeactivate,
    memoryActivate,
    memoryAddBranch,
    memoryRenameBranch,
    memoryDeactivateBranch,
    memoryActivateBranch
  }
);

module.exports = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => rootFields
});