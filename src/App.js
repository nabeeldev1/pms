import React, { Component } from 'react';
// import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';
import classes from './App.css';
import { BrowserRouter } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className={classes.Main}>
          <Navbar />
          {/* <Layout /> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
