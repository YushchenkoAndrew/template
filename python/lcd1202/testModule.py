from lcd1202 import *
import time

####################################################################
#                       TestModule.py                              #
####################################################################
# Description:                                                     #
#     Use for lcding rewriting library for display Nokia 1202      #
#     Make some interactive example about this module              #
#                                                                  #
#                                                                  #
#                                                                  #
####################################################################


lcd = LCD1202(CS=36, Clock=37, Data=40, RES=38, mode=GPIO.BOARD)
lcd.Inicialize()

lcd.printString({"X" : 15, "Y" : 20}, 1, "Test Module")
lcd.printString({"X" : 0, "Y" : 60}, 1, "(Press to Start)")
flag = True
for i in range(15):
	lcd.printString({"X" : 25, "Y" : 30}, flag, " Start")
	lcd.Update()
	flag = not(flag)
	time.sleep(0.5)
		

lcd.Clear_LCD()

lcd.drawRect({"X" : [9, 47], "Y" : [9, 45]}, 1)
lcd.fillRect({"X" : [19, 37], "Y" : [19, 37]}, 1)
lcd.drawCircle({"X" : 27, "Y" : 27, "R" : 18}, 1)
lcd.drawTriangle({"X" : [40, 60, 40], "Y" : [40, 60, 60]}, 1)
lcd.Update()

time.sleep(2)

lcd.fillScreen(1)

lcd.drawRect({"X" : [9, 47], "Y" : [9, 45]}, 0)
lcd.fillRect({"X" : [19, 37], "Y" : [19, 37]}, 0)
lcd.drawCircle({"X" : 27, "Y" : 27, "R" : 18}, 0)
lcd.drawTriangle({"X" : [40, 60, 40], "Y" : [40, 60, 60]}, 0)
lcd.Update()

time.sleep(2)

lcd.Clear_LCD()

lcd.printString({"X" : 20, "Y" : 20}, 1, "Hello world!")
lcd.printString({"X" : 5, "Y" : 45}, 0, " Version 1.0.15 ")
lcd.Update()

time.sleep(2)

lcd.Clear_LCD()
lcd.drawPicture({"X" : 30, "Y" : 30, "Dimension" : "16x16"},
 [0x00, 0x3E, 0x7F, 0xFE, 0xE0, 0xE0, 0xF8, 0xFC,
  0xF8, 0x00, 0x00, 0x00, 0xE0, 0xF0, 0xE0, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7F, 0x7F,
  0x7F, 0x07, 0x07, 0x07, 0x07, 0x07, 0x03, 0x00], 1)

