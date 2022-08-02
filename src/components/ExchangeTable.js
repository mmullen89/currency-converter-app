import React from 'react';
import '../style/Exchange.css';

const ExchangeTable = (props) => {

  const { base , rates } = props;

  return (
    <div>
      <h2>Exchange Table</h2>
      <div className="exchangeTable">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>
                {props.base} to
              </th>
              <th>
                1.00
              </th>
            </tr>
          </thead>
          <tbody>
          {Object.entries(rates).map((entry) => (
          <tr key={entry[0]}>
            <td>{entry[0]}</td>
            <td>{entry[1]}</td>
          </tr>
        ))}
          </tbody>
        </table>      
      </div>
    </div>
  );
}

export default ExchangeTable;