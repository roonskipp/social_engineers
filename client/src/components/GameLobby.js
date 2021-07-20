import { json } from "body-parser";
import React, {useState, useEffect} from "react";

export default function GameLobby(props){

    const [gamestate, setGamestate] = useState(null)
    const [username, setUsername] = useState(null)
    const [otherPlayers, setOtherPlayers] = useState(null)

    // Probably dont need this
    const [uID, setUID] = useState(null)

    useEffect( () => {
        if(props.gamestate != null){
            setGamestate(props.gamestate)
        }
    }, [gamestate])

    useEffect( () => {
        if(gamestate == null){
            getGameStateFromServer()
        }
    }, [gamestate])

    useEffect( () => {
        if(username == null){
            getUseridFromServer();
        }
    }, [username])

    useEffect( () => {
        if(otherPlayers == null){
            getOtherPlayers();
        }
    }, [otherPlayers])



    const getOtherPlayers = () => {
        if(gamestate == null){
            console.log("Cant get usernames without a gamestate id")
        }
        else{
            fetch('/get_players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/Json'
                },
                body: 
                    JSON.stringify({gamestate_id: gamestate.id})
            })
            .then((res) => res.json())
            .then((data) => {
                // usernames should be here
                // names are in a list
                setOtherPlayers(data);
                console.log(data);
            })
        }
    }

    const renderOtherPlayers = () => {
        if(otherPlayers != null){
            return otherPlayers.map((player) => <li>{player.username}</li>)
        }
    }

    const renderUsername = () => {
        if(username != null) {
            return username.toString()
        }
    }

    const getGameStateFromServer = () => {
        fetch('/get_gamestate', {
            method: 'GET',
            headers: {'Content-Type' : 'application/Json'}
        })
        .then((res) => res.json())
        .then((data) => {
            if(data != null)
            {   
                console.log(data);
                setGamestate(data);
            }
            else{
                console.log("Data was null. Expected a gamestate for the session")
            }
        })
    }

    const getUseridFromServer = () => {
        console.log("hi");
            console.log("Getting userid from server");
            fetch("/get_username", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/Json'
                  }
              })
            .then((res) => res.json())
            .then((data) => {
                console.log("data from server: " + data);
                if(data.username != null){
                    setUsername(data.username);
                }
                else{
                    console.log("No username in data from server...");
                }
            });
    }

    const Players = () => {
        if(gamestate == null){
            return <p>No game created yet.</p>
        }
        else{
            gamestate.players.forEach(player => {
                return <p>{player.username}</p>
            });
        }
    }

        if(gamestate != null){
            return(<div>
                <div>
                    {JSON.stringify(gamestate)}
                </div>
                <h1>Welcome to the game lobby, {renderUsername()}</h1>
                <div>
                    <p>Other players:</p><br/>
                    {renderOtherPlayers()}
                </div>
            </div>)
        }
        else{
            return(
                <div>
                    <h1>Welcome {username}. No game has been created yet.</h1>
                </div>
            )
        }
    }

