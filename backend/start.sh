#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"
export REDIS_URL="redis://localhost:6379/0"
uvicorn app.main:app --host 0.0.0.0 --port 8000
