import { prisma } from "@/config";
import { notFoundError } from "@/errors";
import { alredyHasTicket } from "@/services/tickets-service/error";

async function getTicketsTypesRepository(){
    const result = await prisma.ticketType.findMany({})

    return result
}

async function getTicketsByUserRepository(userId: number){
    const getEnrollmentId = await prisma.enrollment.findFirst({
        where: {
            userId
        },
        select: {
            id: true
        }
    })

    if(!getEnrollmentId) throw notFoundError()

    const tickets = await prisma.ticket.findFirst({
        where: {
            enrollmentId: getEnrollmentId.id
        },
        include: {
            TicketType: true
        }
    })

    if(!tickets) throw notFoundError()

    const adress = await prisma.enrollment.findFirst({
        where: {
            id: userId
        }
    })

    const result = {
        tickets: {
        id: tickets.id,
        ticketTypeId: tickets.ticketTypeId,
        enrollmentId: tickets.enrollmentId,
        status: tickets.status,
        TicketType: {
            ...tickets.TicketType
        },
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt
    }, adress}

    return result
}

async function postTickets(id: number, uId: number){
    const enrollmentId = await prisma.enrollment.findFirst({
        where: {
            userId:  uId
        },
        select: {
            id: true
        }
    })

    if(enrollmentId === null) return 

    const checkTickets = await prisma.ticket.findFirst({
        where: {
            enrollmentId: enrollmentId.id 
        }
    })

    if(checkTickets) throw alredyHasTicket()

    const result = await prisma.ticket.create({
        data: {
            ticketTypeId: id,
            enrollmentId: enrollmentId.id,
            status: 'RESERVED',
        }
    })

    const data = {
        id: result.id,
        ticketTypeId: result.ticketTypeId,
        enrollmentId: result.enrollmentId,
        status: result.status,
        TicketType: await prisma.ticketType.findFirst({
            where: {
                id: id
            }
        }),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    }

    return data
}

const ticketsRepository = {
    getTicketsTypesRepository,
    getTicketsByUserRepository,
    postTickets
}

export default ticketsRepository