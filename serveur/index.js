const express = require('express');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// CORS implemented so that we don't get errors when trying to access the server from a different server location
app.use(cors());

// GET: Fetch all pieces
app.get('/', (req, res) => {
    console.log("dans le /"); 
    db.select('*')
        .from('rdc')
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

//GetSalle: fetch a salle by it's ID
app.get('/spec/:id', (req, res)=>{
    console.log("test1");
    db.select('*')
    .from('rdc')
    .where('id', '=', req.params.id)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    });
});

//put: patch a salle by it's ID
app.get('/change/:id/:fonction', (req, res)=>{
    console.log("test2");
    var salleid = req.query.id;
    var updatedSalle = req.query.fonction;
    db('rdc').where('id', '=', req.params.id)
    .update({fonction : req.params.fonction})
    .then(() => {
        console.log("salle updated");
        res.json({msg:"salle updated"});
    })
    .catch((err) => {
        console.log(err);
    });
});

//post: post a new salle
/*app.post('/newsalle/:id', (req, res)=>{
    db('rdc').post(req.body)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    });
});*/

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));