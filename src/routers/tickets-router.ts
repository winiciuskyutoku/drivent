import { getTicketsByUser, getTicketsTypes, postTickets } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router()

ticketsRouter.all('/*', authenticateToken)
ticketsRouter.get('/types', getTicketsTypes)
ticketsRouter.get('/', getTicketsByUser)
ticketsRouter.post('/', postTickets)

export {ticketsRouter}