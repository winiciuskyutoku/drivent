import { AuthenticatedRequest } from "@/middlewares";
import ticketsRepository from "@/repositories/tickets-repository";
import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response){
    try{
        const result = await ticketsRepository.getTicketsTypesRepository()

        res.status(httpStatus.OK).send(result)
    } catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    
    try{
        const result = await ticketsService.getTicketsByUser(userId)

        res.status(httpStatus.OK).send(result.tickets)
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}

export async function postTickets(req: AuthenticatedRequest, res: Response){
    const {ticketTypeId} = req.body
    const userId = req.userId

    try{
        const result = await ticketsService.postTickets(ticketTypeId, userId)

        res.status(httpStatus.CREATED).send(result)
    } catch (err){
        if(err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND)
        if(err.name === 'alredyHasTicket') return res.sendStatus(httpStatus.BAD_REQUEST)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    }
}