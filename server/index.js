const express = require("express");
const db = require('./queries.js');
var session = require("express-session");
var cors = require('cors')
var uuid = require('uuid')
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.use(session({
	genid: function(req) {
	  return uuid.v1(); // use UUIDs for session IDs
	},
	secret: 'keyboard cat'
  }))


function CreateGameCode(){
	return Math.random().toString(36).substring(4).slice(0, 4).toUpperCase();
}

function genuuid(){
	return 
}

// temp list of games before DB is connected
var games = new Map();


app.get("/api", (req, res) => {
	var hour = 3600000
	req.session.cookie.expires = new Date(Date.now() + hour)
	res.json({ message: "Hello from server!" });
  });


app.get("/", (req,res) => {
	var hour = 360000
	req.session.cookie.expires = new Date(Date.now() + 24*hour)
	res.json();
	console.log(req.sessionID);
})

app.get("/session", (req, res) => {
	u_session = req.session;
	if(u_session.username){
		res.json({session: JSON.stringify(u_session)})
	console.log(req.sessionID)

	}
	else{
		res.json({username: "No username in session"})
	console.log(req.sessionID)

	}
});

app.get("/get_username", (req, res) => {
	u_session = req.session;
	u_session.username = uuid.v1();
	res.json({message: "Username is now a uuid v1"})
	console.log(req.sessionID)
});

app.post("/create", db.createGamestate);

app.post("/get_username", db.getUsernameFromSession);

app.post('/get_players', db.getPlayers);

app.get('/get_gamestate', db.getGamestateForSession);

app.post("/get_userid", (req, res) => {
	console.log("OK")
	console.log(req.body);
	let code = req.body.code;
	if(games.has(code)){
		let game = games.get(code);
		let found_player = false;
		for(var i = 0; i< game.players.length; i++){
			if(game.players[i].GetUID() == req.sessionID){
				// found user that requested their username, return the id to them
				found_player = true;
				res.json({userID:req.sessionID})
				break;
			}
		}
		if(! found_player){
			res.json({message: "Could not find a player with this session id"})
		}
	}
	else{
		console.log("No game with code: " + code + " exists.")
	}
});

app.get("/get_game_from_session", (req, res) =>{
	// Check if game exists with player with req.sessionID
	console.log("Attempting to find game with sessionID")
	console.log("Total games on server:" + games.size)
	
	let sID = req.sessionID;
	let found_player = false;

	games_array = Array.from(games.values())

	games.forEach((value, key) => {
		console.log(value, key)
		for(var i = 0; i< value.players.length; i++){
			console.log(value.players[i]);
			if(value.players[i].uiD == sID){
				console.log("Found game for session")
				res.json(value)
				found_player = true;
			}
		}
	});

	for (const [key, value] in games.entries()){
		console.log(key, value);
		for (var player in game.players){
			console.log(player.GetUID())
			if(player.GetUID() == sID){
				// Found game with the users session
				// return the gamestate object
				found_player = true;
				console.log("Found a game for this sessions ID")
				res.json({game})
				break;
			}
			if(found_player){
				break;
			}
		}
		if(found_player){
			break;
		}
	}


	if(! found_player){
		res.json({message: "Could not find any game for this session"})
	}
});

// returns all gamecodes existing
app.get("/all_games", (req, res) => {
	console.log("Received request for all games.");
	console.log("Games to return: " + JSON.stringify(Array.from(games.keys())));
	res.json(JSON.stringify(Array.from(games.keys())));
});

app.post("/join_game", db.joinGame);
  

app.listen(PORT, ()=> {
	console.log(`Server listening on ${PORT}`);
});


class Game {
	constructor(gamesize){
		this.gamesize = gamesize;
		this.gamecode = CreateGameCode();
		this.players = []
	}

	GetGameCode() {
		return this.gamecode;
	}

	AddPlayer(player){
		this.players.push(player);
	}

	GetPlayers(){
		return this.players;
	}

	IsFull(){
		console.log("Players joined: " + this.players.length)
		return this.players.length == this.gamesize;
	}

	VacantSpace(){
		if(!this.IsFull()){
			return this.gamesize - this.players.length;
		}
		else return 0;
	}

}

class Player {
	constructor(username, sessionID){
		this.username = username;
		this.uID = sessionID;
	}

	SetUID(uID){
		this.uID = uID;
	}

	GetUID(){
		return this.uID;
	}
}