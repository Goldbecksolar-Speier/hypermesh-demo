# hypermesh-demo

Eigenständige Mini-Seite mit den Erklärvideos (Verbildlichung) zur hyper-mesh-Plattform. Getrennt von `hyper-mesh-plattform` und BESS, damit sie einzeln übergeben oder verkauft werden kann. Geplante Adresse: `hypermesh.cloud` (ohne Bindestrich).

- Aufbau: eine Seite `index.html` mit Intro und Themenabschnitten, dazu `impressum.html` und `datenschutz.html`. Das Intro zeigt kurz den Stern aus rundem Kern und fünf Blasen (wie auf der hyper-mesh-Startseite), der Stern wandert dann nach oben und wird zur Menüleiste. Abschnitte: Vermittlung Speicher (3 Videos), KI-Programmierung, Marktscreener, Geo-Fencing (je "Erklärvideo folgt") und Defence (1 Video). Die Menüblasen springen zum Abschnitt. Intro und Menü: `assets/intro.js`; das Intro läuft nur beim ersten Besuch je Sitzung und wird bei Link mit `#Abschnitt` oder reduzierter Bewegung übersprungen.
- Videos in `assets/` (je groß + `-small`, auf dem Handy/Datensparmodus lädt `assets/player.js` die kleine Datei). Quelle der Videos: `C:\Users\info\Code\inter-mesh\`.
- `index.html` ist von Hand geschrieben. `impressum.html` und `datenschutz.html` wurden mit einem Skript erzeugt (liegt nicht im Repo), die fertigen HTML-Dateien sind die Quelle: Texte direkt dort ändern.

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
