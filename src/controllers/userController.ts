import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';

//metodo che restituisce i dati dell'utente autenticato
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const user  = await prisma.user.findUnique({ //recupera i dati secondo l'id dell'utente autenticato
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({
            status: "success",
            data: {
                user: user
            },
        });          

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });

        return;
    }
}