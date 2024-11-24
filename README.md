# Book Shop

## Objective

Develop a fully functional Express application using TypeScript with MongoDB (via Mongoose) to manage a Book Store. Ensure data handling through Mongoose schema validation and implement key features like CRUD operations, inventory management, and revenue calculation.

---

## Features

- **CRUD Operations for Books**: Add, retrieve, update, and delete book records.
- **Order Management**: Create orders with inventory management.
- **Revenue Calculation**: Aggregates revenue from all orders using MongoDB pipelines.
- **Error Handling**: Clear and consistent error responses.
- **Validation**: Mongoose schema validation for data integrity.

---

## Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or later)
- [MongoDB](https://www.mongodb.com/) (installed locally or accessible via cloud)
- [TypeScript](https://www.typescriptlang.org/) (installed globally)

### Steps to Set Up Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Md-Rakib-Hassan/basic_book_shop_backend.git
   cd basic_book_shop_backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   - Create a `.env` file or rename the `.env.example` as `.env` in the project root and configure it with the following:
     ```
     PORT=5000
     DATABASE_URI=replace-with-your-mongodb-database-uri-and-make-sure-<password>-is-replaced-by-your-database-password
     ```

4. **Compile TypeScript**

   ```bash
   npm run build
   ```

5. **Start the Server**

   ```bash
   npm run start:dev
   ```

6. **Test the Application**
   - Access the API at `http://localhost:5000/api`.

---

## API Documentation

### 1. **Create a Book**

- **Endpoint**: `POST /api/products`
- **Request Body**:

  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 10,
    "category": "Fiction",
    "description": "A story about the American dream.",
    "quantity": 100,
    "inStock": true
  }
  ```

- **Response**:
  ```json
  {
    "message": "Book created successfully",
    "success": true,
    "data": { ...book details... }
  }
  ```

---

### 2. **Get All Books**

- **Endpoint**: `GET /api/products`
- **Query Parameters**:

  - `searchTerm`: Search by `title`, `author`, or `category`.

- **Response**:
  ```json
  {
    "message": "Books retrieved successfully",
    "success": true,
    "data": [ ...array of books... ]
  }
  ```

---

### 3. **Get a Specific Book**

- **Endpoint**: `GET /api/products/:productId`

- **Response**:
  ```json
  {
    "message": "Book retrieved successfully",
    "success": true,
    "data": { ...book details... }
  }
  ```

---

### 4. **Update a Book**

- **Endpoint**: `PUT /api/products/:productId`
- **Request Body**:

  ```json
  {
    "price": 15,
    "quantity": 25
  }
  ```

- **Response**:
  ```json
  {
    "message": "Book updated successfully",
    "success": true,
    "data": { ...updated book details... }
  }
  ```

---

### 5. **Delete a Book**

- **Endpoint**: `DELETE /api/products/:productId`

- **Response**:
  ```json
  {
    "message": "Book deleted successfully",
    "success": true,
    "data": {}
  }
  ```

---

### 6. **Order a Book**

- **Endpoint**: `POST /api/orders`
- **Request Body**:

  ```json
  {
    "email": "customer@example.com",
    "product": "productId",
    "quantity": 2,
    "totalPrice": 30
  }
  ```

- **Response**:
  ```json
  {
    "message": "Order created successfully",
    "success": true,
    "data": { ...order details... }
  }
  ```

---

### 7. **Calculate Revenue**

- **Endpoint**: `GET /api/orders/revenue`

- **Response**:
  ```json
  {
    "message": "Revenue calculated successfully",
    "success": true,
    "data": {
      "totalRevenue": 450
    }
  }
  ```

---

## Error Handling

All errors return a consistent response format:

```json
{
  "message": "Error description",
  "success": false,
  "error": { ...error details... },
  "stack": "Error stack trace"
}
```

---

## Testing the API

- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) to test API endpoints.
- Alternatively, use `curl` or any HTTP client library in your preferred programming language.

---
