import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class BalanceTransactionService {
  public async execute(): Promise<any> {
    const transactionRepositoryOrm = getRepository(Transaction);
    const transactionRepository = new TransactionsRepository();

    const allTransactions = await transactionRepositoryOrm.find();

    const transactionBalance = await transactionRepository.getBalance(
      allTransactions,
    );

    console.log(allTransactions);

    /* const sumIncome = allTransactions.reduce((accumulator, currentValue) => {
      console.log(`Income = ${accumulator}`);
      if (currentValue.type === 'income') {
        return accumulator + parseFloat(currentValue.value);
      }
      return accumulator;
    }, 0);

    const sumOutcome = allTransactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === 'outcome') {
        return accumulator + parseFloat(currentValue.value);
      }
      return accumulator;
    }, 0);

    const total = sumIncome - sumOutcome;
    */

    const balance = {
      transactions: allTransactions,
      balance: {
        income: transactionBalance.income,
        outcome: transactionBalance.outcome,
        total: transactionBalance.total,
      },
    };

    return balance;
  }
}

export default BalanceTransactionService;
