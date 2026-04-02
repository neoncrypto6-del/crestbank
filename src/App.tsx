import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { EnrollPage } from './pages/EnrollPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransferPage, TransferBankPage } from './pages/TransferPage';
import { TransferCryptoPage } from './pages/TransferCryptoPage';
import { DepositPage } from './pages/DepositPage';
import { DepositCryptoPage, DepositBankPage } from './pages/DepositSubPages';
import { DepositGiftCardPage } from './pages/DepositGiftCardPage';
import { DepositCashAppPage } from './pages/DepositCashAppPage';
import { CardsPage } from './pages/CardsPage';
import { LoanPage } from './pages/LoanPage';
import { InvestPage } from './pages/InvestPage';
import { BillsPage } from './pages/BillsPage';
import { StatementPage } from './pages/StatementPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { VerificationPage } from './pages/VerificationPage';
import { NextOfKinPage } from './pages/NextOfKinPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { CreatePinPage } from './pages/CreatePinPage';
import { FeaturePage } from './pages/FeaturePage';
// Simple Protected Route Wrapper
function ProtectedRoute({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  if (!user) {
    window.location.hash = '#/signin';
    return null;
  }
  return <>{children}</>;
}
function Router() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  // Public Routes
  if (hash === '#/') return <LandingPage />;
  if (hash === '#/signin') return <SignInPage />;
  if (hash === '#/enroll') return <EnrollPage />;
  if (hash.startsWith('#/feature/')) return <FeaturePage />;
  // Protected Routes
  return (
    <ProtectedRoute>
      {hash === '#/dashboard' && <DashboardPage />}
      {hash === '#/transfer' && <TransferPage />}
      {hash === '#/transfer/bank' && <TransferBankPage />}
      {hash === '#/transfer/crypto' && <TransferCryptoPage />}
      {hash === '#/deposit' && <DepositPage />}
      {hash === '#/deposit/bank' && <DepositBankPage />}
      {hash === '#/deposit/crypto' && <DepositCryptoPage />}
      {hash === '#/deposit/gift-card' && <DepositGiftCardPage />}
      {hash === '#/deposit/cashapp' && <DepositCashAppPage />}
      {hash === '#/cards' && <CardsPage />}
      {hash === '#/loan' && <LoanPage />}
      {hash === '#/invest' && <InvestPage />}
      {hash === '#/bills' && <BillsPage />}
      {hash === '#/statement' && <StatementPage />}
      {hash === '#/transactions' && <TransactionHistoryPage />}
      {hash === '#/settings' && <SettingsPage />}
      {hash === '#/settings/profile' && <ProfilePage />}
      {hash === '#/settings/verification' && <VerificationPage />}
      {hash === '#/settings/next-of-kin' && <NextOfKinPage />}
      {hash === '#/settings/change-password' && <ChangePasswordPage />}
      {hash === '#/settings/create-pin' && <CreatePinPage />}
    </ProtectedRoute>);

}
export function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>);

}