const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

const lodash = require('lodash');

// Schema Def for Tasks
const tasks = [
  {
    id: '1',
    title: 'Create your first webpage',
    weight: 1,
    description:
      'Create your first HTML file 0-index.html with: -Add the doctype on the first line (without any comment) -After the doctype, open and close a html tag Open your file in your browser (the page should be blank)',
  },
  {
    id: '2',
    title: 'Structure your webpage',
    weight: 1,
    description:
      'Copy the content of 0-index.html into 1-index.html Create the head and body sections inside the html tag, create the head and body tags (empty) in this order',
  },
];

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: (GraphQLID) },
    projectId: { type: (GraphQLID) },
    title: { type: (GraphQLString) },
    weight: { type: (GraphQLInt) },
    description: { type: (GraphQLString) },
    project: {
      type: ProjectType,
      resolve: (parent, args) => {
        // return Project.findById(parent.projectId);
        return lodash.find(tasks, { id: parent.TaskId });
      }
    }
  })
})

// Schema Def for Projects
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: (GraphQLID) },
    title: { type: (GraphQLString) },
    weight: { type: (GraphQLInt) },
    description: { type: (GraphQLString) },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: (parent, args) => {
        return Task.find({projectId: parent.id})
      }
    }
  })
})

// rootQuery scope
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    task: {
    type: TaskType,
    args: {
        id: { type: GraphQLString }
      },
      resolve: (parent, args) => {
	  return lodash.find(tasks, { id: args.id });
      }
    },
    Project: {
      type: ProjectType,
      args: {
          id: { type: GraphQLString }
        },
        resolve: (parent, args) => {
            
	    return Project.findById(id);
        }
      },
      tasks: {
        type: new GraphQLList(TaskType),
        resolve: () => Task.find({})
      },
      projects: {
        type: new GraphQLList(ProjectType),
        resolve: () => Project.find({})
      }
  })
})



const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
    // addproject to database
		addProject: {
			type: ProjectType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				weight: { type: new GraphQLNonNull(GraphQLInt) },
				description: { type: new GraphQLNonNull(GraphQLString) }
			},
      // Resolve creates newb project and saves to database 
			resolve: (parent, args) => {
				let newNew = new Project({
					title: args.title,
					weight: args.weight,
					description: args.description,
				});
				return newNew.save();
			}
		},
		addTask: {
			type: TaskType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				weight: { type: new GraphQLNonNull(GraphQLInt) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				projectId: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				const superNew = new Task({
					title: args.title,
					weight: args.weight,
					description: args.description,
					projectId: args.projectId
				});
				return superNew.save();
			},
		},
	})
});

// export GraphQLSchema RootQuery
const schema = new GraphQLSchema({
  // define the query section
    query: RootQuery,
    mutation: Mutation
});

// export at the end of the file
module.exports = schema;
