-- drop employee_db if it exists, then create a new empty one --
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- start using the database --
USE employee_db;

-- create department table --
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- create role table --
-- department_id references the id from the department table --
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY(department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

-- create employee table --
-- role_id references the id from the role table --
-- manager_id refers to the specific employee with that particular id --
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL,
    FOREIGN KEY(role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);