# AMI-personal-assistant

Minimal setup and development notes to get this project running locally.

Prerequisites
- Python 3.11+ (this project was created with 3.12)
- Node.js and npm (for the React frontend)

Python (backend) setup
1. Create a virtual environment (recommended):

   python -m venv venv

2. Activate it (PowerShell):

   venv\Scripts\Activate.ps1

3. Install Python dependencies:

   pip install -r requirements.txt

Frontend (React) setup
1. Install node dependencies:

   npm install

2. Start the dev server:

   npm start

Environment variables
- Copy `.env.example` to `.env` and edit values appropriate for your environment. Do NOT commit `.env` to source control.

Useful commands
- Freeze current Python deps: `pip freeze > requirements.txt`
- Remove environment from git tracking (already done): ensure `venv/` is in `.gitignore`

Notes
- Build outputs (e.g. `build/`, `dist/`) and `node_modules/` are ignored in `.gitignore`. Keep `requirements.txt` up-to-date so contributors can recreate the environment.
