//libraries
const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
//find library that formats query results in table 

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
        runInquirer();
      });
};

function runInquirer(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'userProduct_id',
            message: 'What is the ID of the product you would like to purchase?',
        },
        {
            type: 'input',
            name: 'userQuantity',
            message: 'How many would you like to purchase?',
        }
    ]).then(answers => {
        console.log(answers);
        checkQuantity(answers);
    });
};

function checkQuantity(answers){
    var userProduct_id = parseInt(answers.userProduct_id);
    var userQuantity = parseInt(answers.userQuantity);

    connection.query("SELECT stock_quantity FROM products WHERE item_id = ?;", [userProduct_id], function(err, res, fields){
        if (err) throw err;
        var currentStock = res[0].stock_quantity;
        if(currentStock >= userQuantity){
            //proceed to checkout
            console.log("YAY! proceed".blue);
            checkout(currentStock, userProduct_id, userQuantity);
        }else{
            console.log("Insufficient Quantity! Amazon only carries ".red + currentStock + " amount.".red);
        }
    }) 
};

function checkout(currentStock, userProduct_id, userQuantity){
    var updatedStock = currentStock-userQuantity;
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?;", [updatedStock, userProduct_id], function(err, res, fields){
        if(err) throw err;
        showPurchase(userProduct_id, userQuantity);
    });
};

function showPurchase(userProduct_id, userQuantity){
    connection.query("SELECT product_name, price FROM products WHERE item_id = ?;",[userProduct_id], function(err, res, fields){
        if(err) throw err;
        var product = res[0].product_name;
        var itemPrice = res[0].price;
        var totalPrice = itemPrice * userQuantity;

        console.log("Thank you for shopping with us. You purchased " + product + ". Your total is " + totalPrice);
    });
    connection.end();
};
