import connection from "../databases/postgres.js";

export async function listCategories(req, res) {
    try{
        const {rows: categories} = await connection.query('SELECT * FROM categories;') 
        return res.send(categories)
    }catch(erro) {
        console.log(erro);
        res.sendStatus(500); 
    }
} 

export async function insertCategories(req, res) {
    try{
        const { name } = req.body;
        const {rows: searchName} = await connection.query('SELECT * FROM categories WHERE name = $1', [name])
        console.log(searchName)
        if(!name) {
            return res.sendStatus(400);
        }
        if(searchName.length !== 0) {
            return res.sendStatus(409)
        }
  
        const categories = await connection.query('INSERT INTO categories (name) VALUES ($1)', [name])
        res.sendStatus(201);

    }catch(erro) {
        console.log(erro);
        res.sendStatus(500); 
    }
} 