# pishing-detector

`pishing-detector` is a lightweight local phishing scanner and research demo powered by Flask. It provides a private, offline-friendly way to test suspicious URLs and email content, generate risk scores, and view results through dashboard pages.

## Why this project matters

Phishing is one of the most common cyber attack vectors. This project is designed to:

- Demonstrate how URL and email heuristics can identify suspicious behavior.
- Offer a privacy-first local scanner without sending data to third-party services.
- Help security researchers and developers prototype phishing detection logic quickly.
- Provide clear guidance and recommendations for users when a message or URL looks unsafe.

## What it does

The application includes two main analysis flows:

1. **URL analysis**
   - Detects missing HTTPS, long URLs, suspicious keywords, IP-based URLs, and URL shorteners.
   - Flags brand impersonation, many subdomains, odd TLDs, nonstandard ports, and high-entropy path segments.
   - Uses DNS resolution and optional WHOIS checks to identify new or private IP domains.
   - Returns a risk score, verdict (`LEGIT`, `SUSPICIOUS`, `PHISHING`), reasons, recommendations, and detailed metadata.

2. **Email analysis**
   - Reviews sender address patterns, free email domains, urgent subject wording, HTML content, and suspicious links.
   - Detects shortened URLs, sender-domain mismatch, all-caps subjects, and attachment-related language.
   - Provides a score and verdict along with actionable recommendations.

## Project interest and value

This repo is useful for:

- Security learners who want a simple phishing detection proof of concept.
- Developers building a demo app that combines UI, analysis, and history tracking.
- Privacy-conscious users who prefer scanning suspicious content locally.
- Researchers comparing heuristic signals for URL and email legitimacy.

## Getting started

### Prerequisites

- Python 3.8 or newer

### Run locally

```powershell
cd c:\Users\moham\pishing-detector
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Or using the Flask development server:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:FLASK_APP = "app.py"
flask run
```

Open the web interface at `http://127.0.0.1:5000/`.

## Repository structure

- `app.py` — Flask application with routes for home, dashboards, URL scanning, email scanning, and history.
- `utils/url_checker.py` — URL feature extraction and risk analysis.
- `utils/email_checker.py` — Email feature extraction and phishing scoring.
- `utils/risk_scorer.py` — Shared risk scoring logic for URLs and email features.
- `templates/` — HTML dashboard and input pages.
- `static/` — CSS and client-side assets.

## Notes

- `utils/url_checker.py` optionally uses `python-whois` if installed for domain age checks.
- The app stores the last 50 scans in memory for quick dashboard review.
- This is a demo project; it is not a replacement for production-grade threat intelligence systems.

