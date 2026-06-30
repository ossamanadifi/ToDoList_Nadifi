import { prisma } from "../db/db.ts";
import { AppError } from "../utils/appError.ts";
import type { Status } from "../controllers/taskController.ts"; //importo il tipo Status dall'enum definito nel controller

//getTasksService, addTaskService, getTaskService, updateTaskService, deleteTaskService } 

interface UpdateData { // interfaccia per l'update della task
    state?: Status;
    title?: string;
    description?: string;
}

export const getTasksService = async (userId: string) => {
    const tasks = await prisma.task.findMany({
        where: {
            authorId: userId
        },
        orderBy: {
            createdAt: 'asc', //ordina le task in base alla data di creazione in ordine decrescente
        },
    });     

    return tasks;
}

export const getTasksPaginatedService = async (userId: string, skip: number, take: number) => {
    const tasks = await prisma.task.findMany({
        where: {
            authorId: userId
        },
        skip,
        take,
        orderBy: {
            createdAt: 'asc',
        },
    });     

    return tasks;
}


export const addTaskService = async (userId: string, title: string, description: string, state: "PLANNED" | "COMPLETED") => {
    const newTask = await prisma.task.create({ //creazione task
        data: {
            authorId: userId,
            title,
            description,
            state : state || "PLANNED"
        },
    });

    return newTask;
}

export const getTaskService = async (taskId: string, userId: string) => {
    const task = await prisma.task.findUnique({//ricerca in base all'id inserito nella PATH
        where: { id: taskId }
    });

    if (!task) {//task non trovata
        throw new AppError("Task non trovata!", 404);
    }

    if (task.authorId !== userId) {//check sulla paternalità dell'utente verso la task
        throw new AppError("Assicurati di inserire una task creata dal tuo account.", 403);
    }

    return task;
}

export const updateTaskService = async (taskId: string, userId: string, state: Status, title: string, description: string) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId }
    });

    if (!task) {
        throw new AppError("Task non trovata!", 404);
    }

    if (task.authorId !== userId) {
        throw new AppError("Assicurati di inserire una task creata dal tuo account.", 403);
    }

    const newData: UpdateData = {};

    //check sui dati inseriti dall'utente per aggiornare la task
    if (state !== undefined && (state === "PLANNED" || state === "COMPLETED")) newData.state = state;
    if (title !== undefined) newData.title = title;
    if (description !== undefined) newData.description = description;

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: newData,
    });

    return updatedTask;
}

export const deleteTaskService = async (taskId: string, userId: string) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId }
    });

    if (!task) {
         throw new AppError("Task non trovata!", 404);
    }

    if (task.authorId !== userId) {
        throw new AppError("Assicurati di fare riferimento ad una task creata dal tuo account.", 403);
    }

    await prisma.task.delete({
        where: { id: taskId },
    });
}

