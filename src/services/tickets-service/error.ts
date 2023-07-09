import { ApplicationError } from '@/protocols';

export function alredyHasTicket(): ApplicationError {
  return {
    name: 'alredyHasTicket',
    message: 'This user alredy has reserved a ticket',
  };
}
