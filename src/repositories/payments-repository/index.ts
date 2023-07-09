import { prisma } from "@/config";
import { paymentBody } from "@/protocols";
import { wrongUser } from "@/services/payments-service/error";

async function getPayments(ticketId: number, uId: number){
    const result = await prisma.payment.findFirst({
        where: {
            ticketId
        },
        include: {
            Ticket: {
                include: {
                    Enrollment: {
                        select: {
                            userId: true
                        }
                    }
                },
                select: {
                    enrollmentId: true
                }
            }
        }
    })

    if(result.Ticket.Enrollment.userId !== uId) throw wrongUser()

    return {result}
}

async function postPayments(body: paymentBody, uId: number){
    const {ticketId} = body

    const checkTicketId = await prisma.ticket.findFirst({
        where: {
            id: body.ticketId
        },
        include: {
            TicketType: {
                select: {
                    price: true
                }
            },
            Enrollment: {
                select: {
                    userId: true
                }
            }
        }
    })

    if(!checkTicketId) return checkTicketId

    if(checkTicketId.Enrollment.userId !== uId) return uId

    const result = await prisma.payment.create({
        data: {
            ticketId: body.ticketId,
            value: checkTicketId.TicketType.price,
            cardIssuer: body.cardData.issuer,
            cardLastDigits: body.cardData.number.toString()
        }
    })

    await prisma.ticket.update({
        data: {
            status: 'PAID'
        },
        where: {
            id: ticketId
        }
    })

    console.log(result)
    return result
}

const paymentsRepository = {
    getPayments,
    postPayments
}

export default paymentsRepository