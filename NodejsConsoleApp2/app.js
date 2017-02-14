
var mysql = require('mysql');


var veza = mysql.createConnection({
    host : '127.0.0.1',
    database : 'josip',
    user : 'root',
    password: '',
    port: 3306
});
veza.connect(function (error) {
    if (error) {
        console.log('DB connection Error');
    } else {
        console.log('DB connection successful');
    }
});

veza.query('SHOW TABLES', function (error, data) {
    if (error) 
        console.log("Error at database query");
        else 
        console.log('Your info about tables:', data);
    

    });
veza.end();