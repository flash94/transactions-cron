import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { transactionStatus, transactionType } from "../schemas/transaction_schema";


export class CreateTransactionDto {

  @IsNotEmpty()
  @IsString()
  senderAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  recipientAccountNumber: string;

  @IsNotEmpty()
  @IsString()
  recipientAccountName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsEnum(transactionType)
  transactionType: transactionType;

  @IsNotEmpty()
  @IsEnum(transactionStatus)
  tansactionStatus: transactionStatus = transactionStatus.PENDING;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}