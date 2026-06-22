# City Car — ממשק משתמש (Frontend)

## מבוא

זהו פרויקט **React** לשירות **השכרת רכבים שיתופית** — City Car.  
המערכת מנהלת את ממשק הלקוח (הרשמה, הזמנות, מפות, נסיעות) ואת פאנל הניהול (צי רכבים, משתמשים, יומן הזמנות).

הפרויקט בנוי בארכיטקטורת **Feature-Based** — כל תחום אחריות (משתמשים, רכבים, הזמנות, אדמין) מופרד לתיקייה עצמאית עם רכיבים, Redux ו-CSS משלו.  
הפרדה זו מאפשרת תחזוקה נוחה, זיהוי מהיר של קוד לפי נושא, והרחבה של תכונות בלי לערבב אחריות בין מודולים.

---

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Framework | React 19 |
| Build | Vite 7 |
| Routing | React Router DOM 7 |
| State & API | Redux Toolkit + RTK Query |
| UI | CSS מותאם, MUI, Lucide React, React Icons |
| מפות | Google Maps (`@react-google-maps/api`) |
| אחר | Swiper, react-signature-canvas, Axios |

---

## דרישות מקדימות

- **Node.js** (גרסה 18 ומעלה)
- **Backend API** — שרת ASP.NET על `https://localhost:7034`
- **מפתח Google Maps API** — לתצוגת המפה ובחירת רכבים

---

## התקנה והרצה

```bash
npm install
npm run dev        # פיתוח — http://localhost:5173
npm run build      # בנייה ל-dist/
npm run preview    # תצוגה מקדימה של הבנייה
npm run lint       # ESLint
```

### משתני סביבה

צור קובץ `.env` בשורש:

```env
VITE_GOOGLE_MAPS_API_KEY=המפתח_שלך
```

המפתח נטען ב-`GoogleMapWithClusters` ו-`GoogleMapWithMarker` דרך `import.meta.env.VITE_GOOGLE_MAPS_API_KEY`.

### חיבור ל-Backend

```
https://localhost:7034/api/
```

אימות: **Bearer Token** — נשמר ב-`localStorage` תחת `token` ומצורף אוטומטית לבקשות RTK Query.

---

## ארכיטקטורה כללית

```
src/
├── app/store.jsx          # Redux Store
├── App.jsx                # Routes
├── main.jsx               # Provider + BrowserRouter
├── assets/                # תמונות, לוגו
└── features/
    ├── Admin/             # פאנל מנהל
    ├── Car/               # רכבים, מפות, מחירון
    ├── Order/             # הזמנות ונסיעות
    └── User/              # משתמשים, אימות, הרשמה
```

### מבנה מודול (Feature)

```
Feature/
├── components/   # רכיבי React — ממשק
├── redux/        # RTK Query (API) + Slice (state מקומי)
└── Style/        # CSS ייעודי לכל רכיב
```

### נקודת כניסה — `main.jsx`

```jsx
<BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
</BrowserRouter>
```

### Redux Store — `store.jsx`

| Slice / API | תפקיד |
|-------------|--------|
| `userApi` | קריאות API למשתמשים |
| `carApi` | קריאות API לרכבים |
| `orderApi` | קריאות API להזמנות |
| `user` (userSlice) | `currentUser`, `token`, `isAdmin` |
| `car` (carSlice) | state מקומי של רכבים |

---

## ניתוב (Routes) — `App.jsx`

| נתיב | רכיב | תיאור |
|------|------|--------|
| `/` | `MainPage` | דף הבית + כל המסכים הראשיים |
| `/order-details/:id` | `OrderDetails` | פירוט נסיעה שהושלמה |
| `/admin` | `AdminDashboard` | פאנל מנהל |
| `*` | `MainPage` | Fallback |

> רוב המסכים **לא** מוגדרים כ-Route נפרד — הם מנוהלים בתוך `MainPage` דרך `activeView`.

---

