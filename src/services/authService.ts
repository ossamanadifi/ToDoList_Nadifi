
import { prisma } from "../db/db.ts";
import { AppError } from "../utils/appError.ts";

export const registerService = async (name: string, email: string, pswd: string) => {
    const emailCheck = await prisma.user.findUnique({
            where: { email: email },
        });

        if (emailCheck) { //check su email per garantire l'unicità
            throw new AppError("Email già esistente", 400);
        }

        const user = await prisma.user.create({ //creazione dell'utente nel db
            data: {
                name,
                email,
                pswd,
            },
        });

    return user;
}

export const loginService = async (email: string, pswd: string) => {
    
    const user = await prisma.user.findUnique({ //recupero utente secondo i dati inseriti
            where: { 
                email: email,
                pswd: pswd
            },
        });

    if(!user){ //utente non trovato
        throw new AppError("Email o password invalida.", 401);
    }

    return user;    
}
 