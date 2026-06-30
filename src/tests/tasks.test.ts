import {describe , it, expect, beforeAll, beforeEach, afterAll} from "vitest";
import request from "supertest";

import { prisma } from "../db/db.ts";
import { dropTasks, disconnectDB, generateTokenTest } from "./setup.ts";
import { app } from "../app.ts";
let userId: string, token: string;

beforeAll(async () => {
    const user = await prisma.user.create({
        data: {
        name : "UtenteTest",
        email : "user@test.jp",
        pswd : "12345678",
        }
    })

    userId = user.id;
    token = generateTokenTest(userId);
})

beforeEach(async () => {
    await dropTasks();
})

afterAll(async () => {
    await disconnectDB();
})

describe ('GET / tasks', () => {
    it("Restituisce le task dell'utente identificato", async () => {
        const tasks = await prisma.task.createMany({
            data: [
            { title: 'TASK 1', description : 'FARE LA SPESA', authorId : userId },
            { title: 'TASK 2', description : 'STUDIARE', authorId : userId },
            { title: 'TASK 3', description : 'MANGIARE', authorId : userId },
            ],
        });

        const response = await request(app).get("/tasks").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200)
        expect(response.body.data.tasks).toHaveLength(3)

        expect(response.body.data.tasks[0]).toHaveProperty("title" , "TASK 1")
        expect(response.body.data.tasks[0]).toHaveProperty("description" , "FARE LA SPESA")
        expect(response.body.data.tasks[0]).toHaveProperty("state", "PLANNED")
        expect(response.body.data.tasks[0]).toHaveProperty("authorId" , userId)

        expect(response.body.data.tasks[1]).toHaveProperty("title" , "TASK 2")
        expect(response.body.data.tasks[1]).toHaveProperty("description" , "STUDIARE")
        expect(response.body.data.tasks[1]).toHaveProperty("state", "PLANNED")
        expect(response.body.data.tasks[1]).toHaveProperty("authorId" , userId)

        expect(response.body.data.tasks[2]).toHaveProperty("title" , "TASK 3")
        expect(response.body.data.tasks[2]).toHaveProperty("description" , "MANGIARE")
        expect(response.body.data.tasks[2]).toHaveProperty("state", "PLANNED")
        expect(response.body.data.tasks[2]).toHaveProperty("authorId" , userId)
    });

    it("Restituisce errore per mancata autenticazione", async () => {
        const tasks = await prisma.task.createMany({
            data: [
            { title: 'TASK 1', description : 'FARE LA SPESA', authorId : userId },
            { title: 'TASK 2', description : 'STUDIARE', authorId : userId },
            { title: 'TASK 3', description : 'MANGIARE', authorId : userId },
            ],
        });

        const response = await request(app).get("/tasks");

        expect(response.status).toBe(401);      
        expect(response.body.message).toBe("Token non presente. Assicurarsi di essere autenticati");
    })

    it("Restituisce risposta vuota", async () => {
        const response = await request(app).get("/tasks").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200)
        expect(response.body.data.tasks).toEqual([])
    })
})

describe ('POST / tasks', () => {
    it("Restituisce la task creata", async () => {
        const response = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            "title" : "TASK 1",
            "description" : "studiare",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        expect(response.status).toBe(201)

        expect(response.body.data.newTask).toHaveProperty("title" , "TASK 1")
        expect(response.body.data.newTask).toHaveProperty("description" , "studiare")
        expect(response.body.data.newTask).toHaveProperty("state", "COMPLETED")
        expect(response.body.data.newTask).toHaveProperty("authorId" , userId) 
    })

    it("Restituisce errore per mancata autenticazione", async () => {
        const response = await request(app).post("/tasks").send({
            "title" : "TASK 1",
            "description" : "studiare",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        expect(response.status).toBe(401);      
        expect(response.body.message).toBe("Token non presente. Assicurarsi di essere autenticati");

    })

    it("Restituisce errore per dati non validi", async () => {
        const response = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            "title" : "a",
            "description" : "studiare",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        expect(response.status).toBe(400);      
        expect(response.body.message).toBe("inserisci un titolo valido");
    })

        it("Restituisce errore per ENUM non valido", async () => {
        const response = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            "title" : "TASK 10",
            "description" : "studiare",
            "state" : "COMPLETE",
            "authorId" : userId
        });  

        expect(response.status).toBe(400);      
        expect(response.body.message).toBe("Status must be one of: PLANNED, COMPLETED");
    })
})

