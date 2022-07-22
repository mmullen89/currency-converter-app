import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from '../utils/utils';
import Curriences from '../utils/Currencies';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount : '1',
      generatedAmount: '',
      rates: '',
      fromField: 'USD',
      toField: 'EUR'
    };
    this.handleChange = this.handleChange.bind(this);
    this.computeAmount = this.computeAmount.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    console.log(name,value)
    this.setState({
      [name]: value
    });

    this.computeAmount();
  }

  componentDidMount() {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=USD`)
    .then(checkStatus)
    .then(json)
    .then((response) => {
      this.setState({rates: response.rates})
    });
  }

  computeAmount() {
    let tempAmount = this.state.rates[this.state.toField] * this.state.amount;
    console.log("tempAmount: " + tempAmount);
    console.log(this.state.amount);
    this.setState({generatedAmount: tempAmount});
  }
  
  render() {
    const { amount , generatedAmount , fromField , toField } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <label>
              Enter Amount:
              <input type="number" name="amount" value={amount} onChange={this.handleChange} />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label htmlFor="fromField">From: </label>
            <select name="fromField" id="fromField" value={fromField} onChange={this.handleChange}>
              {Object.keys(Curriences).map((key) => (
                <option value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="toField">To: </label>
            <select name="toField" id="toField" value={toField} onChange={this.handleChange}>
              {Object.keys(Curriences).map((key) => (
                  <option value={key}>{key}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span><button type="button" onClick={this.computeAmount}>Click Me!</button>{generatedAmount}</span>
          </div>
        </div> 
      </div>
    )
  }
}

export default CurrencyConverter;