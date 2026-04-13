from utils.email_checker import check_email


def test_check_email_legit():
    result = check_email(
        "jane.doe@company.com",
        "Hello",
        "Hello team, this is a regular email with no suspicious content.",
    )

    assert result["verdict"] == "LEGIT"
    assert result["score"] == 0


def test_check_email_phishing():
    result = check_email(
        "alerts@paypal.com",
        "URGENT: verify your account",
        "Please click http://bit.ly/evil to confirm your password.",
    )

    assert result["verdict"] in ("SUSPICIOUS", "PHISHING")
    assert result["score"] >= 25
    assert any(
        "Urgent" in reason or "Shortened links" in reason or "Suspicious" in reason
        for reason in result["reasons"]
    )
