# Todo API - .NET Core 8 with FastEndpoints

This is a C# .NET Core 8 API built with FastEndpoints for high-performance API development.

## Features

- **FastEndpoints**: High-performance, minimal API framework
- **Authentication Middleware**: Bearer token-based authentication
- **CORS**: Cross-origin resource sharing enabled
- **Swagger**: API documentation with Swagger UI
- **Entity Framework Core**: SQL Server database with Code First migrations
- **Async Operations**: All database operations are asynchronous for better performance

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
- SQL Server (local or remote)
- SQL Server Management Studio or Azure Data Studio (optional, for database management)

### Running the API

1. **Configure Database Connection**: Update the connection string in `appsettings.json` if needed
2. **Run Migrations**: `dotnet ef database update` (first time only)
3. **Start the API**: `dotnet run`
4. **Access the API**: Available at `http://localhost:3000`
5. **Swagger UI**: Available at `http://localhost:3000/swagger`

### Testing the API

You can test the API endpoints using tools like Postman, curl, or any HTTP client.

## Project Structure

```
TodoApi/
├── Data/             # Entity Framework DbContext and migrations
├── Models/           # Entity models
├── Services/         # Business logic services (using DbContext)
├── Endpoints/        # FastEndpoints API endpoints (with embedded DTOs)
├── Middleware/       # Authentication middleware
├── Program.cs        # Application configuration
├── Migrations/       # Database migrations (auto-generated)
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

## Database Configuration

The API uses **Entity Framework Core** with **SQL Server**:

- **Connection String**: Configured in `appsettings.json`
- **Code First**: Database schema generated from C# models
- **Migrations**: Database changes tracked and versioned
- **Seed Data**: Initial users, categories, and todos automatically created

### Database Schema

- **Users**: User accounts with authentication
- **Categories**: Todo categories (Work, Personal, Shopping)
- **Todos**: Todo items linked to users and categories
- **Relationships**: Foreign keys with cascade delete

## Notes

- **Production Ready**: Database persistence with proper relationships
- **Authentication**: Secure token-based authentication system
- **User Context**: All endpoints automatically have access to authenticated user's ID
- **Async Operations**: All database operations are asynchronous for better performance
- **Validation**: Input validation and error handling implemented
