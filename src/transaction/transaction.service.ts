import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction_schema';
import * as mongoose from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sampleTransactions } from './transaction.seed.data';

@Injectable()
export class TransactionService {
    private readonly logger = new Logger(TransactionService.name);
    constructor(
        @InjectModel(Transaction.name)
        private transactionModel: mongoose.Model<Transaction>
    ) {}


      // seed transaction collection if empty
    async seedTransactionCollection(): Promise<void> {
        const count = await this.transactionModel.countDocuments();
        if (count === 0) {
        await this.transactionModel.insertMany(sampleTransactions);
        this.logger.log('Seeded initial transactions successfully.');
        } else {
        this.logger.log('Database already contains transactions. Skipping seed.');
        }
    }
    async onModuleInit() {
        await this.seedTransactionCollection();
    }

    async findAll(): Promise<Transaction[]> {
        const transactions = await this.transactionModel.find();
        return transactions;
    }

    async create(transaction: Transaction): Promise<Transaction>{
        const createdTransaction = await this.transactionModel.create(transaction);
        return createdTransaction;
    }

    async findById(id: string): Promise<Transaction>{
        const singleTransaction = await this.transactionModel.findById(id);
        
        if(!singleTransaction){
            throw new NotFoundException('Transaction with id does not exist');
        }
        return singleTransaction;
    }

    async updateById(id:string, transaction: Transaction): Promise<Transaction>{
        return await this.transactionModel.findByIdAndUpdate(id, transaction, {
            new: true,
            runValidators: true, 
        })
    }

    async getTransactionsBelowAmount(amount: number): Promise<Transaction[]>{
        return await this.transactionModel.find({ amount: { $lt: amount } })
    }

    // Cron job
    @Cron(CronExpression.EVERY_HOUR)
    async findByLessThanAmountHourly(): Promise<void> {
        const amountLimit = 500;
        const transactions = await this.getTransactionsBelowAmount(amountLimit);
        this.logger.log(`Found ${transactions.length} transactions below ${amountLimit}.`);
        this.logger.log(transactions);
    }
}
