const Tello = require('./tello.js');
const Express = require('express');
const server = Express();
const cors = require('cors')
const sql = require('./database/mysqldb')
const drone = new Tello();

const IP_SERVER = '127.0.0.1';
const PORT_SERVER = '8080';

server.use(Express.json());

server.use(cors({
    origin: 'http://localhost'
}))

server.listen(PORT_SERVER, IP_SERVER, () => {
    console.log(`Servidor local conectado em ${IP_SERVER}:${PORT_SERVER}` )
    drone.connect();
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

server.post('/executar-rota', (req, res) => {
    const {vetorteste} = req.body;
    let rota = []
    vetorteste.forEach(element => {
        executar(element, 0);
    })
    
    return res.send(vetorteste);
    
});

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

/**
 * Endpoint que será consumido pela a api criada pelos alunos. 
 * Ela deverá receber o array de comandos da rota no corpo da requisição POST
 */
/*server.post('/executar-rota', (req, res) => {
    const rota = req.body;
    console.log(req.body)

    console.log(rota)
    executar(rota, 0);

    return res.send(rota);
});
*/



/**
 * 
 * @param {*} comandos 
 * @param {*} index 
 * As 3 função abaixo utilizam recursividade para iterar sob o array de objetos 
 * que contém os comandos da rota. 
 * Essa recursividade é necssária para utilizar as chamadas de forma síncrona,
 * executando os comandos apenas após finalizado o timeout correspondente a
 * cada comando anterior.
 */

async function executar(comandos, index) {
    await executarComandosRecursivo(comandos, index);

}

async function executarComandosRecursivo(comandos, index) {
    if (index < comandos.length) {
        await executarComando(comandos[index]);
        await executarComandosRecursivo(comandos, index + 1);
    }
}

async function executarComando(comando) {
    await drone.sendCmd(comando.comando)
        .then(() => {
            console.log('SUCESSO NO COMANDO', comando.comando);
        })
        .catch(async error => {
            console.error('ERRO NO COMANDO ', comando.comando, '. Erro: ', error);
            await executarComando(comando);
        });
    console.log('DELAY: ', comando.tempoDuracaoComando)
    await drone.wait(comando.tempoDuracaoComando);
}








