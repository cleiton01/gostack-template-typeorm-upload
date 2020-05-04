import Transaction from '../models/Transaction';
import { EntityRepository, Repository } from 'typeorm';


interface Balance {
  income: number;
  outcome: number;
  total: number;
}



@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const finalBalance = { income:0, outcome:0, total:0 };

    const transactions = await this.find();

    transactions.map(transaction => {
      if(transaction.type == "income"){
        finalBalance.income += Number(transaction.value);
        finalBalance.total += Number(transaction.value);
      }else{
        finalBalance.outcome += Number(transaction.value);
        finalBalance.total -= Number(transaction.value);
      }
    })

    return finalBalance;
  }

  public async getTransaction():Promise< any>{

    const transactionss = await this.createQueryBuilder("transaction")
      .innerJoinAndSelect("transaction.category","category")
      .getMany();


      transactionss.map(transc => {
        delete transc.category_id;
        transc["category"] = {
            id: transc.category.id,
            title:transc.category.title,
            created_at: transc.category.created_at,
            updated_at: transc.category.updated_at
          };
      });
      console.log(transactionss);
    return transactionss;
  }

}

export default TransactionsRepository;
