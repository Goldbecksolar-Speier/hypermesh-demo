"""Anonymer Aufrufzaehler: nur Gesamtzahl und Zahl je Tag in einer JSON-Datei. Keine IP, kein Cookie."""
import json, os, threading, datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

FILE = os.environ.get('COUNTER_FILE', '/data/counter.json')
LOCK = threading.Lock()


def load():
    try:
        with open(FILE, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {'total': 0, 'days': {}}


def save(d):
    tmp = FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f)
    os.replace(tmp, FILE)


class H(BaseHTTPRequestHandler):
    def _send(self, d):
        b = json.dumps({'total': d['total']}).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        with LOCK:
            self._send(load())

    def do_POST(self):
        with LOCK:
            d = load()
            day = datetime.date.today().isoformat()
            d['total'] += 1
            d['days'][day] = d['days'].get(day, 0) + 1
            save(d)
            self._send(d)

    def log_message(self, *a):  # keine Zugriffslogs mit IP
        pass


os.makedirs(os.path.dirname(FILE), exist_ok=True)
ThreadingHTTPServer(('0.0.0.0', 8000), H).serve_forever()
