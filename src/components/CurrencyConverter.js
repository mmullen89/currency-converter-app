import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { json, checkStatus } from '../utils/utils';
import Curriences from '../utils/Currencies';
import ExchangeTable from './ExchangeTable';
import swapIcon from '../assets/swap-color.png'
import '../style/ConverterCSS.css';
import Chart from 'chart.js';

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
      quoteCurrency: 'EUR',
      loading: true
    };
    this.chartRef = React.createRef();
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
    this.setState({ loading: true });
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${base}`)
    .then(checkStatus)
    .then(json)
    .then((response) => {
      this.setState({rates: response.rates, loading:false},
        ()=>{this.updateAmount()}
      )
    });
  }

  getHistoricalRates = (base, quote) => {
    this.setState({ loading: true });
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    fetch(`https://altexchangerateapi.herokuapp.com/${startDate}..${endDate}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(rate => rate[quote]);
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
        this.setState({ loading: false });
      })
      .catch(error => console.error(error.message));
  }

  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    })
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
      this.setState({[name]: value},
        ()=>{this.getHistoricalRates(this.state.baseCurrency, this.state.quoteCurrency);});
      this.fetchRates(value);
    }
    else if (name === 'quoteCurrency') {
      this.setState({[name]: value},
        ()=>{
          this.updateAmount();
          this.getHistoricalRates(this.state.baseCurrency, this.state.quoteCurrency);
        }
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
    ()=>{
          this.fetchRates(this.state.baseCurrency);
          this.getHistoricalRates(this.state.baseCurrency, this.state.quoteCurrency);
      })
  }

  componentDidMount() {
    const { baseCurrency, quoteCurrency } = this.state;
    this.fetchRates(baseCurrency)
    this.getHistoricalRates(baseCurrency, quoteCurrency)
  }
  
  render() {
    const { amount , quoteAmount , baseCurrency , quoteCurrency , loading } = this.state;
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
                    <select name="baseCurrency" id="baseCurrency" value={baseCurrency} onChange={this.handleChange} disabled={loading}>
                      {Object.entries(Curriences).map((key) => (
                        <option value={key[0]} key={key[0]}>{key[0]} - {key[1]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-2 mt-3 mt-md-0 mb-3 mb-md-0 swapContainer centerContent grow">
                    <span className="swapButton">
                      <input type="image" src={swapIcon} height='25px' onClick={this.swapCurrencies} className="swap" disabled={loading} />
                    </span>
                  </div>
                  <div className="col-12 col-md-5 mb-3 mb-md-0 centerContent">
                    <label htmlFor="quoteCurrency" className="me-2">To: </label>
                    <select name="quoteCurrency" id="quoteCurrency" value={quoteCurrency} onChange={this.handleChange} disabled={loading}>
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
            <div className="col-12 col-lg-6">
              <ExchangeTable base={this.state.baseCurrency} rates={this.state.rates}/>
            </div>
            <div className="col-12 col-lg-6 mt-5 mt-lg-0">
              <h2>Historical Rates (1 Month)</h2>
              <canvas ref={this.chartRef} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CurrencyConverter;