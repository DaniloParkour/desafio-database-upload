import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

class BalanceTransactionService {
  public async execute(): Promise<any> {
    const transactionRepository = getRepository(Transaction);

    const allTransactions = await transactionRepository.find();

    console.log(allTransactions);

    const sumIncome = allTransactions.reduce((accumulator, currentValue) => {
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

    const balance = {
      transactions: allTransactions,
      balance: {
        income: sumIncome,
        outcome: sumOutcome,
        total,
      },
    };

    return balance;
  }
}

export default BalanceTransactionService;
