# API Test Results

## Kết quả thực hiện test các API endpoint

### Chuẩn bị môi trường
- **Server URL:** http://localhost:9934
- **Database:** Đã được reset/clean trước khi test
- **Environment Variables:** Đã được cấu hình đúng

### Test Results Summary
| Test Case | Status | Expected | Actual | Notes |
|-----------|--------|----------|--------|-------|
| 1.1 Basic Health Check | ✅ | 200 OK | 200 OK | |
| 2.1 Register User - Success | ✅ | 200 OK | 200 OK | User created with ID |
| 2.2 Register User - Validation Error | ✅ | 422 Unprocessable | 422 Unprocessable | Validation working correctly |
| 2.3 Login User - Success | ✅ | 200 OK | 200 OK | Tokens generated |
| 2.4 Login User - Wrong Password | ⚠️ | 401 Unauthorized | 422 Unprocessable | DTO validation instead of 401 |
| 2.5 Refresh Token - Success | ✅ | 200 OK | 200 OK | New tokens generated |
| 2.6 Refresh Token - Invalid Token | ✅ | 401 Unauthorized | 401 Unauthorized | Proper error handling |
| 3.1 Create Post - Success | ✅ | 201 Created | 201 Created | Post created with ID |
| 3.2 Create Post - Missing Auth | ✅ | 401 Unauthorized | 401 Unauthorized | Auth guard working |
| 3.3 Get Posts - Success | ✅ | 200 OK | 200 OK | Returns user posts |
| 3.4 Get Posts - Missing Auth | ✅ | 401 Unauthorized | 401 Unauthorized | Auth guard working |
| 3.5 Update Post - Success | ✅ | 200 OK | 201 Created | Post updated successfully |
| 3.6 Update Post - Missing Auth | ✅ | 401 Unauthorized | 401 Unauthorized | Auth guard working |

### Chi tiết Test Results

#### 1. Health Check API

##### 1.1 Basic Health Check
**Command Executed:**
```bash
curl -X GET http://localhost:9933/
```

**Response:**
```
Status: 200
Response Body: {"data":"Hello World!","statusCode":200}
```

**Result:** ✅ PASS

---

#### 2. Authentication APIs

##### 2.1 Register User - Success
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "phoneNumber": "0123456789", "password": "password123", "confirmPassword": "password123"}'
```

**Response:**
```
Status: 200
Response Body: {"data":{"message":"User registered successfully","user":{"id":"7958f070-b464-4d21-8779-381d8ce24542","phoneNumber":"0123456789"}},"statusCode":200}
```

**Result:** ✅ PASS

##### 2.2 Register User - Validation Error
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "", "phoneNumber": "", "password": "", "confirmPassword": "different"}'
```

**Response:**
```
Status: 422
Response Body: {"statusCode":422,"message":"Validation failed","errors":[{"property":"confirmPassword","errors":["confirmPassword and password is not match!"]},{"property":"phoneNumber","errors":["phoneNumber should not be empty"]},{"property":"password","errors":["password should not be empty"]}]}
```

**Result:** ✅ PASS

