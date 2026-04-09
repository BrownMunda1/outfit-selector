from pydantic import BaseModel

### Return type of the endpoint /auth/token (its handled behind the scenes)
class Token(BaseModel):
    access_token: str
    token_type: str
