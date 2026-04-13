# Project Description: pishing-detector

## Overview

`pishing-detector` is a lightweight local phishing detection application built with Flask and Python. It is designed as a privacy-first demo and research tool for analyzing suspicious URLs and email content without sending data to third-party services.

The application provides:

- URL scanning with risk scoring and suspicious indicator detection
- Email scanning with sender and content analysis
- A simple web interface with dashboards for scanning and reviewing results
- In-memory history tracking for recent scans

## Purpose and Value

Phishing attacks remain one of the most common cybersecurity threats. This project helps users and developers:

- understand how URL and email heuristics can detect suspicious content
- prototype phishing detection logic locally
- get immediate, actionable feedback about potentially malicious links or messages
- keep scan data private and contained within the local machine

## Architecture and Components

### `app.py`

This is the Flask application that defines web routes, handles requests, and returns JSON results:

- `/` — home page
- `/dashboard` — main dashboard view
- `/dashboard/url` — URL report dashboard
- `/dashboard/email` — email report dashboard
- `/check` — POST endpoint for URL analysis
- `/check_email` — POST endpoint for email analysis
- `/history` — GET endpoint returning recent scan history

The server stores the last 50 scans in the `scan_history` list, with the newest scan first.

### `utils/url_checker.py`

This module extracts features from URLs and analyzes them for phishing traits.

Key checks include:

- protocol analysis (`https` vs `http`)
- suspicious keywords in the URL path and query
- URL length and encoding abuse
- IP address usage instead of a hostname
- nonstandard network ports
- number of subdomains
- suspicious top-level domains (TLDs)
- suspicious path or query content
- URL fragments containing hidden instructions
- use of the `@` symbol inside the URL
- punycode and internationalized domain names
- repeated TLD patterns and possible domain masquerading
- shortened URLs like `bit.ly` or `t.co`
- brand impersonation indicators for major brands like Apple, Google, PayPal, etc.

This module also optionally performs WHOIS checks if the `whois` library is installed to detect newly registered domains.

It resolves the domain to IP addresses and flags private or reserved address space.

### `utils/email_checker.py`

This module analyzes email metadata and body content for phishing signals.

Email risk signals include:

- urgent or pressure-driven subject lines
- phishing keywords in the body
- suspicious sender names and free email domains
- HTML content in the email body
- links embedded in the message
- shortened URLs inside email text
- sender domain mismatch against linked domains
- all-caps subject lines
- attachment-related phrasing such as invoice or document requests
- suspicious sender address formatting with numbers or punctuation
- very short email bodies

### `utils/risk_scorer.py`

This shared module computes risk scores and verdicts for both URL and email feature sets.

For URL scoring, the module assigns weight to features such as:

- missing HTTPS
- suspicious keywords and long URLs
- IP address usage
- shortened URL use
- brand impersonation
- multiple subdomains
- odd TLDs and suspicious path content
- private or reserved IP resolution
- new domains and nonstandard ports
- high-entropy path segments
- use of the `@` symbol
- punycode domains
- repeated TLD patterns
- suspicious URL fragments

For email scoring, the module evaluates:

- urgent subject patterns
- phishing keywords in the body
- link presence and shortened links
- suspicious sender patterns
- free email domains for messages with links
- sender domain mismatch
- all-caps subject lines
- attachment-related language
- suspicious sender formatting
- message length and HTML content

Verdicts are assigned as:

- `LEGIT`
- `SUSPICIOUS`
- `PHISHING`

## User Experience

The web interface is built on HTML templates located in `templates/`, with a simple stylesheet in `static/styles.css`. Users can:

- enter a URL for scanning
- enter email sender, subject, and body for phishing analysis
- view a dashboard summary of recent scans
- inspect verdicts, scores, reasons, and recommendations

## Testing and CI

The project includes a test suite for the core detection modules and GitHub Actions workflow for CI.

Test files:

- `tests/test_risk_scorer.py`
- `tests/test_url_checker.py`
- `tests/test_email_checker.py`

Development dependencies are listed in `requirements-dev.txt`, with `pytest` for automated testing.

## Setup and Running

### Prerequisites

- Python 3.8 or newer

### Install dependencies

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Run the application

```powershell
python app.py
```

Open the web interface at `http://127.0.0.1:5000/`.

### Run tests

```powershell
pip install -r requirements-dev.txt
python -m pytest -q
```

## Notes

- This project is a proof of concept, not a production-grade anti-phishing system.
- The in-memory scan history is useful for demo purposes but should be replaced with a database for persistence.
- The detection logic is heuristic-based and designed for educational use.
