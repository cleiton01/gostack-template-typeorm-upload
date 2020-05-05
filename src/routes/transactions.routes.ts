import { Router } from 'express';
import multer from 'multer';
import {getCustomRepository} from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

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

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTrasictions = new ImportTransactionsService();

  const transations = await importTrasictions.execute(request.file.path);
  return response.json(transations);
});

export default transactionsRouter;


