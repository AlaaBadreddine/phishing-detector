from utils.url_checker import check_url


def test_check_url_legit():
    result = check_url("https://example.com")

    assert result["verdict"] == "LEGIT"
    assert result["score"] == 0
    assert "recommendations" in result


def test_check_url_phishing_ip():
    result = check_url("http://192.168.1.1/login")

    assert result["verdict"] in ("SUSPICIOUS", "PHISHING")
    assert result["score"] >= 35
    assert any(
        "IP address" in reason or "Not using HTTPS" in reason or "Suspicious path" in reason
        for reason in result["reasons"]
    )
