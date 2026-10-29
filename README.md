# Shoreline: Interactive Beach Tourism (MERN)

Explore beaches on a map, check safety flags, weather and tide, book activities and leave reviews.

- **Client:** React 18, Vite, React Router, Context API, Axios, Tailwind CSS, React-Leaflet
- **Server:** Node.js, Express 5, Mongoose, JWT, bcrypt, helmet, express-validator, rate limiting
- **Database:** MongoDB (local or Atlas). Collections: Users, Beaches, Activities, Bookings, Reviews

## Run it (needs Node 18+ and MongoDB)

```bash
# 1. Server
cd server
cp .env.example .env        # set MONGO_URI and JWT_SECRET
npm install
npm run seed                # loads sample beaches and demo users
npm run dev                 # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to the server)
```

Demo logins after seeding: `admin@beach.test / Admin@123` and `tourist@beach.test / Tourist@123`.

## API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/auth/register | public | Sign up (tourist or operator) |
| POST | /api/auth/login | public | Log in, returns JWT |
| GET | /api/auth/me | user | Current user |
| GET | /api/beaches | public | List; filters `q`, `activity`, `lat`, `lng`, `radius`, `sort` |
| GET | /api/beaches/:id | public | Beach with activities and reviews |
| GET | /api/beaches/:id/weather | public | Weather (cached 10 min) and estimated tide |
| POST/PUT/DELETE | /api/beaches[/:id] | admin, operator | Manage beaches (operators: own only) |
| POST | /api/beaches/:id/activities | admin, operator | Add a bookable activity |
| POST | /api/bookings | user | Book (atomic slot check) |
| GET | /api/bookings/mine | user | My bookings |
| PUT | /api/bookings/:id/cancel | user | Cancel and free the spots |
| POST | /api/reviews | user | Add a review (one per beach) |

## Notes

- Weather returns sample data until you set `OPENWEATHER_API_KEY` in `server/.env`.
- The tide chart is an estimate from a sine model. Swap in a tide API for real data.
- Seed coordinates are placeholders. Replace them with beaches from your region.
- Admin accounts come only from the seed script; sign-up creates tourists or operators.
- To deploy: client on Vercel/Netlify (set the API base URL), server on Render, database on MongoDB Atlas.
