import * as React from 'react';

interface EmailTemplateProps {
  sender: string;
  resetToken: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    sender,
    resetToken
}) => (
  <div>
    <h1>Password Reset Request</h1>
    <p>Hi {sender},</p>
    <p>Click the link below to reset your password:</p>
    <a href={`https://${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/reset-password/${resetToken}`}>
      Reset Password
    </a>
  </div>
);