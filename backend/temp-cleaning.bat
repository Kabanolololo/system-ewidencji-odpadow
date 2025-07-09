@echo off
setlocal enabledelayedexpansion



:: Przeszukiwanie bieżącego katalogu i jego podkatalogów
for /r %%d in (__pycache__) do (
    echo Znalazłem folder: %%d
    rmdir /s /q "%%d"
    :: Ustawienie koloru tekstu na zielony
    color 0A
    echo Folder %%d został usunięty.
    :: Przywrócenie domyślnego koloru konsoli (jeśli chcesz)
    color
)



endlocal
pause
