# Security Policy

## Supported versions

Only the **latest GitHub Release** of AtriumUI is supported with security updates.

| Version | Supported |
| --- | --- |
| Latest release | Yes |
| Older releases | No |

Home Assistant **2024.1+** is the documented runtime target (calendar events: **2023.12+**).

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

1. Use GitHub **Privately report a vulnerability** on this repository
   ([Security Advisories](https://github.com/AlexNechayev/AtriumUI/security/advisories/new)).
2. Include AtriumUI version, Home Assistant version, and steps to reproduce.
3. You should receive an acknowledgement within 7 days. If a fix is needed, we
   will coordinate a release and credit you if you want to be named.

Action execution (`executeAction`) is intentionally allowlisted. Reports that
bypass service, URL, or navigate guards are especially welcome.
