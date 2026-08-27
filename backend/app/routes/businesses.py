from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.models.schemas import BusinessCreate, BusinessResponse
from app.db.database import get_db, Database
from app.services.sample_data import seed_database

router = APIRouter(prefix="/businesses", tags=["Business Management"])


@router.get("", response_model=List[BusinessResponse])
def list_businesses(db: Database = Depends(get_db)):
    """Lists all registered businesses."""
    biz_list = db.get_businesses()
    return [BusinessResponse(**b) for b in biz_list]


@router.post("", response_model=BusinessResponse)
def create_business(payload: BusinessCreate, db: Database = Depends(get_db)):
    """Creates a new business profile."""
    if not payload.name.strip():
        raise HTTPException(status_code=400, detail="Business name cannot be empty.")
    biz = db.create_business(name=payload.name, category=payload.category)
    return BusinessResponse(**biz)


@router.post("/seed-demo")
def seed_demo_data():
    """Seeds rich demo businesses and analyzed reviews for instant presentation."""
    try:
        seed_database()
        return {"status": "success", "message": "Demo businesses and reviews seeded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed demo data: {str(e)}")
