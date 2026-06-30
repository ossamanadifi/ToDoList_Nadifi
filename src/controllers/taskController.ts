import { prisma } from '../db/db.ts';
import type { Request, Response } from 'express';
import { getTasksService, getTasksPaginatedService, addTaskService, getTaskService, updateTaskService, deleteTaskService } from "../services/taskService.ts";
import { asyncHandler } from '../utils/asyncHandler.ts';

export type Status = "PLANNED" | "COMPLETED"; //enum 

//metodo che restituisce le task create dall'utente autenticato
export const getUserTasks = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    let tasks;
    const page  = Number(req.query.page) //recupero il numero della pagina dalla query string, se non presente default a 1
    const pageSize = Number(req.query.pageSize) //recupero il numero di task per pagina dalla query string, se non presente default a 10

    if(page && pageSize && (page >= 1 &&  pageSize >= 1)){ //check su valori negativi o nulli
        const skip = (page - 1) * pageSize; //calcolo il numero di task da saltare in base alla pagina corrente e al numero di task per pagina
        const take = pageSize; //numero di task da prendere in base al numero di task per pagina
        tasks = await getTasksPaginatedService(req.user.id, skip , take); //chiamata al service per ottenere le task dell'utente
    } else {
        tasks = await getTasksService(req.user.id); //chiamata al service per ottenere le task dell'utente
    }

    res.status(200).json({//restituisce le task
        status: "Success",
        data: {
            tasks
        }
    });
})

//metodo che permette di creare una nuova task con previa autenticazione
export const addNewTask = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const {title, description, state} = req.body
    const newTask = await addTaskService(req.user.id, title, description, state);

    res.status(201).json({
        status: "Success",
        data: {
            newTask
        },
    });     
})

//metodo che restituisce dati di una specifica task
export const getTask = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const task = await getTaskService(""+req.params.id, req.user.id);
    res.status(200).json({
        status: "success",
        data: {
            task: task
        },
    });  
})

//metodo che permette di aggiornare i dati di una specifica task
export const updateTask = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    const { title, description, state } = req.body;     
    const updatedTask = await updateTaskService(""+req.params.id, req.user.id, state, title, description);

    res.status(200).json({
        status: "success",
        message: "Task aggiornata con successo.",
        data: {
            task: updatedTask
        },
    });  
})

//metodo che permette di eliminare una specifica task
export const deleteTask = asyncHandler( async (req: Request, res: Response): Promise<void> => {
    await deleteTaskService(""+req.params.id, req.user.id);    
    
    res.status(200).json({
        status: "success",
        message: "Task cancellata con successo.",
    });   
})
