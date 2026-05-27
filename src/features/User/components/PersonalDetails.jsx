import React, { useState, useRef, useEffect } from 'react';
import "../Style/PersonalDetails.css";
import { 
    useSendVerificationCodeMutation, 
    useVerifyRegistrationCodeMutation 
} from '../redux/userApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PersonalQuestions = ({ onBack, onNext, userData, setUserData }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [showPassword, setShowPassword] = useState(false);
    const [sendCode, { isLoading: isSending }] = useSendVerificationCodeMutation();
    const [verifyCode, { isLoading: isVerifying }] = useVerifyRegistrationCodeMutation();

    useEffect(() => {
        if (step === 4 && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [step]);
    // Updating everything
    const updateField = (field, value) => {
        setError('');
        setUserData(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'isForeignCitizen') {
                updated.countryOfOrigin = value ? '' : 'Israel';
            }
            return updated;
        });
    };
const formatExpiryDate = (value) => {
    // nummber only
    let cleaned = value.replace(/\D/g, "");
    
    //(MM/YY) max length 4
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
    
    //add slash after 2 digits
    if (cleaned.length >= 3) {
        return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
};

    //validations for each step
    const validateStep1 = () => {
        if (!userData.firstName?.trim() || !userData.lastName?.trim()) {
            setError("חובה למלא שם פרטי ושם משפחה");
            return false;
        }
        if (!userData.address?.trim()) {
        setError("חובה למלא כתובת מגורים");
        return false;
    }
        if (userData.isForeignCitizen && !userData.countryOfOrigin) {
            setError("חובה לבחור מדינת מקור");
            return false;
        }
        return true;
    };

    const validateStep5 = () => {
        if (!userData.passwordHash || userData.passwordHash.length < 6) {
            setError("סיסמה חייבת להכיל לפחות 6 תווים");
            return false;
        }
        if (!userData.phoneNumber) {
            setError("חובה להזין מספר טלפון");
            return false;
        }
        if (!userData.dateOfBirth) {
            setError("חובה להזין תאריך לידה");
            return false;
        }

        const birthDate = new Date(userData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today < new Date(birthDate.setFullYear(birthDate.getFullYear() + age))) age--;
        
        if (age < 18) {
            setError("הרישום מיועד לגילאי 18 ומעלה בלבד");
            return false;
        }
        return true;
    };

    const validateStep6 = () => {
        const isForeign = userData.isForeignCitizen;
        const idValue = isForeign ? userData.passportNumber : userData.licenseNumber;

        if (!idValue) {
            setError(isForeign ? "חובה למלא מספר דרכון" : "חובה למלא מספר רישיון");
            return false;
        }
        if (isForeign && !/^\d{9}$/.test(idValue)) {
            setError("מספר דרכון חייב להכיל בדיוק 9 ספרות");
            return false;
        }
          if (!isForeign && idValue.length !== 9) {
            setError("מספר רישיון חייב להכיל בדיוק 9 ספרות");
            return false;
        }
        if (!userData.licenseExpirationDate) {
            setError("חובה למלא תאריך תפוגה");
            return false;
        }

        const expDate = new Date(userData.licenseExpirationDate);
        if (expDate <= new Date()) {
            setError("תאריך תפוגת הרישיון חייב להיות עתידי");
            return false;
        }
        return true;
    };
    const validateStep7 = () => {
    const { cardNumber, cardExpiry, cvv } = userData;

    if (!cardNumber || cardNumber.length < 16) {
        setError("מספר כרטיס חייב להכיל 16 ספרות");
        return false;
    }
    
    // MM/YY
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError("תוקף כרטיס לא תקין (MM/YY)");
        return false;
    }

    // break down MM/YY
    const [month, year] = cardExpiry.split('/').map(Number);
    const now = new Date();
    // get last 2 digits of current year
    const currentYear = parseInt(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;

    // validate month
    if (month < 1 || month > 12) {
        setError("חודש לא תקין (01-12)");
        return false;
    }

    //check if card is expired
    if (year < currentYear) {
        setError("הכרטיס פג תוקף (שנה עברה)");
        return false;
    }
    
    if (year === currentYear && month < currentMonth) {
        setError("הכרטיס פג תוקף (חודש עבר)");
        return false;
    }

    if (!cvv || cvv.length < 3) {
        setError("קוד CVV לא תקין");
        return false;
    }
    return true;
    };
    // --- send  code ---
    const handleSendEmail = async () => {
        const email = userData?.email?.trim().toLowerCase();
        if (!email || !email.includes('@')) { setError("חובה להזין כתובת מייל תקינה"); return; }
        try {
            await sendCode(email).unwrap();
            setStep(4);
        } catch (err) {
            setError(err.data?.message || "שגיאה בשליחת המייל");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) { setError("כתובת אימייל לא תקינה"); return; }
    };

    const handleVerifyOtp = async () => {
        const fullCode = otp.join("");
        if (fullCode.length < 6) { setError("יש להזין קוד מלא"); return; }
        try {
            await verifyCode({ email: userData.email.trim().toLowerCase(), code: fullCode }).unwrap();
            setStep(5);
        } catch (err) {
            setError("קוד שגוי, נסה שנית");
        }
    };

    return (
        <div className="questions-page-bg">
            <div className="questions-container">
                <div className="question-card">
                    <div className="card-header-purple">
                        <p className="header-sub-text">שלב {step} מתוך 7</p>
                        <h2 className="header-main-title">
                            {step === 1 ? "פרטים אישיים" : 
                             step === 3 ? "אימות מייל" :
                             step === 5 ? "הגדרת חשבון" : 
                             step === 6 ? "מסמכי נהיגה" : 
                             step === 7 ? "אמצעי תשלום" : "אימות"}
                        </h2>
                    </div>

                    <div className="card-body">
                        {step === 1 && (
                            <div className="step-fade-in">
                                <div className="input-wrapper">
                                    <input type="text" placeholder="שם פרטי" value={userData.firstName || ""}onChange={(e) => updateField('firstName', e.target.value.replace(/[^a-zA-Zא-ת\s]/g, ""))}/>
                                </div>
                                <div className="input-wrapper">
                                    <input type="text" placeholder="שם משפחה" value={userData.lastName || ""} onChange={(e) => updateField('lastName', e.target.value)} />
                                </div>
                                <div className="input-wrapper">
                                   <input 
                                       type="text" 
                                       placeholder="כתובת (עיר, רחוב ומספר)" 
                                       value={userData.address || ""} 
                                       onChange={(e) => updateField('address', e.target.value)} 
                                   />
                               </div>
                                <div className="citizenship-toggle">
                                    <button type="button" className={`toggle-btn ${!userData.isForeignCitizen ? 'active' : ''}`} onClick={() => updateField('isForeignCitizen', false)}>ישראלי</button>
                                    <button type="button" className={`toggle-btn ${userData.isForeignCitizen ? 'active' : ''}`} onClick={() => updateField('isForeignCitizen', true)}>תושב חו"ל</button>
                                </div>
                                {userData.isForeignCitizen && (
                                    <div className="input-wrapper">
                                        <select className="country-select" value={userData.countryOfOrigin || ""} onChange={(e) => updateField('countryOfOrigin', e.target.value)}>
                                            <option value="" disabled>בחר מדינת מקור</option>
                                            <option value="USA">ארצות הברית</option>
                                            <option value="France">צרפת</option>
                                            <option value="UK">אנגליה</option>
                                        </select>
                                    </div>
                                )}
                                <button className="gold-btn" onClick={() => validateStep1() && setStep(3)}>המשך</button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-fade-in">
                                <p className="info-label">מה המייל שלך?</p>
                                <div className="input-wrapper">
                                    <input type="email" placeholder="email@example.com" value={userData.email || ""} onChange={(e) => updateField('email', e.target.value)} autoComplete="email" />
                                </div>
                                <button className="gold-btn" onClick={handleSendEmail} disabled={isSending}>{isSending ? "שולח..." : "שלחו לי קוד אימות"}</button>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="step-fade-in">
                                <p className="info-label">הזינו את הקוד שקיבלתם</p>
                                <div className="code-inputs" style={{ direction: 'ltr' }}>
                                    {otp.map((data, i) => (
                                        <input key={i} type="text" maxLength="1" className="code-square-oval" value={data} ref={el => (inputRefs.current[i] = el)} 
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp);
                                                if (val && i < 5) inputRefs.current[i + 1].focus();
                                            }} 
                                            onKeyDown={e => e.key === "Backspace" && !otp[i] && i > 0 && inputRefs.current[i - 1].focus()} 
                                        />
                                    ))}
                                </div>
                                <button className="gold-btn" onClick={handleVerifyOtp} disabled={isVerifying}>אמת קוד</button>
                            </div>
                        )}

                   {step === 5 && (
    <div className="step-fade-in">
        <form onSubmit={(e) => { e.preventDefault(); validateStep5() && setStep(6); }}>  
            <input 
                type="email" 
                name="email" 
                value={userData.email} 
                autoComplete="username" 
                style={{ display: 'none' }} 
                readOnly 
            />
            
            <div className="input-wrapper" style={{ position: 'relative' }}>
                <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="סיסמה (6+ תווים)" 
                    value={userData.passwordHash || ""} 
                    autoComplete="new-password" 
                    onChange={(e) => updateField('passwordHash', e.target.value)} 
                    required
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6F3293' }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            
            <div className="input-wrapper">
                <input 
                    type="tel" 
                    name="phoneNumber"
                    placeholder="מספר טלפון (10 ספרות)" 
                    maxLength="10"
                    value={userData.phoneNumber || ""} 
                    onChange={(e) => updateField('phoneNumber', e.target.value.replace(/\D/g, ""))} 
                    required
                />
            </div>

            <p className="header-sub-text">תאריך לידה:</p>
            <div className="input-wrapper">
                <input 
                    type="date" 
                    name="dateOfBirth"
                    value={userData.dateOfBirth || ""} 
                    onChange={(e) => updateField('dateOfBirth', e.target.value)} 
                    required
                />
            </div>

            <button type="submit" className="gold-btn">לשלב הבא</button>
        </form>
    </div>
)}

