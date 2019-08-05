DROP DATABASE IF EXISTS amazon_db;
CREATE DATABASE amazon_db;

USE amazon_db;

CREATE TABLE products(
	item_id INT(100) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    
    PRIMARY KEY(item_id)
); 

INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES ("L.O.L. Suprise Confetti Pop Doll", "Toys & Games", 29.74, 5000 ),
("Body Glide Original Anti-Chafe Balm", "Household Products", 9.99, 10000 ),
("Fujifil Instax Mini Instant Film 2-pack", "Electronics", 14.18, 10000 ),
("Amazon Firestick with Alexa Voice Remote", "Electronics", 39.99, 10000 ),
("Donkey Kong Country: Tropical Freeze Nintendo Switch", "Video Games", 40.94, 6000),
("Magnolia Table: A Collection of Recipies for Gathering", "Books", 14.62, 20000),
("I'll Be Gone in the Dark", "Books", 13.23, 20000),
("Native Jefferson Slip on Shoes","Clothing, Shoes & Jewelry",37.63, 15000),
("Earth Friendly Products Window Cleaner with Vinegar", "Household Products", 18.54, 20000),
("ODODOS High Waist Pocket 4-Way Stretch Leggings", "Clothing, Shoes & Jewelry", 15.98, 10000);	

CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(200) NOT NULL,
    over_head_costs FLOAT(13,2) NOT NULL,
    
    PRIMARY KEY(department_id)
); 

ALTER TABLE products ADD product_sales FLOAT(13,2);
