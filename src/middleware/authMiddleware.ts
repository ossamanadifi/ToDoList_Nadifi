import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from 'express';
import { prisma } from "../db/db.ts"
import { asyncHandler } from "../utils/asyncHandler.ts";
import { AppError } from "../utils/appError.ts";

//middleware che permette di verificare l'autenticazione dell'utente negli endpoint dove necessario
export const authMiddleware = asyncHandler( async (req: Request, res: Response, next: NextFunction ) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {//check nell'header di autorizzazione per il JWT BEARER
        token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies?.jwt) {//check nei cookies
        token = req.cookies.jwt;
        console.log(token)
    }

    if (!token) {
        throw new AppError("Token non presente. Assicurarsi di essere autenticati", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//recupero dell'id utente autenticato

        const user = await prisma.user.findUnique({//recupero dei dati dell'utente
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError("L'utente non esiste più.", 401);
        }

        req.user = user; //definizione dell'user nella richiesta per poter accedere successivamente ai suoi dati
        next();

    } catch (err) {
        throw new AppError("Token non riconosciuto. Effettuare nuovamente l'accesso", 401);
    }
});