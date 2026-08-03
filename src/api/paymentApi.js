import api from './client'

const paymentApi = {
  createOrder: (payload) => api.post('/payments/create-order', payload).then(r => r.data.data),
  verifyPayment: (payload) => api.post('/payments/verify', payload).then(r => r.data.data),
  recordFailure: (payload) => api.post('/payments/failure', payload).then(r => r.data),
}

export default paymentApi
