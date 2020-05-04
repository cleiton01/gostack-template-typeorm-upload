import AppError from '../errors/AppError';
import {getRepository, getCustomRepository} from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';


class DeleteTransactionService {
  public async execute(id:string): Promise<void> {

    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await transactionRepository.findOne(id);

    if(!transaction){
      throw new AppError("transaction nao existe",400);
    }else{
      await transactionRepository.remove(transaction);
    }
  }
}

export default DeleteTransactionService;
