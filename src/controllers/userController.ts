import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';
import { getUserService } from "../services/userService.ts";
import { asyncHandler } from '../utils/asyncHandler.ts';

//metodo che restituisce i dati dell'utente autenticato
export const getUserInfo = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const user = await getUserService(req.user.id); //chiamata al service per ottenere i dati dell'utente

    res.status(200).json({
        status: "success",
        data: {
            user: user
        },
    });          
})