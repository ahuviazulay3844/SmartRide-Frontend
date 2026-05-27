
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FleetManagement from './FleetManagement';
import UserManagement from './UserManagement';
import OrderLogs from './OrderLogs';
import '../Style/AdminDashboard.css';

const AdminDashboard = () => {
    // זכירת העמוד הנוכחי בתוך הצד מנהל גם אחרי ריענון
    const [view, setView] = useState(localStorage.getItem('adminView') || 'stats');
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        // שמירת הסטטוס ב-localStorage בכל שינוי עמוד
        localStorage.setItem('adminView', view);
    }, [view]);

    // הגנה קריטית: אם המשתמש לא מנהל - הוא לא יכול להיות פה
    useEffect(() => {
        const user = currentUser || JSON.parse(localStorage.getItem('user'));
        const isAdmin = user?.userType === 1 || user?.userType === 'admin';
        
        if (!isAdmin) {
            navigate('/'); // אם הוא לא מנהל, נזרק לעמוד הראשי
        }
    }, [currentUser, navigate]);

    const changeView = (newView) => setView(newView);

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="sidebar-header">CITY CAR ADMIN</div>
                <nav>
                    <button className={view === 'stats' ? 'active' : ''} onClick={() => changeView('stats')}>📊 סקירה כללית</button>
                    <button className={view === 'fleet' ? 'active' : ''} onClick={() => changeView('fleet')}>🚗 צי רכבים</button>
                    <button className={view === 'users' ? 'active' : ''} onClick={() => changeView('users')}>👥 משתמשים</button>
                    <button className={view === 'orders' ? 'active' : ''} onClick={() => changeView('orders')}>📅 נסיעות</button>
                    
                    <button className="exit-site-btn" onClick={() => {
                        localStorage.removeItem('adminView'); // ניקוי הזיכרון ביציאה
                        navigate('/');
                    }}>⬅️ חזרה לאתר</button>
                </nav>
            </aside>

            <main className="admin-main-content">
                <header className="admin-top-bar">
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        {view !== 'stats' && <button className="back-nav-btn" onClick={() => setView('stats')}>➡️</button>}
                        <h2>{view === 'stats' ? 'לוח בקרה' : 'ניהול מערכת'}</h2>
                    </div>
                    <div className="admin-user-info">מנהל מערכת: {currentUser?.firstName}</div>
                </header>

                <div className="view-container">
                    {view === 'stats' && (
                        <div className="category-grid">
                            <div className="category-card" onClick={() => setView('fleet')}>
                                <h4>🚗 ניהול צי</h4>
                                <p>טיפול ברכבי NeedsMaintenance</p>
                            </div>
                            <div className="category-card" onClick={() => setView('orders')}>
                                <h4>📅 יומן נסיעות</h4>
                                <p>גביית חובות ואיחורים</p>
                            </div>
                            <div className="category-card" onClick={() => setView('users')}>
                                <h4>👥 ניהול קהילה</h4>
                                <p>חסימות וצפייה ביתרות</p>
                            </div>
                        </div>
                    )}
                    {view === 'fleet' && <FleetManagement />}
                    {view === 'users' && <UserManagement />}
                    {view === 'orders' && <OrderLogs />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;