## לוגיקה מרכזית — `MainPage.jsx`

`MainPage` הוא הלב של האפליקציה. הוא מחזיק:

### State מרכזי

| State | תפקיד |
|-------|--------|
| `activeView` | איזה מסך להציג (`home`, `map`, `auth`...) |
| `userData` | נתוני הרשמה — שם, אימייל, רישיון, כרטיס אשראי, דגל אזרח חו"ל |
| `uploadData` | תמונות רישיון (קדמי, אחורי, סלפי) |
| `foreignUploadData` | מסמכי חו"ל (דרכון, ויזה, אישור כניסה) |
| `redirectTo` | לאן לנווט אחרי התחברות (למשל `map`, `orders`) |

### זיהוי משתמש מחובר

```jsx
const token = localStorage.getItem('token');
const loggedIn = !!currentUser || !!token;
```

- אם יש token אבל אין `currentUser` — קורא ל-`getCurrentUser` ומעדכן Redux
- אם המשתמש Admin (`userType === 1`) — מועבר אוטומטית ל-`/admin`

### מפת תצוגות (`activeView`)

| ערך | רכיב | לוגיקה |
|-----|------|--------|
| `home` | `HomeContent` | ברירת מחדל — גלריה + יתרונות |
| `auth` | `AuthPage` | נפתח כשצריך התחברות לפני פעולה |
| `register` | `Register` | מפת שלבי הרשמה |
| `questions` | `PersonalDetails` | טופס רב-שלבי + OTP |
| `upload` | `UploadDocuments` | העלאת רישיון |
| `foreign` | `UploadForeignDocuments` | רק לאזרחי חו"ל |
| `signature` | `Signature` | חתימה → שליחת `registerUser` |
| `profile` | `PersonalArea` | דורש התחברות |
| `map` | `GoogleMapWithClusters` | תהליך הזמנה |
| `pricing` | `PriceList` | מחירון |
| `orders` | `UserOrders` | דורש התחברות |
| `contact` | `ContactUs` | צור קשר |

### הגנת גישה ב-Sidebar

לחיצה על "הזמנות", "אזור אישי" או "הזמנה חדשה" ללא התחברות — שומרת את היעד ב-`redirectTo` ופותחת `AuthPage`.

### סיום הרשמה — `handleFinalRegistration`

אוסף את כל `userData`, התמונות והחתימה ל-DTO אחד ושולח ל-`POST Users/register`.  
בהצלחה — מודל "נרשמת בהצלחה" וחזרה ל-`home`.

---

## מה יש בכל תיקייה

### `src/features/User` — משתמשים ואימות

#### components

| קובץ | תפקיד |
|------|--------|
| `MainPage.jsx` | מסך ראשי — ניהול תצוגות, state הרשמה, logout |
| `MainLayout.jsx` | Navbar + Sidebar + אזור תוכן |
| `HomeContent.jsx` | דף הבית — גלריית רכבים, יתרונות, scroll effects |
| `AuthPage.jsx` | התחברות, שכחתי סיסמה, איפוס סיסמה |
| `Register.jsx` | מפת ויזואלית של 4 שלבי הרשמה |
| `PersonalDetails.jsx` | טופס פרטים אישיים + אימות OTP במייל |
| `UploadDocuments.jsx` | העלאת רישיון נהיגה (קדמי/אחורי) + סלפי |
| `UploadForeignDocuments.jsx` | דרכון, ויזה, אישור כניסה — לאזרחי חו"ל |
| `Signature.jsx` | חתימה דיגיטלית (`react-signature-canvas`) |
| `PersonalArea.jsx` | צפייה ועריכת פרטי משתמש |
| `ContactUs.jsx` | טופס צור קשר |

#### redux

| קובץ | תפקיד |
|------|--------|
| `userApi.jsx` | RTK Query — login, register, CRUD, OTP, שחזור סיסמה |
| `userSlice.jsx` | `currentUser`, `token`, `isAdmin` — מאזינים ל-login ו-getCurrentUser |

