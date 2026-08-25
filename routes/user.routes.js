import express from "express";
import { db } from "../db/index.js";
import { usersTable } from "../models/index.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";
import { signupPostRequestBodySchema } from "../validation/request.validation.js";
import { loginPostRequestBodySchema } from "../validation/request.validation.js";
import { createUserToken } from "../utils/token.js";

const router = express.Router();

router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if( validationResult.error){
        return res.status(400).json({ error: validationResult.error.format() });
    }

    const { firstname, lastname, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);
    
    if(existingUser) 
        return res
        .status(400)
        .json({ error: `User with email ${email} already exists!` });

    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    const user = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        salt,
    })
    .returning({ id: usersTable.id});

    return res.status(201).json({ data: { userId: user[0].id } });
});

router.post('/login', async (req, res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if( validationResult.error){
        return res.status(400).json({ error: validationResult.error });
    }

    const { email, password } = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res
        .status(404)
        .json({ error: `User with email ${email} does not exist!` });
    }

    if( user.password !== hashPasswordWithSalt(password, user.salt).password){
        return res
        .status(401)
        .json({ error: `Invalid password!` });
    }       

    const token = await createUserToken({ id: user.id });

    return res.json({ token });
});

export default router;