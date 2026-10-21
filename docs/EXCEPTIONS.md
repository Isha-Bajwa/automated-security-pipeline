# Security Exceptions & Policy Waivers

## 1. Exception Governance Policy

In DevSecOps pipelines, automated security gates block builds that exhibit **Critical** or **High** severity vulnerabilities or detected secrets. However, certain findings may represent:
1. **False Positives:** A pattern incorrectly flagged by static heuristic matching.
2. **Unreachable Code Paths:** A vulnerability in a vendored dependency or package that is never invoked during runtime execution.
3. **Compensating Controls:** A vulnerability mitigated by infrastructure-level defenses (e.g. AWS WAF, VPC isolation, read-only root filesystems).

Any security waiver must be formally requested, reviewed by the Security Lead, and assigned an expiration date for periodic re-evaluation.

---

## 2. Active Security Exceptions Registry

| Vulnerability / Rule ID | Security Tool | Exception Type | Business & Technical Justification | Owner / Approver | Expiration Date | Tracking File |
|---|---|---|---|---|---|---|
| `CVE-2023-45853` | Trivy Container | Accepted Risk | Buffer overflow in `minizip` decompression code inside alpine library. Unused and unreachable in our Node.js HTTP server. | Isha Javed (Security Lead) | `2026-12-01` | `.trivyignore` |
| `demo-api-key` | Gitleaks | False Positive / Demo Waiver | Synthetic dummy demonstration secret strictly restricted to test branch (`demo/vulnerable`). Real secrets never accepted. | Isha Javed (Security Lead) | Permanent (Test Only) | `.gitleaks.toml` |
| `npm-audit-low-advisory` | npm audit / SCA | Accepted Risk | Informational warning on development tooling with no production runtime impact. | Isha Javed | `2026-11-15` | `docs/FINDINGS.md` |

---

## 3. How to Implement an Approved Exception

### For Trivy Container / Dependency Scans:
1. Add the CVE ID and justification to `.trivyignore` in the repository root:
   ```text
   CVE-2023-45853  # Unused minizip buffer overflow; Isha; review 2026-12-01
   ```
2. Commit the change along with the updated `docs/EXCEPTIONS.md`.

### For Gitleaks Secret Detection:
1. Add custom allowlist or rule tuning to `.gitleaks.toml`:
   ```toml
   [allowlist]
   description = "Allowed demonstration mock tokens"
   regexes = ['''DEMO_DUMMY_[A-Z0-9]+''']
   ```

---

## 4. Periodic Review Cadence
All security waivers are audited every 30 days. Expired exceptions that have not been granted an extension must be remediated immediately.
