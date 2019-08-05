//libraries
const mysql = require('mysql');

//sql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "amazon_db"
});
connection.connect(function(err){
    if(err) throw err;
    console.log("connected");
    start();
});

function start(){
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        connection.end();
      });
};
