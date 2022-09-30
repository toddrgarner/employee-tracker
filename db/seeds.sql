INSERT INTO department (name)
VALUES ("Finance"),
       ("Publishing"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Receptionist", 51000, 1),
       ("Director of Finance", 72000, 1),
       ("A&R Representaive", 45000, 2),
       ("VP of Marketing", 98000, 2),
       ("Music Supervisor", 72000, 3),
       ("Customer Service Manager", 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Otis", "Hayes", 2, NULL),
       ("Rick", "Jones", 4, NULL),
       ("Michael", "Thompson", 6, NULL),
       ("Finny", "Taylor", 1, 1),
       ("Laura", "Nickels", 3, 2),
       ("Sofia", "Salazar", 5, 3);