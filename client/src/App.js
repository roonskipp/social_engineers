import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';


import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import GameLobby from './components/GameLobby';
import TopComponent from './components/TopComponent';

function App() {

  // Handling the gamestate hook

  return (
      <TopComponent></TopComponent>
  );

 

  function onGameCreatedCallback(data){
    console.log(JSON.stringify(data))
  }
}



export default App;
