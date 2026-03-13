"""
Lahari S — Portfolio Flask App
Serves the portfolio and handles contact form emails via Flask-Mail.
"""

import os
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv

# ── Load .env ──────────────────────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)

# ── App Secret ────────────────────────────────────────────────────────────
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-me-in-production')

# ── Flask-Mail Config (Gmail SMTP) ────────────────────────────────────────
app.config['MAIL_SERVER']   = 'smtp.gmail.com'
app.config['MAIL_PORT']     = 587
app.config['MAIL_USE_TLS']  = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)

RECIPIENT_EMAIL = os.getenv('MAIL_USERNAME')   # messages land in Lahari's inbox


# ── Routes ────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send', methods=['POST'])
def send():
    """Receive contact form data and forward it as an email."""
    data = request.get_json(silent=True) or request.form

    name    = (data.get('name', '') or '').strip()
    email   = (data.get('email', '') or '').strip()
    message = (data.get('message', '') or '').strip()

    # ── Basic validation ──────────────────────────────────────────────────
    if not name or not email or not message:
        return jsonify(success=False, message='All fields are required.'), 400

    # ── Compose & send email ──────────────────────────────────────────────
    try:
        subject = f"[Portfolio] New message from {name}"

        body = f"""You have received a new message from your portfolio contact form.

Name    : {name}
Email   : {email}

Message :
{message}

---
Sent via Portfolio Contact Form (Flask-Mail)
"""
        msg = Message(
            subject=subject,
            recipients=[RECIPIENT_EMAIL],
            body=body,
            reply_to=email          # reply goes straight to the visitor
        )
        mail.send(msg)
        return jsonify(success=True,
                       message="Message sent! I'll get back to you soon."), 200

    except Exception as exc:
        app.logger.error(f"Mail send failed: {exc}")
        return jsonify(
            success=False,
            message='Sorry, something went wrong. Please email me directly.'
        ), 500


# ── Run ───────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    # Use the PORT environment variable if available (Render, etc.)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
