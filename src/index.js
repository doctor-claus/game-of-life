import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Grid from './components/grid';
import Buttons from './components/buttons';
class App extends Component{
    constructor(props){
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;
        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)) //array to store entire grid in 2D array
        }
    }
    selectBox = (row, col) => {                             //selecting a box in the grid
        var gridCopy = arrayClone(this.state.gridFull); //deepcloning as the array is 2D
        gridCopy[row][col] = !gridCopy[row][col]; //true to false and vice versa
        this.setState({ gridFull: gridCopy });
    }
    seed = () => {//random selection of boxes in grid using seed button
        var gridCopy = arrayClone(this.state.gridFull);
        for(var i = 0; i < this.rows; i++){
            for(var j = 0; j < this.cols; j++){
                if(Math.floor(Math.random() * 4) === 1){ // 25% chance for a box to be seeded
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({ gridFull: gridCopy, generation: 0 });
    }
    playButton = () => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed);
    }
    pauseButton = () => {
        clearInterval(this.intervalId);
    }
    slowButton = () => {
        this.speed = 1000;
        this.playButton();
    }
    fastButton = () => {
        this.speed = 10;
        this.playButton();
    }
    clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        clearInterval(this.intervalId);
        this.setState({ gridFull: grid, generation: 0 });
    }
    gridSize = (size) => {
        switch(size){
            case "1": 
                this.cols = 20;
                this.rows = 10;
                break;
            case "2": 
                this.cols = 50;
                this.rows = 30;
                break;
            default:
                this.cols = 70;
                this.rows = 50;
        }
        this.clear();
    }
    play = () => { // gameplay algorithm
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              let count = 0;
              if (i > 0) if (g[i - 1][j]) count++;
              if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
              if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
              if (j < this.cols - 1) if (g[i][j + 1]) count++;
              if (j > 0) if (g[i][j - 1]) count++;
              if (i < this.rows - 1) if (g[i + 1][j]) count++;
              if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
              if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
              if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
              if (!g[i][j] && count === 3) g2[i][j] = true;
            }
          }
          this.setState({ gridFull: g2,
        generation: this.state.generation + 1});
    }
    componentDidMount(){ // start playing when page is loaded
        this.seed();
        this.playButton();
    }
    render(){
        return (
            <div>
                <h1>The Game of Life</h1>
                <Buttons 
                    play = {this.playButton}
                    pause = {this.pauseButton}
                    slow = {this.slowButton}
                    fast = {this.fastButton}
                    clear = {this.clear}
                    seed = {this.seed}
                    gridSize = {this.gridSize}
                />
                <Grid
                    gridFull = {this.state.gridFull}
                    rows = {this.rows}
                    cols = {this.cols}
                    selectBox = {this.selectBox} 
                />
                <h2 className= "generations">Generations: {this.state.generation}</h2>
            </div>
        )
    }
}
function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<App />, document.getElementById('root'));



