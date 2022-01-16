import { FormEvent, useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import Modal from 'react-modal';

import { Container, RadioBox, TransactionTypeContainer } from './styles';

import closeImg from '../../assets/close.svg';
import incomeImg from '../../assets/income.svg';
import outcomeImg from '../../assets/outcome.svg';

interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NewTransactionModal({ isOpen, onRequestClose }: NewTransactionModalProps) {
  const { createTransaction } = useTransactions();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('deposit');

  async function handleCreateNewTransaction(e: FormEvent) {
    e.preventDefault();

    await createTransaction({
      title,
      amount,
      category,
      type
    })

    setTitle('');
    setAmount(0);
    setCategory('');
    setType('deposit');
    onRequestClose();
  }

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button 
        type="button" 
        onClick={onRequestClose}
        className="react-modal-close"  
      >
        <img src={closeImg} alt="Close modal" />
      </button>

      <Container onSubmit={handleCreateNewTransaction}>
        <h2>Register new transaction</h2>
        <input 
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))} 
          placeholder="Value" 
        />

        <TransactionTypeContainer>
          <RadioBox 
            type="button"
            onClick={() => setType('deposit')}
            isActive={type === 'deposit'}
            activeColor="green"
          >
            <img src={incomeImg} alt="Income" />
            <span>Entry</span>
          </RadioBox>  
        
          <RadioBox 
            type="button"
            onClick={() => setType('withdrawal')}
            isActive={type === 'withdrawal'}
            activeColor="red"
          >
              <img src={outcomeImg} alt="Outcome" />
              <span>Withdrawal</span>
          </RadioBox>  
        </TransactionTypeContainer>

        <input
          value={category}
          onChange={e => setCategory(e.target.value)} 
          placeholder="Category" 
        />

        <button type="submit">
          Register
        </button>
      </Container>
    </Modal>
  )
}