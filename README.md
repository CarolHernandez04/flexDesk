# FlexDesk - Office Booking System

A production-ready web application for managing office desk and meeting room bookings in hybrid work environments. Built with Next.js 14+, TypeScript, Prisma ORM, PostgreSQL, and NextAuth.js.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with NextAuth.js
- **Desk Booking System**: Book available desks with time slot selection (Morning/Afternoon/Full Day)
- **Real-time Availability**: View desk status in real-time
- **Booking Management**: View, update, and cancel your reservations
- **Meeting Room Reservations**: Book conference and meeting rooms
- **Admin Dashboard**: Management capabilities for administrators

### Technical Features
- ✅ Server-Side Rendering (SSR) with Next.js 14 App Router
- ✅ Type-Safe Development with TypeScript
- ✅ Database ORM with Prisma and PostgreSQL
- ✅ Enterprise Authentication with NextAuth.js
- ✅ Input Validation with Zod
- ✅ Responsive Design with Tailwind CSS (Mobile, Tablet, Desktop)
- ✅ SEO Optimization with Metadata
- ✅ Protected Routes with Middleware
- ✅ Server Actions for secure mutations
- ✅ API Routes for RESTful endpoints
- ✅ Environment configuration with best practices

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | NextAuth.js 4+ |
| **Styling** | Tailwind CSS 4 |
| **Validation** | Zod |
| **Security** | bcryptjs for password hashing |
| **Deployment** | Vercel-ready |

## 📦 Project Structure

```
flexdesk/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── register/         # User registration
│   │   │   └── [...nextauth]/    # NextAuth.js configuration
│   │   ├── desks/                # Desk management endpoints
│   │   └── bookings/             # Booking CRUD endpoints
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── dashboard/                # User dashboard (protected)
│   ├── layout.tsx                # Root layout with SRP
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── navbar.tsx                # Navigation component
│   ├── button.tsx                # Button component
│   ├── tabs.tsx                  # Tabs component
│   ├── loading-skeleton.tsx       # Loading states
│   └── session-provider.tsx       # NextAuth wrapper
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client instance
│   └── utils.ts                  # Helper functions & constants
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database models
│   └── seed.ts                   # Sample data
├── types/                        # TypeScript definitions
│   └── next-auth.d.ts            # NextAuth type extensions
├── middleware.ts                 # Protected route middleware
├── .env.example                  # Environment variables template
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── package.json                  # Project dependencies
```

## 🏗️ Database Schema

### Models

#### User
```typescript
- id: String (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String (Optional)
- role: UserRole (ADMIN | EMPLOYEE)
- department: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
- bookings: Booking[]
```

#### Desk
```typescript
- id: String (Primary Key)
- identifier: String (Unique) - e.g., "DESK-A1"
- status: DeskStatus (AVAILABLE | OCCUPIED | MAINTENANCE)
- department: String (Optional)
- location: String (Optional) - Floor/Zone
- features: String[] - JSON array
- createdAt: DateTime
- updatedAt: DateTime
- bookings: Booking[]
```

#### Booking
```typescript
- id: String (Primary Key)
- userId: String (Foreign Key)
- deskId: String (Foreign Key)
- date: DateTime
- timeSlot: TimeSlot (MORNING | AFTERNOON | FULL_DAY)
- status: BookingStatus (PENDING | CONFIRMED | CANCELLED)
- notes: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
- cancelledAt: DateTime (Optional)
- user: User
- desk: Desk
```

#### MeetingRoom
```typescript
- id: String (Primary Key)
- name: String
- capacity: Int
- floor: Int (Optional)
- location: String (Optional)
- features: String[]
- status: DeskStatus
- createdAt: DateTime
- updatedAt: DateTime
- bookings: RoomBooking[]
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm or yarn or pnpm
- PostgreSQL 12+ (local or managed service)

### Step 1: Clone and Install Dependencies

```bash
cd /path/to/proyecto
npm install
```

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your configuration:

```bash
cp .env.example .env.local
```

**Edit `.env.local`:**

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/flexdesk"

# NextAuth (Required)
NEXTAUTH_SECRET="your-very-long-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"
```

