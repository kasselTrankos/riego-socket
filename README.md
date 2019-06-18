![travis](https://travis-ci.org/kasselTrankos/riego-socket.svg?branch=master)
## The soket riego's leg

This is the socket server from port 3000 that comunicate directly with arduino and mobile.
Given apche2(v2.4+) configuration.
```
RewriteEngine On
RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
RewriteCond %{QUERY_STRING} transport=websocket    [NC]
RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
ProxyPass /socket.io http://localhost:3000/socket.io
ProxyPassReverse /socket.io http://localhost:3000/socket.io
```




Info:
 - [create systemctl riegoserver.service for run node](https://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/)
 - using [pm2](http://pm2.keymetrics.io/) to always stay at work ```npm npm i -g pm2```