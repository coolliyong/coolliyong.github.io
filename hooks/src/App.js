import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Counter from './hooks_study/Counter'
import EffectCom from './hooks_study/EffectCom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
           react Hooks 学习
          </p>
          
          {/* <Counter></Counter> */}
          <EffectCom />
        </header>
      </div>
    )
  }
}

export default App
