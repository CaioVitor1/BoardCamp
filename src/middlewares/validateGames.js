import joi from 'joi';
import connection from "../databases/postgres.js";

export async function validateGames(req, res, next) {
    const { name, categoryId } = req.body;

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
       
        
        if(searchCategory.length === 0) {
            return res.status(400).send("categoria não existe")
        }
        if(searchName.length !== 0) {
            return res.status(409).send("Nome já existe")
        }

    next();
}