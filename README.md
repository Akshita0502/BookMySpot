# BookMySpot 🎟️

A full-stack seat and event booking web application built with the MERN stack. Users can browse events, request bookings via OTP email verification, and track their booking status. Admins can create events, manage bookings, and confirm payments manually.

🔗 **Live Demo:** [book-my-spot-eta.vercel.app](https://book-my-spot-eta.vercel.app)

---

## Features

**User**
- Register and login with JWT authentication
- OTP email verification on signup
- Browse all available events
- Book events with OTP-based confirmation
- View and cancel booking requests from dashboard

**Admin**
- Create, manage, and delete events
- View all booking requests with user details
- Approve bookings as paid or unpaid
- Reject/cancel user bookings
- Dashboard with revenue, paid clients, and pending requests stats

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Project Structure

```
BookMySpot/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar
│       ├── context/         # Auth context
│       ├── pages/           # Home, Login, Register, Dashboard, Admin, EventDetail
│       └── utils/           # Axios instance
├── server/                  # Express backend
│   ├── controllers/         # Auth, Booking, Event controllers
│   ├── middleware/          # JWT protect, admin guard
│   ├── models/              # User, Event, Booking, OTP schemas
│   ├── routes/              # Auth, Booking, Event routes
│   ├── utils/               # Email utility
│   └── index.js             # Entry point
```

---

## API Routes

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/verify-otp` | Verify account OTP |
| POST | `/api/auth/login` | Login user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event by ID |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings/send-otp` | Send booking OTP |
| POST | `/api/bookings` | Book an event |
| GET | `/api/bookings/my` | Get my bookings |
| PUT | `/api/bookings/:id/confirm` | Confirm booking (admin) |
| DELETE | `/api/bookings/:id/cancel` | Cancel booking |

---

## Local Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Gmail account with App Password

### Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
node index.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `EMAIL_USER` | Gmail address for sending OTPs |
| `EMAIL_PASS` | Gmail App Password |
| `PORT` | Backend server port (default: 5000) |

---

## Deployment

- **Frontend** deployed on [Vercel](https://vercel.com)
- **Backend** deployed on [Render](https://render.com)
- **Database** hosted on [MongoDB Atlas](https://mongodb.com/cloud/atlas)

---

## Screenshots

<img width="1853" height="904" alt="image" src="https://github.com/user-attachments/assets/e24b9c52-6206-42fe-8269-b647554e750d" />

---

## Author

**Akshita Singh**  
[GitHub](https://github.com/Akshita0502)
