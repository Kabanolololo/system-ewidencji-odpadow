#!/bin/sh

echo "Czekam na bazę danych db:5432..."

# Czekaj aż baza będzie dostępna
while ! nc -z db 5432; do
  sleep 1
done

echo "Baza danych gotowa! Startuję backend..."

exec uvicorn main:app --host 0.0.0.0 --port 8000