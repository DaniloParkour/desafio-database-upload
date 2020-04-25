import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(
    allTransactions: Transaction[] | null,
  ): Promise<Balance> {
    //
    if (allTransactions == null) {
      const transactionsRepository = getRepository(Transaction);
      const transactions = await transactionsRepository.find();
      return this.balanceTransactions(transactions);
    }
    return this.balanceTransactions(allTransactions);
  }

  private balanceTransactions(transactions: Transaction[]): Balance {
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += Number(transaction.value);
        } else if (transaction.type === 'outcome') {
          accumulator.outcome += Number(transaction.value);
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    /*
    const sumIncome = transactions.reduce((accumulator, currentValue) => {
      console.log(`Income = ${accumulator}`);
      if (currentValue.type === 'income') {
        return accumulator + parseFloat(currentValue.value);
      }
      return accumulator;
    }, 0);

    const sumOutcome = transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === 'outcome') {
        return accumulator + parseFloat(currentValue.value);
      }
      return accumulator;
    }, 0);

    const total = sumIncome - sumOutcome;

    */

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
