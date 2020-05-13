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

//import Box from '@material-ui/core/Box';
import './App.css';
import {BrowserRouter as Router,
  Switch,
  Route,
  Redirect
  } from 'react-router-dom';

const client = new ApolloClient({
  //uri: 'http://localhost:9002/graphql'
  uri: 'http://localhost:4000/graphql'
});


function App() {
 //let searchTerm = '';
  let [searchTerm, setSearchTerm] = useState('');
  console.log("App kutsutaan kahesti");
  return (
    <ApolloProvider client={client}>
      <div className="App">
      <Router>
        <Navigation setSearchTerm={setSearchTerm}/>
        <Container style={{padding:'10px', minHeight:'100vh', height:'100%', backgroundColor:'white'}} maxWidth="md">
          <Container maxWidth="md">
          <CardMedia
                            style={{maxWidth:1200}}
                            component="img"
                            alt="Contemplative Reptile"
                            height="auto"
                            image="https://i.picsum.photos/id/1021/800/130.jpg"
                            title="MAINOSPAIKKA"
                            />
                            </Container>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="/reviews">
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
          
        </Container>
      </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
