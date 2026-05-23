// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate } from 'react-router-dom';
// import { useGetCurrentUserQuery } from '../../User/redux/userApi.jsx';
// import { setUser } from '../../User/redux/userSlice.jsx';
// import FleetManagement from './FleetManagement';
// import UserManagement from './UserManagement';
// import OrderLogs from './OrderLogs';
// import '../Style/AdminDashboard.css';

// const AdminDashboard = () => {
//     const [view, setView] = useState('stats');
//     const dispatch = useDispatch();
//     const { currentUser } = useSelector((state) => state.user);
//     const token = localStorage.getItem('token');

//     const { data: serverUser, isLoading: isUserLoading } = useGetCurrentUserQuery(undefined, {
//         skip: !token || !!currentUser,
//     });

//     useEffect(() => {
//         if (serverUser && !currentUser) {
//             dispatch(setUser(serverUser));
//         }
//     }, [serverUser, currentUser, dispatch]);

//     if (!token && !currentUser) {
//         return <Navigate to="/" replace />;
//     }

//     if (isUserLoading && !currentUser) {
//         return <div className="admin-loading">טוען אישור מנהל...</div>;
//     }

//     if (currentUser && currentUser.userType !== 1 && currentUser.userType !== 'Admin') {
//         return <Navigate to="/" replace />;
//     }

//     return (
//         <div className="admin-wrapper">
//             {/* תפריט צד (Sidebar) */}
//             <aside className="admin-sidebar">
//                 <div className="sidebar-header">ניהול סיטי קאר</div>
//                 <nav>
//                     <button 
//                         className={view === 'stats' ? 'active' : ''} 
//                         onClick={() => setView('stats')}
//                     >
//                         📊 סקירה כללית
//                     </button>
//                     <button 
//                         className={view === 'fleet' ? 'active' : ''} 
//                         onClick={() => setView('fleet')}
//                     >
//                         🚗 ניהול צי רכבים
//                     </button>
//                     <button 
//                         className={view === 'users' ? 'active' : ''} 
//                         onClick={() => setView('users')}
//                     >
//                         👥 ניהול משתמשים
//                     </button>
//                     <button 
//                         className={view === 'orders' ? 'active' : ''} 
//                         onClick={() => setView('orders')}
//                     >
//                         📅 יומן הזמנות
//                     </button>
//                 </nav>
//             </aside>

//             {/* תוכן ראשי משתנה */}
//             <main className="admin-main-content">
//                 <header className="admin-top-bar">
//                     <h2>{
//                         view === 'stats' ? 'לוח בקרה' : 
//                         view === 'fleet' ? 'ניהול רכבים' : 
//                         view === 'users' ? 'ניהול משתמשים' : 'יומן הזמנות'
//                     }</h2>
//                     <div className="admin-user-info">
//                         שלום, {currentUser.firstName}
//                     </div>
//                 </header>

//                 <div className="view-container">
//                     {view === 'stats' && <StatsOverview onSelect={(selected) => setView(selected)} />}
//                     {view === 'fleet' && <FleetManagement />}
//                     {view === 'users' && <UserManagement />}
//                     {view === 'orders' && <OrderLogs />}
//                 </div>
//             </main>
//         </div>
//     );
// };

// // קומפוננטה לסטטיסטיקות מהירות
// const StatsOverview = ({ onSelect }) => (
//     <>
//         <div className="category-grid">
//             <div className="category-card" onClick={() => onSelect('fleet')}>
//                 <h4>🚗 ניהול צי רכבים</h4>
//                 <p>ניהול סטטוסים, תחזוקה ונעילות מכל מקום.</p>
//             </div>
//             <div className="category-card" onClick={() => onSelect('orders')}>
//                 <h4>📅 ניהול הזמנות</h4>
//                 <p>סינון לפי איחורים, תשלום, סטטוס ומידע לקוח.</p>
//             </div>
//             <div className="category-card" onClick={() => onSelect('users')}>
//                 <h4>👥 ניהול משתמשים</h4>
//                 <p>חסימה, שחרור וחיפוש משתמשים בזמן אמת.</p>
//             </div>
//         </div>

