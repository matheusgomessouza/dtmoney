import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface TransactionProps {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

// 3 ways of extends an interface in Typescript

// interface TransactionInputProps {
//   title: string;
//   type: string;
//   category: string;
//   amount: number;
// }

// Extends an interface picking the chosen properties
// type TransactionInputProps = Pick<TransactionProps, 'title' | 'amount' | 'type' | 'category'>;

// Extends an interface omitting the chosen properties
type TransactionInputProps = Omit<TransactionProps, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextDataProps {
  transactions: TransactionProps[],
  createTransaction: (transaction: TransactionInputProps) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextDataProps>({} as TransactionsContextDataProps); // Initial state

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInputData: TransactionInputProps) {
    const response = await api.post('/transactions', {
      ...transactionInputData,
      createdAt: new Date(),
    })
    
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}

