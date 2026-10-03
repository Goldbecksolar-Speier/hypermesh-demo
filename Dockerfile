# hypermesh-demo — statische Seite, kein Build-Schritt noetig
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY *.html robots.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
