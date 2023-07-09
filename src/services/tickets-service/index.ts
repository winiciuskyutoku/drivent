import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { alredyHasTicket } from "./error";

async function getTicketsByUser(userId: number){

    const result = await ticketsRepository.getTicketsByUserRepository(userId)   

    return result
}

async function postTickets(id: number, uId: number){
    if(id === null || id === undefined) throw alredyHasTicket()

    const result = await ticketsRepository.postTickets(id, uId)
    if(!result) throw notFoundError()

    return result
}

const ticketsService = {
    getTicketsByUser,
    postTickets
}

export default ticketsService