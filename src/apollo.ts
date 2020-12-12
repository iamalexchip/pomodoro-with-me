import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

// resolvers
import {SessionResolver} from "./resolvers/SessionResolver";

export const server = async() => {
  const schema = await buildSchema({
    resolvers: [SessionResolver],
    emitSchemaFile: true,
    validate: false,
  });

 return new ApolloServer({schema});
}
