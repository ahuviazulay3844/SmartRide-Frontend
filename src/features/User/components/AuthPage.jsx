
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { 
    useLoginUserMutation, 
    userApi ,
    useForgotPasswordMutation,
    useResetPasswordMutation
} from '../redux/userApi';
import { setUser } from '../redux/userSlice.jsx';
import '../Style/AuthPage.css';
const AuthPage = ({ onLoginSuccess, onClose, onRegisterNavigate }) => {
    const [view, setView] = useState('login');
    const [formData, setFormData] = useState({ email: '', pass: '', code: '', newPassword: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForgotRequest = async (e) => {
    e.preventDefault();
    if (!formData.email) return setMessage({ text: 'נא להזין אימייל', type: 'error' });
    try {
        // הוספת .trim().toLowerCase() כדי להבטיח אחידות מלאה
        const cleanEmail = formData.email.trim().toLowerCase(); 
        await forgotPassword(cleanEmail).unwrap();       
        setFormData(prev => ({ ...prev, email: cleanEmail }));
        
        setMessage({ text: 'קוד אימות נשלח למייל שלך', type: 'success' });
        setView('reset');
    } catch (err) {
        setMessage({ text: 'שגיאה בשליחת המייל', type: 'error' });
    }
};

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword({ 
                email: formData.email, 
                code: formData.code, 
                newPassword: formData.newPassword 
            }).unwrap();
            setMessage({ text: 'הסיסמה עודכנה! מעביר להתחברות...', type: 'success' });
            setTimeout(() => {
                setView('login');
                setMessage({ text: '', type: '' });
            }, 2000);
        } catch (err) {
            setMessage({ text: 'קוד שגוי או פג תוקף', type: 'error' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        if (!formData.email.trim() || !formData.pass.trim()) {
            setMessage({ text: 'נא להזין אימייל וסיסמה כדי להמשיך', type: 'error' });
            return;
        }
        try {
            const result = await loginUser({ email: formData.email.trim().toLowerCase(), pass: formData.pass }).unwrap();
            if (result) {
                const token = result.token || result;
                localStorage.setItem('token', token);
                const userAction = await dispatch(userApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }));
                const user = userAction.data;
                if (user) {                        
                    dispatch(setUser(user));
                    setMessage({ text: 'התחברת בהצלחה!', type: 'success' });
                    const isAdmin = user.userType == 1 || user.userType === 'Admin' || user.userType === '1';
                    if (isAdmin) navigate('/admin');
                    else setTimeout(() => onLoginSuccess(), 500);
                }
            }
        } catch (error) {
            if (error.status === 401) setMessage({ text: 'אחד מהנתונים שהקשת שגוי', type: 'error' });
            else if (error.status === 404) {
                setMessage({ text: 'הפרטים לא זוהו, מעביר להרשמה...', type: 'error' });
                setTimeout(() => onRegisterNavigate(), 1800);
            } else setMessage({ text: 'חלה שגיאה בחיבור לשרת', type: 'error' });
        }
    };


return (
<div className="auth-container">
    <div className="auth-card">
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        <div className="auth-header">
            <img src="/src/assets/top_icon.png" alt="City Car" className="auth-logo" />
            <h2>{view === 'login' ? 'ברוכים הבאים לסיטי קאר' : 'איפוס סיסמה'}</h2>
        </div>

        {view === 'login' ? (
            <form onSubmit={handleSubmit} noValidate>
                <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} autoComplete="username" required />
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="pass" placeholder="סיסמה" value={formData.pass} onChange={handleChange} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="forgot-wrapper">
                    <button type="button" onClick={() => setView('forgot')} className="forgot-password-link">שכחת סיסמה?</button>
                </div>
                {message.text && <div className={`message-banner ${message.type}`}>{message.text}</div>}
                <button type="submit" className="main-btn" disabled={isLoginLoading}>התחברות</button>
            </form>
        ) : view === 'forgot' ? (
            <form onSubmit={handleForgotRequest} noValidate>
                <p className="auth-subtitle">הכנס אימייל לקבלת קוד אימות</p>
                <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} required />
                {message.text && <div className={`message-banner ${message.type}`}>{message.text}</div>}
                <button type="submit" className="main-btn" disabled={isForgotLoading}>שלח קוד אימות</button>
                <button type="button" onClick={() => setView('login')} className="back-to-login">חזור</button>
            </form>
        ) : (
            <form onSubmit={handleResetSubmit} noValidate>
                <input type="email" name="email" value={formData.email} readOnly autoComplete="username" className="readonly-input" />
                <input type="text" name="code" placeholder="קוד מהמייל" value={formData.code} onChange={handleChange} required />
                <input type="password" name="newPassword" placeholder="סיסמה חדשה" value={formData.newPassword} onChange={handleChange} autoComplete="new-password" required />
                {message.text && <div className={`message-banner ${message.type}`}>{message.text}</div>}
                <button type="submit" className="main-btn" disabled={isResetLoading}>עדכן סיסמה</button>
            </form>
        )}
        <div className="auth-footer">
            <button onClick={onRegisterNavigate} type="button" className="link-btn">עדיין אין לך חשבון? להרשמה</button>
        </div>
    </div>
</div>
);
}
export default AuthPage;