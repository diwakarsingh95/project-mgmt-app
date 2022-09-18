// const { projects, clients } = require('../sampleData')

// Mongoose Models
const Project = require('../models/Project')
const Client = require('../models/Client')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} = require('graphql')

const STATUS_ENUM = new GraphQLEnumType({
  name: 'ProjectStatus',
  values: {
    new: { value: 'Not Started' },
    progress: { value: 'In Progress' },
    completed: { value: 'Completed' }
  }
})

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent) {
        return Client.findById(parent.clientId)
      }
    }
  })
})

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find()
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Project.findById(args.id)
      }
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find()
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Client.findById(args.id)
      }
    }
  }
})

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve(_, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone
        })
        return client.save()
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => project.remove())
        })
        return Client.findByIdAndRemove(args.id)
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: STATUS_ENUM,
          defaultValue: 'Not Started'
        },
        clientId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId
        })
        return project.save()
      }
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(_, args) {
        return Project.findByIdAndRemove(args.id)
      }
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: STATUS_ENUM
        }
      },
      resolve(_, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status
            }
          },
          { new: true }
        )
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