#### Style

`AuthPage.css`, `MainLayout.css`, `HomeContent.css`, `Register.css`, `PersonalDetails.css`, `UploadDocuments.css`, `Signature.css`, `PersonalArea.css`, `ContactUs.css`, `MainPage.css`

---

### `src/features/Car` — רכבים ומפות

#### components

| קובץ | תפקיד |
|------|--------|
| `GoogleMapWithClusters.jsx` | מפת Google Maps + תהליך הזמנה 4 שלבים |
| `GoogleMapWithMarker.jsx` | מפה עם סימון בודד |
| `RouteSidePanel.jsx` | בחירת תאריך/שעת התחלה וסיום + בדיקת חפיפת הזמנות |
| `CarSelectionList.jsx` | רשימת רכבים קרובים לפי מיקום וזמנים |
| `CoverageSidePanel.jsx` | בחירת כיסוי ביטוחי (waiver) |
| `CarGallery.jsx` | גלריית רכבים בדף הבית (Swiper) |
| `PriceList.jsx` | מחירון לפי סוג רכב |
| `CarAvailabilityModal.jsx` | מודל זמינות רכב |

#### redux

| קובץ | תפקיד |
|------|--------|
| `carApi.jsx` | שליפת רכבים, closest, available, עדכון דלק/ק"מ/סטטוס/נעילה, תחזוקה |
| `carSlice.jsx` | state מקומי של רכבים |

#### Style

`GoogleMapWithClusters.css`, `GoogleMapWithMarker.css`, `RouteSidePanel.css`, `CarSelectionList.css`, `CoverageSidePanel.css`, `CarGallery.css`, `PriceList.css`, `CarAvailabilityModal.css`

---

### `src/features/Order` — הזמנות ונסיעות

#### components

| קובץ | תפקיד |
|------|--------|
| `CreateOrder.jsx` | סיכום הזמנה + שליחה ל-API |
| `UserOrders.jsx` | רשימת הזמנות, ניהול נסיעה פעילה, polling |
| `OrderDetails.jsx` | פירוט נסיעה שהושלמה (`/order-details/:id`) |
| `CarInspectionModal.jsx` | שאלון מצב רכב לפני תחילת נסיעה |

#### redux

| קובץ | תפקיד |
|------|--------|
| `orderApi.jsx` | CRUD הזמנות, unlock/lock, סיום, ביטול, דיווחים, הארכה |
| `orderSlice.jsx` | slice (לא מחובר כרגע ל-store) |

#### Style

`CreateOrder.css`, `UserOrders.css`, `OrderDetails.css`, `CarInspectionModal.css`

---

### `src/features/Admin` — פאנל ניהול

#### components

| קובץ | תפקיד |
|------|--------|
| `AdminDashboard.jsx` | מסגרת + ניווט בין מסכי ניהול |
| `FleetManagement.jsx` | צפייה בצי, תחזוקה, נעילה — polling כל 5 שניות |
| `UserManagement.jsx` | חיפוש, חסימה/שחרור, מחיקה, יתרה |
| `OrderLogs.jsx` | יומן הזמנות, סינון, סימון כשולם, ביטול |

#### Style

`AdminDashboard.css`, `FleetManagement.css`, `UserManagement.css`, `OrderLogs.css`

---

## לוגיקה לפי רכיבים מרכזיים

### `AuthPage.jsx` — אימות

שלוש תצוגות פנימיות (`view`):

| תצוגה | פעולה |
|-------|--------|
| `login` | התחברות — `loginUser` → שמירת token → `getCurrentUser` → `setUser` |
| `forgot` | שליחת קוד למייל — `forgotPassword` |
| `reset` | איפוס סיסמה — `resetPassword` עם קוד + סיסמה חדשה |

