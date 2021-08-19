// import { spawn } from 'child_process'

import inquirer from 'inquirer'

inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'what is the project name?',
  }
]).then((answers) => {
  console.log({ answers });
  
})

