import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import '../App.css';
import CurrencyConverter from './CurrencyConverter';
import Footer from './layout/Footer';
import Navbar from './layout/Navbar';



const App = () => {
  return (
    <Router>
      <Navbar />
      <CurrencyConverter />
      <Footer />
    </Router>
  );
}

export default App;
