import connection from "../databases/postgres.js";
import joi from 'joi';
import dayjs from "dayjs";

export async function listRentals(req,res) {
    try{
        const {customerId} = req.query
        const {gameId} = req.query
        if(!customerId && !gameId){
            const { rows: rentals } = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name) AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id;`);
            return res.send(rentals);
        }
        else if(customerId && !gameId) {
            const { rows: rentals } = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name) AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id AND rentals."customerId" = '${customerId}';`);
            return res.send(rentals);
        }
        else if(!customerId && gameId){
            console.log("games")
            const { rows: rentals } = await connection.query(`SELECT rentals.*, 
            json_build_object('id', customers.id, 'name', customers.name) AS customer,
            json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id AND rentals."gameId" = '${gameId}';`);
            return res.send(rentals);
        } 

        
    } catch(erro) {
        return res.sendStatus(500)
    }
}

export async function insertRentals(req, res){
    try{
        const searchGameId = res.locals.session;
        const rentDate = dayjs().format('YYYY-MM-DD');
        const returnDate = null;
        const delayFee = null;
   
        const { customerId,gameId, daysRented } = req.body;
       
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
        const rental = res.locals.session;
        const {id} = req.params;
        let returnDate = dayjs().format('YYYY-MM-DD');
        let delayFee = 0;
        
        const texto = JSON.stringify(rental[0].rentDate);

        const selectDate = texto.substr(1,10)
        const date1 = dayjs(selectDate)      

        let daysDifference = date1.diff(returnDate, 'day');
        
        if(daysDifference > rental[0].daysRented) {
            let daysLater = daysDifference - rental[0].daysRented
            console.log(daysLater)
            delayFee = (daysLater)*(rental[0].pricePerDay)
        }
              
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
        const {rows: deleteRentals} = await connection.query('DELETE FROM rentals WHERE id = $1;', [id])

        res.sendStatus(200)

    }catch(erro) {
        console.log(erro)
        return res.sendStatus(500)
    }
}