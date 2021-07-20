import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";

function CreateGame (props){

    const [redirectToLobby, setRedirectToLobby] = useState(false)
    const [username, setUsername] = useState("")
    const [gamesize, setGamesize] = useState("2")


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/create", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/Json'
            },
            body: JSON.stringify({gamesize: gamesize, username: username})
        })
              .then((res) => res.json())
              .then((data) => {
                    console.log(data);
                    let new_gamestate = data;
                    console.log(new_gamestate.gamesize);
                    console.log(new_gamestate != null);
                    // Want some proper check here if the game was correctly created TODO
                    if(new_gamestate != null){
                        // Redirect to lobby
                        props.setGamestate(new_gamestate)
                        setRedirectToLobby(true)
                    }
                });
          };



    
    if(redirectToLobby){
            return (
                <div>
                    <Redirect to="/lobby"/>
                </div>
            )
        }
        else{
            return (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>Gamesize
                            <input type="text" value={gamesize} onChange={e => setGamesize(e.target.value)}></input>
                        </label>
                        <br></br>
                        <label>Username
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)}></input>
                        </label>
                        <button type="submit">Create game</button>
                    </form>
                </div>
            )

        }
}


export default CreateGame;