#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi
echo "--- SETUP VPN INTERNET USING IP ROUTES ---- delay30"
sleep 30

sudo iptables -I FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -I FORWARD -s 10.8.0.0/24 -j ACCEPT


echo " USING INTERFACE enxb827eb2894dd FOR OUTGOING TRAFFIC PLEASE CHANGE"
ipaddr=$( ip -4 -o addr show enxb827eb2894dd | awk '{print $4}' | cut -d "/" -f 1)
echo $ipaddr
sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 ! -d 10.8.0.0/24 -j SNAT --to $ipaddr






