def calculate_risk(features):
    score = 0
    reasons = []
    recommendations = []
    fixes = []

    # Each feature contributes to risk
    if features.get("https") == False:
        score += 10
        reasons.append("Not using HTTPS")
        recommendations.append("Avoid sending credentials over HTTP.")
        fixes.append("Use only secure https:// links for sensitive sites.")

    if features.get("suspicious_keywords"):
        score += 15
        reasons.append("Contains suspicious keywords")
        recommendations.append("Review the link for commonly abused phishing text.")
        fixes.append("Do not follow links with terms like login, verify, or secure unless you initiated them.")

    if features.get("long_url"):
        score += 10
        reasons.append("URL is unusually long")
        recommendations.append("Short or encoded URL paths are a sign of hidden payloads.")
        fixes.append("Avoid clicking links that have long random-looking paths.")

    if features.get("ip_address"):
        score += 25
        reasons.append("Uses IP address instead of domain")
        recommendations.append("Block direct IP URLs unless you trust the source.")
        fixes.append("Do not visit raw IP URLs unless they are from a known internal service.")

    if features.get("shortened_url"):
        score += 20
        reasons.append("URL shortener detected")
        recommendations.append("Expand shortened URLs before clicking.")
        fixes.append("Use a link expander or preview tool to verify the final destination.")

    if features.get("brand_impersonation"):
        score += 15
        reasons.append("Brand impersonation pattern detected")
        recommendations.append("Check the link carefully for spoofed domain names.")
        fixes.append("Compare the domain against the official organization URL.")

    if features.get("many_subdomains"):
        score += 10
        reasons.append("Too many subdomains")
        recommendations.append("Phishing links often use nested subdomains to hide the real host.")
        fixes.append("Be cautious when domains contain many dot-separated labels.")

    if features.get("suspicious_tld"):
        score += 10
        reasons.append("Uses suspicious top-level domain")
        recommendations.append("Watch for unusual domain endings.")
        fixes.append("Avoid clicking domains ending in uncommon TLDs like .xyz or .top.")

    if features.get("suspicious_path"):
        score += 10
        reasons.append("Suspicious path or query parameters")
        recommendations.append("Review the URL path for hidden login or auth redirects.")
        fixes.append("Do not enter credentials on pages that use misleading path names.")

    if features.get("resolved_private_ip"):
        score += 25
        reasons.append("Domain resolves to private or reserved IP")
        recommendations.append("Investigate internal or unexpected address resolution.")
        fixes.append("Treat unexpected private IP resolution as a serious red flag.")

    if features.get("new_domain"):
        score += 25
        reasons.append("Domain is newly registered")
        recommendations.append("New domains are often used in phishing campaigns.")
        fixes.append("Avoid acting on email or messages sent from brand-new domains.")

    if features.get("has_nonstandard_port"):
        score += 10
        reasons.append("Nonstandard network port in URL")
        recommendations.append("Non-standard ports can indicate hidden services.")
        fixes.append("Ignore links that use unusual ports unless you know the service.")

    if features.get("high_entropy_path"):
        score += 10
        reasons.append("High-entropy path detected")
        recommendations.append("Randomized or encoded path segments are often malicious.")
        fixes.append("Do not access links that contain long strings of random characters.")

    if features.get("uses_at_symbol"):
        score += 20
        reasons.append("URL contains an '@' symbol in the path")
        recommendations.append("Avoid URLs that use '@' because they can hide the real destination.")
        fixes.append("Reject URLs that include an '@' as part of the link structure.")

    if features.get("punycode_domain"):
        score += 15
        reasons.append("Punycode or IDN domain detected")
        recommendations.append("Check unusual internationalized domain names carefully.")
        fixes.append("Do not trust domains that use punycode unless you know the brand.")

    if features.get("repeating_tld"):
        score += 10
        reasons.append("Suspected domain masquerading or repeated TLDs")
        recommendations.append("Watch for spoofed domains that use nested or repeated extensions.")
        fixes.append("Inspect the actual domain structure in the browser address bar.")

    if features.get("has_suspicious_fragment"):
        score += 5
        reasons.append("Suspicious URL fragment detected")
        recommendations.append("Fragments can be used to hide redirection or tracking behavior.")
        fixes.append("Avoid relying on fragment-only payloads when verifying link safety.")

    if not reasons:
        recommendations.append("The URL appears low-risk, but always verify the sender separately.")
        fixes.append("If unsure, open the site manually by typing the address in your browser.")

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
        "has_suspicious_fragment": features.get("has_suspicious_fragment"),
        "https": features.get("https"),
        "long_url": features.get("long_url")
    }

    return {
        "score": score,
        "verdict": verdict,
        "reasons": reasons,
        "recommendations": recommendations,
        "fixes": fixes,
        "details": details
    }
