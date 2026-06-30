import { z } from "zod";

//definizione dello schema zod dei dati in input per la registrazione
const registerSchema = z.object({
    name : z.string("Inserisci un nome valido").trim().min(2, "Il nome deve essere almeno di 2 caratteri"),
    email : z.email("Inserisci un' email valida").toLowerCase(),
    pswd : z.string("Inserisci una password valida").min(6, "La password deve essere almeno di 6 caratteri"),
});

//definizione dello schema zod dei dati in input per il login
const loginSchema = z.object({
    email : z.email("Inserisci un' email valida").toLowerCase(),
    pswd : z.string("Inserisci una password valida").min(6),
});

export { registerSchema, loginSchema };