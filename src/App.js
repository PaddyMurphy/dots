import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game';
import './app.css';

/*
Dot Game - The goal of this exercise is to create a game.
In the game, dots move from the top to the bottom
of the screen. A player tries to click on the dots,
and receives points when they are successful.

- start button turns to pause
- dots fall at ajustable rate of 10-100 pixels
- new dot every second randomly at top (always whole)
- dots random size of 10-100 pixels
- points 1-10 (largest to smallest)
- clicking dot removes it and scores
*/

const Button = props => {
  return (
    <button className="app-btn" {...props}>
      Start
    </button>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      started: false,
      paused: false,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="app">
        <Game />
      </div>
    );
  }
}

export default App;
