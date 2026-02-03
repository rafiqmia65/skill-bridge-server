Absolutely! I can polish your README into a **clean, professional, backend-focused documentation** with better structure, flow diagrams, and explanations so that anyone looking at it will quickly understand your backend. Here’s the improved version:

---

# SkillBridge Backend 🎓

## Project Overview

**SkillBridge** is a backend API for a tutoring platform that connects **students** with **tutors**.
It provides features for authentication, user management, tutor profiles, booking management, reviews, categories, and admin operations.

This backend is built to be **RESTful**, secure, and type-safe, using TypeScript and Prisma ORM.

---

## Tech Stack

- **Node.js** + **Express.js** – REST API framework
- **TypeScript** – Type-safe backend
- **Prisma ORM** – PostgreSQL database management
- **Better Auth** – Authentication & session management
- **ESLint + Prettier** – Code formatting and style enforcement

---

## Roles & Permissions

| Role        | Description                | Key Permissions                                        |
| ----------- | -------------------------- | ------------------------------------------------------ |
| **STUDENT** | Learners who book sessions | Create bookings, view own bookings, leave reviews      |
| **TUTOR**   | Teaching experts           | Create/update profile, set availability, view bookings |
| **ADMIN**   | Platform moderator         | Manage users, categories, bookings                     |

---

## Database Models

### 1. **User**

Represents a platform user (Student, Tutor, Admin).

- Fields: `id`, `name`, `email`, `password`, `role`, `isBanned`, `emailVerified`, `image`
- Relations:
  - `tutorProfile` (1:1)
  - `studentBookings` (1:N)
  - `tutorBookings` (1:N)
  - `reviews` (1:N)
  - `sessions` (1:N)
  - `accounts` (1:N)

### 2. **TutorProfile**

Represents additional information for tutors.

- Fields: `id`, `userId`, `bio`, `pricePerHr`
- Relations:
  - `categories` (M:N)
  - `availability` (1:N)
  - `bookings` (1:N)

### 3. **Booking**

Represents a student booking with a tutor.

- Fields: `id`, `studentId`, `tutorId`, `tutorProfileId`, `date`, `status`
- Relations:
  - `review` (1:1)
  - `tutorProfile` (N:1)
  - `student` (N:1)

### 4. **Review**

Represents student feedback for a booking.

- Fields: `id`, `bookingId`, `studentId`, `rating`, `comment`

### 5. **Category**

Represents a subject or skill for tutors.

- Fields: `id`, `name`
- Relations: Many-to-many with TutorProfile

### 6. **Session & Account**

- Handle authentication sessions, cookies, and OAuth provider accounts

---

## API Endpoints

### **Authentication**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login a user        |
| GET    | `/api/auth/me`       | Get current session |

### **Users (Admin)**

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/api/admin/users`     | Get all users                  |
| PATCH  | `/api/admin/users/:id` | Update user status (ban/unban) |

### **Tutors**

| Method | Endpoint                  | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| GET    | `/api/tutors`             | Get all tutors (with optional filters) |
| GET    | `/api/tutors/:id`         | Get single tutor details               |
| PUT    | `/api/tutor/profile`      | Create or update tutor profile         |
| PUT    | `/api/tutor/availability` | Update tutor availability slots        |

### **Categories**

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/api/categories` | Create category (Admin) |
| GET    | `/api/categories` | List all categories     |

### **Bookings**

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/bookings`     | Create a booking (Student)        |
| GET    | `/api/bookings`     | List logged-in student's bookings |
| GET    | `/api/bookings/:id` | Get single booking details        |

### **Reviews**

| Method | Endpoint       | Description                           |
| ------ | -------------- | ------------------------------------- |
| POST   | `/api/reviews` | Create review for a booking (Student) |

---

## Backend Flow Diagrams

### **1. Authentication Flow**

```
[Client] --POST /register--> [Auth Proxy] --forward--> [Better Auth]
[Client] --POST /login--> [Auth Proxy] --forward--> [Better Auth]
[Client] --GET /me--> [Auth Proxy] --forward--> [Better Auth Session]
```

### **2. Role-Based Authorization**

```
[Request with session]
      |
      v
[Authorize Middleware] --checks--> [Allowed Roles?]
      | Yes
      v
[Controller] --> [Service] --> [Prisma DB] --> [Response]
      | No
      v
[403 Forbidden]
```

### **3. Booking Creation Flow**

```
[Student POST /bookings]
      |
      v
[Authorize Middleware -> Role=STUDENT]
      |
      v
[BookingController.createBooking]
      |
      v
[BookingService.createBooking]
      |
      v
[Prisma: Insert booking]
      |
      v
[Return 201 Booking Created]
```

### **4. Tutor Profile Management Flow**

```
[Tutor PUT /tutor/profile]
      |
      v
[Authorize Middleware -> Role=TUTOR]
      |
      v
[TutorController.upsertTutorProfile]
      |
      v
[TutorService.upsertTutorProfile]
      |
      v
[Prisma: Upsert TutorProfile, connect categories]
      |
      v
[Return 200 Profile Saved]
```

---

## Recent Commit

**chore: add comments and fix authorize middleware types**

- Added detailed comments for all controllers, services, and routers
- Fixed TypeScript type for `req.user.role` in authorize middleware
- Enforced strict role types (`"ADMIN" | "TUTOR" | "STUDENT"`)
- Improved maintainability, readability, and type safety

---

## Notes

- All private routes require authentication.
- Role-based access control is strictly enforced via middleware.
- API responses follow the format:
