import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [messageType, setMessageType] = useState('text');
    const [priority, setPriority] = useState('normal');
    const [filters, setFilters] = useState({
        role: '',
        department: '',
        senderId: '',
        startDate: '',
        endDate: '',
        messageType: '',
        priority: ''
    });

    const userData = JSON.parse(localStorage.getItem("data"))?.user || {};
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const res = await api.get('/messages', {
                params: {
                    userId: userData?.id,
                    ...filters
                }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Error loading messages');
        }
    };

    const fetchAllowedUsers = async () => {
        try {
            const res = await api.get('/users/allowed', {
                params: { userId: userData.id }
            });
            setAllowedUsers(res.data);
        } catch (error) {
            console.error('Error loading user list', error);
        }
    };

    const handleSend = async () => {
        if (!newMsg.trim()) return;
        if (!selectedUserId.trim()) return alert("Please select the Recipient!");

        try {
            await api.post('/messages', {
                senderId: userData.id,
                receiverId: selectedUserId,
                message: newMsg,
                department: userData.department,
                messageType: messageType,
                priority: priority
            });
            setNewMsg('');
            setSelectedUserId('');
            setMessageType('');
            setPriority('');
            fetchMessages();
        } catch (error) {
            alert('Send failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    function resetForm() {
        setFilters({
            role: '',
            department: '',
            senderId: '',
            startDate: '',
            endDate: '',
            messageType: '',
            priority: ''
        });
    }
    useEffect(() => {
        fetchMessages();
        fetchAllowedUsers();
    }, []);

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <div style={styles.userCard}>
                    <div style={styles.userName}>{userData.name}</div>
                    <div style={styles.userDetail}>{userData.role}</div>
                    <div style={styles.userDetail}>{userData.department}</div>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            <h2 style={styles.heading}>📨 Department Messages</h2>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={styles.select}
                >
                    <option value="">-- Select Recipient --</option>
                    {allowedUsers.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>
                <select value={messageType} onChange={(e) => setMessageType(e.target.value)} style={styles.select}>
                    <option value="text">Text</option>
                    <option value="task">Task</option>
                    <option value="notice">Notice</option>
                    <option value="alert">Alert</option>
                </select>

                <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                <button onClick={handleSend} style={styles.sendBtn}>Send</button>
            </div>
            <div style={styles.filtersContainer}>
                <select style={styles.select} onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}>
                    <option value="">Role</option>
                    <option value="Head">Head</option>
                    <option value="Manager">Manager</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Executive">Executive</option>
                    <option value="Trainee">Trainee</option>
                </select>

                <select style={styles.select} onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}>
                    <option value="">Department</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Production">Production</option>
                    <option value="Metal Yard">Metal Yard</option>
                    <option value="Quality">Quality</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="HR & Admin">HR & Admin</option>
                </select>

                <select style={styles.select} onChange={(e) => setFilters(prev => ({ ...prev, senderId: e.target.value }))}>
                    <option value="">Sender</option>
                    {allowedUsers.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <select style={styles.select} onChange={(e) => setFilters(prev => ({ ...prev, messageType: e.target.value }))}>
                    <option value="">Message Type</option>
                    <option value="text">Text</option>
                    <option value="task">Task</option>
                    <option value="notice">Notice</option>
                    <option value="alert">Alert</option>
                </select>
                <select style={styles.select} onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}>
                    <option value="">Priority</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>


                {/* <input
                    type="date"
                    style={styles.dateInput}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <input
                    type="date"
                    style={styles.dateInput}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                /> */}

                <button style={styles.filterButton} onClick={fetchMessages}>Apply</button>
                <button
                    style={styles.resetButton}
                    onClick={() => {
                        resetForm();
                        fetchMessages();
                    }}
                >Reset</button>
            </div>

            <div style={styles.messageList}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={styles.messageCard}>
                        <div style={styles.messageHeader}>
                            <div style={styles.senderReceiver}>
                                <span><strong>From:</strong> {msg.Sender?.name} ({msg.Sender?.email})</span>
                                <span><strong>To:</strong> {msg.Receiver?.name} ({msg.Receiver?.email})</span>
                            </div>
                            <div>
                                <span style={{ backgroundColor: '#e7f3ff', padding: '2px 8px', borderRadius: '6px', color: '#007bff', fontSize: '12px' }}>
                                    {msg.messageType.toUpperCase()}
                                </span>
                                {' '}
                                <span style={{
                                    backgroundColor:
                                        msg.priority === 'critical' ? '#ffe0e0' :
                                            msg.priority === 'high' ? '#fff3cd' : '#e2f7e2',
                                    color:
                                        msg.priority === 'critical' ? '#d10000' :
                                            msg.priority === 'high' ? '#856404' : '#1e7e34',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '12px'
                                }}>
                                    {msg.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div style={styles.messageContent}>
                            {msg.message}
                        </div>

                        <div style={styles.metaInfo}>
                            <span><strong>Department:</strong> {msg.department}</span>
                            <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        padding: '20px',
        maxWidth: '1026px',
        margin: '0 auto',
        fontFamily: 'Segoe UI, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        border: 'none',
        color: 'white',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    heading: {
        textAlign: 'center',
        color: '#007bff',
        marginBottom: '20px'
    },
    inputArea: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px'
    },
    input: {
        flex: 2,
        padding: '12px',
        fontSize: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        minWidth: '200px'
    },
    select: {
        flex: 1.2,
        padding: '12px',
        fontSize: '15px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        minWidth: '150px'
    },
    sendBtn: {
        flex: '0 0 auto',
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    messageList: {
        maxHeight: '500px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    messageCard: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
    },
    timestamp: {
        fontSize: '12px',
        color: '#666',
        marginTop: '6px'
    }
    , userCard: {
        backgroundColor: '#f0f4ff',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: '220px',
    },

    userName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '4px',
    },

    userDetail: {
        fontSize: '14px',
        color: '#666',
    },
    filtersContainer: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        padding: '12px',
        background: '#eef2f5',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    select: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        minWidth: '160px',
        backgroundColor: '#fff',
        color: '#333',
    },
    dateInput: {
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        minWidth: '140px',
        backgroundColor: '#fff',
        color: '#333',
    },
    filterButton: {
        padding: '10px 16px',
        borderRadius: '6px',
        backgroundColor: '#007bff',
        border: 'none',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s ease',
    },
    resetButton: {
        padding: '10px 16px',
        borderRadius: '6px',
        backgroundColor: '#6c757d',
        border: 'none',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s ease',
    },
    messageCard: {
        padding: '16px',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'transform 0.2s ease',
    },

    messageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
    },

    senderReceiver: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '13px',
        color: '#555',
    },

    messageContent: {
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#222',
        padding: '10px',
        background: '#f5f8ff',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
    },

    metaInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#888',
        marginTop: '4px'
    },


};

export default Messages;
