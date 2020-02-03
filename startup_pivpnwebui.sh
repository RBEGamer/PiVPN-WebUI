#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi


touch /home/pi/STARTUP_SUCC.txt


echo "--- START NODEJS WBUI ---"

node /home/pi/pivpn_webui/src/server.js





echo "--- STARTUP TUNNEL ---"

#autossh -M 9999 -N -R *:5123:localhost:443 ubuntu@3.124.85.208