**לוגיקת התחברות:**
1. שליחת `{ email, pass }` ל-`Users/login`
2. שמירת token ב-localStorage
3. שליפת `Users/current` ועדכון Redux
4. Admin → `navigate('/admin')` | לקוח → `onLoginSuccess()` (חוזר ל-`redirectTo`)
5. שגיאה 404 → הפניה אוטומטית להרשמה

**UI:** כרטיס מרכזי, gradient, toggle הצגת סיסמה, באנרי הצלחה/שגיאה.

---

### `PersonalDetails.jsx` — הרשמה, שלב 1

טופס רב-שלבי (`step` 1–4):

1. שם, כתובת, טלפון
2. פרטי רישיון + תאריך לידה + דגל "נהג חדש" / "אזרח חו"ל"
3. פרטי כרטיס אשראי (עם פורמט MM/YY)
4. OTP — שליחת קוד (`sendVerificationCode`) + אימות (`verifyRegistrationCode`)

ולידציה בכל שלב לפני מעבר הלאה.

---

## מערכת המפה והזמנה

מסך **"הזמנה חדשה"** (`activeView: map`) מרכז את כל תהליך ההזמנה סביב מפת Google Maps.  
הרכיב הראשי הוא `GoogleMapWithClusters.jsx`, שמנהל 4 שלבים, side panels, וקריאות API לרכבים קרובים.

### מבנה המסך

```
┌─────────────────────────────────────────────────────┐
│  Navbar (MainLayout)                                │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  ┌─────────────┬───────────────────────┐  │
│ (ימין)   │  │ פאנל שלבים  │   אזור תוכן ראשי      │  │
│          │  │ (שמאל)      │   מפה / רשימה / סיכום │  │
│          │  │ 1. מסלולים  │                       │  │
│          │  │ 2. בחירת רכב│                       │  │
│          │  │ 3. כיסויים  │                       │  │
│          │  └─────────────┴───────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

- **פאנל שלבים (שמאל)** — 3 pills: מסלולים → בחירת רכב → כיסויים. ניתן לחזור לשלב קודם אם הוא הושלם (`completedSteps`).
- **אזור מרכזי** — משתנה לפי השלב: מפה, רשימת רכבים, כיסוי ביטוחי, או סיכום הזמנה.
- **RouteSidePanel** — נפתח כ-overlay מעל המפה (לא מחליף את המפה).

---

### `GoogleMapWithClusters.jsx` — מפת Google Maps

**טעינת המפה:**

```jsx
useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  language: 'iw',
  region: 'IL'
})
```

**עיצוב המפה (`WHITE_MINIMAL_STYLE`):**
- רקע לבן, כבישים אפורים, ללא אייקוני ברירת מחדל
- `disableDefaultUI: true` — רק zoom control בפינה שמאל-תחתון
- מרכז ברירת מחדל: `{ lat: 32.05, lng: 34.95 }` (אם אין מיקום משתמש)

**Markers על המפה:**

| Marker | אייקון | פעולה |
|--------|--------|--------|
| מיקום המשתמש | `/assets/my_position_icon.png` | מוצג אחרי Geolocation |
| רכבים | 4 צבעים (`car_icon_purple/light_blue/red/grey`) | לחיצה → פותח `RouteSidePanel` עם הרכב |

**Clustering:** רכבים קרובים מקובצים ב-`MarkerClusterer` — zoom in מפרק clusters.

**Geolocation — `handleLocationClick`:**
1. `navigator.geolocation.getCurrentPosition`
2. שמירת `{ lat, lng }` ב-`userLocation`
3. `shouldFetchClosest = true` → קריאה ל-`GET Cars/closest`
4. המפה עוברת ל-zoom 16 על המיקום
5. שגיאה → toast "יש לאשר הרשאות מיקום בדפדפן"

**כפתור "המיקום שלי":** כפתור צף על המפה שמפעיל `handleLocationClick`.

**עיבוד רכבים (`processedCars`):**
- מקור: `closestCarsFromServer` (אם קיים) או `carsList` מה-props
- סינון רכבים ללא מיקום גאוגרפי
- מיון לפי מרחק
- הוספת `position`, `carIcon`, `distance`

---

### שני מסלולי כניסה ל-`RouteSidePanel`

**מסלול א — מהמפה (לחיצה על marker):**
```
לחיצה על רכב → pendingSelectedCar + originSelection='map'
  → RouteSidePanel (עם פרטי הרכב)
  → אישור זמנים → קפיצה ישירה לשלב 3 (כיסויים)
     + selectedCar = הרכב שנלחץ
