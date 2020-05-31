import React, { useState } from 'react';
import NewReview from './pages/NewReview';
import Products from './pages/Products';
import Product from './pages/Product';
import Landing from './pages/Landing';

import Categories from './pages/Categories';


import Navigation from './components/Navigation';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import SearchResults from './pages/SearchResults';
import Grid from '@material-ui/core/Grid';
import { InMemoryCache } from 'apollo-cache-inmemory';
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
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
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
            <Grid item md={10}>
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>
                {/* <Route path="/products">
                  <Products />
                </Route> */}
                <Route path="/product/:productId">
                  <Product />
                </Route>
                <Route path="/kategoriat/:category?">
                  <Categories />
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
                style={{ maxWidth: 1200 }}
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
