#!/bin/bash
# Demo-Seite auf das NAS kopieren (tar ueber SSH, scp ist auf dem NAS aus).
# Aufruf aus Git Bash im Projektordner:  bash deploy-nas.sh
# Danach auf dem NAS (Schritt 2, braucht sudo): siehe Ausgabe am Ende.
set -e
KEY=~/.ssh/kimi2_synology_ed25519
NAS=ssh-admin@192.168.3.142
DIR=/volume1/docker/hypermesh-demo
SSH="ssh -i $KEY -o BatchMode=yes $NAS"
STAMP=$(date +%Y-%m-%d-%H%M)

[ -z "$(git status --porcelain)" ] || { echo "Arbeitsverzeichnis nicht sauber, erst committen."; exit 1; }

echo "1/4 Sicherung auf dem NAS: $DIR-backup-$STAMP (ohne Videos)"
$SSH "mkdir -p $DIR-backup-$STAMP && cd $DIR && tar cf - --exclude='*.mp4' . | tar xf - -C $DIR-backup-$STAMP"

echo "2/4 Alte Seitendateien entfernen (Inhalte werden komplett ersetzt)"
$SSH "cd $DIR && rm -f *.html && rm -rf assets"

echo "3/4 Neuen Stand uebertragen (git archive, LF)"
git archive --format=tar HEAD | $SSH "tar xf - -C $DIR"
$SSH "cd $DIR && sed -i 's/\r\$//' Dockerfile docker-compose.yml nginx.conf robots.txt *.html assets/*.js assets/*.css"

$SSH "mkdir -p $DIR/counter-data"   # Bind-Mount-Ordner muss auf der Synology vorher existieren

echo "4/4 Pruefsumme"
L=$(git show HEAD:index.html | tr -d '\r' | md5sum | cut -d' ' -f1)
R=$($SSH "md5sum $DIR/index.html" | cut -d' ' -f1)
[ "$L" = "$R" ] && echo "index.html ok ($L)" || { echo "ABWEICHUNG index.html"; exit 1; }
$SSH "ls $DIR/assets/*.mp4 | wc -l; du -sh $DIR"

cat <<'EOT'

Fertig kopiert. Jetzt auf dem NAS (SSH, Docker braucht sudo mit vollem Pfad):

  cd /volume1/docker/hypermesh-demo
  sudo /usr/local/bin/docker rm -f hypermesh-demo
  sudo /usr/local/bin/docker-compose up -d --build
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8095/assets/office-bis-hund.mp4

Test im Browser: http://192.168.3.142:8095
EOT
