from fastapi import HTTPException, status

def validate_month_range(month_from: int, month_to: int):
    if not (1 <= month_from <= 12):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Zakres miesięcy musi być między 1 a 12")
    if not (1 <= month_to <= 12):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Zakres miesięcy musi być między 1 a 12")
    if month_from > month_to:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Miesiąc początkowy nie może być większy niż miesiąc końcowy")
