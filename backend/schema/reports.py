from pydantic import BaseModel, Field, validator
from typing import Dict, List

# Model dla odpowiedzi z latami
class YearsResponse(BaseModel):
    years: List[int]

# Model dla masy odpadów według miesiąca
class WasteMassByMonth(BaseModel):
    month: str
    waste_masses: Dict[str, float]

# Model dla liczby odbiorów odpadów według miesiąca
class WastePickupCount(BaseModel):
    month: str
    waste_name: str
    pickups_count: int

# Model dla średnich przychodów według miesiąca
class WasteAverageRevenue(BaseModel):
    month: str
    waste_name: str
    average_revenue: float

# Model dla przychodów według miesiąca
class WasteRevenueByMonth(BaseModel):
    month: str
    waste_name: str
    total_revenue: float

# Model dla całkowitych przychodów według miesiąca
class TotalRevenueByMonth(BaseModel):
    month: str
    total_revenue: float

# Model for filter parametrów
class FilterParameters(BaseModel):
    year: int = Field(..., ge=2000, le=2100)
    month_from: int = Field(1, ge=1, le=12)
    month_to: int = Field(12, ge=1, le=12)
