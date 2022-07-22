import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import '../App.css';
import CurrencyConverter from './CurrencyConverter';
import Footer from './layout/Footer';
import Navbar from './layout/Navbar';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <Navbar />
      <h1 className="title">Currency Converter</h1>
          <Switch>
            <Route path="/" exact component={CurrencyConverter} />
            <Route component={NotFound} />
          </Switch>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Route component={NotFound} />
          </div>
          <div className="col-6">
            <Route component={NotFound} />
          </div>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
