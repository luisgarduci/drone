const mysql = require('mysql2')

const settings = {
    host: '127.0.0.1',
    port: 3306,
    database: 'drone',
    user: 'root',
    password: ''
}

const connection = mysql.createConnection(settings)

connection.connect((error) => {
    if (error) {
        console.log('Erro na conexão com o banco')
    }
    else {
        console.log('Conectado')
    }
})

module.exports = connection