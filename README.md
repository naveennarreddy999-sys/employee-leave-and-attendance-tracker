# University ERP — Employee Attendance & Leave Management

An enterprise human resources (HR) module for a University ERP system built with **Spring Boot 3.2+** and **React (Vite)**. This application manages employee directories, daily faculty and staff attendance tracking, and leave applications with approval workflows.

---

## 🏛️ Architecture & Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Data Persistence**: Spring Data JPA & Hibernate
- **Database**: H2 In-Memory Database (`jdbc:h2:mem:erpdb`)
- **Validation**: Jakarta Validation API (`@NotBlank`, `@Email`, `@Valid`)
- **Boilerplate Reduction**: Project Lombok
- **Architecture Pattern**: Controller → Service → Repository

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Standard modern CSS design system (responsive cards, tables, badges, animated spinners)
- **Networking**: Native Fetch API client helper (`api/client.js`) with configured CORS support

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (JDK 17 or higher installed)
- **Node.js** (v18+ recommended) & **npm**

---

### 1. Running the Backend (Spring Boot)

The project includes the Maven Wrapper (`mvnw`), eliminating the need for a global Maven installation.

#### Step 1: Open a terminal in the project root
```powershell
# Compile and verify the project
.\mvnw.cmd clean compile

# Run the Spring Boot application
.\mvnw.cmd spring-boot:run
```

The backend server starts on **`http://localhost:8080`**.

#### H2 Database Web Console
- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:erpdb`
- **Username**: `sa`
- **Password**: *(leave blank)*

---

### 2. Running the Frontend (React + Vite)

#### Step 1: Open a second terminal and navigate to `frontend`
```powershell
cd frontend
npm install
npm run dev
```

The frontend development server starts on **`http://localhost:5173`**.

Open your browser and navigate to `http://localhost:5173` to interact with the portal.

---

## 📡 Complete REST API Reference

All backend endpoints are accessible at base URL: `http://localhost:8080`

### 1. Employees API

| Method | Endpoint | Description | Request Body | Response (Success) |
|---|---|---|---|---|
| `POST` | `/employees` | Register a new employee | JSON payload with `@Valid` constraints | `201 Created` with saved `Employee` |
| `GET` | `/employees` | List all registered employees | None | `200 OK` with JSON array of `Employee` |
| `GET` | `/employees/{id}` | Get employee by ID | None | `200 OK` (or `404 Not Found` if missing) |

#### Sample Request (`POST /employees`):
```json
{
  "name": "Dr. Alan Turing",
  "email": "turing@university.edu",
  "department": "Computer Science",
  "designation": "Professor"
}
```

#### Sample Response (`201 Created`):
```json
{
  "id": 1,
  "name": "Dr. Alan Turing",
  "email": "turing@university.edu",
  "department": "Computer Science",
  "designation": "Professor"
}
```

---

### 2. Leave Management API

| Method | Endpoint | Description | Request Body | Response (Success) |
|---|---|---|---|---|
| `POST` | `/leaves` | Submit a leave application | JSON payload (`LeaveApplicationDTO`) | `201 Created` with saved `LeaveRequest` (or `400 Bad Request`) |
| `GET` | `/leaves/pending` | List all pending leave requests | None | `200 OK` with JSON array of `LeaveRequest` |
| `GET` | `/leaves/employee/{id}` | List all leaves for a specific employee | None | `200 OK` with JSON array of `LeaveRequest` |
| `PUT` | `/leaves/{id}/approve` | Approve a leave request | None | `200 OK` with updated `LeaveRequest` |
| `PUT` | `/leaves/{id}/reject` | Reject a leave request | None | `200 OK` with updated `LeaveRequest` |

#### Sample Request (`POST /leaves`):
```json
{
  "employeeId": 1,
  "fromDate": "2026-10-15",
  "toDate": "2026-10-18",
  "reason": "International Academic Conference"
}
```

#### Sample Response (`201 Created`):
```json
{
  "id": 1,
  "employee": {
    "id": 1,
    "name": "Dr. Alan Turing",
    "email": "turing@university.edu",
    "department": "Computer Science",
    "designation": "Professor"
  },
  "fromDate": "2026-10-15",
  "toDate": "2026-10-18",
  "reason": "International Academic Conference",
  "status": "PENDING"
}
```

