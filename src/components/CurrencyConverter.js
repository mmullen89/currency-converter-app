import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { json, checkStatus } from '../utils/utils';
import Curriences from '../utils/Currencies';
import ExchangeTable from './ExchangeTable';
import swapIcon from '../assets/swap-color.png'
import '../style/ConverterCSS.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '1',
      quoteAmount: '',
      rates: '',
      baseCurrency: 'USD',
      quoteCurrency: 'EUR'
    };
    this.handleChange = this.handleChange.bind(this);
    this.computeConversion = this.computeConversion.bind(this);
    this.fetchRates = this.fetchRates.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.swapCurrencies = this.swapCurrencies.bind(this);
  }

  computeConversion(base) {
    const target = (Number((this.state.rates[this.state.quoteCurrency] * base).toFixed(8))).toLocaleString("en-US");
    return target;
  }

  updateAmount() {
    this.setState({quoteAmount: this.computeConversion(this.state.amount)});
  }

  fetchRates(base) {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${base}`)
    .then(checkStatus)
    .then(json)
    .then((response) => {
      this.setState({rates: response.rates},
        ()=>{this.updateAmount()}
      )
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (name === 'amount') {
      this.setState({
        [name]: value,
        quoteAmount: this.computeConversion(value),
      });
    } 
    else if (name === 'baseCurrency') {
      this.setState({[name]: value});
      this.fetchRates(value); 
    }
    else if (name === 'quoteCurrency') {
      this.setState({[name]: value},
        ()=>{this.updateAmount()}
      );
    }
  }

  swapCurrencies() {
    let tempQuote = this.state.baseCurrency;
    let tempBase = this.state.quoteCurrency;

    this.setState({
      baseCurrency: tempBase,
      quoteCurrency: tempQuote
    },
    ()=>{this.fetchRates(this.state.baseCurrency)})
  }

  componentDidMount() {
    this.fetchRates(this.state.baseCurrency)
  }
  
  render() {
    const { amount , quoteAmount , baseCurrency , quoteCurrency } = this.state;
    return (
      <div>
          <div className="titleHolder mb-4">
            <h1 className="title">Quick Quote</h1>
          </div>
          <div className="heroBG"></div>      
            <div className="container" id="currencyContainer">
              <div className="row">
                <div className="col-12 amount">
                  <label>
                    <div className="text-center me-2">Enter Amount: </div>
                    <input type="number" name="amount" value={amount} onChange={this.handleChange} />
                  </label>
                </div>
              </div>
              <div className="row mt-4 mb-3">
                  <div className="col-12 col-md-5 mt-3 mt-md-0 centerContent">
                    <label htmlFor="baseCurrency" className="me-2">From: </label>
                    <select name="baseCurrency" id="baseCurrency" value={baseCurrency} onChange={this.handleChange}>
                      {Object.entries(Curriences).map((key) => (
                        <option value={key[0]} key={key[0]}>{key[0]} - {key[1]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-2 mt-3 mt-md-0 mb-3 mb-md-0 swapContainer centerContent grow">
                    <span className="swapButton">
                      <img src={swapIcon} onClick={this.swapCurrencies} className="swap"></img>
                    </span>
                  </div>
                  <div className="col-12 col-md-5 mb-3 mb-md-0 centerContent">
                    <label htmlFor="quoteCurrency" className="me-2">To: </label>
                    <select name="quoteCurrency" id="quoteCurrency" value={quoteCurrency} onChange={this.handleChange}>
                      {Object.entries(Curriences).map((key) => (
                        <option value={key[0]} key={key[0]}>{key[0]} - {key[1]}</option>
                      ))}
                    </select>
                  </div>
              </div>
            <div className="row">
              <div className="col-12 ms-3 quoteDisplay">
                <span className="quote">{amount} {baseCurrency} equals <span className="quotedTotal">{quoteAmount} {quoteCurrency}</span></span>
                <span>1 {baseCurrency} = {Number(this.state.rates[this.state.quoteCurrency]).toFixed(5)} {quoteCurrency}</span>
              </div>
            </div> 
          </div>

        <div className="container mt-5 centerContent mb-5">
          <div className="row">
            <div className="col-6">
              <ExchangeTable base={this.state.baseCurrency} rates={this.state.rates}/>
            </div>
            <div className="col-6">
              <Route component={NotFound} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyConverter;