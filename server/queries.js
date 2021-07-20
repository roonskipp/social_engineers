const Pool = require('pg').Pool
const pool = new Pool({
  user: 'tobias',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})


const getUsernameFromSession = async (req, res) => {
    const session_id = req.sessionID;

    try {
        let user_res = await pool.query('SELECT username FROM players WHERE session_id = $1 LIMIT 1', [session_id])
        res.json(user_res.rows[0])
    } catch (error) {
        throw error
    }
}


const getPlayers = async (request, response) => {
    // request has gamestate id
    const gamestate_id = request.body.gamestate_id;

    // Get all player ids from player_lists where the gs_id is the same

    try {
        var player_lists_res = await pool.query('SELECT username FROM player_lists INNER JOIN players ON player_lists.player_id = players.id WHERE player_lists.gamestate_id = $1', [gamestate_id]);
        response.json(player_lists_res.rows)
    } catch (error) {
        throw error
    }
}

const joinGame = async (request, response) => {
    // request has gamecode and username
    const gamecode = request.body.gamecode;
    const username = request.body.username;
    const session_id = request.sessionID;

    try {
        let player_results = await pool.query('INSERT INTO players (username, session_id) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET username = EXCLUDED.username RETURNING *', [username, session_id])
        var player = player_results.rows[0];
        var player_id = player.id;
    } catch (error) {
        throw error;
    }

    try {
        var gamestate_results = await pool.query('SELECT * FROM gamestates WHERE gamecode = $1', [gamecode]);
        var gamestate = gamestate_results.rows[0];
        var gamestate_id = gamestate.id;
    } catch (error) {
        throw error;
    }

    try {
        let player_lists_results = await pool.query('INSERT INTO player_lists (gamestate_id, player_id) VALUES ($1, $2) ON CONFLICT (player_id) DO UPDATE SET gamestate_id = EXCLUDED.gamestate_id', [gamestate_id, player_id])
        // Relation created, return the gamestate

        response.json(gamestate);
        
    } catch (error) {
        throw error;
    }

}

const createGamestate = async (request, response) => {
    const gamecode = CreateGameCode();
    const session_id = request.sessionID;
    const gamesize = request.body.gamesize;
    const username = request.body.username;

    try {
        let gamestate_results = await pool.query('INSERT INTO gamestates (gamecode, gamesize) VALUES ($1, $2) RETURNING *', [gamecode, gamesize]);
        var gamestate = gamestate_results.rows[0];
    } catch (error) {
        throw error;
    }


    try {
        let player_results = await pool.query('INSERT INTO players (username, session_id) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET username = EXCLUDED.username RETURNING *', [username, session_id])
        var player = player_results.rows[0];
        var gamestate_id = gamestate.id;
        var player_id = player.id;
    } catch (error) {
        throw error;
    }

    try {
        let player_lists_results = await pool.query('INSERT INTO player_lists (gamestate_id, player_id) VALUES ($1, $2) ON CONFLICT (player_id) DO UPDATE SET gamestate_id = EXCLUDED.gamestate_id', [gamestate_id, player_id])
        // Relation created, return the gamestate

        response.json(gamestate);
        
    } catch (error) {
        throw error;
    }

 

            
            // If the server gets to this point, the player and gamestate is created. Should be fine fetching the username later on from the lobby, however, it can also be cached in the client to avoid a second call
            // But if the player is to see other players' names, it might as well fetch all player names in the lobby incuding one's own


}



const getGamestateForSession = async (request, response) => {
    const session_id = request.sessionID;

    try {
        var player_result = await pool.query('SELECT * FROM players WHERE session_id = $1', [session_id]);
        var player = player_result.rows[0];
        if(player != null){
            var player_id = player.id;
        }
        else{
            response.json({message: "No player found for this session"});
        }
    } catch (error) {
        throw error;
    }

    try {
        var gamestate_result = await pool.query('SELECT * FROM gamestates INNER JOIN player_lists ON gamestates.id = player_lists.gamestate_id WHERE player_lists.player_id = $1', [player_id]);
        var gamestate = gamestate_result.rows[0];
        response.json(gamestate);
    } catch (error) {
        throw error;
    }
}

function CreateGameCode(){
	return Math.random().toString(36).substring(4).slice(0, 4).toUpperCase();
}

module.exports = {
    getPlayers,
    createGamestate,
    getUsernameFromSession,
    joinGame,
    getGamestateForSession
}