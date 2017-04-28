const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const ProjectSchema = new Schema({
  name: String,
  company: { type: Schema.Types.ObjectId, ref: 'company' },
  memories:
  [
    { type: Schema.Types.ObjectId, ref: 'memory' }
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  createdAt: { type: Date, default: Date.now() },
  active: { type: Boolean, default: true },
});

ProjectSchema.statics.add = function (id, name, email, createdBy) {
  const Company = mongoose.model('company');
  const Project = mongoose.model('project');
  return Promise.all([Company.findById(id), this.findOne({ company: id, name })])
    .then(([company, project]) => {
      if (!company || project) { throw new Error('Cant add project, either bad Id or name already used') }

      const collaborator = _.find(company.collaborators, { email, active: true })

      if (!collaborator) { throw new Error('Unauthorized') }

      project = new Project({ name, company, createdBy })
      company.projects.push(project)
      return Promise.all([company.save(), project.save()])
        .then(([company, project]) => project);
    });
}

ProjectSchema.statics.rename = function (id, name) {
  return this.findById(id).populate({ path: 'company', populate: { path: 'projects' } })
    .then(project => {
      if (!project) { throw new Error('Cant update project, wrong id') }
      const project2 = _.find(project.company.projects, { name })
      if (project2) { throw new Error('Name already in use') }
      project.name = name;
      return project.save()
        .then(project => project)
    });
}

ProjectSchema.statics.deactivate = function (id) {
  return this.findById(id)
    .then(project => {
      if (!project) { throw new Error('Cant update project, wrong id') }      
      project.active = false;
      return project.save()
        .then(project => project)
    });
}

ProjectSchema.statics.activate = function (id) {
  return this.findById(id)
    .then(project => {
      if (!project) { throw new Error('Cant update project, wrong id') }      
      project.active = true;
      return project.save()
        .then(project => project)
    });
}

mongoose.model('project', ProjectSchema);