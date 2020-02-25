#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi



# SETUP IP TALBES
sudo iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -I FORWARD -s 10.8.0.0/24 -j ACCEPT

#FINALLY ROUTE ALL TRAFFIC FROM THE OVPN POOL TO THE ETH0 

echo " USING INTERFACE enxb827eb2894dd FOR OUTGOING TRAFFIC PLEASE CHANGE"
ipaddr=$( ip -4 -o addr show enxb827eb2894dd | awk '{print $4}' | cut -d "/" -f 1)
echo $ipaddr
sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to $ipaddr






#python /home/pi/hd44780/show_lcd.py &
#touch /home/pi/STARTUP_SUCC.txt
#autossh -M 9999 -N -R *:8001:localhost:8001 ubuntu@3.124.85.208 &

echo "--- START NODEJS WBUI ---"

node /home/pi/pivpn_webui/src/server.js





echo "--- STARTUP TUNNEL ---"

#autossh -M 9999 -N -R *:8001:localhost:8001 ubuntu@3.124.85.208
