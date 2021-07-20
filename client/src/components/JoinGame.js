import React, {useState} from "react";
import { Redirect } from "react-router";

function JoinGame (props){

    const [redirectToLobby, setRedirectToLobby] = useState(false)
    const [username, setUsername] = useState("")
    const [gamecode, setGamecode] = useState("")


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/join_game", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/Json'
            },
            body: JSON.stringify({gamecode: gamecode, username: username})
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
                        props.setGamestate(new_gamestate);
                        console.log("hi")
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
                        <label>Gamecode
                            <input type="text" value={gamecode} onChange={e => setGamecode(e.target.value)}></input>
                        </label>
                        <br></br>
                        <label>Username
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)}></input>
                        </label>
                        <button type="submit">Join game</button>
                    </form>
                </div>
            )
        }
    }


export default JoinGame;