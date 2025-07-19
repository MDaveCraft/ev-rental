# HYMN EV Rentals – Electric Vehicle Rental Management System

## 📘 Introduction

### 🔹 Purpose
This project aims to build an electric vehicle (EV) rental management system — **HYMN EV Rentals** — that facilitates customers to rent EVs easily while giving administrators tools to manage bookings, payments, and vehicles efficiently.

### 🔹 Scope
HYMN EV Rentals will provide:
- A customer-facing portal for EV search, booking, and payment.
- An admin dashboard for inventory and booking management.
- Full-stack implementation including frontend, backend, database, and third-party integrations.

### 🔹 Overview
The system includes:
- General description
- Functional & non-functional requirements
- Interface specifications
- Performance metrics
- Constraints
- Budget and timeline estimates

---

## 🚦 General Description

### 🔧 Product Functionality
- Customer registration and login  
- Search, filter, and book EVs  
- Payment processing  
- Rental history tracking  
- Admin panel for managing vehicles and bookings  

### 👥 User Characteristics
- **Customers**: Familiar with basic mobile/web operations  
- **Admins**: Trained in EV rental and fleet management

### 🎯 Benefits
- Promotes green transportation  
- Simplifies rental operations  
- Efficient fleet utilization and real-time updates  

---

## ✅ Functional Requirements

### 🔐 R.1: User Registration and Login
- **R.1.1 Register new user**:  
  `Input:` Name, Email, Phone, Password  
  `Output:` Success/Failure message

- **R.1.2 Login**:  
  `Input:` Email and Password  
  `Output:` Dashboard access upon successful login

### 🚗 R.2: Browse Available EVs
- **R.2.1 Search & Filter**:  
  `Input:` Location, Date, Vehicle Type  
  `Output:` Filtered EV list  
  `Processing:` Query database based on filters

### 📅 R.3: Book EV
- **R.3.1 Select vehicle**:  
  `Input:` Vehicle ID  
  `Output:` Rental form

- **R.3.2 Enter rental period and confirm**:  
  `Input:` Start Date, End Date  
  `Output:` Payment page and confirmation

### 💳 R.4: Payment Handling
- **R.4.1 Make payment**:  
  `Input:` Card/UPI details  
  `Output:` Payment success/failure message  
  `Processing:` Secure payment + invoice generation

### 🛠️ R.5: Admin Panel Operations
- **R.5.1 Add/Remove vehicles**:  
  `Input:` Vehicle details  
  `Output:` Updated inventory

- **R.5.2 View all bookings**:  
  `Input:` Filter by date/status  
  `Output:` Booking list

- **R.5.3 Update vehicle status**:  
  Status options: Available, Booked, Maintenance

---

## 💻 Interface Requirements

### 🌐 Frontend
- HTML, CSS, JavaScript (React.js/Vue.js)
- Customer & Admin dashboards

### 🖧 Backend
- Node.js + Express.js REST APIs
- MongoDB or MySQL database

### 🔌 External Interfaces
- Razorpay/Stripe API for payments  
- Email/SMS API for alerts  
- Map API for geo-filtering  

---

## 🚀 Performance Requirements
- Support **100+ concurrent users**
- Booking response time: **< 2 seconds**
- Payment processing time: **< 5 seconds**
- Availability: **99.9% uptime per month**

---

## 📐 Design Constraints
- Must be **browser compatible** (Chrome, Firefox, Safari)
- Fully **responsive design** (mobile/tablet/desktop)
- Use **HTTPS** for all communications
- Payments must follow **PCI-DSS standards**

---

## 📊 Non-Functional Attributes

| Attribute     | Details                                                                 |
|---------------|-------------------------------------------------------------------------|
| **Security**      | Encrypted passwords, secure authentication and transactions           |
| **Portability**   | Usable on desktops, tablets, and smartphones                          |
| **Reliability**   | Auto-backup every 24 hours; error logging                             |
| **Scalability**   | Built to scale with increasing users                                  |
| **Maintainability** | Modular architecture for easy codebase updates                      |
| **Usability**     | Intuitive UI and low learning curve                                   |
| **Data Integrity**| Prevent double-booking, maintain audit logs                           |

---

## 🗓️ Preliminary Schedule & 💰 Budget

### 🧭 Timeline (~4 Months)
1. **Requirement Analysis & Planning** – 2 weeks  
2. **UI/UX and Frontend Development** – 4 weeks  
3. **Backend and API Development** – 4 weeks  
4. **Integration & Testing** – 3 weeks  
5. **Deployment & Feedback** – 1 week  

### 💸 Budget Estimate
**₹2.5 – ₹3.5 lakhs** (if outsourced)

---

## 📎 Appendices

### 🔤 Acronyms
- **EV**: Electric Vehicle  
- **UI**: User Interface  
- **API**: Application Programming Interface

