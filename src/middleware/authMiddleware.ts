import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from 'express';
import { prisma } from "../db/db.ts"

//middleware che permette di verificare l'autenticazione dell'utente negli endpoint dove necessario
export const authMiddleware = async (req: Request, res: Response, next: NextFunction ) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {//check nell'header di autorizzazione per il JWT BEARER
        token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies?.jwt) {//check nei cookies
        token = req.cookies.jwt;
        console.log(token)
    }

    if (!token) {
        return res.status(401).json({ error: "Token non presente. Assicurarsi di essere autenticati" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//recupero dell'id utente autenticato

        const user = await prisma.user.findUnique({//recupero dei dati dell'utente
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ error: "L'utente non esiste più." });
        }

        req.user = user; //definizione dell'user nella richiesta per poter accedere successivamente ai suoi dati
        next();

    } catch (err) {
        return res.status(401).json({ error: "Token non riconosciuto. Effettuare nuovamente l'accesso" });
    }
};