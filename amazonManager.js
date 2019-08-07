//libraries
const mysql = require('mysql');
const inquirer = require('inquirer');
const colors = require('colors');
const Table = require('cli-table');
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
    inquirer.prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to view?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(choice => {
        switch(choice.userChoice){
            case 'View Products for Sale':
                viewProducts();
            break;
            case 'View Low Inventory':
                viewInventory();
            break;
            case 'Add to Inventory':
                addInventory();
            break;
            case 'Add New Product':
                newProduct();
            break;
            default:
                console.log('Error: Pick another option');
        }
    });
};

function viewProducts(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products;", function(err, res, fields){
        if(err) throw err;
        const table = new Table({
            head: ['Item ID'.yellow,'Product Name'.yellow, 'Price'.yellow, 'Quantity'.yellow]
        });
        for(var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        };
        console.log(table.toString());
        connection.end();
    })
};

function viewInventory(){
    connection.query('SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity <= 5;', function(err, res, fields){
        if(err) throw err;
        const table = new Table({
            head: ['Item ID'.yellow,'Product Name'.yellow, 'Quantity'.yellow]
        });
        for(var i = 0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].stock_quantity]);
        };
        console.log(table.toString());

        connection.end();
    })
};


function addInventory(){
    connection.query('SELECT item_id, product_name FROM products;', function(err, res, fields, products){
        if(err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'userChoice',
                message: 'Which product would you like to buy inventory for?',
                choices: function(){
                    let products = [];
                    for(var i=0; i <res.length; i++){
                        products.push(res[i].product_name);
                    };
                 return products
                }
            
            }
        ]).then(choice => {
            console.log(choice);
            buyInventory(choice.userChoice)
        });
    });
};
function buyInventory(name){
    connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", [name], function(err, res){
        if(err) throw err;
        var currentInv = res[0].stock_quantity;

        inquirer.prompt([
            {
                type: 'input',
                name: 'newinventory',
                message: 'How much inventory would you like to add?',
            }
        ]).then(answer => {
            var newInv = answer.newinventory;
            var totalInv = currentInv + newInv
            var sql = "UPDATE products SET stock_quantity = ? WHERE product_name = ?";
            var values = [
                [totalInv, name]
            ];
            connection.query(sql, [values], function(err, res){
                if(err) throw err;
                console.log("Inventory successfully updated.".green);
                connection.end();
            });
    
        });
    });
};


function newProduct(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'What is the name of the product?',
        },{
            type: 'input',
            name: 'department_name',
            message: 'What department is the product in?',
        },{
            type: 'input',
            name: 'price',
            message: 'What is the price?',
        },{
            type: 'input',
            name: 'stock_quantity',
            message: 'How many are in stock?',
        }
    ]).then(answers => {
        var product_name = answers.product_name;
        var department = answers.department_name;
        var price = parseFloat(answers.price);
        var stock_quantity = parseInt(answers.stock_quantity);

        insertInto(product_name, department, price, stock_quantity);
    });

    function insertInto(product_name, department, price, stock_quantity){
        var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [
            [product_name, department, price, stock_quantity]
        ];
        connection.query(sql, [values], function(err, res){
            if(err) throw err;
            console.log("Successful product insert.".green);
        })
        connection.end();
    };

};
