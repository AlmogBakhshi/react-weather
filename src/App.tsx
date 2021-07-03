import React from 'react';
import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './components/weather';
import Favorites from './components/weather/favorites';

function App() {
  return (
    <BrowserRouter basename='/'>
      <Switch>
        <Route path='/favorites' component={Favorites} />
        <Route path='/' component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
