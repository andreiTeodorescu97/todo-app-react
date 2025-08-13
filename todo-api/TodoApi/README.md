# Todo API - .NET Core 8 with FastEndpoints

This is a C# .NET Core 8 API built with FastEndpoints for high-performance API development.

## Features

- **FastEndpoints**: High-performance, minimal API framework
- **Authentication Middleware**: Bearer token-based authentication (same as Node.js API)
- **CORS**: Cross-origin resource sharing enabled
- **Swagger**: API documentation with Swagger UI
- **In-memory storage**: Data stored in memory (can be easily replaced with database)

## API Endpoints

### Authentication
- `POST /login` - User login (username: alice/password1 or bob/password2)
- `POST /logout` - User logout (requires authentication)

### Todos
- `GET /todos` - Get all todos for authenticated user
- `POST /todos` - Create a new todo
- `PATCH /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete an uncompleted todo

### Categories
- `GET /categories` - Get all categories (requires authentication)
- `POST /categories` - Create a new category
- `PATCH /categories/{id}` - Update a category
- `DELETE /categories/{id}` - Delete a category

## Getting Started

### Prerequisites
- .NET 8.0 SDK

### Running the API
1. Navigate to the project directory
2. Run: `dotnet run`
3. The API will be available at `http://localhost:3000`
4. Swagger UI will be available at `http://localhost:3000/swagger`

### Testing the API
You can test the API endpoints using tools like Postman, curl, or any HTTP client.

## Project Structure

```
TodoApi/
├── Models/           # Entity models
├── Services/         # Business logic services
├── Endpoints/        # FastEndpoints API endpoints (with embedded DTOs)
├── Middleware/       # Authentication middleware
├── Program.cs        # Application configuration
└── README.md         # This file
```

## Authentication

The API uses **Bearer token authentication** with **middleware-based validation** (same as your Node.js API):

1. **Login**: Send credentials to `/login` to get a token
2. **Protected Endpoints**: Include token in Authorization header
3. **Middleware**: Automatically validates tokens and extracts userId
4. **Context**: Endpoints access `HttpContext.Items["UserId"]` for user identification

### Example Usage

```http
Authorization: Bearer <your-token>
```

## Data Models

### User
- `Id`: Unique identifier
- `Username`: User's username
- `Password`: User's password

### Todo
- `Id`: Unique identifier
- `UserId`: Associated user ID
- `CategoryId`: Associated category ID
- `Name`: Todo name
- `Description`: Todo description
- `DateAdded`: Creation date
- `Completed`: Completion status
- `DateCompleted`: Completion date (nullable)

### Category
- `Id`: Unique identifier
- `Name`: Category name
- `DateAdded`: Creation date

## Key Features

- **Centralized Authentication**: Middleware handles all token validation
- **Clean Endpoints**: No manual token checking in each endpoint
- **Consolidated DTOs**: Request/Response objects embedded in endpoint classes
- **Better Error Handling**: Consistent error responses across all endpoints
- **Performance**: FastEndpoints provides high-performance routing

## Notes

- This is an in-memory implementation for demonstration purposes
- In production, you would want to add proper database persistence
- The authentication system provides secure token-based authentication
- All endpoints automatically have access to the authenticated user's ID
- Consider adding input validation and enhanced error handling for production use
