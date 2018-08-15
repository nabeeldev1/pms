import React, { Component } from 'react';
// import Layout from './components/Layout/Layout';
import Navbar from './components/Navbar/Navbar';
// import classes from './App.css';
import { BrowserRouter } from "react-router-dom";
import Footer from './components/Footer/Footer';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          {/* <Layout /> */}
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
