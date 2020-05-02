import React from 'react';
import NewReview from './pages/NewReview';
import Reviews from './pages/Reviews';
import SingleProduct from './pages/SingleProduct';
import Navigation from './components/Navigation';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';

import {BrowserRouter as Router,
  Switch,
  Route,
  } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
      <Navigation/>
      <Container maxWidth="md"  >
      <CardMedia
                        style={{marginTop:'10px', maxWidth:1200, margin: '5px auto'}}
                        component="img"
                        alt="Contemplative Reptile"
                        height="auto"
                        image="https://i.picsum.photos/id/1021/800/160.jpg"
                        title="Contemplative Reptile"
                        />
                        </Container>
      <Switch>
          
          <Route path="/arvostelut">
            <Reviews />
          </Route>
          <Route path="/yksittainen">
            <SingleProduct />
          </Route>
          <Route path="/luo">
          <NewReview />
          </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
