import express from 'express'
import { register, login } from '../controllers/authController.ts';
import { validateRequest } from '../middleware/validateRequest.ts';
import { registerSchema, loginSchema } from '../validators/authValidator.ts';

const authRouter = express.Router()
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.it
 *               password:
 *                 type: string
 *                 example: 12345678
 *               name:
 *                 type: string
 *                 example: UserTest
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email già presente nel servizio.
 */
authRouter.post("/register", validateRequest(registerSchema), register) //definizione del metodo associato alla route con validazione dei dati

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticazione
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.it
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authorId:
 *                   type: string
 *                   example: faa7cf42-b495-4fc4-8851-d05b99014808
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email o password invalida.
 */
authRouter.post("/login", validateRequest(loginSchema), login) //definizione del metodo associato alla route con validazione dei dati

export default authRouter;