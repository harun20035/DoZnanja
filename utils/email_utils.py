import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

def send_course_status_email(to_email: str, course_title: str, status: str):
    subject = "Status vašeg kursa na doZnanja"
    status_hr = "odobren" if status == "APPROVED" else "odbijen"

    body = f"""\
Poštovani,

Vaš kurs "{course_title}" je {status_hr} od strane administratora.

Pozdrav,
DoZnanja tim
"""

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        print(f"✅ Email poslan na {to_email}")
    except Exception as e:
        print(f"❌ Greška pri slanju maila: {e}")