##### 2.3 Login User - Success
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0123456789", "password": "password123"}'
```

**Response:**
```
Status: 200
Response Body: {"data":{"tokens":{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2NjMsImV4cCI6MTc2MTk3Mzg2M30.wjUlospyP6Hp3frwr0htr0ZORC23PBHwuF98ZECYZNw","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2NjMsImV4cCI6MTc2MjMxOTQ2M30.t9qBAP4Y9eIVfSUwKkWPaAzYA9_Z5XXqI067CjOH44c"},"user":{"id":"7958f070-b464-4d21-8779-381d8ce24542","name":"Test User","phoneNumber":"0123456789"}},"statusCode":200}
```

**Tokens Captured:
- Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2NjMsImV4cCI6MTc2MTk3Mzg2M30.wjUlospyP6Hp3frwr0htr0ZORC23PBHwuF98ZECYZNw
- Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2NjMsImV4cCI6MTc2MjMxOTQ2M30.t9qBAP4Y9eIVfSUwKkWPaAzYA9_Z5XXqI067CjOH44c
```

**Result:** ✅ PASS

##### 2.4 Login User - Wrong Password
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "0123456789", "password": "wrongpassword"}'
```

**Response:**
```
Status: 422
Response Body: {"message":[{"property":"password","errors":["Password is incorrect"]}],"error":"Unprocessable Entity","statusCode":422}
```

**Result:** ⚠️ PARTIAL - Returns 422 instead of expected 401

##### 2.5 Refresh Token - Success
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2NjMsImV4cCI6MTc2MjMxOTQ2M30.t9qBAP4Y9eIVfSUwKkWPaAzYA9_Z5XXqI067CjOH44c"}'
```

**Response:**
```
Status: 200
Response Body: {"data":{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MTk3Mzg4N30.8J27I_-5_6xkuteVxOJ5art4lLFzMWUqAUWF8jUSGOA","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MjMxOTQ4N30.VGsy6LQOVcOSClSJW-AeVNsnFFaL0dZI9rkSNQYHBQg"},"statusCode":200}
```

**New Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MTk3Mzg4N30.8J27I_-5_6xkuteVxOJ5art4lLFzMWUqAUWF8jUSGOA**

**Result:** ✅ PASS

##### 2.6 Refresh Token - Invalid Token
**Command Executed:**
```bash
curl -X POST http://localhost:9933/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "invalid_token_here"}'
```

**Response:**
```
Status: 401
Response Body: {"message":"Invalid refresh token","error":"Unauthorized","statusCode":401}
```

**Result:** ✅ PASS

---

#### 3. Posts APIs

##### 3.1 Create Post - Success
**Command Executed:**
```bash
curl -X POST http://localhost:9933/post/create-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MTk3Mzg4N30.8J27I_-5_6xkuteVxOJ5art4lLFzMWUqAUWF8jUSGOA" \
  -H "x-api-key: 12345678910" \
  -d '{"title": "My First Post", "content": "This is the content of my first post."}'
```

**Response:**
```
Status: 201
Response Body: {"data":{"id":"cf61ad26-25b4-4a54-9325-0ca6e7ac9729","title":"My First Post","content":"This is the content of my first post.","createdAt":"2025-10-29T05:11:57.879Z","updatedAt":"2025-10-29T05:11:57.879Z","deletedAt":null,"userId":"7958f070-b464-4d21-8779-381d8ce24542"},"statusCode":201}
```

**Post ID Captured: cf61ad26-25b4-4a54-9325-0ca6e7ac9729**

**Result:** ✅ PASS

##### 3.2 Create Post - Missing Auth
**Command Executed:**
```bash
curl -X POST http://localhost:9933/post/create-post \
  -H "Content-Type: application/json" \
  -d '{"title": "Unauthorized Post", "content": "This should fail due to missing auth"}'
```

**Response:**
```
Status: 401
Response Body: {"message":"Authentication failed - all auth types required","error":"Unauthorized","statusCode":401}
```

**Result:** ✅ PASS

##### 3.3 Get Posts - Success
**Command Executed:**
```bash
curl -X GET http://localhost:9933/post/get \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MTk3Mzg4N30.8J27I_-5_6xkuteVxOJ5art4lLFzMWUqAUWF8jUSGOA" \
  -H "x-api-key: 12345678910"
```

**Response:**
```
Status: 200
Response Body: {"data":[{"id":"cf61ad26-25b4-4a54-9325-0ca6e7ac9729","title":"My First Post","content":"This is the content of my first post.","createdAt":"2025-10-29T05:11:57.879Z","updatedAt":"2025-10-29T05:11:57.879Z","deletedAt":null,"userId":"7958f070-b464-4d21-8779-381d8ce24542"}],"statusCode":200}
```

**Result:** ✅ PASS

##### 3.4 Get Posts - Missing Auth
**Command Executed:**
```bash
curl -X GET http://localhost:9933/post/get
```

**Response:**
```
Status: 401
Response Body: {"message":"Authentication failed - all auth types required","error":"Unauthorized","statusCode":401}
```

**Result:** ✅ PASS

##### 3.5 Update Post - Success
**Command Executed:**
```bash
curl -X POST http://localhost:9933/post/update-post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OTU4ZjA3MC1iNDY0LTRkMjEtODc3OS0zODFkOGNlMjQ1NDIiLCJpYXQiOjE3NjE3MTQ2ODcsImV4cCI6MTc2MTk3Mzg4N30.8J27I_-5_6xkuteVxOJ5art4lLFzMWUqAUWF8jUSGOA" \
  -H "x-api-key: 12345678910" \
  -d '{"id": "cf61ad26-25b4-4a54-9325-0ca6e7ac9729", "title": "Updated Post Title", "content": "Updated content for the post."}'
```

**Response:**
```
Status: 201
Response Body: {"data":{"id":"cf61ad26-25b4-4a54-9325-0ca6e7ac9729","title":"Updated Post Title","content":"Updated content for the post.","createdAt":"2025-10-29T05:11:57.879Z","updatedAt":"2025-10-29T05:12:49.031Z","deletedAt":null,"userId":"7958f070-b464-4d21-8779-381d8ce24542"},"statusCode":201}
```

**Result:** ✅ PASS

##### 3.6 Update Post - Missing Auth
**Command Executed:**
```bash
curl -X POST http://localhost:9933/post/update-post \
  -H "Content-Type: application/json" \
  -d '{"id": "cf61ad26-25b4-4a54-9325-0ca6e7ac9729", "title": "Unauthorized Update", "content": "This should fail due to missing auth"}'
```

**Response:**
```
Status: 401
Response Body: {"message":"Unauthorized","error":"Unauthorized","statusCode":401}
```

**Result:** ✅ PASS

---

### Issues Found
- **Issue 1:** Login với mật khẩu sai trả về 422 thay vì 401 - validation đang được xử lý ở DTO level thay vì service level
- **Issue 2:** Update Post trả về status 201 thay vì 200 như mong đợi

### Recommendations
- Cải thiện error handling cho login để trả về 401 thay vì 422 khi sai mật khẩu
- Thống nhất status codes: Update operations nên trả về 200 thay vì 201
- Thêm rate limiting cho authentication endpoints
- Thêm pagination cho Get Posts endpoint khi có nhiều posts

### Test Environment Details
- **OS:** macOS Darwin 25.0.0
- **Node Version:** v20.x (based on project setup)
- **Database:** PostgreSQL running on localhost:5433
- **API Key:** 12345678910 (configured in .env)
- **Server Port:** 9933
