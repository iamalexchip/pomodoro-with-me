import { ApolloClient, InMemoryCache } from '@apollo/client';

export default new ApolloClient({
  uri: process.env.API_URL || 'http://localhost:5000/graphql',
  cache: new InMemoryCache()
});
