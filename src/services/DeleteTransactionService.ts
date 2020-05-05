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
    }
    console.log(`transaction - in proces - ${transaction.id}`);

    const resultSet = await transactionRepository.createQueryBuilder()
    .delete()
    .from(Transaction)
    .where("id = :id", { id: transaction.id })
    .execute()
    ;
    console.log(resultSet);
  }
}

export default DeleteTransactionService;