lcd.drawPicture({"X" : 15, "Y" : 20, "Dimension" : "32x32"},
 [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80,
  0x80, 0x00, 0x00, 0x00, 0x00, 0xF0, 0xF8, 0xF8,
  0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7F, 0xFF,
  0xFF, 0xFF, 0xE0, 0xE0, 0xE0, 0xFF, 0xFF, 0xFF,
  0xFF, 0x00, 0x00, 0xF0, 0xF8, 0xF0, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x01, 0x01, 0x01, 0x01, 0x01, 0xFF, 0xFF, 0xFF,
  0xFF, 0x70, 0x70, 0x7F, 0x7F, 0x3F, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x0F, 0x0F, 0x0F,
  0x0F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 1)

lcd.drawPicture({"X" : 60, "Y" : 30, "Dimension" : "32x32"},
 [0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0xE0, 0xE0,
  0xC0, 0x00, 0x00, 0x00, 0xFC, 0xFE, 0xFE, 0xFE,
  0xFC, 0x00, 0x00, 0x00, 0xC0, 0xE0, 0xE0, 0xC0,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF,
  0xFF, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF,
  0xFF, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x07, 0x0F,
  0x0F, 0x0F, 0x0F, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF,
  0xFF, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x07, 0x03,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x3F, 0x3F, 0x3F, 0x3F,
  0x3F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 1)

lcd.drawPicture({"X" : 60, "Y" : 5, "Dimension" : "16x8"},
 [0x04, 0x24, 0x24, 0x04, 0x04, 0x04, 0x04, 0x14,
  0x14, 0x04, 0x44, 0x44, 0x04, 0x04, 0x14, 0x14], 1)

lcd.drawPicture({"X" : 60, "Y" : 13, "Dimension" : "16x8"},
 [0x01, 0x21, 0x24, 0x04, 0x04, 0x00, 0x01, 0x11,
  0x11, 0x02, 0x42, 0x40, 0x00, 0x02, 0x11, 0x11], 1)

lcd.drawPicture({"X" : 44, "Y" : 5, "Dimension" : "16x8"},
 [0x04, 0x24, 0x24, 0x04, 0x02, 0x01, 0x01, 0x11,
  0x12, 0x04, 0x44, 0x44, 0x04, 0x04, 0x14, 0x14], 1)

lcd.drawPicture({"X" : 44, "Y" : 13, "Dimension" : "16x8"},
 [0x01, 0x21, 0x24, 0x04, 0x04, 0x00, 0x01, 0x11,
  0x11, 0x02, 0x42, 0x40, 0x00, 0x02, 0x11, 0x11], 1)

for i in range(20):
	lcd.drawPicture({"X" : 1, "Y" : 1, "Dimension" : "32x32"},
	 [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	  0xF0, 0xF0, 0xFC, 0xFC, 0xCC, 0xCC, 0xFC, 0xFC,
	  0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xF0, 0xF0,
	  0xFC, 0xF0, 0xE0, 0x80, 0x00, 0x00, 0x00, 0x00,
	  0x00, 0xC0, 0xE0, 0xE0, 0xF0, 0xF0, 0xF8, 0xF8,
	  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x9F, 0x9F, 0x99,
	  0x99, 0x99, 0x19, 0x19, 0x19, 0x01, 0x01, 0x01,
	  0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3E, 0x7E, 0xFF,
	  0xFF, 0xFF, 0xFF, 0x3F, 0x3F, 0xFF, 0xFF, 0xFF,
	  0xFF, 0x7F, 0x3F, 0x1F, 0x07, 0x01, 0x01, 0x01,
	  0x07, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0F,
	  0x0F, 0x0D, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x0F,
	  0x0F, 0x0C, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00,
	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 1)

	lcd.Update()

	time.sleep(0.05)	

	lcd.drawPicture({"X" : 1, "Y" : 1, "Dimension" : "32x32"},
	 [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0xF0, 0xF0, 0xFC, 0xFC, 0xCC, 0xCC, 0xFC, 0xFC,
  	  0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xF0, 0xF0,
  	  0xFC, 0xF0, 0xE0, 0x80, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0xC0, 0xE0, 0xE0, 0xF0, 0xF0, 0xF8, 0xF8,
  	  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x9F, 0x9F, 0x99,
  	  0x99, 0x99, 0x19, 0x19, 0x19, 0x01, 0x01, 0x01,
  	  0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3E, 0x7E, 0xFF,
  	  0xFF, 0x7F, 0x3F, 0x3F, 0x3F, 0xFF, 0xFF, 0xFF,
  	  0xFF, 0x7F, 0x3F, 0x1F, 0x07, 0x01, 0x01, 0x01,
  	  0x07, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07,
  	  0x07, 0x06, 0x06, 0x00, 0x00, 0x01, 0x03, 0x3F,
  	  0x3F, 0x30, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 1)

	lcd.Update()

	time.sleep(0.05)	

	lcd.drawPicture({"X" : 1, "Y" : 1, "Dimension" : "32x32"},
	 [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0xF0, 0xF0, 0xFC, 0xFC, 0xCC, 0xCC, 0xFC, 0xFC,
  	  0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xF0, 0xF0,
  	  0xFC, 0xF0, 0xE0, 0x80, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0xC0, 0xE0, 0xE0, 0xF0, 0xF0, 0xF8, 0xF8,
  	  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x9F, 0x9F, 0x99,
  	  0x99, 0x99, 0x19, 0x19, 0x19, 0x01, 0x01, 0x01,
  	  0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3E, 0x7E, 0xFF,
  	  0xFF, 0xFF, 0xFF, 0x7F, 0x3F, 0x3F, 0xFF, 0xFF,
  	  0xFF, 0x3F, 0x1F, 0x0F, 0x07, 0x01, 0x01, 0x01,
  	  0x07, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3F,
  	  0x3F, 0x33, 0x31, 0x00, 0x00, 0x00, 0x00, 0x07,
  	  0x07, 0x06, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00,
  	  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 1)

	lcd.Update()
	time.sleep(0.05)


lcd.GPIO_CleanUp()