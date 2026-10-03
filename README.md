# hypermesh-demo

Eigenständige Mini-Seite mit den Erklärvideos (Verbildlichung) zur hyper-mesh-Plattform. Getrennt von `hyper-mesh-plattform` und BESS, damit sie einzeln übergeben oder verkauft werden kann. Geplante Adresse: `hypermesh.cloud` (ohne Bindestrich).

- Seiten: `index.html` (Übersicht), `netz.html`, `zug.html`, `invest.html`, `defence.html`, `impressum.html` (Platzhalter).
- Videos in `assets/` (je groß + `-small`, auf dem Handy/Datensparmodus lädt `assets/player.js` die kleine Datei). Quelle der Videos: `C:\Users\info\Code\inter-mesh\`.
- Seiten werden mit `gen_demo.py` erzeugt (Skript liegt nicht im Repo, die fertigen HTML-Dateien sind Quelle). Texte direkt in den HTML-Dateien ändern.

## Nicht in Suchmaschinen (noindex, drei Schichten)
1. `robots.txt`: `Disallow: /`
2. `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` in jeder Seite
3. nginx-Header `X-Robots-Tag` (auch für die MP4-Dateien), siehe `nginx.conf`

Grenze: noindex hält nur Suchmaschinen fern. Wer die Adresse kennt, kommt drauf, und der Domainname steht über das Let's-Encrypt-Zertifikat in öffentlichen Zertifikatslisten. Für echten Zugriffsschutz Basic Auth in nginx ergänzen.

## Lokal ansehen
```bash
cd C:/Users/info/Code/hypermesh-demo && python -m http.server 8769
```
Dann `http://localhost:8769/`.

## Docker (Synology), Container `hypermesh-demo`, Port 8095
```bash
docker compose up -d --build
```
Danach im DSM: Reverse-Proxy `www.hypermesh.cloud` (443) → `http://localhost:8095`, Zertifikat Let's Encrypt. DNS bei Strato: CNAME `www` → `graben54.goip.de` (DynDNS, wie bei `www.speier-solar.de`); die Domain ohne `www` kann kein CNAME sein, dort eine Weiterleitung auf `www.hypermesh.cloud` einrichten. Reverse-Proxy-Hostname und Zertifikat: `www.hypermesh.cloud`.

Stand: lokal gebaut, nicht gepusht, nicht auf dem NAS.
