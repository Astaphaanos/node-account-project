// modulos externos
const inquirer = require('inquirer');
const chalk = require('chalk')

// modulos internos
const fs = require('fs');

//* Operação que o usuário vai inicializar o sistema

operations() // essa função tem que ser inicializada com o sistema

function operations() {
  inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
        const action = answer['action'] // pegar a ação que o usuário fez
        
         if (action === 'Criar conta') {
        createAccount()
      } else if (action === 'Depositar') {
        deposit()
      } else if (action === 'Consultar Saldo') {
        getAccountBalance()
      } else if (action === 'Sacar') {
        withdraw()
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
        process.exit()
      }
    })
    .catch((err) => console.log(err))
}

//* create an account 
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

//* criação da conta em si
function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        // verificar se existe o accounts e não existir vai criar
        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        // validação para saber se a conta já existe
        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Está conta já existe, escolha outro nome!'))
            buildAccount()
            return 
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
            console.log(err)
        })

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operations() // quero que o usuário escolha a próxima operação
    }).catch((err) => console.log(err))
}