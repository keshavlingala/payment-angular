import {environment} from "../../environments/environment";

export const API_URL = environment.BASE_URL + 'api/'
export const LOGIN_URL = API_URL + 'login'
export const REGISTER_URL = API_URL + 'register'
export const GET_CUSTOMER_DATA = API_URL + 'customer/'
export const GET_BANK_DATA = API_URL + 'bank/'
export const GET_MESSAGE_CODE_DATA = API_URL + 'messagecodes/'
export const POST_TRANSACTION = API_URL + 'transaction/'
export const GET_TRANSACTIONS = API_URL + 'transactions/'
export const GET_MESSAGE_COUNTS = API_URL + 'message-count/'
export const GET_TOP_CUSTOMERS = API_URL + 'top/'
export const GET_AMOUNT_BY_BANKS = API_URL + 'bank-amount/'

