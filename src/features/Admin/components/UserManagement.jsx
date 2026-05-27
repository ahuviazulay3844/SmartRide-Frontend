
import React, { useMemo, useState } from 'react';
import { useGetAllUsersQuery, useToggleBlockUserMutation, useDeleteUserMutation } from '../../User/redux/userApi';

const UserManagement = () => {
    const [search, setSearch] = useState('');
    const { data: users = [], isLoading } = useGetAllUsersQuery();
    const [toggleBlock] = useToggleBlockUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const filteredUsers = useMemo(() => {
        return users.filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
    }, [users, search]);

    if (isLoading) return <div className="admin-loading">טוען משתמשים...</div>;

    return (
        <div className="admin-section admin-page">
            <div className="page-hero-bar"><h3>ניהול קהילת לקוחות</h3></div>
            <div className="order-filters">
                <input type="text" placeholder="חפש לקוח..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <table className="admin-table admin-table-purple">
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>יתרה ב-SQL</th>
                        <th>סטטוס</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => {
                        const balance = user.accountBalance ?? user.AccountBalance ?? 0;
                        return (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td style={{color: balance < 0 ? '#ff7675' : '#52be80', fontWeight: 'bold'}}>
                                    ₪{Math.round(balance)}
                                </td>
                                <td>
                                    <span className={user.isBlocked ? 'status-blocked' : 'status-active'}>
                                        {user.isBlocked ? '🚫 חסום' : '✅ פעיל'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-action" onClick={() => toggleBlock(user.id)}>
                                        {user.isBlocked ? 'שחרר' : 'חסום'}
                                    </button>
                                    <button className="btn-delete" onClick={() => window.confirm('למחוק?') && deleteUser(user.id)}>🗑️</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;