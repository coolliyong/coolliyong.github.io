import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './hooks_study/Counter'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
           react Hooks 学习
          </p>
          <span>useState</span>
          <Counter></Counter>
        </header>
      </div>
    );
  }
}

export default App;
