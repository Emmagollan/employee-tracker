
const mysql = require('mysql2');
 
const conn = mysql.createConnection({
  host: 'localhost',
  port: '4001', 
  user: 'root',
  password: 'root',
  database: 'etracker'
});

const menuCommands = {
  'view all departments': 'SELECT id, name, id AS value FROM department;',
  'view all roles': 'SELECT R.id, R.title, R.salary, D.name AS department, CONCAT (R.title, " ( Department: ", D.name, " )") AS name, R.id AS value FROM role AS R INNER JOIN department AS D ON R.department_id = D.id;',
  'view all employees': 'SELECT E.id, E.first_name, E.last_name, R.title AS role, CONCAT(M.first_name, " ", M.last_name) AS manager, CONCAT(E.first_name, " ", E.last_name, "( Role: ", R.title, " )") AS name , E.id AS value FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id INNER JOIN employee AS M ON E.manager_id = M.id;',
  'add a department': 'INSERT INTO department(name) VALUES ("{name}");',
  'add a role': 'INSERT INTO role(title, salary, department_id) VALUES ("{title}", {salary}, {department});',
  'add an employee': 'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("{firstName}", "{lastName}", {role}, {manager});',
  'update an employee role': 'UPDATE employee SET role_id={role} WHERE id={employee};',
  'update an employee manager': 'UPDATE employee SET manager_id={manager} WHERE id={employee};',
  'view employees for manager': 'SELECT E.id, E.first_name, E.last_name, R.title AS role, CONCAT(M.first_name, " ", M.last_name) AS manager, CONCAT(E.first_name, " ", E.last_name) AS name , E.id AS value FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id INNER JOIN employee AS M ON E.manager_id = M.id WHERE M.id = {manager};',
  'view employees for department': 'SELECT E.id, E.first_name, E.last_name, R.title AS role, CONCAT(M.first_name, " ", M.last_name) AS manager, CONCAT(E.first_name, " ", E.last_name) AS name , E.id AS value FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id INNER JOIN employee AS M ON E.manager_id = M.id WHERE R.department_id = {department} OR R.department_id=2;',
  'view employees by manager': 'SELECT E.id, E.first_name, E.last_name, R.title AS role, CONCAT(M.first_name, " ", M.last_name) AS manager, CONCAT(E.first_name, " ", E.last_name) AS name , E.id AS value FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id INNER JOIN employee AS M ON E.manager_id = M.id ORDER BY manager;',
  'view employees by department': 'SELECT E.id, E.first_name, E.last_name, R.title AS role, CONCAT(M.first_name, " ", M.last_name) AS manager, CONCAT(E.first_name, " ", E.last_name) AS name , E.id AS value FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id INNER JOIN employee AS M ON E.manager_id = M.id ORDER BY R.department_id;',
  'view total utilized budget for department': 'SELECT SUM(R.salary) AS budget FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id WHERE R.department_id = {department};',
  'view total utilized budget': 'SELECT SUM(R.salary) AS budget FROM employee AS E INNER JOIN role AS R ON E.role_id = R.id;'
};

exports.viewAllDepartments = viewAllDepartments;
exports.viewAllEmployees = viewAllEmployees;
exports.viewAllRoles = viewAllRoles;
exports.executeQuery = executeQuery;

async function viewAllDepartments() {
  return executeQuery('view all departments');
}

async function viewAllRoles() {
  return executeQuery('view all roles');
}

async function viewAllEmployees() {
  return executeQuery('view all employees');
}

async function executeQuery(command, params) {
  let query = menuCommands[command];
  if (params) {
    for (const p of Object.keys(params)) {
      query = query.replace(`{${p}}`, params[p]);
    }
  }
  console.log('Executing Query: ' + query);
  return conn.promise().query(query);
  // return Promise.resolve([{name: 'test', value: 'from file', 'new': true}]);
}