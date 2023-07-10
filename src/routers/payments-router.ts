import { getPayments, postPayments } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router()

paymentsRouter.all('/*', authenticateToken)
paymentsRouter.get('/', getPayments)
paymentsRouter.post('/process', postPayments)

export  {paymentsRouter}