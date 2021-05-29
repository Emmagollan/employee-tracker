const cTable = require('console.table');
const menu = require('./menu');
const dbconn = require('./dbconnect');

async function runApp() {
  let closeProgram = false;
  let option = null;
  let inputs = null;
  let output = null;

  let employees = (await dbconn.viewAllEmployees())[0];
  let roles = (await dbconn.viewAllRoles())[0];
  let departments = (await dbconn.viewAllDepartments())[0];
  do {
    try {
      option = (await menu.startMenu()).main;
      inputs = await menu.gatherInputs(option, employees, roles, departments);
      output = await dbconn.executeQuery(option, inputs);
      console.table(output[0]);
      if (menu.refreshOptions[option].employee) {
        employees = (await dbconn.viewAllEmployees())[0];
      } 
      if (menu.refreshOptions[option].role) {
        roles = (await dbconn.viewAllRoles())[0];
      }
      if (menu.refreshOptions[option].department) {
        departments = (await dbconn.viewAllDepartments())[0];
      }
    } catch (err) {
      console.error(err);
    } finally {
      closeProgram = (await menu.closeProgram()).end;
    }
  } while (!closeProgram)
  console.log('Thank you for using the Employee Tracker System (ETS)');
  process.exit(0);
  
}

runApp();