**For Production:**
- Generate a strong `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Use your Vercel/production domain for `NEXTAUTH_URL`
- Set up PostgreSQL with a managed service (Railway, Supabase, AWS RDS, etc.)

### Step 3: Set Up Database

Push the schema to your PostgreSQL database:

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### Step 4: Seed Sample Data

Populate the database with demo desks and users:

```bash
npm run db:seed
```

**Demo Credentials:**
- Admin: `admin@flexdesk.com` / `admin123`
- Employee 1: `john@flexdesk.com` / `user123`
- Employee 2: `jane@flexdesk.com` / `user123`

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### For Employees

1. **Register/Login**: Create an account or sign in
2. **Book a Desk**: 
   - Navigate to Dashboard → "Book a Desk"
   - Select date and department (optional)
   - Choose an available desk
   - Select time slot (Morning/Afternoon/Full Day)
   - Click "Book This Desk"
3. **Manage Bookings**:
   - View all bookings in "My Bookings" tab
   - Cancel bookings with confirmation modal
   - View booking history

### For Administrators

- Access admin panel for desk and room management
- Monitor office space utilization
- Manage user roles and permissions
- Generate usage reports (future enhancement)

## 🔐 Security Features

### Authentication & Authorization
- Secure password hashing with bcryptjs
- JWT-based sessions with NextAuth.js
- Protected routes via middleware
- Role-based access control (RBAC)
- CSRF protection built-in

### Data Protection
- Server-side validation with Zod
- SQL injection prevention via Prisma ORM
- Secure API endpoints with authentication checks
- Environment variables for sensitive configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy:

```bash
git push origin main
```

### Alternative Platforms

**Railway:**
```bash
railway init
railway up
```

**Docker:**
```bash
docker build -t flexdesk .
docker run -p 3000:3000 flexdesk
```

## 📝 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Login
```http
POST /api/auth/[...nextauth]
```
(Handled by NextAuth.js)

### Desk Endpoints

#### Get Available Desks
```http
GET /api/desks?date=2024-04-15&department=Engineering
```

**Query Parameters:**
- `date` (optional): ISO date string
- `department` (optional): Department filter

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "deskId": "desk-123",
  "date": "2024-04-15T00:00:00Z",
  "timeSlot": "MORNING",
  "notes": "Optional notes"
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

#### Update Booking
```http
PUT /api/bookings/[id]
Authorization: Bearer <token>
```

#### Cancel Booking
```http
DELETE /api/bookings/[id]
Authorization: Bearer <token>
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration with validation
- [ ] User login with incorrect credentials
- [ ] Book desk for available time slot
- [ ] Prevent double-booking same desk
- [ ] Cancel booking with confirmation
- [ ] View booking history
- [ ] Responsive design on mobile
- [ ] Protected routes redirect to login
- [ ] Admin can access admin routes

### Running Linter

```bash
npm run lint
```

## 📊 Database Queries

### Popular Desks

```sql
SELECT desk.identifier, COUNT(*)
FROM bookings
JOIN desks ON bookings.desk_id = desks.id
WHERE bookings.created_at > NOW() - INTERVAL '30 days'
GROUP BY desk.id
ORDER BY COUNT(*) DESC;
```

### Peak Usage Times

```sql
SELECT time_slot, COUNT(*) as bookings
FROM bookings
WHERE status = 'CONFIRMED'
GROUP BY time_slot
ORDER BY COUNT(*) DESC;
```

## 🔧 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | - | Session encryption key |
| `NEXTAUTH_URL` | ✅ | - | Application URL |
| `NEXTAUTH_URL_INTERNAL` | ❌ | Same as above | Internal URL for server |
| `NODE_ENV` | ❌ | `development` | Execution environment |

## 🚨 Troubleshooting

### Database Connection Error
```
Error: getaddrinfo ENOTFOUND localhost
```
**Solution**: Ensure PostgreSQL is running and `DATABASE_URL` is correct

### Authentication Issues
```
error: NEXT_PUBLIC_NEXTAUTH_SECRET not set
```
**Solution**: Generate with `openssl rand -base64 32` and add to `.env.local`

### Prisma Type Errors
```bash
npm run prisma:generate
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact development team

---

**Built with ❤️ for modern hybrid workplaces**
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
