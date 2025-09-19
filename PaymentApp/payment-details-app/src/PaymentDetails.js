import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = "https://localhost:7091/api/PaymentDetails"; 

function PaymentDetails() {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [form, setForm] = useState({
    cardOwnerName: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(apiUrl);
      setPaymentDetails(res.data);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setError('Failed to connect to the server. Please make sure your API server is running on https://localhost:7091');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, { paymentDetailId: editingId, ...form });
      } else {
        await axios.post(apiUrl, form);
      }
      setForm({ cardOwnerName: '', cardNumber: '', expirationDate: '', securityCode: '' });
      setEditingId(null);
      fetchPaymentDetails();
    } catch (error) {
      console.error('Error saving payment details:', error);
      setError('Failed to save payment details. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = detail => {
    setForm({
      cardOwnerName: detail.cardOwnerName,
      cardNumber: detail.cardNumber,
      expirationDate: detail.expirationDate,
      securityCode: detail.securityCode
    });
    setEditingId(detail.paymentDetailId);
  };

  const handleDelete = async id => {
    try {
      setError(null);
      await axios.delete(`${apiUrl}/${id}`);
      fetchPaymentDetails();
    } catch (error) {
      console.error('Error deleting payment details:', error);
      setError('Failed to delete payment details. Please check your connection and try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                <i className="fas fa-credit-card me-2"></i>
                Payment Details Management
              </h2>
            </div>
            <div className="card-body">
              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="text-center mb-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardOwnerName" className="form-label">Card Owner Name</label>
                    <input
                      id="cardOwnerName"
                      name="cardOwnerName"
                      type="text"
                      className="form-control"
                      placeholder="Enter card owner name"
                      value={form.cardOwnerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                    <input
                      id="expirationDate"
                      name="expirationDate"
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      value={form.expirationDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="securityCode" className="form-label">Security Code</label>
                    <input
                      id="securityCode"
                      name="securityCode"
                      type="text"
                      className="form-control"
                      placeholder="CVV"
                      value={form.securityCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {editingId ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas ${editingId ? 'fa-edit' : 'fa-plus'} me-1`}></i>
                        {editingId ? 'Update Payment' : 'Add Payment'}
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setForm({ cardOwnerName: '', cardNumber: '', expirationDate: '', securityCode: '' });
                      }}
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0">Saved Payment Details</h3>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={fetchPaymentDetails}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh
                  </button>
                </div>
                {error && paymentDetails.length === 0 ? (
                  <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Unable to load payment details. Please check if your API server is running.
                    <br />
                    <button 
                      className="btn btn-primary btn-sm mt-2"
                      onClick={fetchPaymentDetails}
                    >
                      <i className="fas fa-redo me-1"></i>
                      Try Again
                    </button>
                  </div>
                ) : paymentDetails.length === 0 ? (
                  <div className="alert alert-info text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    No payment details found. Add your first payment method above.
                  </div>
                ) : (
                  <div className="row">
                    {paymentDetails.map(detail => (
                      <div key={detail.paymentDetailId} className="col-md-6 mb-3">
                        <div className="card border-left-primary h-100">
                          <div className="card-body">
                            <h5 className="card-title text-primary">
                              <i className="fas fa-credit-card me-2"></i>
                              {detail.cardOwnerName}
                            </h5>
                            <p className="card-text">
                              <strong>Card Number:</strong> **** **** **** {detail.cardNumber.slice(-4)}<br/>
                              <strong>Expires:</strong> {detail.expirationDate}<br/>
                              <strong>CVV:</strong> ***
                            </p>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleEdit(detail)}
                              >
                                <i className="fas fa-edit me-1"></i>
                                Edit
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(detail.paymentDetailId)}
                              >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;