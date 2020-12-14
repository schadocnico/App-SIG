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
    db.raw('SELECT * FROM rdc UNION ALL SELECT * from premier ORDER BY id_salle')
        .then((data) => {
            console.log(data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});

//GetSalle: fetch a salle by it's ID
app.get('/spec/:id', (req, res)=>{
    let based = 'rdc'
    if(req.params.id > 13 ){
        based = 'premier'
    }
    console.log("test1");
    db.select('*')
    .from(based)
    .where('id_salle', '=', req.params.id)
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    });
});

//put: patch a salle by it's ID
app.put('/change/:id', (req, res)=>{
    console.log("test2");
    var salleid = req.query.id;
    var updatedSalle = req.query.fonction;
    let based = 'rdc'
    if(req.params.id > 13 ){
        based = 'premier'
    }
    db(based).where('id_salle', '=', req.params.id)
    .update({fonction : req.body.fonction})
    .then(() => {
        console.log("salle updated");
        res.json(req.body.fonction);
    })
    .catch((err) => {
        console.log(err);
    });
});


app.get('/qr/:id', (req, res)=>{
    let based = 'qrc_rdc'
    if(req.params.id > 13 ){
        based = 'qrc_premier'
    }
    db.raw('SELECT ST_X(ST_AsText(geom)),ST_Y(ST_AsText(geom)) FROM ' + based + ' WHERE id_salle = ' + req.params.id)
    .then((data) => {
        console.log(data.rows[0]);
        res.json(data.rows[0]);

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