{step === 6 && (
    <div className="step-fade-in">
        <div className="input-wrapper">
            <input 
                type="text" 
                placeholder={userData.isForeignCitizen ? "מספר דרכון (9 ספרות)" : "מספר רישיון נהיגה"} 
                value={userData.isForeignCitizen ? userData.passportNumber : userData.licenseNumber} 
                onChange={(e) => updateField(userData.isForeignCitizen ? 'passportNumber' : 'licenseNumber', e.target.value)} 
            />
        </div>
        <p className="header-sub-text">תאריך תפוגת רישיון:</p>
        <div className="input-wrapper">
            <input type="date" value={userData.licenseExpirationDate || ""} onChange={(e) => updateField('licenseExpirationDate', e.target.value)} />
        </div>
        <button className="gold-btn" onClick={() => validateStep6() && setStep(7)}>מעבר לתשלום</button>
    </div>
)}

                     {step === 7 && (
    <div className="step-fade-in">
        <div className="input-wrapper">
            <input 
                type="text" 
                maxLength="16" 
                placeholder="מספר כרטיס אשראי" 
                value={userData.cardNumber || ""} 
                onChange={(e) => updateField('cardNumber', e.target.value.replace(/\D/g,''))} 
            />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-wrapper">
                <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength="5" // חשוב: MM/YY זה 5 תווים
                    value={userData.cardExpiry || ""} 
                    // שימוש בפורמט האוטומטי כאן:
                    onChange={(e) => updateField('cardExpiry', formatExpiryDate(e.target.value))} 
                />
            </div>
            <div className="input-wrapper">
                <input 
                    type="text" 
                    maxLength="3" 
                    placeholder="CVV" 
                    value={userData.cvv || ""} 
                    onChange={(e) => updateField('cvv', e.target.value.replace(/\D/g,''))} 
                />
            </div>
        </div>
        <button className="gold-btn" onClick={() => validateStep7() && onNext()}>המשך להעלאת מסמכים</button>
    </div>
)}
         {error && <p className="error-text">{error}</p>}
     </div>

     <button className="back-arrow-btn" onClick={() => step > 1 ? setStep(step === 5 ? 3 : step - 1) : onBack()}>
         <span className="arrow-icon">➜</span>
     </button>
                </div>
            </div>
        </div>
    );
};
export default PersonalQuestions;