import React from 'react';
import NewReview from './pages/NewReview';
import Reviews from './pages/Reviews';
import SingleReview from './pages/SingleReview';
import Navigation from './components/Navigation';

import {BrowserRouter as Router,
  Switch,
  Route,
  } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
      <Navigation/>
      
      <Switch>
          
          <Route path="/arvostelut">
            <Reviews />
          </Route>
          <Route path="/yksittainen">
            <SingleReview />
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
