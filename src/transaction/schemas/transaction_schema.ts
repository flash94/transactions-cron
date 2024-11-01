import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TransactionDocument = Transaction & Document;
export enum transactionType {
    DEBIT = 'Debit',
    CREDIT = 'Credit'
}

export enum transactionStatus{
    PENDING = 'Pending',
    SUCCESSFUL = 'Successful',
    FAILED = "Failed",

}
@Schema({
    timestamps:true
})
export class Transaction{
    @Prop({required: true})
    senderAccountNumber: string;

    @Prop({required: true})
    recipientAccountNumber: string;

    @Prop({required: true})
    recipientAccountName: string;

    @Prop({required: true, min:0})
    amount: Number;

    @Prop({required: true})
    transactionType : transactionType;

    @Prop({required: true, default:'Pending'})
    tansactionStatus: transactionStatus;

    @Prop({maxlength: 255})
    description?: string
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);