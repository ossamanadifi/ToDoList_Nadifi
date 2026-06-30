import { prisma } from "../db/db.ts";

export const getUserService = async (userId: string) => {
    const user  = await prisma.user.findUnique({ //recupera i dati secondo l'id dell'utente autenticato
        where: {
            id: userId
        }
    });

    return user;
}