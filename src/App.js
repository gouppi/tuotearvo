import React, {useState} from 'react';
import NewReview from './pages/NewReview';
import Products from './pages/Products';
import Product from './pages/Product';
import Landing from './pages/Landing';
import Navigation from './components/Navigation';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import SearchResults from './pages/SearchResults';
import Grid from '@material-ui/core/Grid';
import { InMemoryCache } from 'apollo-cache-inmemory';

//import Box from '@material-ui/core/Box';
import './App.css';
import {BrowserRouter as Router,
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
      <div className="App">
      <Router>
        <Navigation setSearchTerm={setSearchTerm}/>
        
        <Container style={{padding:'124px 10px 10px', minHeight:'100vh', height:'100%', backgroundColor:'white'}} maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item md={10}>
            <Container maxWidth="md">
            <CardMedia
                              style={{maxWidth:1200}}
                              component="img"
                              alt="Contemplative Reptile"
                              height="auto"
                              image="https://picsum.photos/800/160"
                              title="MAINOSPAIKKA"
                              />
                              </Container>

            
            
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              <Route path="/products">
                <Products />
              </Route>
              <Route path="/product/:productId">
                <Product />
              </Route>
              <Route path="/create">
                <NewReview />
              </Route>
              <Route path="/search">
                <SearchResults searchTerm={searchTerm} />
              </Route>
              <Redirect from="*" to={"/"} />
            </Switch>
            </Grid>
              <Grid item md={2}>
              <CardMedia
                                style={{maxWidth:1200}}
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
      </div>
    </ApolloProvider>
  );
}

export default App;
