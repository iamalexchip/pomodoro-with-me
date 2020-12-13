import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

// resolvers
import { SessionResolver } from "./resolvers/SessionResolver";
import { ColumnResolver } from "./resolvers/ColumnResolver";

export const server = async() => {
  const schema = await buildSchema({
    resolvers: [SessionResolver, ColumnResolver],
    emitSchemaFile: true,
    validate: false,
  });

 return new ApolloServer({schema});
}
