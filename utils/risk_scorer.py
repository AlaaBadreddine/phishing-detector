def calculate_risk(features):
    score = 0
    reasons = []
    recommendations = []

    # Each feature contributes to risk
    if features.get("https") == False:
        score += 10
        reasons.append("Not using HTTPS")
        recommendations.append("Avoid sending credentials over HTTP.")

    if features.get("suspicious_keywords"):
        score += 15
        reasons.append("Contains suspicious keywords")
        recommendations.append("Review the link for commonly abused phishing text.")

    if features.get("long_url"):
        score += 10
        reasons.append("URL is unusually long")
        recommendations.append("Short or encoded URL paths are a sign of hidden payloads.")

    if features.get("ip_address"):
        score += 25
        reasons.append("Uses IP address instead of domain")
        recommendations.append("Block direct IP URLs unless you trust the source.")

    if features.get("shortened_url"):
        score += 20
        reasons.append("URL shortener detected")
        recommendations.append("Expand shortened URLs before clicking.")

    if features.get("brand_impersonation"):
        score += 15
        reasons.append("Brand impersonation pattern detected")
        recommendations.append("Check the link carefully for spoofed domain names.")

    if features.get("many_subdomains"):
        score += 10
        reasons.append("Too many subdomains")
        recommendations.append("Phishing links often use nested subdomains to hide the real host.")

    if features.get("suspicious_tld"):
        score += 10
        reasons.append("Uses suspicious top-level domain")
        recommendations.append("Watch for unusual domain endings.")

    if features.get("suspicious_path"):
        score += 10
        reasons.append("Suspicious path or query parameters")
        recommendations.append("Review the URL path for hidden login or auth redirects.")

    if features.get("resolved_private_ip"):
        score += 25
        reasons.append("Domain resolves to private or reserved IP")
        recommendations.append("Investigate internal or unexpected address resolution.")

    if features.get("new_domain"):
        score += 25
        reasons.append("Domain is newly registered")
        recommendations.append("New domains are often used in phishing campaigns.")

    if features.get("has_nonstandard_port"):
        score += 10
        reasons.append("Nonstandard network port in URL")
        recommendations.append("Non-standard ports can indicate hidden services.")

    if features.get("high_entropy_path"):
        score += 10
        reasons.append("High-entropy path detected")
        recommendations.append("Randomized or encoded path segments are often malicious.")

    if features.get("uses_at_symbol"):
        score += 20
        reasons.append("URL contains an '@' symbol in the path")
        recommendations.append("Avoid URLs that use '@' because they can hide the real destination.")

    if features.get("punycode_domain"):
        score += 15
        reasons.append("Punycode or IDN domain detected")
        recommendations.append("Check unusual internationalized domain names carefully.")

    if features.get("repeating_tld"):
        score += 10
        reasons.append("Suspected domain masquerading or repeated TLDs")
        recommendations.append("Watch for spoofed domains that use nested or repeated extensions.")

    if features.get("has_suspicious_fragment"):
        score += 5
        reasons.append("Suspicious URL fragment detected")
        recommendations.append("Fragments can be used to hide redirection or tracking behavior.")

    if score >= 60:
        verdict = "PHISHING"
    elif score >= 35:
        verdict = "SUSPICIOUS"
    else:
        verdict = "LEGIT"

    details = {
        "domain": features.get("domain"),
        "ip_addresses": features.get("ip_addresses", []),
        "shortened_url": features.get("shortened_url"),
        "brand_impersonation": features.get("brand_impersonation"),
        "resolved_private_ip": features.get("resolved_private_ip"),
        "suspicious_path": features.get("suspicious_path"),
        "new_domain": features.get("new_domain"),
        "has_nonstandard_port": features.get("has_nonstandard_port"),
        "many_encoded_chars": features.get("many_encoded_chars"),
        "uses_at_symbol": features.get("uses_at_symbol"),
        "punycode_domain": features.get("punycode_domain"),
        "repeating_tld": features.get("repeating_tld"),
        "has_suspicious_fragment": features.get("has_suspicious_fragment")
    }

    return {
        "score": score,
        "verdict": verdict,
        "reasons": reasons,
        "recommendations": recommendations,
        "details": details
    }
