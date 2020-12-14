import { AppRouter } from "./AppRouter";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../providers/apolloClient";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;
