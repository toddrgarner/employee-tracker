DROP DATABASE IF EXISTS store_db;
CREATE DATABASE store_db;

USE store_db;

--department table
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
   
);
--role table
CREATE TABLE Role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT ,
    FOREIGN KEY (department_id) 
    REFERENCES department(id) ON DELETE SET NULL
);
--employee table
CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30), NOT NULL
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) 
    REFERENCES role(id)
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id) ON DELETE SET NULL
);