# PiVPN-WebUI
A very fast written PiVPN Webui for adding/rewoke clients.

# !!! USE WITH CAUTION !!!
This was an one hour project only for easy client management!
You can access to systems shell over the webui rest api!
The Webui also shows your public ssh key for ssh tunnel setup

## FEATURES

* ADD/REWOKE VPN PROFILES
* ACTIVE CLIENT OVERVIEW
* AUTOMATIC SSH TUNNEL SETUP FOR USAGE BEHIND A NAT



## SETUP [OpenVPN]

### GENERAL SETUP
* Setup a local hostname on the machine!
* Enable iptables!
* generate ssh keys if not done : `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

### SETUP PiVPN
First you have to setup your PiVPN server.
In the setup dialog:
* Set your hostname at the public ip question

### SETUP WEBUI
* Install `NodeJS >10` on your Pi
* Clone this Repo to you Pi home folder `/home/pi`.
* Make startupscript exeuatable `sudo chmod +x /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`
* Use `crontab -e` and add `@reboot /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`


### SETUP SSH REVERSE TUNNEL
* modifiy the config file to setup the ssh tunnel (`/home/pi/PiVPN-WebUI/src/config.json`)


# IMAGES
![Gopher image](/pivpnwebui.png)
