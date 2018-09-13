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
    <button className="btn" {...props}>
      Start
    </button>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.toggleGame = this.toggleGame.bind(this);

    this.state = {
      started: false,
      paused: false,
      numberOfDots: 1,
      dot: {
        minWidth: 10,
        maxWidth: 100,
        minVelocity: 10,
        maxVelocity: 100,
      },
    };
  }

  componentDidMount() {}

  toggleGame(event) {
    this.setState({started: true}, console.log('toggle'));
  }

  render() {
    return (
      <div className="app">
        <div className="app-menu">
          <div className="app-score">23242</div>
          <Button onClick={this.toggleGame} />

          <input
            type="range"
            id="app-slider"
            name="app-slider"
            min="10"
            max="100"
            defaultValue="50"
            step="1"
          />
        </div>
        <div className="app-main">
          <div className="app-game">
            <Game />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
