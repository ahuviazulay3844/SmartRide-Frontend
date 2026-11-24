import React from "react";
import "../Style/Register.css";
import personal_details from "../../../assets/imgi_9_step_personal_details.png";
import upload_documents from "../../../assets/imgi_10_step_upload_files.png";
import foreign_citizen from "../../../assets/imgi_11_step_foreign_citizen.png";
import signature from "../../../assets/imgi_12_step_sign.png";

const Register = ({ onStepClick, isForeign }) => { 

  return (
    <div className="register-page">
      <h2 className="title">תהליך הרשמה</h2>

      <div className="flow-wrapper">
        <svg className="flow-line" viewBox="0 0 500 650">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b2a8f" />
              <stop offset="45%" stopColor="#9a74c9" />
              <stop offset="100%" stopColor="#efe6fb" />
            </linearGradient>
          </defs>

          {/* one continuous S-shaped ribbon passing through the four circles */}
          <path
            d="M320 70
               C 320 170, 180 145, 180 245
               C 180 345, 320 320, 320 420
               C 320 520, 180 495, 180 595"
            stroke="url(#grad)"
            strokeWidth="78"
            fill="none"
            strokeLinecap="round"
          />

          {/* small direction arrows along the ribbon */}
          <g stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M262 150 L 236 178 M236 178 L 236 160 M236 178 L 254 178" />
            <path d="M238 325 L 264 353 M264 353 L 264 335 M264 353 L 246 353" />
            <path d="M262 500 L 236 528 M236 528 L 236 510 M236 528 L 254 528" />
          </g>
        </svg>
         {/* Personal details */}
        <div className="step-item s1 clickable" onClick={() => onStepClick('questions')}>
          <div className="circle-wrap"><img src={personal_details} alt="פרטים אישיים" /></div>
          <div className="text-wrap">
            <h3>פרטים אישיים</h3>
            <ul>
              <li>אימות אימייל</li>
              <li>שם וכתובת</li>
            </ul>
          </div>
        </div>

        {/* שלב 2: העלאת רישיון */}
        <div className="step-item s2 clickable" onClick={() => onStepClick('upload')}>
          <div className="circle-wrap"><img src={upload_documents} alt="העלאת רישיון" /></div>
          <div className="text-wrap">
            <h3>העלאת רישיון</h3>
            <ul>
              <li>רישיון נהיגה</li>
              <li>סלפי עם רישיון</li>
            </ul>
          </div>
        </div>
        
        {/*Step 3: Overseas Citizen - Always displayed but clickable only if relevant or skips*/}
        <div className={`step-item s3 clickable ${!isForeign ? 'disabled-step' : ''}`} 
             onClick={() => isForeign ? onStepClick('foreign') : alert("שלב זה מיועד לאזרחי חו\"ל בלבד")}>
          <div className="circle-wrap"><img src={foreign_citizen} alt="אזרח חוץ" /></div>
          <div className="text-wrap">
            <h3>מסמכי זיהוי נוספים</h3>
            <ul>
              <li>דרכון וויזה</li>
              <li>לאזרחי חו"ל בלבד</li>
            </ul>
          </div>
        </div>

        { /*Step 4: Signature - Always displayed and clickable, but if foreign citizen step is relevant, it should be completed first*/}
        <div className="step-item s4 clickable" onClick={() => onStepClick('signature')}>
          <div className="circle-wrap"><img src={signature} alt="חתימה" /></div>
          <div className="text-wrap">
            <h3>חתימה</h3>
            <ul>
              <li>חתימה על התקנון</li>
            </ul>
          </div>
        </div>
      </div>

      <button className="continue-btn" onClick={() => onStepClick('questions')}>
        התחל הרשמה
      </button>
    </div>
  );
};

export default Register;