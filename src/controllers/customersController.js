import connection from "../databases/postgres.js";
import joi from 'joi';

export async function listCustomers(req, res) {
    try{
        const {cpf} = req.query
        if(!cpf) {
            const {rows: customers} = await connection.query('SELECT * FROM customers') 
            return res.send(customers)
        }else {
            const {rows: customers} = await connection.query(`SELECT * FROM customers WHERE customers.cpf ILIKE '${cpf}%'`) 
            return res.send(customers)
        }
        
} catch(erro) {
    console.log(erro);
    return res.sendStatus(500);
    }
}
export async function listUnicCustomers(req, res) {
    try{
        const { id } = req.params;
        console.log(id)
        const {rows: searchId} = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);        
        if(searchId.length === 0) {
            return res.status(404).send("ID Não cadastrado")
        }
        return res.send(searchId)

    }catch(erro) {
        console.log(erro);
        return res.sendStatus(500);
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
            res.status(400).send('Campos inválidos');
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
       const numberId = parseInt(id)
       
       const { name, phone, cpf, birthday } = req.body;
       const customersSchema = joi.object({
           name: joi.string().trim().min(1).required(),
           phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
           cpf:joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
           birthday: joi.string().pattern(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/).required()
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
       
       const updateCustomer = await connection.query(`UPDATE customers SET name = '${name}', phone = '${phone}', cpf = '${cpf}', birthday = '${birthday}' WHERE id = $1`, [id]) 
       return res.sendStatus(200)


    } catch(erro) {
        console.log(erro);
        res.sendStatus(500);
    }
}