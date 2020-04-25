import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

/*
{
  "id": "uuid",
  "title": "Salário",
  "value": 3000,
  "type": "income",
  "category": "Alimentação"
}
*/

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(
        'Only values income and outcome are allowed for type',
        400,
      );
    }

    if (type === 'outcome') {
      const transactionRepositoryApp = new TransactionsRepository();
      const balanceValue = (await transactionRepositoryApp.getBalance(null))
        .total;
      if (balanceValue < value) {
        throw new AppError('Outcome value is greater than balance value', 400);
      }
    }

    const categoryFinded = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryFinded) {
      const newTransaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: categoryFinded.id,
      });

      await transactionRepository.save(newTransaction);

      return newTransaction;
    }

    const newCategory = categoryRepository.create({
      title: category,
    });

    const savedCategory = await categoryRepository.save(newCategory);

    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: savedCategory.id,
    });

    const savedTransaction = await transactionRepository.save(newTransaction);

    return savedTransaction;
  }
}

export default CreateTransactionService;
