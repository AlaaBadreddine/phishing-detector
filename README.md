# PhishShield (local)

Lightweight local phishing research and scanner demo.

Prerequisites
- Python 3.8+

Quick start (Windows PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Or using `flask` development server:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:FLASK_APP = "app.py"
flask run
```

Troubleshooting
- If `ModuleNotFoundError: No module named 'flask'` appears, run `pip install -r requirements.txt` inside the activated virtualenv.
- Some optional utilities under `utils/` may require extra packages; add them to `requirements.txt` as needed.

Files of interest
- `app.py` — Flask server
- `templates/` — Jinja2 HTML templates
- `static/styles.css` — Minimal stylesheet used by templates

If you want, I can create a virtualenv and install dependencies for you, or adjust `requirements.txt` to include other packages used by `utils/`.
