import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';

type Status = "PLANNED" | "COMPLETED"; //enum 

interface UpdateData { // interfaccia per l'update della task
    state?: Status;
    title?: string;
    description?: string;
}

//metodo che restituisce le task create dall'utente autenticato
export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
    try{
        const tasks  = await prisma.task.findMany({//ricerca delle task con un authorid uguale a quello dell'utente autenticato
            where: {
                authorId: req.user.id
            }
        });

        res.status(200).json({//restituisce le task
            status: "Success",
            data: {
                tasks
            }
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });

        return;
    }
}

//metodo che permette di creare una nuova task con previa autenticazione
export const addNewTask = async (req: Request, res: Response): Promise<void> => {
    try{
        const {title, description, state} = req.body
        const newTask = await prisma.task.create({ //creazione task
            data: {
                authorId: req.user.id,
                title,
                description,
                state : state || "PLANNED"
            },
        });

        res.status(201).json({
            status: "Success",
            data: {
                newTask
            },
        });     

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });

        return;
    }
}

//metodo che restituisce dati di una specifica task
export const getTask = async (req: Request, res: Response): Promise<void> => {
    try{
        const task = await prisma.task.findUnique({//ricerca in base all'id inserito nella PATH
            where: { id: ""+req.params.id }
        });

        if (!task) {//task non trovata
            res.status(404).json({ error: "Task non trovata!" });
            return;
        }

        if (task.authorId !== req.user.id) {//check sulla paternalità dell'utente verso la task
            res.status(403).json({ error: "Assicurati di inserire una task creata dal tuo account." });
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                task: task
            },
        });  

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });

        return;
    }
}

//metodo che permette di aggiornare i dati di una specifica task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try{
        const { title, description, state } = req.body;
        const task = await prisma.task.findUnique({
            where: { id: ""+req.params.id }
        });

        if (!task) {
            res.status(404).json({ error: "Task non trovata!" });
            return;
        }

        if (task.authorId !== req.user.id) {
            res.status(403).json({ error: "Assicurati di inserire una task creata dal tuo account." });
        }

        const newData: UpdateData = {};

        //check sui dati inseriti dall'utente per aggiornare la task
        if (state !== undefined && (state === "PLANNED" || state === "COMPLETED")) newData.state = state;
        if (title !== undefined) newData.title = title;
        if (description !== undefined) newData.description = description;

        const updatedTask = await prisma.task.update({
            where: { id: ""+req.params.id },
            data: newData,
        });

        res.status(200).json({
            status: "success",
            message: "Task aggiornata con successo.",
            data: {
                task: updatedTask
            },
        });  

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });     

        return; 
    }
}


//metodo che permette di eliminare una specifica task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try{
        const task = await prisma.task.findUnique({
            where: { id: String(req.params.id) }
        });

        if (!task) {
            res.status(404).json({ error: "Task non trovata!" });
            return
        }

        console.log(req.user.id)

        if (task.authorId !== req.user.id) {
            res.status(403).json({ error: "Assicurati di fare riferimento ad una task creata dal tuo account." });
            return
        }

        await prisma.task.delete({
            where: { id: ""+req.params.id },
        });

        res.status(200).json({
            status: "success",
            message: "Task cancellata con successo.",
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });

        return;
    }
    
}
