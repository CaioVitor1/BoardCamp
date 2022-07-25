import connection from "../databases/postgres.js";
import joi from 'joi';
import dayjs from "dayjs";


export async function listRentals(req,res) {
    try{
        
        const { rows: rentals } = await connection.query(`SELECT rentals.*, 
        json_build_object('id', customers.id, 'name', customers.name) AS customer,
        json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        JOIN categories ON games."categoryId" = categories.id;`);
        return res.send(rentals);
    
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

export async function returnRentals(req, res) {
    try{
        const {id} = req.params;
        let returnDate = dayjs().format('YYYY-MM-DD');
     
        
        let delayFee = 0;
        const {rows: rental} = await connection.query('SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals.id = $1', [id])
        
        if(rental.length === 0) {
            return res.sendStatus(404)
        }
        if(rental[0].returnDate !== null) {
            return res.sendStatus(400)
        }
        const texto = JSON.stringify(rental[0].rentDate);

        const selectDate = texto.substr(1,10)
        const date1 = dayjs(selectDate)      

        let daysDifference = date1.diff(returnDate, 'day');
        
        if(daysDifference > rental[0].daysRented) {
            let daysLater = daysDifference - rental[0].daysRented
            console.log(daysLater)
            delayFee = (daysLater)*(rental[0].pricePerDay)
        }
        
         console.log(returnDate);
       
         console.log(delayFee)
        
       
        const updateRentals = await connection.query(`UPDATE rentals SET "returnDate" = '${returnDate}', "delayFee" = ${delayFee}  WHERE id = $1;`, [id])
        return res.sendStatus(200)


    }catch(erro) {
        console.log(erro)
        return res.sendStatus(500);
    }
}

export async function deleteRentals(req, res) {
    try{
        const {id} = req.params;
        const {rows: searchId} = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if(searchId.length === 0) {
            return res.status(404).send('ID não cadastrado');
        }
       
        if(searchId[0].returnDate === null) {
            return res.status(400).send('O jogo ainda não foi devolvido');
        }
        const {rows: deleteRentals} = await connection.query('DELETE FROM rentals WHERE id = $1;', [id])

        res.sendStatus(200)

    }catch(erro) {
        console.log(erro)
        return res.sendStatus(500)
    }
}