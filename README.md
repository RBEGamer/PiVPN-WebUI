# PiVPN-WebUI
A very fast written PiVPN Webui for adding/rewoke clients [OpenVPN].
It also opens a ssh reverse tunnel to a remote server, so you can PiVPN behind a NAT.


# !!! USE WITH CAUTION !!!
This was an one hour project only for easy client management!
You can access to systems shell over the webui rest api!
The Webui also shows your public ssh key for ssh tunnel setup

## FEATURES

* ADD/REWOKE VPN PROFILES
* ACTIVE CLIENT OVERVIEW
* AUTOMATIC SSH TUNNEL SETUP FOR USAGE BEHIND A NAT

# PARTS NEEDED
* RPI
* A VPS SERVER FOR SSH TUNNEL (the 1$ ones)

## SETUP

### GENERAL SETUP
* Setup a local hostname on the machine!
* Enable iptables! `sudo mkdir /etc/iptables`
* generate ssh keys if not done : `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

* insert your `id_rsa.pub` to the `authorized_keys` file at you remote server 

### SETUP PiVPN [OpenVPN]
!!! YOU HAVE TO CHOOSE OPENVPN IF YOU WANT TO USE THE SSH TUNNEL !!!
First you have to setup your PiVPN server.
In the setup dialog:
* Set your hostname at the public ip question
* After reboot run `pivpn -d` to check everything / add ip tables

### SETUP WEBUI
* Install `NodeJS >10` on your Pi
* Clone this Repo to you Pi home folder `/home/pi`.
* Make startupscript exeuatable `sudo chmod +x /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`
* Use `crontab -e` and add `@reboot /home/pi/PiVPN-WebUI/startup_pivpnwebui.sh`
* Run `npm install` in `/home/pi/PiVPN-WebUI/src/`

### SETUP SSH REVERSE TUNNEL
Here you can setup an ssh tunnel to an remote server.
You can disable the tunnel in the `config file`

* modifiy the config file to setup the ssh tunnel (`/home/pi/PiVPN-WebUI/src/config.json`)

* !! -> insert the remote server ip `pivpn_remote_tunnel_server_ip` !!


## USAGE
Goto `<RPI_IP>:3000` to visit the Webinterface. There you can ADD a new profile and download them to import into you `OpenVPN Client`

### NOTE
In you OpenVPN Client, set the Tunnel-Protocol to `TCP` ! The ssh tunnel doesnt support UDP!
# IMAGES
![Gopher image](/pivpnwebui.png)



## FINAL SERVER SETUP USING A RPI 3B+ AND 12V BATTERIES AS USV BACKUP
## THE DISPLAYS SHOWS A FEW SETTINGS FROM THE pivpnwebui API
![Gopher image](/documentation/2020-02-23 19.12.22.jpg)

![Gopher image](/documentation/2020-02-23 19.10.11.jpg)

![Gopher image](/documentation/2020-02-23 19.10.08.jpg)
