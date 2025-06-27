import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordContext = createContext();

export const useResetPassword = () => {
  const context = useContext(ResetPasswordContext);
  if (!context) {
    throw new Error('useResetPassword must be used within a ResetPasswordProvider');
  }
  return context;
};

export const ResetPasswordProvider = ({ children }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  const value = {
    email,
    setEmail,
    resetRequested,
    setResetRequested,
    resetCompleted,
    setResetCompleted,
    navigate
  };

  return (
    <ResetPasswordContext.Provider value={value}>
      {children}
    </ResetPasswordContext.Provider>
  );
}; 