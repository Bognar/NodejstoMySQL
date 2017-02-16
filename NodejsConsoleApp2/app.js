// može se koristiti postman aplikacija za slanje post,get,delete i put requesta nazad u server
// 


var http = require('http');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();

var pool = mysql.createPool({
    host: 'localhost',
    user: 'josip34',
    password: '2404983300031',
    database: 'josip',
    port:3306
    
});

// definiranje zadane rute 
var apiRoutes = express.Router();

var port = 9000; 
// namještanje da zaprima informacije od postmana za edit,write i change u bazi.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


apiRoutes.get('/', function (req, res) {
    
    res.json({ message: 'API radi!' });
});

//Dodavanje korisnika
apiRoutes.post('/dodajime', function (req, res, next) {

    pool.getConnection(function (err, connection) {

        if (err) {
            console.error("Dogodila se greška: " + err);
        } else

        var korisnik = {
            First_Name: req.body.ime,
            Last_Name: req.body.prezime
        };

        connection.query('INSERT INTO imena SET ?', korisnik,
            function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    res.json("Uspješno dodan korisnik!");
                    res.end();
                }
                connection.release();
            });
    });
})

//Dohvaćanje svih korisnika
apiRoutes.get('/pregledimena', function (req, res, next) {

    pool.getConnection(function (err, connection) {

        if (err) {
            console.error("Dogodila se greška: " + err);
        }

        var query = "SELECT * FROM imena ORDER BY id ASC";

        var table = ["imena"];

        query = mysql.format(query, table);

        connection.query(query, function (err, rows) {
            connection.release();
            if (err) {
                return next(err);
            } else {
                res.json({
                    success: true,
                    popis_korisnika: rows
                });
            }
        });
    });
});

//Uređivanje korisnika
apiRoutes.put('/korisnik/:id', function (req, res, next) {

    pool.getConnection(function (err, connection) {

        if (err) {
            console.error("Dogodila se greška: " + err);
        }

        var korisnik = {
            First_Name: req.body.ime,
            Last_Name: req.body.prezime
        };

        connection.query('update imena SET ? where id = ?', [korisnik, req.params.id],
            function (err, rows) {
                if (err) {
                    return next(err);
                } else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    var result = {
                        success: true,
                        detail: rows
                    }
                    res.write(JSON.stringify(result));
                    res.end();
                }
            });
    });
});

//Brisanje korisnika
apiRoutes.delete('/korisnik/:id', function (req, res, next) {

    pool.getConnection(function (err, connection) {

        if (err) {
            console.error("Dogodila se greška: " + err);
        }

        connection.query('delete from imena where id = ?', [req.params.id],

            function (err, rows) {
                if (err) {
                    return next(err);
                } else {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    var result = {
                        success: true
                    }
                    res.write(JSON.stringify(result));
                    res.end();
                }
            });
    });
});

// sve rute sadržavati će /api
app.use('/api', apiRoutes);

// pokretanje 
app.listen(port);
console.log('API radi @ port:' + ' ' + port);