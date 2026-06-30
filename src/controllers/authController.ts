
import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';
import { generateToken } from "../auth/generateToken.ts";
import { registerService, loginService } from "../services/authService.ts";
import { asyncHandler } from '../utils/asyncHandler.ts';

//metodo che permette di registrare un utente all'interno del servizio
export const register = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const { name, email, pswd } = req.body;
    const user = await registerService(name, email, pswd);

    res.status(201).json({ //restituzione dei dati dell'utente tranne pswd
    status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
            }
        }
    });

});

//metodo che permette di autenticare un utente all'interno del servizio
export const login = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const { email, pswd } = req.body;
    const user = await loginService(email, pswd);
    const token = generateToken(user.id, res)

    res.status(200).json({//restituzione id e token JWT
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
                },
            token
        },
    });
})
