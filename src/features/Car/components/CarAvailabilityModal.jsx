import React from "react";
import "../Style/CarAvailabilityModal.css";

const CarAvailabilityModal = ({ car, selectedTime, onClose, onEditTime, onConfirmSelection }) => {
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  
  if (isToday) {
    return `שעה ${timeStr}`;
  } else {
    //to format the date as 15.05.2026 we can use toLocaleDateString with the right options and then replace the slashes with dots
    const dateStr = date.toLocaleDateString("he-IL", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    }).replace(/\//g, '.'); //   15.05.2026
    
    return `שעה ${timeStr} בתאריך ${dateStr}`;
  }
};
  const status = Number(car?.status);
  
  const blockStart = car?.blockingOrderStart ? new Date(car.blockingOrderStart) : null;
  const blockEnd = car?.blockingOrderEnd ? new Date(car.blockingOrderEnd) : null;
  
  const reqStart = new Date(selectedTime.start);
  const reqEnd = new Date(selectedTime.end);
  const now = new Date();

  const getAvailabilityMessage = () => {
    // Maintenance
    if (status === 3) return "הרכב נמצא כרגע בתחזוקה או דורש תדלוק ולא ניתן להזמנה.";

    // Occupied
if (status === 2) {
  return `הרכב תפוס כרגע. הוא צפוי להתפנות ב${formatTime(blockEnd)}.`; 
}

    // BLocked but might be bookable for part of the time
    if (status === 1 && blockStart && blockEnd) {
      
      // the effective start is the later of now or the requested start, because if the blocking period started in the past but the user is trying to book for now, we should consider the effective start as now for calculating the gap
      const effectiveStart = now > reqStart ? now : reqStart;
      const startGapMinutes = (blockStart - effectiveStart) / 60000;
      
      const endGapMinutes = (reqEnd - blockEnd) / 60000;

      if (startGapMinutes >= 60 && endGapMinutes > 0) {
        return `שים לב: הרכב פנוי להזמנה עד שעה ${formatTime(blockStart)} ושוב החל משעה ${formatTime(blockEnd)}.`;
      }
      
      if (startGapMinutes >= 60) {
        return `שים לב: הרכב פנוי להזמנה רק עד שעה ${formatTime(blockStart)}.`;
      }

      if (endGapMinutes > 0) {
        return `הרכב תפוס בחלק מהזמן שבחרת. הוא יהיה פנוי עבורך החל משעה ${formatTime(blockEnd)}.`;
      }
    }

    return "הרכב לא זמין להזמנה בטווח הזמן המדויק שצוין.";
  };

  const statusInfo = (s) => {
    switch (s) {
      case 0: return { label: "פנוי", color: "#16a34a" };
      case 1: return { label: "פנוי חלקית", color: "#ea580c" };
      case 2: return { label: "תפוס", color: "#dc2626" };
      default: return { label: "לא זמין", color: "#4b5563" };
    }
  };

  const info = statusInfo(status);

  return (
    <div className="availability-modal-overlay" onClick={onClose}>
      <div className="availability-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="modal-car-header">
          <img src={car?.imageUrl || "/assets/car-placeholder.png"} alt={car?.model} className="modal-car-image" />
          <div className="modal-car-info">
            <h2>{car?.model}</h2>
            <p>{car?.startParking}</p>
          </div>
        </div>

        <div className="modal-status-section">
          <div className="status-badge-large" style={{ borderColor: info.color, color: info.color }}>
            <span>{info.label}</span>
          </div>
        </div>

        {(status === 1 || status === 2 || status === 3) && (
          <div className={`availability-warning-card ${status === 2 ? 'busy' : 'partial'}`}>
            <div className="warning-title">⚠️ מידע חשוב על הזמינות</div>
            <p className="warning-text">{getAvailabilityMessage()}</p>
          </div>
        )}

        <div className="modal-specs">
          <div className="spec-item-modal"><span>⛽ {car?.fuelLevel}%</span></div>
          <div className="spec-item-modal"><span>📏 {(car?.distance || 0).toFixed(1)} ק"מ</span></div>
          <div className="spec-item-modal"><span>💺 {car?.seats} מושבים</span></div>
        </div>

        <div className="modal-actions">
          <button className="btn-edit-time" onClick={() => onEditTime(car)}>שנה זמנים</button>
          <button 
            className="btn-confirm" 
            disabled={status === 2 || status === 3|| status === 1}
            onClick={() => onConfirmSelection(car)}
          >
           {status === 2 || status === 3 || status === 4 ? (
             "הרכב תפוס"
           ) : status === 1 ? (
             "פנוי חלקית"
           ) : (
             "הזמן נסיעה עכשיו"
           )}

          </button>
        </div>
      </div>
    </div>
  );
};

export default CarAvailabilityModal;