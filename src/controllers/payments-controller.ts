import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayments(req: AuthenticatedRequest, res: Response){
    const {ticketId} = req.query
    const uId = req.userId
    const tId = Number(ticketId)

    try {
        const result = await paymentsService.getPayments(tId, uId)

        res.status(httpStatus.OK).send(result)
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        if(err.name === 'emptyQuery') return res.status(httpStatus.BAD_REQUEST).send(err.message)
        if(err.name === 'wrongUser') return res.status(httpStatus.UNAUTHORIZED).send(err.message)
        res.status(httpStatus.NOT_FOUND).send(err.message)
    }
}   

export async function postPayments(req: AuthenticatedRequest, res: Response){
    const uId = req.userId

    try{
        const result = await paymentsService.postPayments(req.body, uId)

        res.status(httpStatus.OK).send(result)
    } catch(err){
        if(err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message)
        if(err.name === 'wrongUser') return res.status(httpStatus.UNAUTHORIZED).send(err.message)
        res.status(httpStatus.BAD_REQUEST).send(err.message)
    }
}