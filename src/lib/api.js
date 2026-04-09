const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const USER_ID = 'user_default';

export { USER_ID };

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if in browser
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export async function getTransactions() {
  return fetchAPI(`/transactions`);
}

export async function addTransaction(transaction) {
  return fetchAPI('/transactions/add', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(id) {
  return fetchAPI(`/transactions/${id}`, { method: 'DELETE' });
}

export async function getAnalytics() {
  return fetchAPI(`/analytics`);
}

export async function getAIAdvice(transactions, monthlyTotal) {
  return fetchAPI('/ai/advice', {
    method: 'POST',
    body: JSON.stringify({ transactions, monthlyTotal }),
  });
}

export async function createPaymentOrder(amount, currency = 'USD') {
  return fetchAPI('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount, currency }),
  });
}

export async function verifyPayment(paymentData) {
  return fetchAPI('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
}

export const authAPI = {
  login: async (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (name, email, password) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }
};
