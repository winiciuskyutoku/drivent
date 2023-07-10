import { prisma } from "@/config";
import { paymentBody } from "@/protocols";
import { wrongUser } from "@/services/payments-service/error";
import dayjs from "dayjs"

async function getPayments(ticketId: number, uId: number){
    const checkUser = await prisma.ticket.findFirst({
        where: {
            id: ticketId
        },
        select: {
            Enrollment: {
                select: {
                    userId: true
                }
            }
        }
    })

    const result =  await prisma.payment.findFirst({
        where: {
            ticketId
        }
    })

    const data = {checkUser, result}

    return data
}

async function postPayments(body: paymentBody, uId: number){

    const checkTicketId = await prisma.ticket.findFirst({
        where: {
            id: body.ticketId
        },
        select: {
            TicketType: {
                select: {price: true}
            },
            Enrollment: {
                select: {userId: true}
            }
        }
    })

    const result = await prisma.payment.create({
        data: {
            ticketId: body.ticketId,
            value: checkTicketId.TicketType.price,
            cardIssuer: body.cardData.issuer,
            cardLastDigits: `${body.cardData.number}`.slice(-4)
        }
    })

    await prisma.ticket.update({
        data: {
            status: 'PAID'
        },
        where: {
            id: body.ticketId
        }
    })

    const data = {result, checkTicketId}

    return data
}

const paymentsRepository = {
    getPayments,
    postPayments
}

export default paymentsRepository