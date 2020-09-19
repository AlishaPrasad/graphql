const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql'); 

const app = express();

const users = [];

app.use(bodyParser.json());

app.use('/graphql', 
    graphqlHttp({
        schema: buildSchema(`
            type User {
                firstName: String!
                lastName: String!
                email: String!
                prefix: String!
                credentials: String!
            }
            
            input UserInput {
                firstName: String!
                lastName: String!
                email: String!
                prefix: String!
                credentials: String!
            }

            type RootQuery {
                users: [User!]!
            }

            type RootMutation {
                createUser(userInput: UserInput) : User
            }

            schema {
                query: RootQuery,
                mutation: RootMutation
            }
        `),
        rootValue:{
            users: () => users,
            createUser: (args) => {
                const user = {
                    firstName: args.userInput.firstName,
                    lastName: args.userInput.lastName,
                    email:args.userInput.email,
                    prefix: args.userInput.prefix,
                    credentials: args.userInput.credentials
                }
                users.push(user);
                return user;
            }
        },
        graphiql: true
    })
);

app.listen(3000);
