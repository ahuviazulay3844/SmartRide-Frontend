// import React, { useMemo } from 'react';
// import { 
//     useGetAllCarsQuery, 
//     useSendToMaintenanceMutation, 
//     useReleaseFromMaintenanceMutation, 
//     useUpdateCarLockMutation 
// } from '../../Car/redux/carApi.jsx'; 

// const FleetManagement = () => {
//     const { data: cars = [], isLoading, isError } = useGetAllCarsQuery();
//     const [sendToMaintenance] = useSendToMaintenanceMutation();
//     const [releaseFromMaintenance] = useReleaseFromMaintenanceMutation();
//     const [updateLock] = useUpdateCarLockMutation();

//     const handleMaintenance = async (carId, currentStatus) => {
//         try {
//             if (currentStatus === 'Available' || currentStatus === 0) {
//                 await sendToMaintenance(carId).unwrap();
//             } else {
//                 await releaseFromMaintenance(carId).unwrap();
//             }
//         } catch (err) {
//             console.error('Maintenance update failed:', err);
//         }
//     };

//     const handleToggleLock = async (carId, currentLockStatus) => {
//         try {
//             await updateLock({ id: carId, isLocked: !currentLockStatus }).unwrap();
//         } catch (err) {
//             console.error('Lock toggle failed:', err);
//         }
//     };

//     const summary = useMemo(() => {
//         const active = cars.filter(car => car.status === 'Available' || car.status === 0).length;
//         const maintenance = cars.filter(car => !(car.status === 'Available' || car.status === 0)).length;
//         const lowFuel = cars.filter(car => car.fuelLevel !== undefined && Number(car.fuelLevel) < 30).length;
//         return { active, maintenance, lowFuel };
//     }, [cars]);

//     if (isLoading) return <div className="admin-loading">טוען רכבים...</div>;
//     if (isError) return <div className="admin-error">שגיאה בטעינת הנתונים מהשרת</div>;

//     return (
//         <div className="admin-section admin-page">
//             <div className="page-hero-bar">
//                 <div>
//                     <h3>ניהול צי רכבים</h3>
//                     <p>הצגת סטטוס מלא של כל הרכבים וצפייה ברכבים עם דלק נמוך.</p>
//                 </div>
//                 <div className="page-hero-metrics">
//                     <span>פעילים: {summary.active}</span>
//                     <span>בתיקון: {summary.maintenance}</span>
//                     <span>דלק נמוך: {summary.lowFuel}</span>
//                 </div>
//             </div>
//             <table className="admin-table admin-table-purple">
//                 <thead>
//                     <tr>
//                         <th>רכב</th>
//                         <th>דגם</th>
//                         <th>דלק</th>
//                         <th>סטטוס</th>
//                         <th>נעילה</th>
//                         <th>פעולות</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {cars.map(car => (
//                         <tr key={car.id}>
//                             <td>{car.plateNumber || car.id}</td>
//                             <td>{car.model}</td>
//                             <td>
//                                 <span className={`status-badge ${car.fuelLevel >= 40 ? 'available' : car.fuelLevel >= 15 ? 'status-warning' : 'repair'}`}>
//                                     {car.fuelLevel !== undefined ? `${car.fuelLevel}%` : 'לא ידוע'}
//                                 </span>
//                             </td>
//                             <td>
//                                 <span className={`status-badge ${car.status === 'Available' || car.status === 0 ? 'available' : 'repair'}`}>
//                                     {car.status === 'Available' || car.status === 0 ? '✅ פעיל' : '🛠️ בטיפול'}
//                                 </span>
//                             </td>
//                             <td>
//                                 <button 
//                                     className={`btn-lock ${car.isLocked ? 'locked' : 'unlocked'}`}
//                                     onClick={() => handleToggleLock(car.id, car.isLocked)}
//                                 >
//                                     {car.isLocked ? '🔒 נעול' : '🔓 פתוח'}
//                                 </button>
//                             </td>
//                             <td>
//                                 <button 
//                                     className={`btn-action ${car.status === 'Available' || car.status === 0 ? 'btn-repair' : 'btn-return'}`}
//                                     onClick={() => handleMaintenance(car.id, car.status)}
//                                 >
//                                     {car.status === 'Available' || car.status === 0 ? '🔧 שלח לתיקון' : '✅ החזר לשירות'}
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default FleetManagement;
// import React, { useMemo } from 'react';

