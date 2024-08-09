export interface Transaction{
    id: string;
    type: 'Buy' | 'Transfer';
    info: TransactionTransfer | TransactionBuy;
    date: string;
}
export interface TransactionTransfer{
    receiverId: string;
    senderId: string;
    title: string;
    subtitle: string;
    emblem: string;
    sum: number;
    valute: string;
}
export interface TransactionBuy{
    receiverId: string;
    senderId: string;
    title: string;
    subtitle: string;
    emblem: string;
    sum: number;
    valute: string;
}
