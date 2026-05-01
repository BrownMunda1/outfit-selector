import os
import json
from datetime import timedelta, datetime, timezone
from typing import Annotated

from pwdlib import PasswordHash
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.routing import APIRouter
from fastapi import Depends, HTTPException, status
import jwt
from jwt.exceptions import InvalidTokenError

from common.constants import USER_COLLECTION_NAME
from integration.mongo.connection import AsyncMongoConnection
from integration.mongo.repository import UserRepository
from backend.models.schema import User
from backend.models.token import Token


ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token") # It means that /auth/token is the URL which is responsible for returning a bearer token after accepting oauth2 credentials

async def get_collection():
    collection = await AsyncMongoConnection().get_collection(collection_name=USER_COLLECTION_NAME)
    return collection


# Function-1 == create_access_token: It creates an access token based on user data (in this case, username)
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
    ALGORITHM = os.getenv("AUTH_ALGORITHM")
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(payload=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function-2 == get_current_user: Takes the token, decodes it using the secret key and algorithm, and then return the user data based on the token
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):

    SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
    ALGORITHM = os.getenv("AUTH_ALGORITHM")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_details = payload.get("sub")
        if user_details is None:
            raise credentials_exception
        token_data = json.loads(user_details)
        return token_data
    except InvalidTokenError as e:
        print("Invalid token error:", e)
        raise credentials_exception


# Function-3 == login_for_access_token: the endpoint where oauth2_scheme is pointed to. creates access token from user data. accepts form data of username and password. returns the Token class with access token
auth_router = APIRouter(prefix="/auth")

@auth_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db = Depends(get_collection)) -> Token:
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": json.dumps({
                "username": user.username,
                "gender": user.gender
            }),
            "exp": access_token_expires
        },
        expires_delta=access_token_expires
    )
    # This is the required format by the spec
    return Token(access_token=access_token, token_type="bearer")

# To create a user, hit the /auth endpoint
@auth_router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: User, db = Depends(get_collection)):
    create_user_model = User(
        username=create_user_request.username,
        gender=create_user_request.gender,
        name=create_user_request.name,
        password=get_password_hash(create_user_request.password)
    )

    result = await UserRepository.insert_one(collection=db, data=create_user_model)
    return result.acknowledged


## Helper functions

async def authenticate_user(db, username: str, password: str):
    user = await get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


async def get_user(db, username: str) -> User | None:

    user_list = await UserRepository.find(collection=db, username=username)
    if len(user_list) == 0:
        return False
    user = user_list[0]
    if not user or len(user) == 0:
        return False
    return User(**user)
