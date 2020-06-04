import React, { useState } from 'react';
import NewReview from './pages/NewReview';
import Products from './pages/Products';

import Product2 from './pages/Product2';
import Landing from './pages/Landing';

import Categories from './pages/Categories';

import Navigation from './components/Navigation';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import SearchResults from './pages/SearchResults';
import Grid from '@material-ui/core/Grid';
import { InMemoryCache,defaultDataIdFromObject } from 'apollo-cache-inmemory';
import Box from '@material-ui/core/box';

//import Box from '@material-ui/core/Box';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

const client = new ApolloClient({
  //uri: 'http://localhost:9002/graphql'
  uri: 'http://192.168.0.106:4000/graphql',
  cache: new InMemoryCache({
    dataIdFromObject: object => {
      //console.log("Objektin tyyppinimi:", object.__typename);
      //console.log("Itse objekti", object);
      switch (object.__typename) {
        //case "CategoryProducts": return object.page; // use the `key` field as the identifier
        //case 'bar': return `bar:${object.blah}`; // append `bar` to the `blah` field as the identifier
        // TODO: Pagination + categoryProducts page for specific seo_name + page_id + limit combo?
        default: return defaultDataIdFromObject(object); // fall back to default handling
      }
    }
  })
});


function App() {
  let [searchTerm, setSearchTerm] = useState('');
  return (
    <ApolloProvider client={client}>

      <Router>
        <Box display="flex" justifyContent="center" maxWidth="lg" style={{ padding: '10px 0', backgroundColor: "#f8f8f8" }}>
          <CardMedia
            style={{ minHeight: '240px', maxWidth: '980px' }}
            component="img"
            alt="Contemplative Reptile"
            height="auto"
            image="https://picsum.photos/980/240"
            title="MAINOSPAIKKA"
          />
        </Box>
        <Navigation setSearchTerm={setSearchTerm} />

        <Container style={{ minHeight: '100vh', height: '100%' }} maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item style={{marginTop:"20px"}} md={10}>
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>

                <Route exact path="/tuotteet/:category?">
                  <Categories />
                </Route>
                <Route exact path="/tuotteet/:category/:product">
                  <Product2/>
                </Route>

                {/* <Route path="/create">
                  <NewReview />
                </Route> */}
                <Route path="/search">
                  <SearchResults searchTerm={searchTerm} />
                </Route>
                <Redirect from="*" to={"/"} />
              </Switch>
            </Grid>
            <Grid item md={2}>
              <CardMedia
                style={{ maxWidth: 1200, paddingTop: '10px' }}
                component="img"
                alt="Contemplative Reptile"
                height="auto"
                image="https://picsum.photos/160/600"
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
