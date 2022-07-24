import connection from "../databases/postgres.js";
import joi from 'joi';

export async function listCustomers(req, res) {
    try{
        const {rows: customers} = await connection.query('SELECT * FROM customers') 
    return res.send(customers)
} catch(erro) {
    console.log(erro);
        res.sendStatus(500);
    }
}
export async function listUnicCustomers(req, res) {
    try{
        const { id } = req.params;
        console.log(id)
        const {rows: searchId} = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);        
        if(searchId.length === 0) {
            return res.status(409).send("ID Não cadastrado")
        }
        res.send(searchId)

    }catch(erro) {
        console.log(erro);
        res.sendStatus(500);
}
}

export async function insertCustomers(req, res) {
    try{
        const { name, phone, cpf, birthday } = req.body;
        const customersSchema = joi.object({
            name: joi.string().trim().min(1).required(),
            phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
            cpf:joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
            birthday: joi.string().pattern(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/).required()
        });
        
        const { error } = customersSchema.validate(req.body);
        if (error) {
            res.status(401).send('Campos inválidos');
            return;
        }

        const {rows: searchCpf} = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);        
        if(searchCpf.length !== 0) {
            return res.status(409).send("CPF já cadastrado")
        }

        const newCustomers = await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    
    
    }
    catch(erro) {
        console.log(erro);
        res.sendStatus(500);
    }
}

export async function updateCustomers(req, res) {
    try{
       const {id} = req.params;

       const { name, phone, cpf, birthday } = req.body;
       const customersSchema = joi.object({
           name: joi.string().trim().min(1).required(),
           phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
           cpf:joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
           birthday: joi.string().pattern(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/).required()
       });
       
       const { error } = customersSchema.validate(req.body);
       if (error) {
           res.status(401).send('Campos inválidos');
           return;
       }

       const {rows: searchCpf} = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);        
       if(searchCpf.length !== 0) {
           return res.status(409).send("CPF já cadastrado")
       }

       const updateCustomer = await connection.query('UPDATE customers SET name = name, phone = phone, cpf = cpf, birthday = birthday WHERE id = $1', [id]) 
       return res.send("dados atualizados")


    } catch(erro) {
        console.log(erro);
        res.sendStatus(500);
    }
}