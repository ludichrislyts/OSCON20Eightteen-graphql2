const photos = require('./data').photos;
const users = require('./data').users;
const { ApolloServer } = require('apollo-server')

const typeDefs = `
    type Photo {
        id: ID!
        name: String!
        description: String
        postedBy: User
    }
    type User {
        githubLogin: ID!
        name: String
        postedPhotos: [Photo!]!
    }
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
        totalUsers: Int!
        allUsers: [User!]!
    }
    type Mutation {
        postPhoto(name: String! description: String): Photo!
    }
`

var _id = 0

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos,
        totalUsers: () => users.length,
        allUsers: () => users
    },
    Mutation: {
        postPhoto: (parent, args) => {
            var newPhoto = {
                id: _id++,
                ...args
            }
            photos.push(newPhoto)
            return newPhoto
        }
    },
    Photo: {
        postedBy: parent => {
            return users.find(u =>
                u.githubLogin === parent.githubLogin)
        }
    },
    User: {
        postedPhotos: parent => {
            return photos.filter(p =>
                p.githubLogin === parent.githubLogin
            )
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server
    .listen()
    .then(({ url }) => console.log(`GraphQL Service Running on ${url}`))
