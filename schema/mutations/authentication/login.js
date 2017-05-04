const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObject,
    GraphQLString,
    GraphQLNonNull
} = graphql;
const DeviceType = require('../../types/device_type');
const User = mongoose.model('user');

module.exports = {
    type: DeviceType,
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parentValue, { email }, req) {
        //console.log(req.headers['user-agent'])
        return User.addUser(email, req.headers['user-agent'])
    }
};