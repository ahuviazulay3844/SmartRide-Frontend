// import React, { useMemo, useState } from 'react';
// import { useGetAllOrdersQuery, useCancelOrderMutation, useMarkAsPaidMutation } from '../../Order/redux/orderApi.jsx';
// import '../Style/AdminDashboard.css';

// const OrderLogs = () => {
//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [delayFilter, setDelayFilter] = useState('all');

//     const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();
//     const [markAsPaid] = useMarkAsPaidMutation();
//     const [cancelOrder] = useCancelOrderMutation();

//     const normalizedSearch = search.trim().toLowerCase();

//     const filteredOrders = useMemo(() => {
//         return orders.filter((order) => {
//             const text = [
//                 order.id?.toString(),
//                 order.userEmail,
//                 order.carPlateNumber,
//                 order.userName,
//                 order.status,
//             ]
//                 .filter(Boolean)
//                 .join(' ')
//                 .toLowerCase();

//             if (normalizedSearch && !text.includes(normalizedSearch)) {
//                 return false;
//             }

//             if (statusFilter === 'paid' && !order.isPaid) return false;
//             if (statusFilter === 'pending' && order.isPaid) return false;

//             const lateMinutes = order.delayMinutes || 0;
//             const isDelayed = order.isDelayed || lateMinutes > 0 || (
//                 order.actualReturnTime && order.expectedReturnTime &&
//                 new Date(order.actualReturnTime) > new Date(order.expectedReturnTime)
//             );

//             if (delayFilter === 'delayed' && !isDelayed) return false;
//             if (delayFilter === 'on-time' && isDelayed) return false;
//             if (delayFilter === 'over-hour' && lateMinutes < 60) return false;

//             return true;
//         });
//     }, [orders, normalizedSearch, statusFilter, delayFilter]);

//     if (isLoading) return <div className="admin-loading">טוען יומן הזמנות...</div>;
//     if (isError) return <div className="admin-error">שגיאה בטעינת ההזמנות.</div>;

//     return (
//         <div className="admin-section">
//             <div className="order-header-bar">
//                 <div>
//                     <h3>יומן הזמנות מנהל</h3>
//                     <p>סינון מהיר לפי תשלום, איחור, לקוח ולוחית רכב.</p>
//                 </div>
//                 <div className="order-summary">
//                     <span>{filteredOrders.length} הזמנות</span>
//                     <span>{orders.length} בסך הכל</span>
//                 </div>
//             </div>

//             <div className="order-filters">
//                 <input
//                     type="text"
//                     placeholder="חיפוש לפי מספר, דוא', לוחית או סטטוס"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />

//                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//                     <option value="all">הכל</option>
//                     <option value="paid">שולם</option>
//                     <option value="pending">ממתין לתשלום</option>
//                 </select>

//                 <select value={delayFilter} onChange={(e) => setDelayFilter(e.target.value)}>
//                     <option value="all">כל ההזמנות</option>
//                     <option value="delayed">איחור</option>
//                     <option value="over-hour">איחור גדול מעל שעה</option>
//                     <option value="on-time">בזמן</option>
//                 </select>
//             </div>

//             <table className="admin-table admin-table-purple">
//                 <thead>
//                     <tr>
//                         <th>מס' הזמנה</th>
//                         <th>לקוח</th>
//                         <th>רכב</th>
//                         <th>דלק</th>
//                         <th>סטטוס</th>
//                         <th>תשלום</th>
//                         <th>איחור</th>
//                         <th>פעולות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredOrders.map((order) => {
//                         const isDelayed = order.isDelayed || order.delayMinutes > 0 || (
//                             order.actualReturnTime && order.expectedReturnTime &&
//                             new Date(order.actualReturnTime) > new Date(order.expectedReturnTime)
//                         );

