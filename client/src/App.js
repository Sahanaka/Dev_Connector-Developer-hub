import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/' component={ Landing } />
      <section className='container'>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </section>
    </Fragment>
  </Router>
);
  
export default App;
