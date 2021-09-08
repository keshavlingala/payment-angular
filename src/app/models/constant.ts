import {environment} from "../../environments/environment";

export const API_URL = environment.BASE_URL + 'api/'
export const LOGIN_URL = API_URL + 'login'
export const REGISTER_URL = API_URL + 'register'
export const GET_CUSTOMER_DATA = API_URL + 'customer/'
export const GET_BANK_DATA = API_URL + 'bank/'
export const GET_MESSAGE_CODE_DATA = API_URL + 'messagecodes/'
export const POST_TRANSACTION = API_URL + 'transaction/'
export const GET_TRANSACTIONS = API_URL + 'transactions/'

