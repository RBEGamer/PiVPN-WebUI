#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi

touch /home/pi/STARTUP_SUCC.txt

echo "--- START NODEJS WBUI ---"
node /home/pi/PiVPN-WebUI/src/server.js

