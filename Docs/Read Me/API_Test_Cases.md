# API Test Cases Documentation

## Tổng quan
Tài liệu này ghi lại các test case cho các API endpoint trong dự án NestJS Learning.

## Các Test Case

### 1. Health Check API
**Endpoint:** `GET /`

#### Test Case 1.1: Basic Health Check
- **Mô tả:** Kiểm tra trạng thái cơ bản của server
- **Expected Result:** Status 200, trả về message chào mừng
- **Curl Command:**
```bash
curl -X GET http://localhost:9934/
```

### 2. Authentication APIs

#### Test Case 2.1: Register User - Success
- **Endpoint:** `POST /auth/register`
- **Body:**
```json
{
  "name": "Test User",
  "phoneNumber": "0123456789",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Expected Result:** Status 200, user được tạo thành công
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phoneNumber": "0123456789",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### Test Case 2.2: Register User - Validation Error
- **Endpoint:** `POST /auth/register`
- **Body:** Dữ liệu không hợp lệ (missing fields, password mismatch)
- **Expected Result:** Status 422, validation errors
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "phoneNumber": "",
    "password": "",
    "confirmPassword": "different"
  }'
```

#### Test Case 2.3: Login User - Success
- **Endpoint:** `POST /auth/login`
- **Body:**
```json
{
  "phoneNumber": "0123456789",
  "password": "password123"
}
```
- **Expected Result:** Status 200, trả về accessToken và refreshToken
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0123456789",
    "password": "password123"
  }'
```

#### Test Case 2.4: Login User - Wrong Password
- **Endpoint:** `POST /auth/login`
- **Body:** Sai mật khẩu
- **Expected Result:** Status 401, Unauthorized
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0123456789",
    "password": "wrongpassword"
  }'
```

#### Test Case 2.5: Refresh Token - Success
- **Endpoint:** `POST /auth/refresh-token`
- **Body:** Valid refresh token từ login response
- **Expected Result:** Status 200, new access token
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

#### Test Case 2.6: Refresh Token - Invalid Token
- **Endpoint:** `POST /auth/refresh-token`
- **Body:** Invalid refresh token
- **Expected Result:** Status 401, Invalid token
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid_token_here"
  }'
```

### 3. Posts APIs

#### Test Case 3.1: Create Post - Success
- **Endpoint:** `POST /post/create-post`
- **Headers:** Authorization Bearer token + API Key
- **Body:**
```json
{
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```
- **Expected Result:** Status 201, post được tạo thành công
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/post/create-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post."
  }'
```

#### Test Case 3.2: Create Post - Missing Auth
- **Endpoint:** `POST /post/create-post`
- **Body:** Valid post data nhưng thiếu authentication
- **Expected Result:** Status 401, Unauthorized
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/post/create-post \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Post",
    "content": "This should fail due to missing auth"
  }'
```

#### Test Case 3.3: Get Posts - Success
- **Endpoint:** `GET /post/get`
- **Headers:** Authorization Bearer token + API Key
- **Expected Result:** Status 200, danh sách posts của user
- **Curl Command:**
```bash
curl -X GET http://localhost:9934/post/get \
  -H "Authorization: Bearer your_access_token_here" \
  -H "x-api-key: your_api_key_here"
```

#### Test Case 3.4: Get Posts - Missing Auth
- **Endpoint:** `GET /post/get`
- **Headers:** Không có authentication
- **Expected Result:** Status 401, Unauthorized
- **Curl Command:**
```bash
curl -X GET http://localhost:9934/post/get
```

#### Test Case 3.5: Update Post - Success
- **Endpoint:** `POST /post/update-post`
- **Headers:** Authorization Bearer token + API Key
- **Body:** Valid post data với ID
- **Expected Result:** Status 200, post được cập nhật
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/post/update-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "id": "your_post_id_here",
    "title": "Updated Post Title",
    "content": "Updated content for the post."
  }'
```

#### Test Case 3.6: Update Post - Missing Auth
- **Endpoint:** `POST /post/update-post`
- **Headers:** Không có authentication
- **Expected Result:** Status 401, Unauthorized
- **Curl Command:**
```bash
curl -X POST http://localhost:9934/post/update-post \
  -H "Content-Type: application/json" \
  -d '{
    "id": "some_id",
    "title": "Unauthorized Update",
    "content": "This should fail due to missing auth"
  }'
```
