'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import ExpenseForm from '@/components/ExpenseForm';
import { addTransaction, createPaymentOrder, verifyPayment } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
};

export default function AddExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('10.00');

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await addTransaction(data);
      toast.success('Transaction added successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const paypalCreateOrder = async (data, actions) => {
    try {
      const res = await createPaymentOrder(paymentAmount, 'USD');
      return res.data.orderId;
    } catch (err) {
      toast.error('Could not initiate PayPal checkout');
      return null;
    }
  };

  const paypalOnApprove = async (data, actions) => {
    try {
      await verifyPayment({
        orderID: data.orderID,
        transactionData: {
          amount: Number(paymentAmount),
          category: 'Payment',
          type: 'income',
          userId: 'user_default',
          note: `PayPal payment: ${data.orderID}`,
        },
      });
      toast.success('Payment successful! Added to balance.');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Payment verification failed');
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
      <Sidebar />

      <main className="dashboard-main" style={{
        marginLeft: 240,
        paddingTop: 64,
        minHeight: '100vh',
      }}>
        <PageTransition>
          <div style={{ padding: '32px 28px', maxWidth: 600 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>Add Transaction</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                Record a new income or expense transaction.
              </p>
            </div>

            <ExpenseForm onSubmit={handleSubmit} loading={loading} />

            {/* PayPal Payment Section */}
            <div className="glass-card" style={{
              padding: 24,
              marginTop: 20,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.04))',
            }}>
              <span style={{ fontSize: 32 }}>💳</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 8, marginBottom: 6 }}>
                Add Funds to Wallet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Securely deposit funds via PayPal
              </p>
              
              <div style={{ marginBottom: 16 }}>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="input-field"
                  style={{ width: '150px', display: 'inline-block' }}
                  min="1"
                  step="0.01"
                  placeholder="Amount (USD)"
                />
              </div>

              {Number(paymentAmount) > 0 ? (
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                  <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons 
                          createOrder={paypalCreateOrder}
                          onApprove={paypalOnApprove}
                          style={{ layout: "horizontal", color: "blue", shape: "rect", height: 40 }}
                      />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--color-danger)' }}>Enter a valid amount to pay.</p>
              )}
            </div>
          </div>
        </PageTransition>
      </main>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
      </div>
    </ProtectedRoute>
  );
}
