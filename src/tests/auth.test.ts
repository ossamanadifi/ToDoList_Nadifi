import {describe , it, expect, afterAll} from "vitest";
import request from "supertest";

import { prisma } from "../db/db.ts";
import {  disconnectDB } from "./setup.ts";
import { app } from "../app.ts";

afterAll(async () => { 
    await disconnectDB();
})

describe ('POST /auth/register', () => { 
    it("Restituisce utente creato", async () => {
        const response = await request(app).post("/auth/register").send({
            "name" : "UtenteTest4",
            "email" : "user4@test.it",
            "pswd" : "12345678"
        });  

        const user = await prisma.user.findUnique({
            where : {
                email : "user4@test.it"
            }
        })

        expect(response.status).toBe(201);

        expect(response.body.data.user).toHaveProperty("id" , user?.id)
        expect(response.body.data.user).toHaveProperty("name" , "UtenteTest4")
        expect(response.body.data.user).toHaveProperty("email", "user4@test.it")
    })    

    it("Restituisce errore per email duplicata", async () => {
        const user = await prisma.user.create({
            data : {
                "name" : "UtenteTest5",
                "email" : "user5@test.it",
                "pswd" : "12345678"
            }
        })

        const response = await request(app).post("/auth/register").send({
            "name" : "UtenteTest5",
            "email" : "user5@test.it",
            "pswd" : "12345678"
        });  

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email già presente nel servizio.");
    })    

    it("Restituisce errore per dati mancanti", async () => {
        const response = await request(app).post("/auth/register").send({
            "name" : "UtenteTest",
            "pswd" : "12345678"
        });  

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Inserisci un' email valida");
    })    
})

describe ('POST /auth/login', () => { 
    it("Restituisce utente loggato", async () => {
        const response = await request(app).post("/auth/login").send({
            "email" : "user5@test.it",
            "pswd" : "12345678"
        });  

        const user = await prisma.user.findUnique({
            where : {
                email : "user5@test.it"
            }
        })

        expect(response.status).toBe(200);

        expect(response.body.data.user).toHaveProperty("id" , user?.id)
        expect(response.body.data.user).toHaveProperty("email", "user5@test.it")
    })    

    it("Restituisce errore per dati non identificata", async () => {
        const response = await request(app).post("/auth/login").send({
            "email" : "user67@test.it",
            "pswd" : "12345678"
        });  

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Email o password invalida.");
    })    

    it("Restituisce errore per dati mancanti", async () => {
        const response = await request(app).post("/auth/login").send({
            "pswd" : "12345678"
        });  

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Inserisci un' email valida");
    })    
})
    