describe ('GET/tasks/{id}', () => {
    it('Restituisce la task richiesta', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).get(`/tasks/${task.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);      
        expect(response.body.data.task).toEqual(task);
    })

    it("Restituisce errore per mancata autenticazione", async () => {
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).get(`/tasks/${task.id}`);  

        expect(response.status).toBe(401);      
        expect(response.body.message).toBe("Token non presente. Assicurarsi di essere autenticati");
    })

    it('Restituisce errore per autenticazione di utente errato', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const user2 = await prisma.user.create({
            data: {
                name : "UtenteTest",
                email : "user2@test.com",
                pswd : "12345678",
            }
        })

        const userId2 = user2.id;
        const token2 = generateTokenTest(userId2);

        const response = await request(app).get(`/tasks/${task.id}`).set("Authorization", `Bearer ${token2}`)

        expect(response.status).toBe(403);      
        expect(response.body.message).toBe("Assicurati di inserire una task creata dal tuo account.");
    })

    it("Restituisce errore per task mancante", async () => {
        const response = await request(app).get(`/tasks/550e8400-e29b-41d4-a716-446655440000`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);      
        expect(response.body.message).toBe("Task non trovata!");
    })
})

describe ('PUT/tasks/{id}', () => {
    it('Aggiorna la task indicata', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).put(`/tasks/${task.id}`).set("Authorization", `Bearer ${token}`).send({
            "title" : "TASK 20",
            "description" : "leggere",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        const taskUpdated = await prisma.task.findUnique({
            where : {
                id : task.id
            }
        })

        expect(response.status).toBe(200);      
        expect(response.body.message).toBe("Task aggiornata con successo.");
        expect(response.body.data.task).toEqual(taskUpdated);
    })

    it("Restituisce errore per mancata autenticazione", async () => {
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).put(`/tasks/${task.id}`).send({
            "title" : "TASK 20",
            "description" : "studiare",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        expect(response.status).toBe(401);      
        expect(response.body.message).toBe("Token non presente. Assicurarsi di essere autenticati");
    })

    it('Restituisce errore per autenticazione di utente errato', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const user2 = await prisma.user.create({
            data: {
                name : "UtenteTest",
                email : "user3@test.com",
                pswd : "12345678",
            }
        })

        const userId2 = user2.id;
        const token2 = generateTokenTest(userId2);

        const response = await request(app).put(`/tasks/${task.id}`).set("Authorization", `Bearer ${token2}`).send({
            "title" : "TASK 20",
            "description" : "studiare",
            "state" : "COMPLETED",
            "authorId" : userId
        });  

        const taskUpdated = await prisma.task.findUnique({
            where : {
                id : task.id
            }
        })

        expect(response.status).toBe(403);      
        expect(response.body.message).toBe("Assicurati di inserire una task creata dal tuo account.");
    })

    it("Should return error for missing task", async () => {
        const response = await request(app).put(`/tasks/550e8400-e29b-41d4-a716-446655440000`).set("Authorization", `Bearer ${token}`).send({
            "state" : "COMPLETED"
        });  

        expect(response.status).toBe(404);      
        expect(response.body.message).toBe("Task non trovata!");
    })
})

describe ('DELETE/tasks/{id}', () => {
    it('Conferma la cancellazione della task', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).delete(`/tasks/${task.id}`).set("Authorization", `Bearer ${token}`);  

        expect(response.status).toBe(200);      
        expect(response.body.message).toBe("Task cancellata con successo.");
    })

    it("Restituisce errore per mancata autenticazione", async () => {
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const response = await request(app).delete(`/tasks/${task.id}`);  

        expect(response.status).toBe(401);      
        expect(response.body.message).toBe("Token non presente. Assicurarsi di essere autenticati");
    })

    it('Restituisce errore per autenticazione di utente errato', async () =>{
        const task = await prisma.task.create({
            data : {
                "title" : "TASK 1",
                "description" : "studiare",
                "state" : "PLANNED",
                "authorId" : userId
            }
        })

        const user2 = await prisma.user.create({
            data: {
                name : "UtenteTest",
                email : "user9@test.com",
                pswd : "12345678",
            }
        })

        const userId2 = user2.id;
        token = generateTokenTest(userId2);

        const response = await request(app).delete(`/tasks/${task.id}`).set("Authorization", `Bearer ${token}`);  

        expect(response.status).toBe(403);      
        expect(response.body.message).toBe("Assicurati di fare riferimento ad una task creata dal tuo account.");
    })

    it("Restituisce errore per task mancante", async () => {
        const response = await request(app).delete(`/tasks/550e8400-e29b-41d4-a716-446655440000`).set("Authorization", `Bearer ${token}`).send({
            "state" : "COMPLETED"
        });  

        expect(response.status).toBe(404);      
        expect(response.body.message).toBe("Task non trovata!");
    })
})
