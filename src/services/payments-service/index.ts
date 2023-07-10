import paymentsRepository from "@/repositories/payments-repository";
import { emptyQuery, wrongUser } from "./error";
import { notFoundError, unauthorizedError } from "@/errors";
import { paymentBody } from "@/protocols";
import { getTicketsByUser } from "@/controllers";
import ticketsRepository from "@/repositories/tickets-repository";

async function getPayments(ticketId: number, uId: number){
    if(!ticketId) throw emptyQuery()

    const checkTicket = await ticketsRepository.getTickets(ticketId)
    if(!checkTicket) throw notFoundError()

    const result = await paymentsRepository.getPayments(ticketId, uId)

    if(result.checkUser.Enrollment.userId !== uId) throw wrongUser()

    return result
}

async function postPayments(body: paymentBody, uId: number){
    if(!body.cardData || !body.ticketId) throw emptyQuery()

    const checkTicket = await ticketsRepository.getTickets(body.ticketId)
    if(!checkTicket) throw notFoundError()

    const checkUser = await getPayments(body.ticketId, uId)
    if(checkUser.checkUser.Enrollment.userId != uId) throw wrongUser()

    return await paymentsRepository.postPayments(body, uId)
}

const paymentsService = {
    getPayments,
    postPayments
}

export default paymentsService