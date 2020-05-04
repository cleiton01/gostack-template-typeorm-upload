import { Router } from 'express';
import {getCustomRepository} from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const balance = await transactionRepository.getBalance();
  const transactions = await transactionRepository.getTransaction();

  return response.json({transactions,balance});
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService()

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category
  });

  response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const id  = request.params.id;

  const deleteTransaction = new DeleteTransactionService();
  deleteTransaction.execute(id);

  response.status(200).json({ok:id});

});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;