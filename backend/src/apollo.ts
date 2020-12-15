import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

// resolvers
import { SessionResolver } from "./resolvers/SessionResolver";
import { ColumnResolver } from "./resolvers/ColumnResolver";
import { TaskResolver } from "./resolvers/TaskResolver";

export const server = async() => {
  const schema = await buildSchema({
    resolvers: [SessionResolver, ColumnResolver, TaskResolver],
    emitSchemaFile: true,
    validate: false,
  });

 return new ApolloServer({schema});
}
