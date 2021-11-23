import express from "express";
import session from "express-session";
import cors from "cors";
import {uuid} from "uuid";
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.use(express.json());

app.use(session({
	genid: function(req: ) {
	  return uuid.v1(); // use UUIDs for session IDs
	},
	secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

  app.listen(PORT, ()=> {
	console.log(`Server listening on ${PORT}`);
});


app.get("/", (req, res) => {
	res.json({message: "HELLO"})
})