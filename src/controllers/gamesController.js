import connection from "../databases/postgres.js";
import joi from 'joi';

export async function listGames(req, res) {
    const {name} = req.query
    if(!name) {
        const {rows: games} = await connection.query('SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id') 
        console.log(games);
        return res.send(games)
    } else{
        const {rows: games} = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id AND games."name" ILIKE '${name}%';`) 
        return res.send(games)
    }
}

export async function insertGames(req, res) {
    try{
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
        const gameSchema = joi.object({
            name: joi.string().trim().min(1).required(),
            image: joi.string().required(),
            stockTotal: joi.number().positive().greater(0).required(),
            categoryId: joi.number().required(),
            pricePerDay: joi.number().positive().greater(0).required()
        });
        
        const { error } = gameSchema.validate(req.body);
        if (error) {
            res.status(401).send('Campos inválidos');
            return;
        }
        const {rows: searchCategory} = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        const {rows: searchName} = await connection.query('SELECT * FROM games WHERE name = $1', [name]);        
       
        console.log(searchName)
        if(searchCategory.length === 0) {
            return res.status(409).send("categoria não existe")
        }
        if(searchName.length !== 0) {
            return res.status(409).send("Nome já existe")
        }
        
        const newGame = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(201);


} catch(erro) {
    console.log(erro);
    res.sendStatus(500);
}
}