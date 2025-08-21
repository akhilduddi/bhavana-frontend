import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (value) => {
    if (!value) return '';
    // Keep a leading + if provided; otherwise strip to digits
    const hasPlus = value.trim().startsWith('+');
    const digits = value.replace(/\D/g, '');

    // If already in +91XXXXXXXXXX or +XXXXXXXXXX form
    if (hasPlus) {
      // Ensure only one leading +
      return `+${digits}`;
    }

    // If user typed a 10-digit Indian mobile number, prepend +91
    if (digits.length === 10) {
      return `+91${digits}`;
    }

    // If starts with 91 and total 12 digits, add +
    if (digits.startsWith('91') && digits.length === 12) {
      return `+${digits}`;
    }

    // Fallback: prefix + to whatever digits present
    return digits ? `+${digits}` : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });
    try {
      const formatted = normalizePhone(form.phone);
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // Backend expects { name, phone_number }
        body: JSON.stringify({ name: form.name, phone_number: formatted }),
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const data = await res.json();
          msg = data?.message || JSON.stringify(data) || msg;
        } catch {}
        throw new Error(msg);
      }

      setFeedback({ type: 'success', text: 'Contact added successfully.' });
      setForm({ name: '', phone: '' });
    } catch (err) {
      setFeedback({ type: 'error', text: err?.message || 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="container">
        <header className="page-header">
          <h1>Add your number into our database</h1>
          <p>Add a new contact</p>
        </header>

        <section className="admin-info" aria-label="Calling interface information">
          <div className="info-icon">
            <i className="fa-solid fa-phone-volume" aria-hidden="true"></i>
          </div>
          <div className="info-text">
            <h2>Calling Interface</h2>
            <p>
              this is calling interface in this we all multiple number of people at a time this will save your time  and work more effective
            </p>
          </div>
        </section>

        {/* Add contact form - shown before feature highlights */}
        <section className="admin-sections">
          <div className="admin-form-card">
            <h3 className="section-title">Add Single Contact</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number (e.g., 9550992307)"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {feedback.text && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {feedback.text}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary with-icon" disabled={submitting}>
                  <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                  <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="admin-features" aria-label="Product features">
          <h3 className="section-title">Built for church-wide communication</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fa-solid fa-users"></i>
              <h4>Call everyone at once</h4>
              <p>Reach your entire community in one click. No manual dialing.</p>
            </div>
            <div className="feature-card">
              <i className="fa-solid fa-clock"></i>
              <h4>Saves time</h4>
              <p>Automated calling saves hours every week and avoids repetitive work.</p>
            </div>
            <div className="feature-card">
              <i className="fa-solid fa-calendar-check"></i>
              <h4>Schedule calls</h4>
              <p>Pick date and time for announcements, reminders, and event invites.</p>
            </div>
            <div className="feature-card">
              <i className="fa-solid fa-file-csv"></i>
              <h4>Bulk import</h4>
              <p>Upload CSV lists to add or update numbers in seconds.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
