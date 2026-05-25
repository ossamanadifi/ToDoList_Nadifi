import {describe , it, expect, beforeAll} from "vitest";
import request from "supertest";

import { prisma } from "../db/db.ts";
import { generateTokenTest } from "./setup.ts";
import { app } from "../app.ts";
import { User } from "../../generated/prisma/client/client.ts";

let userId: string, token: string, user : User;

beforeAll(async () => {
    user = await prisma.user.create({
        data: {
        name : "UtenteTest6",
        email : "user6@test.jp",
        pswd : "12345678",
        }
    })

    userId = user.id;
    token = generateTokenTest(userId);
})

describe ('GET / account', () => { 
    it("Should return the user's data", async () => {
    const response = await request(app).get("/account").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200)
        expect(response.body.data.user).toEqual(user)      
    })

    it("Should return error for authentication", async () => {
        const response = await request(app).get("/account").set("Authorization", "Bearer abaucbdcuadbavkdbcdcbacab");

        expect(response.status).toBe(401);      
        expect(response.body.error).toBe("Token non riconosciuto. Effettuare nuovamente l'accesso");

    })    
})