// import {
//     useGetAllCarsQuery,
//     useSendToMaintenanceMutation,
//     useReleaseFromMaintenanceMutation,
//     useUpdateCarLockMutation
// } from '../../Car/redux/carApi';

// import {
//     Car,
//     Fuel,
//     Lock,
//     Unlock,
//     Wrench,
//     CheckCircle,
//     Gauge,
//     Loader2,
//     AlertTriangle
// } from 'lucide-react';

// import '../Style/FleetManagement.css';

// const FleetManagement = () => {

//     const {
//         data: cars = [],
//         isLoading,
//         isError,
//         refetch
//     } = useGetAllCarsQuery(undefined, {
//         pollingInterval: 3000,
//         refetchOnMountOrArgChange: true,
//         refetchOnFocus: true,
//         refetchOnReconnect: true
//     });

//     const [sendToMaintenance, { isLoading: sending }] =
//         useSendToMaintenanceMutation();

//     const [releaseFromMaintenance, { isLoading: releasing }] =
//         useReleaseFromMaintenanceMutation();

//     const [updateLock, { isLoading: updatingLock }] =
//         useUpdateCarLockMutation();

//     // ===== זיהוי אמיתי של רכב במוסך =====
//     const isCarInMaintenance = (car) => {

//         const needsMaintenance =
//             car?.needsMaintenance ??
//             car?.NeedsMaintenance;

//         const status =
//             car?.status ??
//             car?.Status;

//         return (
//             needsMaintenance === true ||
//             needsMaintenance === 'True' ||
//             needsMaintenance === 'true' ||
//             needsMaintenance === 1 ||
//             needsMaintenance === '1' ||

//             status === 3 ||
//             status === '3' ||
//             status === 'Maintenance'
//         );
//     };

//     // ===== סיכום עליון =====
//     const summary = useMemo(() => {

//         const repairCars =
//             cars.filter(car => isCarInMaintenance(car));

//         const lowFuelCars =
//             cars.filter(car => {
//                 const fuel =
//                     car?.fuelLevel ??
//                     car?.FuelLevel ??
//                     0;

//                 return fuel < 20;
//             });

//         return {
//             total: cars.length,
//             repair: repairCars.length,
//             active: cars.length - repairCars.length,
//             lowFuel: lowFuelCars.length
//         };

//     }, [cars]);

//     // ===== שליחה / החזרה ממוסך =====
//     const handleMaintenanceAction = async (car) => {

//         try {

//             const inRepair =
//                 isCarInMaintenance(car);

//             if (inRepair) {

//                 await releaseFromMaintenance(car.id).unwrap();

//             } else {

//                 await sendToMaintenance(car.id).unwrap();
//             }

//             await refetch();

//         } catch (err) {

//             console.error('Maintenance Error:', err);

//             alert('שגיאה בעדכון מצב תחזוקה');
//         }
//     };

//     // ===== נעילה / פתיחה =====
//     const handleLockToggle = async (car) => {

//         try {

//             const currentLock =
//                 car?.isLocked ??
//                 car?.IsLocked ??
//                 false;

//             await updateLock({
//                 id: car.id,
//                 isLocked: !currentLock
//             }).unwrap();

//             await refetch();

//         } catch (err) {

//             console.error('Lock Error:', err);

//             alert('שגיאה בעדכון נעילה');
//         }
//     };

//     // ===== טעינה =====
//     if (isLoading) {

//         return (
//             <div className="admin-loading-container">

