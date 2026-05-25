import jwt from "jsonwebtoken";
import type { Response } from 'express';

//metodo che partendo dall'id dell utente genera un "JWT" utilizzando il codice segreto dell+ progetto
//setta il token generato all'interno dei cookies e lo restituisce al chiamante.
export const generateToken = (userId : string, res : Response) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};