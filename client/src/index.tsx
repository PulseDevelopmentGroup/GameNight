import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  HttpLink,
  ApolloProvider,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";

import "./tailwind.css";
import "./index.css";
import App from "./App";
import { cache } from "./cache";
import { BrowserRouter as Router } from "react-router-dom";
import { loader } from "graphql.macro";
const clientSchema = loader("./schema.graphql");

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4001/query",
  }),
  typeDefs: clientSchema,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