//                 <Loader2 className="spinner-icon" />

//                 <p>טוען רכבים מהשרת...</p>

//             </div>
//         );
//     }

//     // ===== שגיאה =====
//     if (isError) {

//         return (
//             <div className="admin-error-container">

//                 <AlertTriangle size={40} />

//                 <p>שגיאה בטעינת רכבים</p>

//                 <button
//                     className="btn-refresh"
//                     onClick={() => refetch()}
//                 >
//                     טען מחדש
//                 </button>

//             </div>
//         );
//     }

//     return (

//         <div className="admin-section admin-page">

//             {/* ===== כותרת עליונה ===== */}

//             <div className="page-hero-bar">

//                 <div className="hero-title-area">

//                     <div className="hero-icon-wrapper">
//                         <Car size={26} />
//                     </div>

//                     <div>

//                         <h3>
//                             Smart-Ride - ניהול צי רכבים
//                         </h3>

//                         <p>
//                             פיקוח בזמן אמת על רכבים, נעילות,
//                             דלק ותחזוקה
//                         </p>

//                     </div>

//                 </div>

//                 {/* ===== סטטיסטיקות ===== */}

//                 <div className="page-hero-metrics">

//                     <div className="metric-box active-cars">

//                         <span className="metric-label">
//                             ✅ רכבים תקינים
//                         </span>

//                         <span className="metric-value">
//                             {summary.active}
//                         </span>

//                     </div>

//                     <div className="metric-box maintenance-cars">

//                         <span className="metric-label">
//                             🛠️ במוסך
//                         </span>

//                         <span
//                             className="metric-value"
//                             style={{ color: '#ff7675' }}
//                         >
//                             {summary.repair}
//                         </span>

//                     </div>

//                     <div className="metric-box low-fuel-cars">

//                         <span className="metric-label">
//                             ⛽ דלק נמוך
//                         </span>

//                         <span className="metric-value">
//                             {summary.lowFuel}
//                         </span>

//                     </div>

//                 </div>

//             </div>

//             {/* ===== טבלת רכבים ===== */}

//             <div className="table-responsive">

//                 <table className="admin-table admin-table-purple">

//                     <thead>

//                         <tr>

//                             <th>רישוי</th>

//                             <th>רכב</th>

//                             <th>מד אוץ</th>

//                             <th>דלק</th>

//                             <th>תחזוקה</th>

//                             <th>נעילה</th>

//                             <th>פעולות</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {
//                             cars.map(car => {

//                                 const fuel =
//                                     car?.fuelLevel ??
//                                     car?.FuelLevel ??
//                                     0;

//                                 const km =
//                                     car?.kilometers ??
//                                     car?.Kilometers ??
//                                     0;

//                                 const isLocked =
//                                     car?.isLocked ??
//                                     car?.IsLocked ??
//                                     false;

//                                 const inRepair =
//                                     isCarInMaintenance(car);

//                                 return (

//                                     <tr
//                                         key={car.id}
//                                         className={
//                                             inRepair
//                                                 ? 'row-in-maintenance'
//                                                 : ''
//                                         }
//                                     >

//                                         {/* ===== רישוי ===== */}

//                                         <td>

//                                             <span className="license-badge">

//                                                 {
//                                                     car?.licensePlate ??
//                                                     car?.LicensePlate
//                                                 }

//                                             </span>

//                                         </td>

//                                         {/* ===== רכב ===== */}

//                                         <td className="car-model-cell">

//                                             <strong>

//                                                 {
//                                                     car?.model ??
//                                                     car?.Model
//                                                 }

//                                             </strong>

//                                             <span className="car-year-sub">

//                                                 {
//                                                     car?.year ??
//                                                     car?.Year
//                                                 }

//                                             </span>

//                                         </td>

//                                         {/* ===== קילומטראז ===== */}

//                                         <td>

//                                             <div className="km-display">

