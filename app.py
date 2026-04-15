from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
from utils.url_checker import check_url
from utils.email_checker import check_email
import os

app = Flask(__name__)

# Path to the built frontend bundle for the secure dashboard UI.
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'dist')

# In-memory scan history keeps the most recent 50 results for dashboard review.
scan_history = []

@app.route("/check", methods=["POST"])
def check():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()

    if not url:
        return jsonify({
            "score": 0,
            "verdict": "LEGIT",
            "reasons": ["No URL provided"],
            "recommendations": ["Please enter a URL and try again."],
            "fixes": ["Provide a URL to scan so the detector can analyze it."],
            "details": {}
        })

    result = check_url(url)

    # 📊 Save scan to history
    scan_entry = {
        "type": "URL",
        "timestamp": datetime.now().isoformat(),
        "source": url,
        "score": result["score"],
        "verdict": result["verdict"],
        "reasons": result["reasons"]
    }

    scan_history.insert(0, scan_entry)  # newest first
    if len(scan_history) > 50:
        scan_history.pop()

    return jsonify(result)

@app.route("/check_email", methods=["POST"])
def check_email_route():
    data = request.get_json(silent=True) or {}
    sender = (data.get("sender") or "").strip()
    subject = (data.get("subject") or "").strip()
    body = (data.get("body") or "").strip()

    if not sender and not subject and not body:
        return jsonify({
            "score": 0,
            "verdict": "LEGIT",
            "reasons": ["No email content provided"],
            "recommendations": ["Provide sender, subject, or body to analyze the message."],
            "fixes": ["Submit email content so the scanner can generate recommendations."],
            "details": {}
        })

    result = check_email(sender, subject, body)

    scan_entry = {
        "type": "EMAIL",
        "timestamp": datetime.now().isoformat(),
        "source": subject or sender,
        "sender": sender,
        "subject": subject,
        "score": result["score"],
        "verdict": result["verdict"],
        "reasons": result["reasons"]
    }

    scan_history.insert(0, scan_entry)
    if len(scan_history) > 50:
        scan_history.pop()

    return jsonify(result)

@app.route("/history", methods=["GET"])
def history():
    return jsonify(scan_history)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path and os.path.exists(os.path.join(FRONTEND_DIST, path)):
        return send_from_directory(FRONTEND_DIST, path)

    index_file = os.path.join(FRONTEND_DIST, 'index.html')
    if os.path.exists(index_file):
        return send_from_directory(FRONTEND_DIST, 'index.html')

    return (
        'Frontend application not built. Run `npm install` and `npm run build` inside /frontend.',
        501
    )

if __name__ == "__main__":
    app.run(debug=True)
