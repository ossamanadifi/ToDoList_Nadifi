import express from 'express'
import { getTask, addNewTask, updateTask, deleteTask, getUserTasks } from '../controllers/taskController.ts';
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { validateRequest } from '../middleware/validateRequest.ts';
import { taskSchema } from '../validators/taskValidator.ts';

const taskRouter = express.Router()
taskRouter.use(authMiddleware);
/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Ottieni tutte le task
 *     description: Restituisce tutte le task associate all'utente autenticato
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numero della pagina da recuperare.
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numero di task da restituire per pagina.
 *     responses:
 *       200:
 *         description: Lista di task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 */
taskRouter.get("/", getUserTasks) //definizione del metodo associato alla route

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Crea task
 *     description: Crea una nuova task per l'utente autenticato
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: TASK 1
 *               description:
 *                 type: string
 *                 example: studiare per la verifica
 *               status:
 *                 type: string
 *                 enum:
 *                   - PLANNED
 *                   - COMPLETED
 *                 example: PLANNED
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Input non valido
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 */
taskRouter.post("/", validateRequest(taskSchema), addNewTask) //definizione del metodo associato alla route con validazione dei dati


/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Ottieni task
 *     description: Restituisce una specifica task dell'utente autenticato.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task non trovata
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 *       403:
 *         description: Assicurati di inserire una task creata dal tuo account.
 */
taskRouter.get("/:id", getTask); //definizione del metodo associato alla route

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Modifica di una task
 *     description: Modifica di una specifica task associata ad un utente
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PLANNED
 *                   - COMPLETED
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Task non trovata
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 *       403:
 *         description: Assicurati di inserire una task creata dal tuo account.
 */
taskRouter.put("/:id", updateTask); //definizione del metodo associato alla route con validazione dei dati

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Cancellazione di una task
 *     description: Cancellazione di una specifica task creata dall'utente autenticato
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Task non trovata
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 *       403:
 *         description: Assicurati di inserire una task creata dal tuo account.
 */
taskRouter.delete("/:id", deleteTask); //definizione del metodo associato alla route con validazione dei dati


export default taskRouter;