import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  import CreateGame from "./CreateGame";
  import JoinGame from "./JoinGame";
  import GameLobby from "./GameLobby";

export default function TopComponent (){

    const [gamestate, setGamestate] = useState(null);

    

        return (<div>
            <div>
                The gamestate is: {JSON.stringify(gamestate)}
            </div>
              <Router>
                    <Switch>
                        <Route path="/create" render={(props) => (
                            <div>
                            <h2>Create a game</h2>
                            <Link to="/" className="main-btn">Main page</Link>
                            <div className="create-game-form">
                            </div>
                            <CreateGame setGamestate={setGamestate}></CreateGame>
                        </div>
                        )}>
                            
                        </Route>

                        <Route path="/join" render={(props) => (
                            <JoinGame setGamestate={setGamestate}></JoinGame>
                        )}>
                        </Route>

                        <Route path="/lobby" render={(props) => (
                            <GameLobby gamestate={gamestate}></GameLobby>
                        )}>
                        </Route>

                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
            </Router>
        </div>)


    function Home() {
        return <div>
                  <h2>Home</h2>
                    <div className="button-list-landing-page">
                      <Link to="/create" className="main-btn">Create Game</Link>
                      <Link to="/join" className="main-btn">Join Game</Link>
                    </div>
              </div>;
      }
      
      
      
    function Join() {
        return  <div>
                    <h2>Join a game</h2>
                    <Link to="/" className="main-btn">Main page</Link>
                    <JoinGame></JoinGame>
                </div>;
      }
      
    function Lobby(){
        return <div>
            <GameLobby username="Tobias"></GameLobby>
          </div>
    }
}