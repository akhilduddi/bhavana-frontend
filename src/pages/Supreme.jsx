import React, { useEffect, useState } from 'react';

const Supreme = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callingId, setCallingId] = useState(null);
  const [groupCalling, setGroupCalling] = useState(false);
  const [callMsg, setCallMsg] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/contacts', { headers: { Accept: 'application/json' } });
        if (!res.ok) {
          let msg = `Request failed (${res.status})`;
          try {
            const data = await res.json();
            msg = data?.message || msg;
          } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleCall = async (id) => {
    setCallingId(id);
    setCallMsg('');
    try {
      let res = await fetch(`/api/call-one/${id}`, { method: 'POST' });
      if (!res.ok) {
        let msg = `Call request failed (${res.status})`;
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      setCallMsg('Call initiated successfully.');
    } catch (err) {
      setCallMsg(err?.message || 'Unable to initiate call.');
    } finally {
      setCallingId(null);
    }
  };

  const handleGroupCall = async () => {
    setGroupCalling(true);
    setCallMsg('');
    try {
      const res = await fetch('/api/call-all', { method: 'POST' });
      if (!res.ok) {
        let msg = `Group call request failed (${res.status})`;
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      setCallMsg('Group call initiated successfully.');
    } catch (err) {
      setCallMsg(err?.message || 'Unable to initiate group call.');
    } finally {
      setGroupCalling(false);
    }
  };

  return (
    <div className="supreme-container" style={{ background: '#ffffff', minHeight: '60vh', padding: '24px 0' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Contacts</h2>
          <button
            onClick={handleGroupCall}
            disabled={groupCalling || contacts.length === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 8,
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)',
              cursor: groupCalling ? 'not-allowed' : 'pointer'
            }}
            aria-label="Make group call"
          >
            <i className="fa-solid fa-users" aria-hidden="true"></i>
            <span>{groupCalling ? 'Calling...' : 'Group Call'}</span>
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {callMsg && <p style={{ color: '#065f46', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 10px', borderRadius: 8 }}>{callMsg}</p>}

        {!loading && !error && (
          contacts.length === 0 ? (
            <p>No contacts found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #edf2f7' }}>{c.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #edf2f7' }}>{c.name}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #edf2f7' }}>{c.phone_number}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #edf2f7' }}>
                        <button
                          onClick={() => handleCall(c.id)}
                          disabled={callingId === c.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: '#16a34a',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: 8,
                            boxShadow: '0 6px 16px rgba(22,163,74,0.25)',
                            cursor: callingId === c.id ? 'not-allowed' : 'pointer'
                          }}
                          aria-label={`Call ${c.name}`}
                        >
                          <i className="fa-solid fa-phone" aria-hidden="true"></i>
                          <span>{callingId === c.id ? 'Calling...' : 'Call'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Supreme;
