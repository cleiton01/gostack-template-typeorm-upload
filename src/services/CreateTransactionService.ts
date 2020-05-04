import AppError from '../errors/AppError';
import {getCustomRepository, getRepository} from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request{
  title: string;
  value:number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    let newCategory = await categoriesRepository.findOne({where: {title: category}});

    if(newCategory == undefined){
      newCategory = categoriesRepository.create({title: category});
      newCategory = await categoriesRepository.save(newCategory);
      console.log(newCategory);
    }

    const balance = await transactionRepository.getBalance();

    console.log(balance);
    if( balance.total < value && type == 'outcome'){
      throw new AppError("Balance its not enough", 400);
    }

    const transaction = transactionRepository.create({
      title, value, type, category_id: newCategory.id
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
