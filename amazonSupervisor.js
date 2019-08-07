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
            name: 'userPath',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department']
        }
    ]).then(choice => {
        if(choice.userPath === 'View Product Sales by Department'){
            viewSalesByDept();
        };
        if(choice.userPath ==='Create New Department'){
            createNewDept();
        }
    });
};

function viewSalesByDept(){
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, departments.over_head_costs - products.product_sales AS total_profit FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name;", function(err, res, fields){
        if(err) throw err;
        const table = new Table({
            head: ['Dep. ID'.yellow,'Name'.yellow, 'Overhead'.yellow, 'Sales'.yellow, 'Total Profit'.yellow]
        });
        for(var i = 0; i < res.length; i++){
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        };
        console.log(table.toString());
        connection.end();

    });
};

function createNewDept(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the new department?',
        },{
            type: 'input',
            name: 'over_head_costs',
            message: 'What are the department overhead costs?',
        }
    ]).then(answers => {
        var department_name = answers.department_name;
        var over_head_costs = parseFloat(answers.over_head_costs);

        insertInto(department_name, over_head_costs);
    });

    function insertInto(department_name, over_head_costs){
        var sql = "INSERT INTO departments (department_name, over_head_costs) VALUES ?";
        var values = [
            [department_name, over_head_costs]
        ];
        connection.query(sql, [values], function(err, res){
            if(err) throw err;
            console.log("Successfully created a new department.".green);
        })
        connection.end();
    };

};