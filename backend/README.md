
# README - FastAPI Project Setup & Run Guide


Thank you for using this FastAPI project! Below you will find instructions on how to install, run, and develop with FastAPI.

---

1. Requirements 

Make sure you have the following installed:

- Python 3.10+ (recommended)
- Git
- Virtual environment tool (optional but recommended)

---

# 2. Clone the Repository

Open your terminal or command line and run:

```
git clone https://github.com/Kabanolololo/system-ewidencji-odpadow
cd backend
```
---

# 3. Create and Activate Virtual Environment

#### Linux / macOS:

```
python3 -m venv venv
source venv/bin/activate
```

#### Windows:

```
python -m venv venv
venv\Scripts\activate
```
---

# 4. Install Dependencies

Install required packages from `requirements.txt`:

```
pip install -r requirements.txt
```
---

# 5. Run the Application

You can start the FastAPI server with:

```
uvicorn main:app --reload
```

- `main` - name of your main Python file (e.g., `main.py`)
- `app` - the FastAPI app instance inside `main.py`
- `--reload` - auto-reload server on code changes (recommended for development)

The API will be available at:

```
http://127.0.0.1:8000
```

Docs (Swagger UI):

```
http://127.0.0.1:8000/docs
```

---

# 6. Run with Docker

You can also run the application using Docker and Docker Compose. This can simplify setup and environment management.

To stop and remove any running containers and volumes:

```bash
docker compose down -v
```

To build the Docker image and start the application:

```bash
docker compose up --build
```

The API will then be available at:

```
http://127.0.0.1:8000
```