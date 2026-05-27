

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
