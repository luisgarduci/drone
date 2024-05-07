/*
const express = require('express');
const server = express();
const BodyParser = require('body-parser');
const cors = require('cors')
const sql = require('./database/mysqldb')
const port = 8080;
const ip = '127.0.0.1';

server.use(cors({
    origin: 'http://localhost'
}))

server.use(BodyParser.json())

server.listen(port, ip, () => {
    console.log('Servidor Rodando');
})

server.get('/rotas', (req, res) => {
    let id_usuario = req.query.id_usuario
    sql.query('SELECT * FROM rota WHERE id_usuario = ?', [id_usuario], (error, result) => {
        res.json(result)
    })
})

server.get('/selecionarComandos', (req, res) => {
    let id_rota = req.query.id_rota;
    sql.query("SELECT comando, tempoDuracaoComando FROM comandos WHERE id_rotas = ?", [id_rota], (error, result) => {
        res.json(result)
    })
})

//adicionando a rota e os comandos dela
server.post('/adicionarRota', (req, res) => {
    let comando;
    let id_rota;
    const {id_usuario, NomeRota, Comandos} = req.body;
    
    sql.beginTransaction((err) => {
        if (err) {
          throw err;
        }

        sql.query("insert into rota (id_usuario, NomeRotas) VALUES (?, ?)", [id_usuario, NomeRota], (err, result) => {
            if (err) {
              return sql.rollback(() => {
                throw err;
              });
            }

            id_rota = result.insertId;
      
        // Consulta para inserir dados na primeira tabela

        Comandos.forEach(element => {
            switch (element['Comando']) {
                case 'takeoff':
                    comando = `takeoff`
                    break;
                case 'Left':
                    comando = `rc -${element['Velocidade']} 0 0 0`
                    break;
                case 'Right':
                    comando = `rc ${element['Velocidade']} 0 0 0`
                    break;
                case 'Forward':
                    comando = `rc 0 ${element['Velocidade']} 0 0`
                    break;
                case 'Backward':
                    comando = `rc 0 -${element['Velocidade']} 0 0`
                    break;
                case 'Up':
                    comando = `rc 0 0 ${element['Velocidade']} 0`
                    break;
                case 'Down':
                    comando = `rc 0 0 -${element['Velocidade']} 0`
                    break;
                case 'Yaw Right':
                    comando = `rc 0 0 0 ${element['Velocidade']}`
                    break;
                case 'Yaw Left':
                    comando = `rc 0 0 0 -${element['Velocidade']}`
                    break;
                case 'land':
                    comando = `land`
                    break;
                case '':
                    comando = `rc 0 0 0 0`
                    break;
        
            }
        
      
        sql.query('insert into comandos (comando, velocidade, tempoDuracaoComando, id_rotas) VALUES (?, ?, ?, ?)', [comando, element['Velocidade'], element['Tempo'], id_rota], (error, result) => {
          if (error) {
            return sql.rollback(() => {
              throw error;
            });
          }
      
            sql.commit((err) => {
              if (err) {
                return sql.rollback(() => {
                  throw err;
                });
              }
      
              console.log('Transação concluída com sucesso!');
              // Encerrar a conexão com o banco de dados após a transação
            });
          });
        });
      });
    });
})

server.get('/validarCadastro', (req, res) => {
    let nome = req.query.nome;
    sql.query("SELECT * FROM usuario WHERE nome = ?", [nome], (error, result) => {
        res.json(result);
    })
})

server.post('/cadastrar', (req, res) => {
    const { Nome, Senha, Ocupacao, Turma } = req.body
    sql.query("insert into usuario (nome, senha, ocupacao, turma) VALUES (?, ?, ?, ?)", [Nome, Senha, Ocupacao, Turma], (error, result, fields) => {
        if (error) {
            console.log(error.stack)
        }
    })
})

server.get('/logar', (req, res) => {
    let Nome = req.query.nome;
    let Senha = req.query.senha;
    sql.query("SELECT id_usuario FROM usuario WHERE nome = ? and senha = ?", [Nome, Senha], (error, result) => {
        res.json(result)
    })
})
*/

