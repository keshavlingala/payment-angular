export interface Customer {
  accountNumber: string;
  clearBalance: number;
  name: string;
  overdraft: boolean;
}

export interface Bank {
  bic: string;
  name: string;
}

export interface TransferTypeCode {
  value: string;
  name: string;
}

export interface MessageType {
  messageCode: string;
  description: string;
}

export interface CurrencyType {
  code: string;
  name: string;
  value: number;
  symbol: string;
}
