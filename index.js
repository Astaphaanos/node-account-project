//* modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//* modulos internos
const fs = require('fs')

//* Operação que o usuário vai inicializar o sistema
operation() // essa função tem que ser inicializada com o sistema

function operation() {
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
      const action = answer['action']  // pegar a ação que o usuário fez

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
}

//* create an account 
function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
  console.log(chalk.green('Defina as opções da sua conta a seguir'))

  buildAccount()
}

//* criação da conta em si
function buildAccount() {
  inquirer.prompt([
      {
        name: 'accountName',
        message: 'Digite um nome para a sua conta:',
      },
    ])
    .then((answer) => {
      console.info(answer['accountName'])

      const accountName = answer['accountName']

    // verificar se existe o accounts e não existir vai criar
      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }

    // validação para saber se a conta já existe
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),)
        buildAccount(accountName)
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance":0}',
        function (err) {
          console.log(err)
        },
      )

      console.log(chalk.green('Parabéns, sua conta foi criada!'))
      operation() // quero que o usuário escolha a próxima operação
    })
}

//* função de depositar
function deposit() {
  inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName']

        // verificar se a conta existe
      if (!checkAccount(accountName)) {
        return deposit() // volta para pedir novamente o nome
      }

      inquirer.prompt([
          {
            name: 'amount',
            message: 'Quanto você deseja depositar?',
          },
        ])
        .then((answer) => {
          const amount = answer['amount']

          addAmount(accountName, amount) // adicionar o deposito
          operation()
        })
    })
}

//* função para verificar se a conta existe 
function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
    return false
  }
  return true
}

//* função de pegar a conta
function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r',
  })

  return JSON.parse(accountJSON)
}

//* função de adicionar o deposito
function addAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount) { 
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),)
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) // parseFloat -> converter em número

  fs.writeFileSync( // se não tiver valor, aparece esse erro
    `accounts/${accountName}.json`, // salvar os dados em um arquivo
    JSON.stringify(accountData), // transformar em string
    function (err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`),)
}

//* função de sacar
function getAccountBalance() {
  inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName']

        // verificar se a conta existe
      if (!checkAccount(accountName)) {
        return getAccountBalance()
      }

      const accountData = getAccount(accountName)

      console.log(
        chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance}`,),)
      operation()
    })
}

//* função de sacar
function withdraw() {
  inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName']

       // verificar se a conta existe
      if (!checkAccount(accountName)) {
        return withdraw()
      }

      inquirer.prompt([
          {
            name: 'amount',
            message: 'Quanto você deseja sacar?',
          },
        ])
        .then((answer) => { // o saque em si 
          const amount = answer['amount']

          removeAmount(accountName, amount)
          operation()
        })
    })
}

//* função de remover valor da conta 
function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName) // pegar a conta para saber quanto dinheiro tem

  if (!amount) {  // verificar se o valor veio na hora de depositar
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),)
    return withdraw()
  }

  if (accountData.balance < amount) { // verificar se tem menos na conta do que quer tirar
    console.log(chalk.bgRed.black('Valor indisponível!'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount) // salvar na conta o valor reduzido

  fs.writeFileSync( // salvar os dados em um arquivo
    `accounts/${accountName}.json`,
    JSON.stringify(accountData), // transformar em string
    function (err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`),)
}