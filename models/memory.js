const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const MemorySchema = new Schema({
    name: String,
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    project: { type: Schema.Types.ObjectId, ref: 'project' },
    branches: [{
        name: String,
        data: { type: Schema.Types.Mixed },
        result: { type: Schema.Types.Mixed },
        active: { type: Boolean, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
        createdAt: { type: Date, default: Date.now() },
        documents: [{
            path: String,
            name: String,
            active: { type: Boolean, default: true },
            createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
            createdAt: { type: Date, default: Date.now() },
            size: Number
        }]
    }]
})

MemorySchema.virtual('branchCount').get(function () {
    return this.branches.length;
});

MemorySchema.statics.add = function (id, name, createdBy) {
    const Project = mongoose.model('project');
    const Memory = mongoose.model('memory');
    return Promise.all([Project.findById(id), this.findOne({ project: id, name })])
        .then(([project, memory]) => {
            if (!project || memory) { throw new Error('Cant add memory, either bad Id or name already used') }

            memory = new Memory({ name, project, createdBy })
            project.memories.push(memory)
            return Promise.all([project.save(), memory.save()])
                .then(([project, memory]) => memory);
        });
}

MemorySchema.statics.rename = function (id, name, createdBy) {
    return this.findById(id).populate({ path: 'project', populate: { path: 'memories' } })
        .then(memory => {
            if (!memory) { throw new Error('Cant update memory, wrong id') }
            const memory2 = _.find(memory.project.memories, { name })
            if (memory2) { throw new Error('Name already in use') }
            memory.name = name;
            return memory.save()
                .then(memory => memory)
        });
}

MemorySchema.statics.deactivate = function (id) {
    return this.findById(id)
        .then(memory => {
            if (!memory) { throw new Error('Cant update memory, wrong id') }
            memory.active = false;
            return memory.save()
                .then(memory => memory)
        });
}

MemorySchema.statics.activate = function (id) {
    return this.findById(id)
        .then(memory => {
            if (!memory) { throw new Error('Cant update memory, wrong id') }
            memory.active = true;
            return memory.save()
                .then(memory => memory)
        });
}

MemorySchema.statics.addBranch = function (id, name, data, result, createdBy) {
    return this.findById(id)
        .then(memory => {
            if (!memory) { throw new Error('Cant add, bad ID') }
            if (memory.branchCount == 0) { memory.branches.push({ name: 'master', data, result, createdBy }) }
            else {
                const branch = _.find(memory.branches, { name })
                if (branch) { throw new Error('Cant add, name already in use') }
                memory.branches.push({ name, data, result, createdBy })
            }
            return memory.save()
                .then(memory => memory);
        });
}

MemorySchema.statics.renameBranch = function (id, name) {
    return this.findOne({'branches._id':id})
        .then(memory => {
            if (!memory) { throw new Error('Cant change name, bad ID') }
            const branches = _.find(memory.branches, { name })
            if (branches) { throw new Error('Cant add, name already in use') }
            const branchToUpdate = _.find(memory.branches, function(o) { return o._id.toString() == id })
            if (!branchToUpdate) { throw new Error('Cant change name, bad ID') }
            branchToUpdate.name = name;
            return memory.save()
                .then(memory => memory);
        });
}

MemorySchema.statics.deactivateBranch = function (id) {
    return this.findOne({'branches._id':id})
        .then(memory => {
            if (!memory) { throw new Error('Cant update, bad ID') }
            const branchToUpdate = _.find(memory.branches, function(o) { return o._id.toString() == id })
            if (!branchToUpdate) { throw new Error('Cant update, bad ID') }
            branchToUpdate.active = false;
            return memory.save()
                .then(memory => memory);
        });
}

MemorySchema.statics.activateBranch = function (id) {
    return this.findOne({'branches._id':id})
        .then(memory => {
            if (!memory) { throw new Error('Cant update, bad ID') }
            const branchToUpdate = _.find(memory.branches, function(o) { return o._id.toString() == id })
            if (!branchToUpdate) { throw new Error('Cant update, bad ID') }
            branchToUpdate.active = true;
            return memory.save()
                .then(memory => memory);
        });
}

MemorySchema.statics.addDocument = function (id, createdBy) {
}

MemorySchema.statics.renameDocument = function (id, createdBy) {
}

MemorySchema.statics.removeDocument = function (id, createdBy) {
}

mongoose.model('memory', MemorySchema);