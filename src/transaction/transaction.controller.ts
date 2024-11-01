import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './schemas/transaction_schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/Update-transaction.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService : TransactionService){}

    @Get()
    async getAllTransactions(): Promise<Transaction[]>{
        return this.transactionService.findAll();
    }

    @Post()
    async createTransaction(
        @Body()
        transaction : CreateTransactionDto,
    ): Promise<Transaction>{
        return this.transactionService.create(transaction);
    }

    @Get(':id')
    async getTransactionById(
        @Param('id')
        id: string
    ): Promise<Transaction>{
        return this.transactionService.findById(id);
    }

    @Put(':id')
    async updateTransaction(
        @Param('id')
        id:string,
        @Body()
        transaction : UpdateTransactionDto,
    ): Promise<Transaction>{
        return this.transactionService.updateById(id, transaction)
    }

    @Get('filter/less-than')
    async getTransactionsBelowAmount(
        @Query('amount') amount:number,
    ): Promise<Transaction[]> {
        return this.transactionService.getTransactionsBelowAmount(amount)
    }
}
