// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) throw new Error('Transaction ID not found.');

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