```

**מסלול ב — מה-sidebar (שלב 1 "מסלולים"):**
```
לחיצה על שלב 1 → RouteSidePanel (ללא רכב)
  → אישור זמנים → שלב 2 (CarSelectionList)
  → Geolocation (אם עדיין אין) → שליפת רכבים קרובים
```

**עריכת זמנים מרשימת הרכבים:**
לחיצה על "שנה זמנים" ב-`CarAvailabilityModal` → `onEditTime` → `RouteSidePanel` עם הרכב + `editingTimeFromCarModal=true` → חזרה לשלב 2.

---

### `RouteSidePanel.jsx` — בחירת זמנים

פאנל overlay לבחירת **איסוף** ו-**החזרה**.

**לוגיקת זמנים:**
- עיגול ל-5 דקות (`roundTo5`)
- ברירת מחדל: עכשיו → +1 שעה
- מינימום: שעה אחת בין התחלה לסיום
- שינוי איסוף — מזיז את ההחזרה בהתאם (שומר על משך הנסיעה)
- כפתורי +/- לימים ושעות
- כפתור "איפוס" — חזרה לברירת מחדל

**ולידציות לפני אישור:**

| בדיקה | הודעה |
|-------|--------|
| זמן התחלה יותר מ-15 דק' בעבר | "הזמן שנבחר עבר" |
| משתמש לא מחובר | "יש להתחבר למערכת" |
| חפיפת הזמנות (`checkUserOverlap`) | "יש לך כבר הזמנה קיימת בטווח הזה" |

**פלט ל-parent (`onConfirm`):**
```jsx
{ start: Date, end: Date, selectedCar?, totalDays, totalHours, billableHours }
```

---

### `CarSelectionList.jsx` — בחירת רכב

מוצג בשלב 2 — רשת כרטיסי רכב במקום המפה.

**API:** `GET Cars/closest?lat=&lng=&start=&end=` — **polling כל 3 שניות**.

**פילטרים:**

| פילטר | ערכים |
|-------|--------|
| חיפוש | לפי דגם |
| קטגוריה | מיני / משפחתי / גדול / מסחרי / יוקרה |
| מושבים | 5 / 7 / 9 |
| אזור | רובע A–D (`regionId`) |
| מרחק | slider 0.5–10 ק"מ |

**סטטוסי רכב (`getStatusInfo`):**

| status | תווית | ניתן להזמין? |
|--------|--------|-------------|
| 0 | פנוי | כן |
| 1 | פנוי חלקית | כן |
| 2 | תפוס | לא |
| 3 | בטיפול | לא |

**כרטיס רכב מציג:** תמונה, דגם, מחיר/שעה, חניה, דלק%, מרחק, מושבים, תג "פופולרי".

**לחיצה על כרטיס** → `CarAvailabilityModal` → אישור → `onSelectCar` → מעבר לשלב 3.

---

### `CarAvailabilityModal.jsx` — מודל זמינות

נפתח לפני בחירה סופית של רכב. מציג:
- תמונה, דגם, מיקום חניה
- badge סטטוס (צבע לפי זמינות)
- **הודעת זמינות חכמה** — לפי `blockingOrderStart/End` וטווח הזמנים שנבחר:
  - תפוס → "צפוי להתפנות ב-[שעה]"
  - פנוי חלקית → חלונות זמן פנויים לפני/אחרי חסימה
  - תחזוקה → "לא ניתן להזמנה"
- כפתור **"שנה זמנים"** → חוזר ל-`RouteSidePanel`
- כפתור **"הזמן נסיעה עכשיו"** — פעיל רק ל-status 0 (פנוי)

---

### `CoverageSidePanel.jsx` — כיסוי ביטוחי

שלב 3 — בחירת **ביטול השתתפות עצמית (waiver)**.

**תמחור waiver:**
- 3₪ לשעה / 50₪ ליום
- חישוב לפי `billableHours` מטווח הזמנים

**חסימת שבת:** אם ההתחלה או הסיום נופלים בשישי מ-16:00 או בשבת עד 20:00 — לא ניתן לאשר.

**שמירה:** בחירת waiver נשמרת ב-`localStorage` (`coverage_waiver`).

**פלט:** `{ billableHours, hasWaiver }` → מעבר לשלב 4 (סיכום).

---

### `GoogleMapWithMarker.jsx` — מפה עם marker בודד

רכיב עצמאי לתצוגת **רכב יחיד** על מפה:
- מקבל `carLocation` (latitude/longitude) + `carTitle`
- marker סגול, zoom 16, אותו סגנון מינימלי לבן
- מתאים להצגת מיקום רכב בודד

---

### 4 שלבי ההזמנה — סיכום

```
שלב 1 — מסלולים (RouteSidePanel)
  ↓ בחירת תאריכים + checkUserOverlap
