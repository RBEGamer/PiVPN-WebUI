#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi





#python /home/pi/hd44780/show_lcd.py &
#touch /home/pi/STARTUP_SUCC.txt
#autossh -M 9999 -N -R *:8001:localhost:8001 ubuntu@3.124.85.208 &

echo "--- START NODEJS WBUI ---"

node /home/pi/pivpn_webui/src/server.js





echo "--- STARTUP TUNNEL ---"

#autossh -M 9999 -N -R *:8001:localhost:8001 ubuntu@3.124.85.208
