import connection from "../databases/postgres.js";
import joi from 'joi';

export async function validateInsert(req, res, next) {
    const { customerId,gameId} = req.body;

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
            return res.status(400).send("Esse cliente não está cadastrado")
        }

        const {rows: searchGameId} = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);        
        if(searchGameId.length === 0) {
            return res.status(400).send("Esse jogo não está cadastrado")
        }
        const {rows: availableRental} = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);        
       console.log(availableRental)
        if(availableRental.length >= searchGameId[0].stockTotal) {
            return res.status(400).send("Não possuímos o jogo disponível em estoque")
        }

        res.locals.session = searchGameId;
        next();

}

export async function validateFinished( req, res, next) {
    const {id} = req.params;
    const {rows: rental} = await connection.query('SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals.id = $1', [id])
        
        if(rental.length === 0) {
            return res.sendStatus(404)
        }
        if(rental[0].returnDate !== null) {
            return res.sendStatus(400)
        }

        res.locals.session = rental;
        next();
}

export async function validateDelete( req, res, next) {

        const {id} = req.params;
        const {rows: searchId} = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        if(searchId.length === 0) {
            return res.status(404).send('ID não cadastrado');
        }
       
        if(searchId[0].returnDate === null) {
            return res.status(400).send('O jogo ainda não foi devolvido');
        }

        next();
}