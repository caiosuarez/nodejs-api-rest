const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(dataCriacao)
        const data = moment(atendimento.data, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
        const atendimentoDatado = {...atendimento, dataCriacao, data}; 

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length > 3;

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Cliente deve ter pelo menos 4 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);
        if(erros.length) {
            res.status(400).json(erros)
        } else {
            const sql = 'INSERT INTO Atendimentos SET ?'
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                   res.status(400).json(erro)
                } else {
                   res.status(201).json(resultados)
                }
            })
        }

    }
}

module.exports = new Atendimento