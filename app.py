from flask import Flask, request, jsonify, render_template
from datetime import datetime
from utils.url_checker import check_url
from utils.email_checker import check_email

app = Flask(__name__)

# 🧠 In-memory scan history (SOC style logs)
scan_history = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route('/dashboard/url')
def dashboard_url():
    return render_template('dashboard_url.html')

@app.route('/dashboard/email')
def dashboard_email():
    return render_template('dashboard_email.html')

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

if __name__ == "__main__":
    app.run(debug=True)
