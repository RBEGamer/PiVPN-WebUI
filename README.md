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
* Setup a local hostname on the machine!
* Enable iptables!


First you have to setup your PiVPN server.
In the setup dialog:
* Set your hostname at the public ip question

* Install `NodeJS >10` on your Pi
* Clone this Repo to you Pi home folder `/home/pi`.
* Make startupscript exeuatable `sudo chmod +x /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`
* Use `crontab -e` and add `@reboot /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`




# IMAGES
![Gopher image](/pivpnwebui.png)
