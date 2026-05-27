import React from 'react';
import { useSelector } from 'react-redux';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import '../Style/ContactUs.css';

const ContactUs = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const memberId = currentUser?.id || 'לא מחובר';

  const contactItems = [
    {
      id: 1,
      title: 'מוקד חירום בהזמנה פעילה, 24/6',
      subtitle: '*2319 שלוחה 7',
      icon: <Phone className="contact-icon-svg" />,
      action: 'tel:*2319'
    },
    {
      id: 2,
      title: 'מוקד להזמנות חדשות/שינויים בהזמנות קיימות',
      subtitle: '*2319 שלוחה 6 ולאחר מכן 2 | בימים א-ה 09:00-15:00 וביום שישי וערבי חג 09:00-12:00',
      icon: <Phone className="contact-icon-svg" />,
      action: 'tel:*2319'
    },
    {
      id: 3,
      title: 'מוקד עדכונים ושונות מענה 24/6',
      subtitle: '*2319 שלוחה 6 ולאחר מכן 3',
      icon: <Phone className="contact-icon-svg" />,
      action: 'tel:*2319'
    },
    {
      id: 4,
      title: 'הרשמות:',
      subtitle: 'אתר / אפליקציה / אימייל: citydrive.system@gmail.com',
      icon: <Mail className="contact-icon-svg" />,
      action: 'mailto:citydrive.system@gmail.com'
    },
    {
      id: 5,
      title: 'פניות לשירות לקוחות ניתן לשלוח בעמוד הפניות',
      subtitle: 'לחץ כאן לפתיחת פנייה ממוחשבת במערכת',
      icon: <MessageSquare className="contact-icon-svg" />,
      action: '#/support-tickets' 
    }
  ];

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        <header className="contact-header">
          <h2>יצירת קשר</h2>
          <p className="contact-main-subtitle">בכל פנייה לנציג שירות יש להזדהות עם מספר מנוי</p>
          <div className="member-badge">
            מספר המנוי שלך הוא: <span className="member-id-num">{memberId}</span>
          </div>
        </header>

        <div className="contact-cards-list">
          {contactItems.map((item) => (
            <a 
              href={item.action} 
              key={item.id} 
              className="contact-row-card"
              onClick={(e) => item.action.startsWith('#') && e.preventDefault()}
            >
              <div className="contact-card-content">
                <h3 className="contact-card-title">{item.title}</h3>
                <p className="contact-card-subtitle">{item.subtitle}</p>
              </div>
              <div className="contact-icon-wrapper">
                {item.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;