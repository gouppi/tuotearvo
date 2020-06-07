import React, { useState } from "react";
import Product from "./pages/Product";
import Landing from "./pages/Landing";
import Categories from "./pages/Categories";
import Navigation from "./components/Navigation";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import SearchResults from "./pages/SearchResults";
import Grid from "@material-ui/core/Grid";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import Box from "@material-ui/core/box";
import ad_160 from "./img/ad_160_600.png";
import ad_horizontal from "./img/ad_horizontal.png";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    dataIdFromObject: (object) => {
      //console.log("Objektin tyyppinimi:", object.__typename);
      //console.log("Itse objekti", object);
      switch (object.__typename) {
        // TODO: Pagination + categoryProducts page for specific seo_name + page_id + limit combo?
        default:
          return defaultDataIdFromObject(object); // fall back to default handling
      }
    },
  }),
});

function App() {
  let [searchTerm, setSearchTerm] = useState("");
  return (
    <ApolloProvider client={client}>
      <Router>
        <Box
          display="flex"
          justifyContent="center"
          maxWidth="lg"
          style={{ padding: "10px 0", backgroundColor: "#f8f8f8" }}
        >
          <CardMedia
            style={{ maxHeight: "240px", maxWidth: "980px" }}
            component="img"
            alt="Contemplative Reptile"
            height="auto"
            image={ad_horizontal}
            title="MAINOSPAIKKA"
          />
        </Box>
        <Navigation setSearchTerm={setSearchTerm} />

        <Container
          style={{ maxHeight: "100vh", minHeight: "100vh" }}
          maxWidth="xl"
        >
          <Grid container style={{ marginTop: "20px" }} spacing={4}>
            <Grid item md={10}>
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>
                <Route exact path="/tuotteet/:category?">
                  <Categories />
                </Route>
                <Route exact path="/tuotteet/:category/:product">
                  <Product />
                </Route>

                <Route path="/search">
                  <SearchResults searchTerm={searchTerm} />
                </Route>
                <Redirect from="*" to={"/"} />
              </Switch>
            </Grid>
            <Grid item md={2}>
              <CardMedia
                style={{ maxWidth: "160px", maxHeight: "600px" }}
                component="img"
                alt="Contemplative Reptile"
                height="auto"
                image={ad_160}
                title="MAINOSPAIKKA"
              />
            </Grid>
          </Grid>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;