//                                                 <Gauge
//                                                     size={14}
//                                                     style={{
//                                                         marginLeft: '5px'
//                                                     }}
//                                                 />

//                                                 {km.toLocaleString()} ק"מ

//                                             </div>

//                                         </td>

//                                         {/* ===== דלק ===== */}

//                                         <td>

//                                             <div className="fuel-cell-wrapper">

//                                                 <Fuel
//                                                     size={14}
//                                                     style={{
//                                                         marginLeft: '5px'
//                                                     }}
//                                                 />

//                                                 <span
//                                                     className={`status-badge ${
//                                                         fuel >= 40
//                                                             ? 'available'
//                                                             : fuel >= 20
//                                                             ? 'status-warning'
//                                                             : 'repair'
//                                                     }`}
//                                                 >

//                                                     {fuel}%

//                                                 </span>

//                                             </div>

//                                         </td>

//                                         {/* ===== תחזוקה ===== */}

//                                         <td>

//                                             <span
//                                                 className={`status-badge ${
//                                                     inRepair
//                                                         ? 'repair'
//                                                         : 'available'
//                                                 }`}
//                                             >

//                                                 {
//                                                     inRepair
//                                                         ? '🛠️ בתיקון'
//                                                         : '✅ תקין'
//                                                 }

//                                             </span>

//                                         </td>

//                                         {/* ===== נעילה ===== */}

//                                         <td>

//                                             <button
//                                                 className={`btn-lock ${
//                                                     isLocked
//                                                         ? 'locked'
//                                                         : 'unlocked'
//                                                 }`}
//                                                 onClick={() =>
//                                                     handleLockToggle(car)
//                                                 }
//                                                 disabled={updatingLock}
//                                             >

//                                                 {
//                                                     isLocked
//                                                         ? (
//                                                             <>
//                                                                 <Lock
//                                                                     size={14}
//                                                                     style={{
//                                                                         marginLeft: '4px'
//                                                                     }}
//                                                                 />
//                                                                 נעול
//                                                             </>
//                                                         )
//                                                         : (
//                                                             <>
//                                                                 <Unlock
//                                                                     size={14}
//                                                                     style={{
//                                                                         marginLeft: '4px'
//                                                                     }}
//                                                                 />
//                                                                 פתוח
//                                                             </>
//                                                         )
//                                                 }

//                                             </button>

//                                         </td>

//                                         {/* ===== פעולות ===== */}

//                                         <td>

//                                             <button
//                                                 className={`btn-action ${
//                                                     inRepair
//                                                         ? 'btn-return'
//                                                         : 'btn-repair'
//                                                 }`}
//                                                 onClick={() =>
//                                                     handleMaintenanceAction(car)
//                                                 }
//                                                 disabled={
//                                                     sending ||
//                                                     releasing
//                                                 }
//                                             >

//                                                 {
//                                                     inRepair
//                                                         ? (
//                                                             <>
//                                                                 <CheckCircle
//                                                                     size={14}
//                                                                     style={{
//                                                                         marginLeft: '5px'
//                                                                     }}
//                                                                 />
//                                                                 החזר לשירות
//                                                             </>
//                                                         )
//                                                         : (
//                                                             <>
//                                                                 <Wrench
//                                                                     size={14}
//                                                                     style={{
//                                                                         marginLeft: '5px'
//                                                                     }}
//                                                                 />
//                                                                 שלח לתיקון
//                                                             </>
//                                                         )
//                                                 }

//                                             </button>

//                                         </td>

//                                     </tr>
//                                 );
//                             })
//                         }

//                         {
//                             cars.length === 0 &&
//                             (
//                                 <tr>

//                                     <td
//                                         colSpan="7"
//                                         className="no-data-cell"
//                                     >

//                                         אין רכבים במערכת

//                                     </td>

//                                 </tr>
//                             )
//                         }

//                     </tbody>

//                 </table>

//             </div>

//         </div>
//     );
// };

// export default FleetManagement;
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