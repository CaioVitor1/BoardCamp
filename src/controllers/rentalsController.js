import connection from "../databases/postgres.js";
import joi from 'joi';
import dayjs from "dayjs";


export async function listRentals(req,res) {
    try{
        const {rows: rentals} = await connection.query(`
        SELECT rentals.*, customers.id, customers.name FROM rentals 
        JOIN customers 
        ON rentals."customerId" = customers.id;
        JOIN games
        `)
       //apenas um teste, falta complementar essa query de cima
        res.send(rentals)
    
    } catch(erro) {
        res.sendStatus(500)
    }
}



export async function insertRentals(req, res){
    try{
        const rentDate = dayjs().format('YYYY-MM-DD');
        const returnDate = null;
        const delayFee = null;
   
        const { customerId,gameId, daysRented } = req.body;
        const rentalsSchema = joi.object({
            customerId: joi.number().required(),
            gameId: joi.number().required(),
            daysRented: joi.number().positive().greater(0).required()
            
        });
        
        const { error } = rentalsSchema.validate(req.body);
        if (error) {
            res.status(401).send('Campos inválidos');
            return;
        }

        const {rows: searchCustomerId} = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);        
        if(searchCustomerId.length === 0) {
            return res.status(409).send("Esse cliente não está cadastrado")
        }

        const {rows: searchGameId} = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);        
        if(searchGameId.length === 0) {
            return res.status(409).send("Esse jogo não está cadastrado")
        }

        const originalPrice = (searchGameId[0].pricePerDay * daysRented)

        const newRentals = await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)', [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
       
        return res.sendStatus(201);


    }catch(erro) {
        console.log(erro);
        res.sendStatus(500);
    }
}