שלב 2 — בחירת רכב (CarSelectionList + CarAvailabilityModal)
  ↓ Geolocation → GET Cars/closest (polling)
שלב 3 — כיסויים (CoverageSidePanel)
  ↓ waiver + בדיקת שבת
שלב 4 — סיכום (CreateOrder)
  ↓ POST Orders
```

**State מרכזי ב-`GoogleMapWithClusters`:**

| State | תפקיד |
|-------|--------|
| `currentStep` | שלב נוכחי (1–3) |
| `completedSteps` | שלבים שהושלמו (מאפשר חזרה) |
| `userLocation` | מיקום GPS |
| `orderPayload` | תאריכים + כיסוי |
| `selectedCar` / `pendingSelectedCar` | רכב נבחר / רכב בלחיצה מהמפה |
| `showSidePanel` | האם `RouteSidePanel` פתוח |
| `showGridFull` | האם להציג רשימת רכבים במקום מפה |
| `originSelection` | `'map'` אם הגיעו מלחיצה על marker |
| `shouldFetchClosest` | trigger לשליפת רכבים קרובים |

---

### `CreateOrder.jsx` — יצירת הזמנה

בונה DTO:

```jsx
{
  userId, startTime, expectedEndTime, carId,
  wantsInsuranceUpgrade, pricingType, totalDays, totalHours, status: 1
}
```

שולח ל-`POST Orders`. בהצלחה — הודעה וחזרה לדף הבית.

---

### `UserOrders.jsx` — ניהול נסיעות

**Polling:** רענון הזמנות ורכבים כל 3 שניות.

**פעולות לפי סטטוס הזמנה:**

| פעולה | API |
|-------|-----|
| פתיחת רכב | `unlockCar` |
| נעילת רכב | `updateCarLock` |
| דיווח תחילה | `submitStartReport` (דרך `CarInspectionModal`) |
| דיווח תדלוק | `reportRefuel` + העלאת קבלה |
| הארכת נסיעה | `extendOrder` |
| סיום נסיעה | `finishOrder` — דורש נעילה פיזית |
| ביטול | `cancelOrder` — עלות לפי זמן לפני התחלה |
| החלפת רכב | `confirmReplacement` |

**לוגיקת ביטול:**
- 24+ שעות לפני → בחינם
- 2–24 שעות → דמי ביטול שעה
- פחות מ-2 שעות → 50% מעלות ההזמנה

**חישוב איחור:** `calculateLateMinutes` — השוואת `expectedEndTime` לזמן נוכחי/סיום בפועל.

---

### `CarInspectionModal.jsx` — דיווח מצב רכב

שאלון לפני תחילת נסיעה: ניקיון פנים/חוץ, מזגן, פנצ'ר, נזק חדש + תיאור נזק.  
נשלח ל-`Orders/{id}/submit-start-report`.

---

### `AdminDashboard.jsx` — הגנת גישה

```jsx
const isAdmin = user?.userType === 1 || user?.userType === 'admin';
if (!isAdmin) navigate('/');
```

**תצוגות פנימיות** (`view`): `stats` | `fleet` | `users` | `orders`  
נשמרות ב-`localStorage` (`adminView`) — שורדות ריענון.

---

### `userSlice.jsx` — state משתמש

| שדה | מקור |
|-----|------|
| `token` | localStorage / login |
| `currentUser` | login / getCurrentUser / setUser |
| `isAdmin` | `userType === 1` |

**Matchers:**
- `loginUser.fulfilled` → שמירת token + user
- `getCurrentUser.fulfilled` → עדכון user (גם אחרי F5)

---

## זרימות משתמש

### הרשמה

```
Register → PersonalDetails (OTP) → UploadDocuments
  → [אזרח חו"ל: UploadForeignDocuments]
  → Signature → POST /Users/register → home
```

### הזמנה חדשה

```
"הזמנה חדשה" → [auth אם נדרש] → map
  → RouteSidePanel → CarSelectionList → CoverageSidePanel → CreateOrder → POST /Orders
```

### ניהול נסיעה

```
orders → UserOrders
  → unlock → CarInspectionModal → נסיעה
  → [refuel / extend] → finishOrder → /order-details/:id
```

### Admin

```
login (Admin) → /admin
  → stats / fleet / users / orders
```

---

## API — Endpoints עיקריים

### Users (`userApi.jsx`)

| Endpoint | שימוש |
|----------|--------|
| `POST Users/login` | התחברות |
| `POST Users/register` | הרשמה |
| `GET Users/current` | משתמש מחובר |
| `POST Users/forgot-password` | שליחת קוד |
| `POST Users/reset-password` | איפוס סיסמה |
| `GET/PUT/DELETE Users/{id}` | CRUD |
| `PATCH Users/toggle-block/{id}` | חסימה/שחרור |

### Cars (`carApi.jsx`)

| Endpoint | שימוש |
|----------|--------|
| `GET Cars` | כל הרכבים |
| `GET Cars/closest` | רכבים קרובים |
| `GET Cars/available` | זמינות לפי תאריך |
| `PATCH Cars/{id}/fuel` | עדכון דלק |
| `PATCH Cars/{id}/toggle-lock` | נעילה |
| `PATCH Cars/{id}/send-to-maintenance` | שליחה לתחזוקה |

### Orders (`orderApi.jsx`)

| Endpoint | שימוש |
|----------|--------|
| `POST Orders` | יצירת הזמנה |
| `GET Orders/user/{userId}` | הזמנות משתמש |
| `POST Orders/{id}/unlock` | פתיחת רכב |
| `POST Orders/{id}/submit-start-report` | דיווח תחילה |
| `PATCH Orders/{id}/finish` | סיום נסיעה |
| `PATCH Orders/cancel/{id}` | ביטול |
| `POST Orders/extend/{id}` | הארכה |

---

## פריסה — `MainLayout.jsx`

- **Navbar** — לוגו (חזרה ל-home), ברכת שלום, הזמנה חדשה, הרשמה/התחברות/התנתקות
- **Sidebar ימני** — אזור אישי, הזמנות, מחירון, צור קשר
- **אזור מרכזי** — `{children}` לפי `activeView`

---

## City Car

Frontend מלא לשירות השכרת רכבים שיתופית — ממשק לקוח עם הרשמה, מפות, הזמנות וניהול נסיעות; ופאנל מנהל לצי, משתמשים ויומן הזמנות.
