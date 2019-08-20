import React from 'react';
import ReactTable from 'react-table';
import _ from 'lodash';
import 'react-table/react-table.css';
import { getInitialFlightData } from './DataProvider';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: getInitialFlightData()
    }
    this.columns = [
      {
        Header: "Origin",
        accessor: "origin"
      },
      {
        Header: "Flight",
        accessor: "flight"
      },
      {
        Header: "Arrival",
        accessor: "arrival"
      },
      {
        Header: "State",
        accessor: "state"
      }
    ];

    // this is the object for the SSE protocol
    this.eventSource = new EventSource("http://localhost:5000/events");
  }

  updateFlightState(flightState){
    let newData = _.map(this.state.data, item => {
      if( item.flight === flightState.flight ){
        item.state = flightState.state;
      }
      return item;
    })
    this.setState({data: newData});
  }

  componentDidMount(){
    this.eventSource.onmessage = e =>
      this.updateFlightState(JSON.parse(e.data));
  }

  render(){
    return (
      <div className="App">
        <ReactTable data={this.state.data} columns={this.columns} />
      </div>
    );
  }
}

export default App;
