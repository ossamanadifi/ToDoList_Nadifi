import { z } from "zod";

//definizione dello schema zod dei dati in input per la creazione di una task
const taskSchema = z.object({
    title : z.string().trim().min(2, "inserisci un titolo valido"),
    description : z.string().trim().min(2,"Inserisci una descrizione valida"),
    state : z.enum(["PLANNED", "COMPLETED"], {
        error: () => ({
            message: "Status must be one of: PLANNED, COMPLETED",
        }),
    }).optional()
});

export { taskSchema };