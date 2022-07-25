import joi from 'joi';

export async function validateCategories(req, res, next) {
        const nameSchema = joi.object({
            name: joi.string().required()
        });
    
        const { error } = nameSchema.validate(req.body);
        if (error) {
            res.status(401).send('Campos inválidos');
            return;
        }
        next();
}