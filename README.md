# ModaMatch - Fashion Outfit Recommendation System

A modern fashion outfit recommendation website that helps users browse clothing items and receive personalized outfit suggestions based on their preferences using an AI-powered expert system.

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Live)** | [https://alisulimanali004-wq.github.io/modeMatch/frontend/](https://alisulimanali004-wq.github.io/modeMatch/frontend/) |
| **Backend API** | [https://moda-match-production-36f5.up.railway.app](https://moda-match-production-36f5.up.railway.app) |
| **API Health Check** | [https://moda-match-production-36f5.up.railway.app/api/health](https://moda-match-production-36f5.up.railway.app/api/health) |
| **Source Code** | [https://github.com/alisulimanali004-wq/modeMatch](https://github.com/alisulimanali004-wq/modeMatch) |

---

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- jQuery
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Cloud Database)
- JWT (JSON Web Tokens) for Authentication
- bcryptjs for Password Hashing

### Deployment
- **Frontend Hosting:** GitHub Pages
- **Backend Hosting:** Railway
- **Database:** MongoDB Atlas

---

## Features

- **User Authentication:** Register, Login, and Password Reset
- **Outfit Browsing:** Browse clothing items by category
- **Smart AI Recommendations** (280+ outfit combinations):
  - Gender detection (with context understanding like "my wife", "my brother")
  - Season detection (temperature-based & weather-based)
  - 14 Occasions: casual, formal, romantic, party, wedding, interview, graduation, funeral, travel, beach, picnic, concert, sporty, first date
  - 16 Color preferences with styling tips
  - 6 Style preferences: elegant, modern, simple, bold, vintage, streetwear
  - Budget-aware suggestions (affordable vs luxury)
  - Time of day awareness (morning, evening, night)
  - Age group detection (young, adult, mature)
  - **Bilingual support:** English & Arabic
- **Separate Collections:** Dedicated pages for Men and Women
- **Contact Form:** Users can send messages
- **Responsive Design:** Works on all devices

---

## Project Structure

```
ModaMatch/
├── backend/
│   ├── controllers/
│   │   └── aiController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Outfit.js
│   │   └── Contact.js
│   ├── routes/
│   │   └── ai.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── js/
│   │   └── api.js
│   ├── images/
│   ├── index.html
│   ├── login.html
│   ├── sign in.html
│   ├── shop.html
│   ├── men.html
│   ├── women.html
│   └── contact.html
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/outfits` | Get all outfits |
| POST | `/api/outfits/suggest` | Get outfit suggestions |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/ai/recommend` | AI recommendations |
| POST | `/api/ai/recommend-text` | Text-based AI recommendations |

---

## How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/alisulimanali004-wq/modeMatch.git
cd modeMatch
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

Start the server:
```bash
node server.js
```

### 3. Setup Frontend
Open the `frontend` folder with **Live Server** extension in VS Code, or use:
```bash
npx serve frontend
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (development/production) |

---

## Database Schema

### User Model
- firstName, lastName, email, password
- phone, gender
- Body measurements: height, weight, shoulderWidth, chestSize, waistSize

### Outfit Model
- season, event, gender, bodyShape
- top, bottom, shoes, accessories
- colors, recommendedStores

### Contact Model
- firstName, lastName, email, message

---

## Screenshots

The website includes:
- Modern landing page with image carousel
- User registration and login forms
- Interactive outfit suggestion system
- Men's and Women's collection pages
- Contact form

---

## Author

**ModaMatch Development Team**

---

## License

This project is for educational purposes.
