import { ApplicationError } from '@/protocols';

export function emptyQuery(): ApplicationError {
  return {
    name: 'emptyQuery',
    message: 'Query is empty',
  };
}

export function wrongUser(): ApplicationError {
  return {
    name: 'wrongUser',
    message: 'This ticket does not belongs to this user'
  }
}

