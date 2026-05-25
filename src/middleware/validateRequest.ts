import type { Request, Response, NextFunction } from 'express';
import { ZodType } from "zod";

//middleware che permette di verificare i dati in input secondo uno schema ZOD
export const validateRequest = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next:  NextFunction) => {
        const result = schema.safeParse(req.body);//confronto dati con lo schema

        if (!result.success) {
            const formatted = result.error.format();

            const flatErrors = Object.values(formatted)
            .flatMap((field: any) => field?._errors ?? []);
    
            console.log(flatErrors.join(", "))

            return res.status(400).json({ message: flatErrors.join(", ") });//restituisce gli errori che si sono verificati nel confronto
        }

        req.body = result.data;
        next();
    };
};