//         <div className="stats-grid">
//             <div className="stat-card">
//                 <h4>רכבים פעילים</h4>
//                 <p>24</p>
//             </div>
//             <div className="stat-card yellow">
//                 <h4>בתיקון</h4>
//                 <p>3</p>
//             </div>
//             <div className="stat-card green">
//                 <h4>הזמנות להיום</h4>
//                 <p>15</p>
//             </div>
//             <div className="stat-card orange">
//                 <h4>משתמשים חסומים</h4>
//                 <p>2</p>
//             </div>
//         </div>
//     </>
// );

// export default AdminDashboard;
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// import FleetManagement from './FleetManagement';
// import UserManagement from './UserManagement';
// import OrderLogs from './OrderLogs';

// import '../Style/AdminDashboard.css';

// const StatsOverview = ({ onSelect }) => {
//     return (
//         <div className="category-grid">

//             <div className="category-card" onClick={() => onSelect('fleet')}>
//                 <h4>🚗 ניהול צי רכבים</h4>
//                 <p>נעילה, מוסך, דלק וסטטוס רכבים</p>
//             </div>

//             <div className="category-card" onClick={() => onSelect('users')}>
//                 <h4>👥 ניהול משתמשים</h4>
//                 <p>חסימות, מחיקות ויתרות</p>
//             </div>

//             <div className="category-card" onClick={() => onSelect('orders')}>
//                 <h4>📅 הזמנות וגבייה</h4>
//                 <p>מעקב תשלומים וקנסות</p>
//             </div>

//         </div>
//     );
// };

// const AdminDashboard = () => {

//     const [view, setView] = useState('stats');

//     const { currentUser } = useSelector((state) => state.user);

//     const navigate = useNavigate();

//     useEffect(() => {

//         if (
//             !currentUser ||
//             (
//                 currentUser.userType !== 1 &&
//                 currentUser.userType !== 'admin'
//             )
//         ) {
//             navigate('/');
//         }

//     }, [currentUser, navigate]);

//     return (
//         <div className="admin-wrapper">

//             <aside className="admin-sidebar">

//                 <div className="sidebar-header">
//                     CITY CAR
//                 </div>

//                 <nav>

//                     <button
//                         className={view === 'stats' ? 'active' : ''}
//                         onClick={() => setView('stats')}
//                     >
//                         📊 סקירה
//                     </button>

//                     <button
//                         className={view === 'fleet' ? 'active' : ''}
//                         onClick={() => setView('fleet')}
//                     >
//                         🚗 רכבים
//                     </button>

//                     <button
//                         className={view === 'users' ? 'active' : ''}
//                         onClick={() => setView('users')}
//                     >
//                         👥 לקוחות
//                     </button>

//                     <button
//                         className={view === 'orders' ? 'active' : ''}
//                         onClick={() => setView('orders')}
//                     >
//                         📅 נסיעות
//                     </button>

//                     <button
//                         className="exit-site-btn"
//                         onClick={() => navigate('/')}
//                     >
//                         ⬅️ חזרה לאתר
//                     </button>

//                 </nav>

//             </aside>

//             <main className="admin-main-content">

//                 <header className="admin-top-bar">

//                     <div
//                         style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '15px'
//                         }}
//                     >

//                         {
//                             view !== 'stats' &&
//                             (
//                                 <button
//                                     className="back-nav-btn"
//                                     onClick={() => setView('stats')}
//                                 >
//                                     ➡️
//                                 </button>
//                             )
//                         }

//                         <h2>
//                             {
//                                 view === 'stats'
//                                     ? 'לוח בקרה'
//                                     : 'ניהול מערכת'
//                             }
//                         </h2>

//                     </div>

//                     <div className="admin-user-info">
//                         שלום, {currentUser?.firstName || 'מנהל'} (ADMIN)
//                     </div>

//                 </header>

//                 <div className="view-container">

//                     {view === 'stats' && <StatsOverview onSelect={setView} />}

//                     {view === 'fleet' && <FleetManagement />}

//                     {view === 'users' && <UserManagement />}

//                     {view === 'orders' && <OrderLogs />}

//                 </div>

//             </main>

//         </div>
//     );
// };

// export default AdminDashboard;
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