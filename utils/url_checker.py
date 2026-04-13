import re
import socket
import ipaddress
from urllib.parse import urlparse, unquote
from datetime import datetime
from utils.risk_scorer import calculate_risk

try:
    import whois
except ImportError:
    whois = None

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "buff.ly", "adf.ly", "short.ly", "is.gd", "cutt.ly"
}

KNOWN_BRAND_KEYWORDS = [
    "apple", "google", "microsoft", "paypal", "amazon", "facebook", "netflix",
    "bankofamerica", "chase", "wellsfargo", "dropbox", "adobe", "linkedin", "github"
]

SUSPICIOUS_PORTS = {8080, 8000, 8888, 8443, 22, 23, 2323, 3389}


def normalize_url(url):
    if not url.startswith("http://") and not url.startswith("https://"):
        return "http://" + url
    return url


def is_shortened_url(domain):
    return any(domain.endswith(shortener) for shortener in SHORTENER_DOMAINS)


def is_brand_impersonation(domain):
    domain_lower = domain.lower()
    if any(brand in domain_lower for brand in KNOWN_BRAND_KEYWORDS):
        suspicious_markers = ["secure", "account", "login", "verify", "update", "service", "support"]
        return any(marker in domain_lower for marker in suspicious_markers)
    return False


def extract_features(url):
    features = {}

    normalized_url = normalize_url(url)
    parsed = urlparse(normalized_url)
    domain = parsed.netloc
    hostname = domain.split("@")[-1].split(":")[0]
    path = unquote(parsed.path or "")
    query = unquote(parsed.query or "")

    # HTTPS check
    features["https"] = normalized_url.startswith("https")

    # Suspicious keywords in URL
    suspicious_words = ["login", "verify", "secure", "account", "update", "reset", "bank"]
    features["suspicious_keywords"] = any(word in normalized_url.lower() for word in suspicious_words)

    # URL length and encoding abuse
    features["long_url"] = len(normalized_url) > 75
    features["many_encoded_chars"] = path.count("%") + query.count("%") > 3

    # IP address usage
    features["ip_address"] = bool(re.match(r"http[s]?://\d+\.\d+\.\d+\.\d+", normalized_url))

    # Suspicious ports
    features["has_nonstandard_port"] = parsed.port is not None and parsed.port not in (80, 443)

    # Subdomain count
    features["many_subdomains"] = hostname.count(".") > 3

    # Suspicious TLDs
    suspicious_tlds = [".xyz", ".top", ".click", ".info", ".pw", ".club", ".icu"]
    features["suspicious_tld"] = any(hostname.endswith(tld) for tld in suspicious_tlds)

    # Suspicious path indicators
    path_keywords = ["login", "secure", "account", "signin", "update", "verify", "reset", "auth"]
    fragment_keywords = ["login", "verify", "auth", "secure", "token"]
    features["suspicious_path"] = any(keyword in path.lower() for keyword in path_keywords) or any(keyword in query.lower() for keyword in path_keywords)
    features["has_suspicious_fragment"] = bool(parsed.fragment and any(keyword in parsed.fragment.lower() for keyword in fragment_keywords))
    features["uses_at_symbol"] = "@" in normalized_url and not normalized_url.lower().startswith("mailto:")
    features["punycode_domain"] = hostname.startswith("xn--") or ".xn--" in hostname
    features["repeating_tld"] = bool(re.search(r"\.(?:[a-z]{2,})(?:\.[a-z]{2,})+$", hostname)) and hostname.count(".") >= 3

    # URL shortening and brand impersonation
    features["shortened_url"] = is_shortened_url(hostname)
    features["brand_impersonation"] = is_brand_impersonation(hostname)

    # Domain age and threat intelligence
    features["new_domain"] = False
    if whois is not None:
        try:
            domain_info = whois.whois(hostname)
            creation_date = domain_info.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            if creation_date:
                age_days = (datetime.now() - creation_date).days
                if age_days < 30:
                    features["new_domain"] = True
        except Exception:
            pass

    # DNS and IP reputation
    features["resolved_private_ip"] = False
    features["ip_addresses"] = []
    try:
        answers = socket.getaddrinfo(hostname, parsed.port or 0, family=socket.AF_UNSPEC, type=socket.SOCK_STREAM)
        ip_addresses = sorted({item[4][0] for item in answers})
        features["ip_addresses"] = ip_addresses
        for address in ip_addresses:
            try:
                ip_obj = ipaddress.ip_address(address)
                if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved or ip_obj.is_multicast or ip_obj.is_unspecified:
                    features["resolved_private_ip"] = True
                    break
            except Exception:
                continue
    except Exception:
        pass

    # Extra cyber signals
    features["high_entropy_path"] = len(re.findall(r"[A-Za-z0-9_-]{8,}", path)) > 2
    features["domain"] = hostname

    return features


def check_url(url):
    features = extract_features(url)
    result = calculate_risk(features)
    return result
