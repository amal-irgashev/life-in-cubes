# Life in Cubes - Backend

This is the backend service for the Life in Cubes project, built with Django and Django REST Framework.

## Project Structure

```
backend/
├── apps/                   # All Django apps
│   └── life_cubes/        # Main application
├── core/                   # Project configuration
├── media/                  # User-uploaded files
├── static/                # Static files
├── templates/             # HTML templates
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── manage.py             # Django management script
└── requirements.txt      # Project dependencies
```

## Setup

1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values as needed

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Run development server:
   ```bash
   python manage.py runserver
   ```

## API Documentation

The API documentation will be available at `/api/docs/` when the server is running.

## Development

- Follow PEP 8 style guide
- Write tests for new features
- Update documentation when making changes

## Security

- Never commit sensitive data
- Keep dependencies updated
- Use environment variables for configuration 