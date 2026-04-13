from utils.risk_scorer import calculate_risk


def test_calculate_risk_legit():
    features = {
        "https": True,
        "suspicious_keywords": False,
        "long_url": False,
        "ip_address": False,
        "shortened_url": False,
        "brand_impersonation": False,
        "many_subdomains": False,
        "suspicious_tld": False,
        "suspicious_path": False,
        "resolved_private_ip": False,
        "new_domain": False,
        "has_nonstandard_port": False,
        "high_entropy_path": False,
        "uses_at_symbol": False,
        "punycode_domain": False,
        "repeating_tld": False,
        "has_suspicious_fragment": False,
    }

    result = calculate_risk(features)

    assert result["verdict"] == "LEGIT"
    assert result["score"] == 0


def test_calculate_risk_phishing():
    features = {
        "https": False,
        "suspicious_keywords": True,
        "long_url": True,
        "ip_address": True,
        "shortened_url": True,
        "brand_impersonation": True,
        "many_subdomains": True,
        "suspicious_tld": True,
        "suspicious_path": True,
        "resolved_private_ip": True,
        "new_domain": True,
        "has_nonstandard_port": True,
        "high_entropy_path": True,
        "uses_at_symbol": True,
        "punycode_domain": True,
        "repeating_tld": True,
        "has_suspicious_fragment": True,
    }

    result = calculate_risk(features)

    assert result["verdict"] == "PHISHING"
    assert result["score"] >= 60