//                         return (
//                             <tr key={order.id}>
//                                 <td>#{order.id}</td>
//                                         <td>{order.userEmail || order.userName || 'לקוח לא ידוע'}</td>
//                                 <td>{order.carPlateNumber || order.carName || 'רכב לא ידוע'}</td>
//                                 <td>
//                                     <span className={`status-badge ${order.fuelLevel >= 40 ? 'available' : order.fuelLevel >= 15 ? 'status-warning' : 'repair'}`}>
//                                         {order.fuelLevel !== undefined ? `${order.fuelLevel}%` : (order.fuelTime !== undefined ? `${order.fuelTime} ליטר` : '--')}
//                                     </span>
//                                 </td>
//                                 <td>{order.status || (order.isPaid ? 'הושלם' : 'פעיל')}</td>
//                                 <td>
//                                     <span className={`status-badge ${order.isPaid ? 'available' : 'repair'}`}>
//                                         {order.isPaid ? 'שולם' : 'ממתין'}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <span className={`status-badge ${isDelayed ? 'repair' : 'available'}`}>
//                                         {isDelayed ? '⏳ באיחור' : '✔️ בזמן'}
//                                     </span>
//                                 </td>
//                                 <td className="action-buttons">
//                                     {!order.isPaid && (
//                                         <button
//                                             className="btn-action btn-small"
//                                             onClick={() => markAsPaid(order.id)}
//                                         >
//                                             סמן ששולם
//                                         </button>
//                                     )}
//                                     <button
//                                         className="btn-delete btn-small"
//                                         onClick={() => cancelOrder(order.id)}
//                                     >
//                                         ביטול
//                                     </button>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             {!filteredOrders.length && (
//                 <div className="admin-empty-state">לא נמצאו הזמנות לפי המסננים.</div>
//             )}
//         </div>
//     );
// };

// export default OrderLogs;
import React, { useMemo, useState } from 'react';

import {
    useGetAllOrdersQuery,
    useMarkAsPaidMutation,
    useCancelOrderMutation
} from '../../Order/redux/orderApi';

import '../Style/OrderLogs.css';

const OrderLogs = () => {

    const [search, setSearch] = useState('');

    const [statusFilter, setStatusFilter] =
        useState('all');

    const {
        data: orders = [],
        isLoading
    } = useGetAllOrdersQuery();

    const [markAsPaid] =
        useMarkAsPaidMutation();

    const [cancelOrder] =
        useCancelOrderMutation();

    const filteredOrders = useMemo(() => {

        return orders.filter(order => {

            const text =
                `${order.id} ${order.userFullName} ${order.carModel}`
                    .toLowerCase();

            const match =
                text.includes(search.toLowerCase());

            const isPaid =
                order?.isPaid ??
                order?.IsPaid ??
                false;

            if (statusFilter === 'paid') {
                return match && isPaid;
            }

            if (statusFilter === 'unpaid') {
                return match && !isPaid;
            }

            return match;

        });

    }, [orders, search, statusFilter]);

    if (isLoading) {
        return <div className="admin-loading">טוען הזמנות...</div>;
    }

    return (
        <div className="admin-section">

            <div className="page-hero-bar">
                <h3>הזמנות ותשלומים</h3>
            </div>

            <div className="order-filters">

                <input
                    type="text"
                    placeholder="חיפוש..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">הכל</option>
                    <option value="paid">שולמו</option>
                    <option value="unpaid">לא שולמו</option>
                </select>

            </div>

            <table className="admin-table admin-table-purple">

                <thead>
                    <tr>
                        <th>#</th>
                        <th>לקוח</th>
                        <th>רכב</th>
                        <th>סה"כ</th>
                        <th>תשלום</th>
                        <th>איחור</th>
                        <th>פעולות</th>
                    </tr>
                </thead>

                <tbody>

                    {
                        filteredOrders.map(order => {

                            const isPaid =
                                order?.isPaid ??
                                order?.IsPaid ??
                                false;

                            return (
                                <tr key={order.id}>

                                    <td>{order.id}</td>

                                    <td>{order.userFullName}</td>

                                    <td>{order.carModel}</td>

                                    <td>
                                        ₪
                                        {
                                            Math.round(
                                                order?.totalPrice ??
                                                order?.TotalPrice ??
                                                0
                                            )
                                        }
                                    </td>

                                    <td>

                                        <span
                                            className={`status-badge ${
                                                isPaid
                                                    ? 'available'
                                                    : 'repair'
                                            }`}
                                        >
                                            {
                                                isPaid
                                                    ? '✅ שולם'
                                                    : '⏳ פתוח'
                                            }
                                        </span>

                                    </td>

                                    <td>

                                        ₪
                                        {
                                            Math.round(
                                                order?.lateFee ??
                                                order?.LateFee ??
                                                0
                                            )
                                        }

                                    </td>

                                    <td>

                                        {
                                            !isPaid &&
                                            (
                                                <button
                                                    className="btn-action"
                                                    onClick={() => markAsPaid(order.id)}
                                                >
                                                    סמן כשולם
                                                </button>
                                            )
                                        }

                                        <button
                                            className="btn-delete"
                                            onClick={() => cancelOrder(order.id)}
                                        >
                                            🗑️
                                        </button>

                                    </td>

                                </tr>
                            );
                        })
                    }

                </tbody>

            </table>

        </div>
    );
};

export default OrderLogs;
