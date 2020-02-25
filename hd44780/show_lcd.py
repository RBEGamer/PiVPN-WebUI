import lcddriver
from time import *
import requests
import time
import os




lcd = lcddriver.lcd()
lcd.lcd_clear()

lcd.lcd_display_string("OVPN VPN SERVER", 1)


LCD_DISPLAY_LEN = 16

DISPLAY_SHOW_STR = "12345678"


loopcounter = 0


lcd.lcd_display_string("-- PRODEVMO --", 2)

lcd_curr_pos = 0 # the 16x times pos in str
def disp_show():
	global lcd_curr_pos
	if lcd_curr_pos > len(DISPLAY_SHOW_STR)-LCD_DISPLAY_LEN +1:
		lcd_curr_pos = 0

	lcd.lcd_clear()
	disp_end = len(DISPLAY_SHOW_STR)
	if(disp_end > LCD_DISPLAY_LEN):
		disp_end = LCD_DISPLAY_LEN
	lcd.lcd_display_string(DISPLAY_SHOW_STR[lcd_curr_pos:],2)
	print("LCD TO SHOW:" + DISPLAY_SHOW_STR[lcd_curr_pos:])
	lcd.lcd_display_string("OVPN VPN SERVER", 1)

while(1):
	if loopcounter > 50:
		lcd.lcd_backlight("off")
		continue
	else:
		loopcounter = loopcounter +1
#		lcd.lcd_backlight("on")

	DISPLAY_SHOW_STR = ""
	try:
		r = requests.get('http://127.0.0.1:3000/rest/get_active_client_status')
		if r.status_code == 200 and r.json() is not None:
			DISPLAY_SHOW_STR +=" ACTIVE CLIENTS:" +str(len(r.json()['count'])) + " | "

	except:
                DISPLAY_SHOW_STR += " REQUEST EXCEPTION get_active_client_status | "



	try:
                r = requests.get('http://127.0.0.1:3000/rest/config')
                if r.status_code == 200 and r.json() is not None:
                        DISPLAY_SHOW_STR +=" TUNNEL_IP:" +str(r.json()['pivpn_remote_tunnel_server_ip']) + " | "
			DISPLAY_SHOW_STR +=" TUNNEL_PORT:" +str(r.json()['pivpn_ovpn_remote_tunnel_port']) + " | "
			DISPLAY_SHOW_STR +=" WebUI Port:" +str(r.json()['webserver_default_port']) + " | "
	except:
                DISPLAY_SHOW_STR += " REQUEST EXCEPTION /rest/config | "

	#print(DISPLAY_SHOW_STR)
	disp_show()
	lcd_curr_pos = lcd_curr_pos + 5
	time.sleep(0.5)
