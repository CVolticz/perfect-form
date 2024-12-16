// system level import
import React from 'react';
import { Alert } from 'reactstrap';

// Error Component Interfect
interface ErrorMessageProps {
    children: any
}

const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <Alert color="danger" fade={false} data-testid="error">
    {children}
  </Alert>
);

export default ErrorMessage;
