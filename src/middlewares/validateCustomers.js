import connection from "../databases/postgres.js";
import dayjs from "dayjs";
import baseJoi from 'joi';
import joiDate from '@joi/date';
const joi = baseJoi.extend(joiDate);

export async function validateCustomer(req, res, next) {
    const date = dayjs().format('YYYY-MM-DD');
        const {  cpf } = req.body;
        const customersSchema = joi.object({
        name: joi.string().trim().min(1).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        cpf:joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().format('YYYY-MM-DD').max(date).min('1900-01-01').required()
    });
    
    const { error } = customersSchema.validate(req.body);
    if (error) {
        res.status(400).send('Campos inválidos');
        return;
    }

    const {rows: searchCpf} = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);        
        if(searchCpf.length !== 0) {
            return res.status(409).send("CPF já cadastrado")
        }

        next()
}

export async function validateUpdate(req, res, next) {
       const date = dayjs().format('YYYY-MM-DD');
       const {cpf} = req.body;
       const {id} = req.params;
       const numberId = parseInt(id)
       const customersSchema = joi.object({
           name: joi.string().trim().min(1).required(),
           phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
           cpf:joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
           birthday: joi.date().format('YYYY-MM-DD').max(date).min('1900-01-01').required()
       });
       
       const { error } = customersSchema.validate(req.body);
       if (error) {
           res.status(400).send('Campos inválidos');
           return;
       }

       const {rows: searchCpf} = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);        
       if(searchCpf.length !== 0 && searchCpf[0].id !== numberId) {
           
           return res.status(409).send("CPF já cadastrado por outro usuário")
       }
       next();
}