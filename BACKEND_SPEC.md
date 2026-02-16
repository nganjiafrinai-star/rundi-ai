# Backend API Specification for Rundi AI

## POST /auth/ensure-user

### Purpose
Create or update a user in the backend database based on OAuth provider information. This endpoint is called by the NextAuth signIn callback to ensure users exist before any other API calls.

### Authentication
- **Optional**: `Authorization: Bearer <id_token>` - Google ID token for verification
- **Alternative**: Server-to-server secret header (if you prefer)

### Request Body
```json
{
  "provider": "google",
  "provider_id": "google-sub-id-12345",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://lh3.googleusercontent.com/..."
}
```

### Response

**200 OK** - User already exists (updated if needed):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://lh3.googleusercontent.com/...",
  "provider": "google",
  "provider_id": "google-sub-id-12345",
  "created_at": "2026-02-16T07:30:00Z",
  "updated_at": "2026-02-16T09:30:00Z"
}
```

**201 Created** - New user created:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://lh3.googleusercontent.com/...",
  "provider": "google",
  "provider_id": "google-sub-id-12345",
  "created_at": "2026-02-16T09:30:00Z",
  "updated_at": "2026-02-16T09:30:00Z"
}
```

**400 Bad Request** - Invalid request:
```json
{
  "detail": "Missing required field: email"
}
```

### Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
```

### FastAPI Implementation Example

```python
# models/user.py
from sqlalchemy import Column, String, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255))
    avatar = Column(String)
    provider = Column(String(50), nullable=False)
    provider_id = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        UniqueConstraint('provider', 'provider_id', name='uq_provider_user'),
    )

# schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class UserEnsureRequest(BaseModel):
    provider: str
    provider_id: str
    email: EmailStr
    name: str
    avatar: str | None = None

class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    avatar: str | None
    provider: str
    provider_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserEnsureRequest, UserResponse
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/ensure-user", response_model=UserResponse, status_code=200)
async def ensure_user(
    request: UserEnsureRequest,
    db: Session = Depends(get_db)
):
    """
    Create or update user based on OAuth provider information.
    Returns 200 if user exists (updated), 201 if newly created.
    """
    # Try to find existing user by provider+provider_id or email
    user = db.query(User).filter(
        (User.provider == request.provider) & (User.provider_id == request.provider_id)
    ).first()
    
    if not user:
        user = db.query(User).filter(User.email == request.email).first()
    
    if user:
        # Update existing user
        user.name = request.name
        user.avatar = request.avatar
        user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user
    else:
        # Create new user
        new_user = User(
            email=request.email,
            name=request.name,
            avatar=request.avatar,
            provider=request.provider,
            provider_id=request.provider_id
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Return 201 for new user
        from fastapi import Response
        return Response(
            content=UserResponse.from_orm(new_user).json(),
            status_code=201,
            media_type="application/json"
        )
```

### Testing with curl

```bash
# Test ensure-user endpoint
curl -X POST http://192.168.1.223:800/auth/ensure-user \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "provider_id": "test-user-123",
    "email": "test@example.com",
    "name": "Test User",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Notes

1. **UPSERT Logic**: The endpoint should check for existing users by both `(provider, provider_id)` and `email` to handle cases where a user might sign in with different providers using the same email.

2. **No 404 Errors**: This endpoint should NEVER return 404 for authenticated requests. It always creates the user if they don't exist.

3. **Idempotent**: Calling this endpoint multiple times with the same data should be safe and return the same user.

4. **Database Constraints**: The unique constraints ensure data integrity and prevent duplicate users.