---

### 3. Attendance API

| Method | Endpoint | Description | Request Body | Response (Success) |
|---|---|---|---|---|
| `POST` | `/attendance` | Mark attendance for a day | JSON payload (`AttendanceRequestDTO`) | `201 Created` with `Attendance` (or `400` if duplicate/invalid) |
| `GET` | `/attendance/employee/{id}` | Get all attendance entries for an employee | None | `200 OK` with JSON array of `Attendance` |
| `GET` | `/attendance/employee/{id}/percentage` | Get attendance percentage and totals | None | `200 OK` with `AttendancePercentageDTO` |

#### Sample Request (`POST /attendance`):
```json
{
  "employeeId": 1,
  "date": "2026-10-06",
  "status": "PRESENT"
}
```

#### Sample Response (`201 Created`):
```json
{
  "id": 1,
  "employee": {
    "id": 1,
    "name": "Dr. Alan Turing",
    "email": "turing@university.edu",
    "department": "Computer Science",
    "designation": "Professor"
  },
  "date": "2026-10-06",
  "status": "PRESENT"
}
```

#### Sample Response (`GET /attendance/employee/1/percentage`):
```json
{
  "employeeId": 1,
  "totalDays": 5,
  "presentDays": 4,
  "percentage": 80.0
}
```

---

## 📂 Project Directory Structure

```
erp project/
├── pom.xml                                    # Maven dependencies & build configuration
├── mvnw / mvnw.cmd                            # Maven Wrapper executables
├── .mvn/wrapper/                              # Maven Wrapper properties & JAR
├── README.md                                  # Project documentation & API guide
│
├── src/main/java/com/erp/attendanceleave/
│   ├── AttendanceLeaveApplication.java        # Spring Boot main entry point
│   │
│   ├── config/
│   │   └── WebConfig.java                     # Global CORS configuration (localhost:5173)
│   │
│   ├── model/
│   │   ├── Employee.java                      # JPA Entity: Employee
│   │   ├── LeaveRequest.java                  # JPA Entity: LeaveRequest
│   │   ├── LeaveStatus.java                   # Enum: PENDING, APPROVED, REJECTED
│   │   ├── Attendance.java                    # JPA Entity: Attendance
│   │   └── AttendanceStatus.java              # Enum: PRESENT, ABSENT
│   │
│   ├── dto/
│   │   ├── LeaveApplicationDTO.java           # DTO: Leave submission payload
│   │   ├── AttendanceRequestDTO.java          # DTO: Attendance mark payload
│   │   └── AttendancePercentageDTO.java       # DTO: Attendance statistics payload
│   │
│   ├── repository/
│   │   ├── EmployeeRepository.java            # Spring Data JPA Repository
│   │   ├── LeaveRequestRepository.java        # Custom queries by status & employee
│   │   └── AttendanceRepository.java          # Custom count & duplicate checks
│   │
│   ├── service/
│   │   ├── EmployeeService.java               # Employee business logic
│   │   ├── LeaveService.java                  # Leave submission & approval logic
│   │   └── AttendanceService.java             # Attendance & percentage calculation
│   │
│   └── controller/
│       ├── EmployeeController.java            # Endpoints: /employees
│       ├── LeaveController.java               # Endpoints: /leaves
│       └── AttendanceController.java          # Endpoints: /attendance
│
├── src/main/resources/
│   └── application.properties                 # H2 in-memory DB & JPA configuration
│
└── frontend/                                  # React + Vite application
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                            # Main layout & tab router
        ├── App.css                            # Clean typography & design system
        ├── components/
        │   └── Navbar.jsx                     # Top navigation bar
        ├── pages/
        │   ├── EmployeesPage.jsx              # Employee directory & creation form
        │   ├── AttendancePage.jsx             # Daily roster & attendance statistics
        │   └── LeavePage.jsx                  # Leave application & approval table
        └── api/
            └── client.js                      # Fetch client for all backend endpoints
```
