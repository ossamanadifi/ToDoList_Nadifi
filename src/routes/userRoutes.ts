import express from 'express'
import { getUserInfo } from '../controllers/userController.ts';
import { authMiddleware } from "../middleware/authMiddleware.ts";

const userRouter = express.Router()
userRouter.use(authMiddleware);

/**
 * @openapi
 * /account:
 *   get:
 *     summary: Ottieni dati accounti
 *     description: Restituisce i dati dell'utente autenticato.
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dati utente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token non presente. Assicurarsi di essere autenticati
 */
userRouter.get("/", getUserInfo); //definizione del metodo associato alla route

export default userRouter;