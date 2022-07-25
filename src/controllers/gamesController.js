import connection from "../databases/postgres.js";

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
        
        const newGame = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(201);


} catch(erro) {
    console.log(erro);
    res.sendStatus(500);
}
}