### 📚 References
- [GitHub Repo – EV Rental Management System](#)  
- [Razorpay API Docs](https://razorpay.com/docs/api/)  
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

## 📬 Contact
For suggestions or queries, feel free to open an issue or submit a pull request.

---

> 🚗 Let's build a greener, smarter rental system with **HYMN EV Rentals**!




# 📘 Software Requirements Specification (SRS)

## 🚗 Secure EV Rental Management System

---

## 🧭 Project Domain

- **Domain:** Smart Mobility / Transportation as a Service (TaaS)
- **Subdomains:**
  - EV Fleet Management
  - Vehicle Sharing Platform
  - Sustainable Urban Mobility
  - Smart City Solutions

---

## 📌 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements of the **Secure EV Rental Management System**. The system allows users to book, unlock, and return Electric Vehicles (EVs) securely using OTP verification and manage bookings, payments, and complaints seamlessly.

### 1.2 Scope

The system includes:
- User registration and login with OTP
- Vehicle listing and real-time availability
- EV booking, ride tracking, and OTP-based unlocking/return
- Wallet management and Razorpay-based payments
- Admin dashboard for managing users, vehicles, and complaints
- Complaint logging and resolution system

### 1.3 Definitions

| Term | Meaning |
|------|---------|
| EV | Electric Vehicle |
| OTP | One-Time Password |
| JWT | JSON Web Token |
| UI/UX | User Interface / User Experience |
| API | Application Programming Interface |

### 1.4 References

- [GitHub Repository](https://github.com/Yashesh1195/Problem-Statement-4-Secure-EV-Rental-Management)
- IEEE SRS Format
- MERN Stack Documentation

### 1.5 Overview

This document contains the overall design, system architecture, functional modules, external interface requirements, and system constraints.

---

## 🧩 2. Overall Description

### 2.1 Product Perspective

A full-stack web application developed using:
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, OTP
- **Payment Gateway:** Razorpay

### 2.2 Product Functions

- Secure user authentication with OTP
- EV booking and real-time status
- Wallet-based ride payment
- Admin management of rides, vehicles, and users
- Complaint submission and tracking

### 2.3 User Classes

| Role | Description |
|------|-------------|
| User | Can browse, book EVs, unlock/return using OTP, manage wallet |
| Admin | Can add/remove vehicles, manage users, resolve complaints |
| (Optional) Owner | Add/manage vehicles and view income analytics |

### 2.4 Operating Environment

- **Web Browsers:** Chrome, Firefox, Edge
- **OS:** Linux / Windows / Cloud Hosting (Heroku/Vercel)
- **Runtime:** Node.js v14+
- **Database:** MongoDB

### 2.5 Constraints

- Requires internet access
- OTP requires email/SMS API (e.g., Twilio/SendGrid)
- Camera/GPS integration planned as future enhancement

### 2.6 User Documentation

- README instructions
- UI hints and tooltips
- In-app notifications

### 2.7 Assumptions

- Users have valid phone/email for OTP
- Razorpay supports payment operations
- OTP services function reliably

---

## ✅ 3. Functional Requirements

### 3.1 User Module

- Register/Login via phone/email with OTP
- JWT token-based session handling
- Dashboard showing available EVs
- Book vehicle for a time period
- Receive OTP to unlock and return vehicle

### 3.2 Vehicle Module

- Admin can add, update, or remove EVs
- Show availability status (Available/In-Use)
- EV status updated on booking and return
- OTP validation before unlock and after return

### 3.3 Wallet & Payment

- Razorpay integration for wallet top-up
- Auto-deduct amount on ride completion
- Show transaction history

### 3.4 Admin Module

- View and manage all users
- Manage vehicle inventory
- Monitor and resolve complaints
- View analytics and ride summaries

### 3.5 Complaint Management

- User can submit complaints
- Admin can view, resolve, and close complaints
- Notify user on complaint status change

---

## 🛡️ 4. Non-Functional Requirements

### 4.1 Performance

- API response time < 1 second
- Handle 100+ concurrent users
- Booking system with <3s page load

### 4.2 Security

- JWT-based auth
- HTTPS for secure communication
- OTP verification for sensitive operations
- Role-based access control (Admin/User)

### 4.3 Usability

- Mobile-responsive UI
- Intuitive booking and return flow
- Clear status indicators (vehicle, payment, complaint)

### 4.4 Availability

- Uptime > 99.5%
- Cloud-deployed backend
- Daily database backups

### 4.5 Maintainability

- Modular MVC architecture
- RESTful API design
- Configurable .env file for API keys and ports

---

## 🔌 5. External Interface Requirements

### 5.1 UI Components

- **User Dashboard:** EV list, wallet balance, ride logs
- **Admin Panel:** CRUD for users/vehicles, analytics
- **Complaint Form:** Title, description, status
- **Wallet UI:** Top-up and payment history

### 5.2 Hardware Interfaces

- (Planned) QR code scanner / GPS device

### 5.3 Software Interfaces

- MongoDB Atlas for database
- Razorpay for payments
- Twilio or SendGrid for OTP/email
- Optional: Google Maps for vehicle location

### 5.4 Communication Interfaces

- RESTful API (HTTPS)
- Email/SMS notifications
- (Future) WebSockets for real-time updates

---

## 🚀 6. Appendix

### 6.1 Future Enhancements

- QR code-based vehicle unlock
- GPS integration for vehicle tracking
- AI-powered ride pricing
- EV battery and health monitoring

### 6.2 Suggested Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, Bootstrap, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB |
| Auth | JWT + OTP |
| Payments | Razorpay |
| OTP | Twilio / SendGrid |

---

## 📫 Author

- Developed by: [Yashesh Mehta](https://github.com/Yashesh1195)
