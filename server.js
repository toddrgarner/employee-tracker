// import necessary packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create a connection to the employee_db database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'beverly1',
        database: 'employee_db',
    },
console.log(
`------------------
EMPLOYEE MANAGER
------------------
`)
);


// Helper functions to read data from mySQL database

// displays department data in a table
function displayDepartments(){
    db.promise().query("SELECT * FROM department")
    .then(([rows]) => {
        const departmentArray = rows;
        console.table(departmentArray);
    })
    .then(() => userInterface())
}

// displays role data in a table
function displayRoles(){
    db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY role.id`)
    .then(([rows]) => {
        const roleArray = rows;
        console.table(roleArray);
    })
    .then(() => userInterface())
}

// displays employee data in a table
function displayEmployees(){
    db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`)
    .then(([rows]) => {
        const employeeArray = rows;
        console.table(employeeArray);
    })
    .then(() => userInterface())
}

// add employee by asking for their name, role, and who they work under
function addEmployee(){
    let roleArray = [];
    let managerArray = ["None"];
    
    db.query(`SELECT title FROM role`, (err, result1) => {
        if (err) console.error(err);
        result1.forEach(role => roleArray.push(role.title));
        
        db.query(`SELECT CONCAT(employee.first_name, " ", employee.last_name) AS manager_name FROM employee`, (err, result2) => {
            if (err) console.error(err);
            result2.forEach(manager => managerArray.push(manager.manager_name));
            
            inquirer.prompt([
                {
                    name: "employeeFirstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "employeeLastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "employeeRole",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roleArray,
                },
                {
                    name: "employeeManager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managerArray,
                },
            ])
            .then((response) => {
                if (response.employeeManager === "None"){ // exclude the manager_id if they have no manager
                    db.promise().query(`INSERT INTO employee (first_name, last_name, role_id)
                    VALUES (?, ?, (SELECT id FROM role WHERE title = ?))`, 
                    [response.employeeFirstName, response.employeeLastName, response.employeeRole])
                    .then(() => console.log(`Added ${response.employeeFirstName} ${response.employeeLastName} to the database.`))
                    .then(() => userInterface())
                } else{ // include the manager_id if they work under someone
                    db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?, 
                    (SELECT id FROM role WHERE title = ?), 
                    (SELECT id FROM employee manager WHERE CONCAT(first_name, " ", last_name) = ?));`, 
                    [response.employeeFirstName, response.employeeLastName, response.employeeRole, response.employeeManager])
                    .then(() => console.log(`Added ${response.employeeFirstName} ${response.employeeLastName} to the database.`))
                    .then(() => userInterface())
                }
            })
        })
    })
}

// update employee role
function updateEmployee(){
    let employeeArray = [];
    let roleArray = [];
    db.query(`SELECT CONCAT(first_name, " ", last_name) AS name FROM employee`, (err, result1) => {
        if (err) console.error(err)
        result1.forEach(employee => employeeArray.push(employee.name));

        db.query(`SELECT title FROM role`, (err, result2) => {
            if(err) console.error(err)
            result2.forEach(role => roleArray.push(role.title));

            inquirer.prompt([
                {
                    name: "updatedEmployeeName",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeArray,
                },
                {
                    name: "updatedEmployeeRole",
                    type: "list",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleArray,
                }
            ])
            .then((response) => {
                params = [response.updatedEmployeeRole, response.updatedEmployeeName];
                db.promise().query(`UPDATE employee 
                SET role_id = (SELECT id FROM role WHERE title = ?)
                WHERE CONCAT(first_name, " ", last_name) = ?`, params)
                .then(() => console.log(`Updated employee's role.`))
                .then(() => userInterface())
            })
        })
    })
}

// add role to the role table, ask for the role's title, salary, and department
function addRole(){
    db.query('SELECT name FROM department', (err, result) =>{
        if (err){
            console.error(err);
        } else{
            inquirer.prompt([
                {
                    name: "roleName",
                    type: "input",
                    message: "What is the name of the role?",
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary of the role?",
                },
                {
                    name: "roleDepartment",
                    type: "list",
                    message: "Which department does the role belong to?",
                    choices: result,
                }
            ]).then((response) => {
                if (response){
                    const params = [response.roleName, response.roleSalary, response.roleDepartment];
                    db.promise().query(`INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`, params)
                    .then(() => {
                        console.log(`Added ${response.roleName} to the database.`);
                    })
                    .then(() => userInterface())
                } else{
                    console.log("Not a valid input. Please try again.")
                    addRole();
                }
                
            })
        }
    });

}

// add department into department table, ask for the name of the new department
function addDepartment(){
    inquirer.prompt(
        {
            name: "departmentName",
            type: "input",
            message: "What is the name of the department?",
        }
    )
    .then((response) => {
        if (response.departmentName){
            db.promise().query(`INSERT INTO department (name) VALUES (?)`, response.departmentName)
            .then(() => {
                console.log(`Added ${response.departmentName} to the database`);
            })
            .then(() => userInterface())
        } else{
            console.log("That is not a valid input. Please try again.");
            addDepartment();
        }
    })
}



// MAIN INQUIRER QUESTIONS
// bonus things to do later: update managers, view employees by manager, view employees by department, view total utilized budget of department
function userInterface(){
    inquirer
    .prompt(
        {
         name: "action",
         type: 'list',
         message: "What would you like to do?",
         choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            "Quit"
         ]
        }
    )
    .then((response) => {
        // call the respective function when the user has chosen
        switch(response.action){
            case "View All Employees":
                displayEmployees();
                break;
            case "View All Roles":
                displayRoles();
                break;
            case "View All Departments":
                displayDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            default:
                console.log("Thanks for using the Employee Tracker!");
                break;
        }

    })
}

// initialize questions when starting up the server

