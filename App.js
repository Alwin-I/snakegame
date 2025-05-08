import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import Matter from 'matter-js';
import { GameEngine } from 'react-native-game-engine';
import Constants from './Constants';
import { Head } from './components/Head';
import { Tail } from './components/Tail';
import { Food } from './components/Food';
import { Borders } from './components/Borders';
import { GameLoop } from './entities/index';
import { Physics } from './Physics';

// MainMenu 
class MainMenu extends Component {
  render() {
    return (
      <View style={styles.mainMenuContainer}>
        <ImageBackground
          source={require('./assets/grass-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.menuContent}>
          <Text style={styles.title}>Nokia Snake Game</Text>
          <View style={styles.developersContainer}>
            <Text style={styles.developerText}>Developed by:</Text>
            <Text style={styles.nameText}>Alwin Antony</Text>
          </View>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={this.props.onStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// Main App component game logic and rendering
export default class App extends Component {
  constructor(props) {
    super(props);
    this.engine = Matter.Engine.create({ enableSleeping: false });
    this.world = this.engine.world;

    // Create game boundaries
    const wallThickness = 50;
    const width = Constants.MAX_WIDTH;
    const height = Constants.MAX_HEIGHT;

    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true })
    ];
    Matter.World.add(this.world, walls);

    // Initialize game state
    this.state = {
      running: false,
      score: 0,
      paused: false,
      showMainMenu: true
    };
  }

  // Lifecycle methods
  componentDidMount() {
    this.rafLoop = null;
    this.keepAliveLoop();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafLoop);
  }

  // Game loop 
  keepAliveLoop = () => {
    if (this.gameEngine && this.state.running) {
      this.gameEngine.dispatch({ type: 'tick' });
    }
    this.rafLoop = requestAnimationFrame(this.keepAliveLoop);
  };

  // Setup game entities (snake head, tail, food, and borders)
  setupGameEntities = () => {
    const startX = Math.floor(Constants.GRID_WIDTH / 2);
    const startY = Math.floor(Constants.GRID_HEIGHT / 2);

    // Generate random food position doesn't overlap with snake
    let foodX = startX;
    let foodY = startY;

    while (
      (foodX === startX && foodY === startY) ||
      foodX <= 0 || foodX >= Constants.GRID_WIDTH - 1 ||
      foodY <= 0 || foodY >= Constants.GRID_HEIGHT - 1
    ) {
      foodX = Math.floor(Math.random() * (Constants.GRID_WIDTH - 2)) + 1;
      foodY = Math.floor(Math.random() * (Constants.GRID_HEIGHT - 2)) + 1;
    }

    return {
      physics: { 
        engine: this.engine, 
        world: this.world,
        running: this.state.running 
      },
      borders: {
        renderer: <Borders />
      },
      head: {
        position: [startX, startY],
        xspeed: 1,
        yspeed: 0,
        updateFrequency: 30,
        nextMove: 30,
        size: Constants.CELL_SIZE,
        touchStart: null,
        renderer: <Head />
      },
      tail: {
        size: Constants.CELL_SIZE,
        elements: [],
        renderer: <Tail />
      },
      food: {
        position: [foodX, foodY],
        size: Constants.CELL_SIZE,
        renderer: <Food />
      }
    };
  };

  // Handle game events (game over, scoring)
  onEvent = (e) => {
    if (e.type === 'game-over') {
      this.setState({ running: false });
    } else if (e.type === 'score+') {
      this.setState(prevState => ({ score: prevState.score + 1 }));
    }
  };

  // Reset game state and physics engine
  resetGame = () => {
    Matter.Engine.clear(this.engine);
    this.engine = Matter.Engine.create({ enableSleeping: false });
    this.world = this.engine.world;

    const wallThickness = 50;
    const width = Constants.MAX_WIDTH;
    const height = Constants.MAX_HEIGHT;

    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true })
    ];
    Matter.World.add(this.world, walls);
    
    this.setState({
      running: true,
      score: 0,
      paused: false
    }, () => {
      if (this.gameEngine) {
        this.gameEngine.swap(this.setupGameEntities());
      }
    });
  };

  // Toggle game pause state
  togglePause = () => {
    this.setState(prevState => {
      const newPaused = !prevState.paused;
      return {
        paused: newPaused,
        running: !newPaused
      };
    });
  };

  // Start game from main menu
  startGame = () => {
    this.setState({
      showMainMenu: false,
      running: true,
      score: 0,
      paused: false
    });
  };

  render() {
    // Show main menu if game hasn't started
    if (this.state.showMainMenu) {
      return <MainMenu onStartGame={this.startGame} />;
    }

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('./assets/grass-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.gameContainer}>
          <StatusBar hidden={true} />
          <View style={styles.topBar}>
            <Text style={styles.scoreText}>Score: {this.state.score}</Text>
            <TouchableOpacity onPress={this.togglePause} style={styles.pauseButton}>
              <Text style={styles.pauseButtonText}>
                {this.state.paused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Game engine component that handles game physics and rendering */}
          <GameEngine
            ref={(ref) => { this.gameEngine = ref; }}
            style={styles.gameEngine}
            systems={[ Physics, GameLoop ]}
            entities={ this.setupGameEntities() }
            running={ this.state.running }
            onEvent={ this.onEvent }
          />

          {/* Pause overlay */}
          { this.state.paused && (
            <View style={styles.pauseOverlay}>
              <Text style={styles.pauseText}>Game Paused</Text>
              <TouchableOpacity onPress={this.togglePause} style={styles.resumeButton}>
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.setState({ showMainMenu: true })}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Game over overlay */}
          { !this.state.running && !this.state.paused && (
            <View style={styles.gameOverOverlay}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.gameOverText}>Score: {this.state.score}</Text>
              <TouchableOpacity onPress={this.resetGame} style={styles.restartButton}>
                <Text style={styles.restartText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => this.setState({ showMainMenu: true })}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

// Styles for the game components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    top: '-20%',
    left: '-20%',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  scoreText: {
    color: '#000',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  gameEngine: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameOverText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    margin: 10
  },
  restartButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20
  },
  restartText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5
  },
  pauseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  mainMenuContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  developersContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  developerText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  nameText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});
