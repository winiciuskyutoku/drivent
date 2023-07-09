import { getPayments, postPayments } from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchema } from "@/schemas/payments-schemas";
import { Router } from "express";

const paymentsRouter = Router()

paymentsRouter.all('/*', authenticateToken)
paymentsRouter.get('/', getPayments)
paymentsRouter.post('/process', validateBody(paymentSchema), postPayments)

export  {paymentsRouter}