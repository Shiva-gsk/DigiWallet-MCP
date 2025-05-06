import * as React from 'react';

interface EmailTemplateProps {
  amount: number;
  sender: string;
  receiver: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    amount,
    sender,
    receiver,
}) => (
  <div>
    <h1>Transaction of {amount} made from {sender} to {receiver}</h1>
  </div>
);