
import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';
import { generateToken } from "../auth/generateToken.ts";

//metodo che permette di registrare un utente all'interno del servizio
export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, email, pswd } = req.body;
        const emailCheck = await prisma.user.findUnique({
            where: { email: email },
        });

        if (emailCheck) { //check su email per garantire l'unicità
            res.status(400).json({ error: "Email già presente nel servizio." });
            return;
        }

        const user = await prisma.user.create({ //creazione dell'utente nel db
            data: {
                name,
                email,
                pswd,
            },
        });

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

    } catch (error) { 
        res.status(500).json({ //Eccezione in caso di errori interni del servizio
            status: "error",
            message: "Internal server error"
        });

        return;
    }
};

//metodo che permette di autenticare un utente all'interno del servizio
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, pswd } = req.body;

        const user = await prisma.user.findUnique({ //recupero utente secondo i dati inseriti
            where: { 
                email: email,
                pswd: pswd
            },
        });

        if(!user){ //utente non trovato
            res.status(401).json({ error: "Email o password invalida." });
            return;   
        }

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
        
    } catch (error) {
        res.status(500).json({ //Eccezione in caso di errori interni del servizio
            status: "error",
            message: "Internal server error"
        });

        return;
    }
}
