import paymentsRepository from "@/repositories/payments-repository";
import { emptyQuery, wrongUser } from "./error";
import { notFoundError } from "@/errors";
import { paymentBody } from "@/protocols";

async function getPayments(ticketId: number, uId: number){
    if(!ticketId) throw emptyQuery()

    const result = await paymentsRepository.getPayments(ticketId, uId)
    if(!result.result) throw notFoundError()

    return result
}

async function postPayments(body: paymentBody, uId: number){
    const result = await paymentsRepository.postPayments(body, uId)
    if(result === uId) throw wrongUser()
    if(!result) throw notFoundError()

    return result
}

const paymentsService = {
    getPayments,
    postPayments
}

export default paymentsService