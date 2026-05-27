
import React, { useMemo, useEffect } from 'react';
import { 
    useGetAllCarsQuery, 
    useSendToMaintenanceMutation, 
    useReleaseFromMaintenanceMutation, 
    useUpdateCarLockMutation 
} from '../../Car/redux/carApi.jsx'; 
import { Wrench, CheckCircle, Lock, Unlock, Fuel, Gauge, Loader2 } from 'lucide-react';
import '../Style/FleetManagement.css';

const FleetManagement = () => {
    // צמצום ה-Polling ל-5 שניות כדי למנוע את שגיאת ה-Timeout שקיבלת ב-C#
    const { data: cars = [], isLoading, isError, refetch } = useGetAllCarsQuery(undefined, { 
        pollingInterval: 5000,
        refetchOnMountOrArgChange: true 
    });
    
    const [sendToMaintenance, { isLoading: isSending }] = useSendToMaintenanceMutation();
    const [releaseFromMaintenance, { isLoading: isReleasing }] = useReleaseFromMaintenanceMutation();
    const [updateLock] = useUpdateCarLockMutation();

    // פונקציה חסינת טעויות לבדיקת סטטוס ב-SQL (מטפלת ב-NULL, True, 1, ו-NeedsMaintenance)
    const isActuallyInMaintenance = (car) => {
        const val = car?.needsMaintenance ?? car?.NeedsMaintenance;
        // בודק אם הערך הוא אמת כ-Boolean או כמחרוזת "True" (קורה לעיתים ב-SQL)
        return val === true || val === "True" || val === "true" || val === 1;
    };

    const handleMaintenanceToggle = async (car) => {
        const inRepair = isActuallyInMaintenance(car);
        try {
            if (inRepair) {
                await releaseFromMaintenance(car.id).unwrap();
            } else {
                await sendToMaintenance(car.id).unwrap();
            }
            refetch(); // רענון נתונים מהשרת מיד לאחר הפעולה
        } catch (err) {
            alert("שגיאת שרת: " + (err.data?.message || "לא ניתן לעדכן סטטוס"));
        }
    };

    const summary = useMemo(() => {
        const repairList = cars.filter(car => isActuallyInMaintenance(car));
        return {
            total: cars.length,
            repair: repairList.length,
            active: cars.length - repairList.length
        };
    }, [cars]);

    if (isLoading) return <div className="admin-loading"><Loader2 className="spin" /> מתחבר ל-SQL...</div>;

    return (
        <div className="admin-section admin-page">
            <div className="page-hero-bar">
                <div>
                    <h3>ניהול צי רכבים - Smart Ride</h3>
                    <p>סנכרון מלא מול עמודת NeedsMaintenance ב-Database</p>
                </div>
                <div className="page-hero-metrics">
                    <div className="metric-pill active">✅ תקינים: {summary.active}</div>
                    <div className="metric-pill repair">🛠️ בטיפול: {summary.repair}</div>
                </div>
            </div>
            
            <table className="admin-table admin-table-purple">
                <thead>
                    <tr>
                        <th>לוחית רישוי</th>
                        <th>דגם</th>
                        <th>דלק</th>
                        <th>מצב ב-Database</th>
                        <th>נעילה</th>
                        <th>פעולות מנהל</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map(car => {
                        const inMaint = isActuallyInMaintenance(car);
                        const locked = car.isLocked ?? car.IsLocked;
                        return (
                            <tr key={car.id} className={inMaint ? 'row-highlight-repair' : ''}>
                                <td className="license-badge">{car.licensePlate || car.LicensePlate}</td>
                                <td>{car.model}</td>
                                <td>{car.fuelLevel}%</td>
                                <td>
                                    <span className={`status-badge ${inMaint ? 'repair' : 'available'}`}>
                                        {inMaint ? '🛠️ במוסך (True)' : '✅ פעיל (False)'}
                                    </span>
                                </td>
                                <td>
                                    <button className={`btn-lock ${locked ? 'locked' : 'unlocked'}`} onClick={() => updateLock({id: car.id, isLocked: !locked})}>
                                        {locked ? <Lock size={14}/> : <Unlock size={14}/>}
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        className={`btn-action ${inMaint ? 'btn-return' : 'btn-repair'}`}
                                        onClick={() => handleMaintenanceToggle(car)}
                                        disabled={isSending || isReleasing}
                                    >
                                        {inMaint ? <CheckCircle size={14}/> : <Wrench size={14}/>}
                                        {inMaint ? ' החזר לשירות' : ' שלח לתיקון'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default FleetManagement;