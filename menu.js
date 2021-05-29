const inquirer = require('inquirer');

const menuOptions = {
  'view all departments': {},
  'view all roles': {},
  'view all employees': {},
  'add a department': { name: 'input' },
  'add a role': { title: 'input', salary: 'number', department: 'list' },
  'add an employee': { firstName: 'input', lastName: 'input', role: 'list', manager: 'list'},
  'update an employee role': { employee: 'list', role: 'list'},
  'update an employee manager': { employee: 'list', manager: 'list'},
  'view employees for manager': { manager: 'list' },
  'view employees for department': { department: 'list' },
  'view employees by manager': {},
  'view employees by department': {},
  'view total utilized budget for department': { department: 'list' },
  'view total utilized budget': {}
};

const refreshOptions = {
  'view all departments': {employee: false, role: false, department: false},
  'view all roles': {employee: false, role: false, department: false},
  'view all employees': {employee: false, role: false, department: false},
  'add a department': {employee: false, role: false, department: true},
  'add a role': {employee: false, role: true, department: false},
  'add an employee': {employee: true, role: false, department: false},
  'update an employee role': {employee: true, role: false, department: false},
  'update an employee manager': {employee: true, role: false, department: false},
  'view employees for manager': {employee: false, role: false, department: false},
  'view employees for department': {employee: false, role: false, department: false},
  'view employees by manager': {employee: false, role: false, department: false},
  'view employees by department': {employee: false, role: false, department: false},
  'view total utilized budget for department': {employee: false, role: false, department: false},
  'view total utilized budget': {employee: false, role: false, department: false}
};

exports.menuOptions = menuOptions;
exports.startMenu = startMenu;
exports.gatherInputs = gatherInputs;
exports.refreshOptions = refreshOptions;
exports.closeProgram = closeProgram;

async function startMenu() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'main',
      message: 'What would you like to do?',
      choices: Object.keys(menuOptions)
    }
  ]);
}

async function gatherInputs(answer, employee, role, department) {
  const params = menuOptions[answer];
  const questions = [];
  for (const p of Object.keys(params)) {
    const question = {
      type: params[p],
      name: p,
      message: 'What is the ' + p
    };
    if (question.type === 'list' && (p === 'employee' || p === 'manager')) {
      question.choices = employee;
      question.default = -1;
    } else if (question.type === 'list' && p === 'role') {
      question.choices = role;
    } else if (question.type === 'list' && p === 'department') {
      question.choices = department;
    }
    questions.push(question);
  }
  if (questions.length === 0) {
    return Promise.resolve({});
  }
  return inquirer.prompt(questions);
}

async function closeProgram() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'end',
      message: 'Would you like to close/end the program?',
      default: false
    }
  ]);
}