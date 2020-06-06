
import RPi.GPIO as GPIO
import time

class LCD1202:

#difine global constant
        
	#This parameter contain MAX_LEN -- X  MAX_LEN -- Y and MAX_LEN String
	LCD_Dimension = {"X" : 96, "Y" : 68, "Str" : 9}
	
	#Set constant address Y, X3, X4
	ADDR = {"Y" : 0xB0, "X3" : 0x10, "X4" : 0x00}
	
	#It's a dict that use as key character of ASCII and how 4 byte of data
	Table_ASCII = {}    
	
	#Set mode for LCD
	LCD_Mode = {"C" : 0, "D" : 1}
	    
	#Full size of LCD_RAM is (LCD_Dimension("Str")  * LCD_Dimension("X")) 	
	LCD_RAM = dict()
	    
	#This dict contain pin and it's default value for each wire
	SPI = {"RES" : 0, "CS" : 0, "Data" : 0, "Clock" : 0}	
	
	def __init__(self, RES=2, CS=3, Data=4, Clock=17, mode=GPIO.BCM):
		self.SPI.update({"RES" : RES, "CS" : CS, "Data" : Data, "Clock" : Clock})
		GPIO.setmode(mode)
		try:
			Sign_Table = open("table.txt", 'r')
		except:
			print("Something went worng!!\nCan't fined ASCII Table!!")
		for line in Sign_Table.readlines():
			store = line.split(" : ")
			self.Table_ASCII.update({store[0] : [int(i, base=16) for i in store[1][0:28].split(", ")]})
	             
	
	
	def Clear_LCD(self):
		self.LCD_RAM.clear() 
	    
		for i in range(9):
			self.SendByte(self.LCD_Mode["C"], self.ADDR["Y"] | i)
			self.SendByte(self.LCD_Mode["C"], self.ADDR["X4"])
			self.SendByte(self.LCD_Mode["C"], self.ADDR["X3"])
	
			for j in range(self.LCD_Dimension["X"]):
				self.SendByte(self.LCD_Mode["D"], 0)
		self.Update()


	def fillScreen(self, color):
		self.fillRect({"X" : [0, self.LCD_Dimension["X"]], "Y" : [0, self.LCD_Dimension["Y"]]}, color)


			
	
	def GPIO_CleanUp(self):
		GPIO.cleanup()

	def Delay(self):
		pass	
	
	def SendByte(self, mode, data):
		GPIO.output(self.SPI["CS"], 0)	
		GPIO.output(self.SPI["Data"], mode)
		self.Delay()
		GPIO.output(self.SPI["Clock"], 1)
		self.Delay()
	
		for i in range(8):
			GPIO.output(self.SPI["Clock"], 0)
			GPIO.output(self.SPI["Data"], (data & 0x80) != 0) 
			self.Delay()
			GPIO.output(self.SPI["Clock"], 1)
			data = data << 1
	
		GPIO.output(self.SPI["Clock"], 0)
	    
	
	def Update(self):
		#for i in range(9): 
		for i in self.LCD_RAM.keys():
			self.SendByte(self.LCD_Mode["C"], self.ADDR["Y"] | i)
			self.SendByte(self.LCD_Mode["C"], self.ADDR["X4"])
			self.SendByte(self.LCD_Mode["C"], self.ADDR["X3"])

			for j in range(self.LCD_Dimension["X"]):
				if j in self.LCD_RAM[i].keys():
					self.SendByte(self.LCD_Mode["D"], self.LCD_RAM[i][j])
				else:
					self.SendByte(self.LCD_Mode["D"], 0)
	
	
	def Inicialize(self):
		for (pin, state) in zip(self.SPI, [1, 0, 0, 0]):
			GPIO.setup(self.SPI[pin], GPIO.OUT)
			GPIO.output(self.SPI[pin], state)
		
		time.sleep(0.02)
		GPIO.output(self.SPI["CS"], 1)	
		
		#Set command for inicialize display		
		self.SendByte(self.LCD_Mode["C"], 0x2F)
		self.SendByte(self.LCD_Mode["C"], 0xA4)
		self.SendByte(self.LCD_Mode["C"], 0xAF)
		self.Clear_LCD()
	
	#Coord is dict so user by himself named it
	def drawPixel(self, coord, Color):
		if ((coord["X"] < 0) or (coord["X"] >= self.LCD_Dimension["X"]) or (coord["Y"] < 0) or (coord["Y"] >= self.LCD_Dimension["Y"])):
			pass
		coord["Y"], coord["Temp"] = int(coord["Y"] / 8), coord["Y"] % 8


		if not((coord["Y"]) in self.LCD_RAM.keys()):
			self.LCD_RAM.update({coord["Y"] : {}})
		
		if not(coord["X"] in self.LCD_RAM[coord["Y"]].keys()):
			self.LCD_RAM[coord["Y"]].update({coord["X"] : 0})
		
		if Color:
			self.LCD_RAM[coord["Y"]][coord["X"]] = self.LCD_RAM[coord["Y"]][coord["X"]] | (1 << coord["Temp"]) 
		else:
			self.LCD_RAM[coord["Y"]][coord["X"]] = self.LCD_RAM[coord["Y"]][coord["X"]] & ~(1 << coord["Temp"])   
	
	#Coord is dict, so user by himself named it
	def drawChar(self, coord, Color, char):
		if ((coord["X"] >= self.LCD_Dimension["X"]) or (coord["Y"] >= self.LCD_Dimension["Y"]) or (coord["X"] > 4) or (coord["Y"] > 7)):
			pass  
		
		# This is temporal value and it only need for not change Basic ASCII_TABLE
		temp = [i for i in self.Table_ASCII[char]] + [0]
		
		#I don't know, do I need also Russian chars or not. Okey, it's coming soon
		for i in range(len(temp)):
			line = temp[i]
			for j in range(8):
				self.drawPixel(coord={"X" : coord["X"] + i, "Y" : coord["Y"] + j}, Color=Color ^ (line & 0x01 == 0))
				line = line >> 1
		
		# Show char and bits value
		#print(char, " -- ", temp)
		

	# This method print string in display	
	def printString(self, coord, color, string):
		for char in str(string):
			self.drawChar({"X" : coord["X"], "Y" : coord["Y"]}, color, char)	
			coord["X"] += 6

	# This method draw Line, in coord we have {"X" : [x0, x1], "Y" : [y0, y1]}
	def drawLine(self, coord, color):
		state = 1

		if (abs(coord["Y"][1] - coord["Y"][0]) > abs(coord["X"][1] - coord["X"][0])):
			coord["Y"], coord["X"] = [coord["X"][0], coord["X"][1]], [coord["Y"][0], coord["Y"][1]] 
			state = 0
		
		# Calculate "deltas" of line
		dx = coord["X"][1] - coord["X"][0]
		dy = coord["Y"][1] - coord["Y"][0] 
		
		x, y = coord["X"][1], coord["Y"][1]
		
		# Calculate error interval for Y axis
		D = 2 * abs(dy) - abs(dx)

		if (dx >= 0):
			x, y = coord["X"][0], coord["Y"][0]

		for x in range(x, abs(x - sum(coord["X"])) + 1):
			# Draw pixel from line span at currently raterrized position
			if (state):
				self.drawPixel({"X" : x, "Y" : y}, color)
			else:
				self.drawPixel({"X" : y, "Y" : x}, color)

			if (D >= 0):
				D = D - 2 * abs(dx)
				y = y + 1
			
			D = D + 2 * abs(dy)

				



	# This method draw Rectangle, in coord hav {"X" : [x0, x1], "Y" : [y0, y1]}, where from (x0, y0) to (x1, y1) it's rectangle diagonal
	def drawRect(self, coord, color):
		self.drawLine({"X" : [coord["X"][0], coord["X"][1]], "Y" : [coord["Y"][0], coord["Y"][0]]}, color)
		self.drawLine({"X" : [coord["X"][0], coord["X"][0]], "Y" : [coord["Y"][0], coord["Y"][1]]}, color)
		self.drawLine({"X" : [coord["X"][0], coord["X"][1]], "Y" : [coord["Y"][1], coord["Y"][1]]}, color)
		self.drawLine({"X" : [coord["X"][1], coord["X"][1]], "Y" : [coord["Y"][0], coord["Y"][1]]}, color)
	

	# A submethod used by method "drawCircle" for putting pixel at subsequece points coord={"X" : [x0, x1], "Y" : [y0, y1]}
	def subSequencePoint(self, coord, color):
		self.drawPixel({"X" : coord["X"][0] + coord["X"][1], "Y" : coord["Y"][0] + coord["Y"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] - coord["X"][1], "Y" : coord["Y"][0] + coord["Y"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] + coord["X"][1], "Y" : coord["Y"][0] - coord["Y"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] - coord["X"][1], "Y" : coord["Y"][0] - coord["Y"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] + coord["Y"][1], "Y" : coord["Y"][0] + coord["X"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] - coord["Y"][1], "Y" : coord["Y"][0] + coord["X"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] + coord["Y"][1], "Y" : coord["Y"][0] - coord["X"][1]}, color)
		self.drawPixel({"X" : coord["X"][0] - coord["Y"][1], "Y" : coord["Y"][0] - coord["X"][1]}, color)

	# This mathod draw Circle coord={"X" : x, "Y" : y, "R" : r}
	def drawCircle(self, coord, color):
		x = 0
		y = coord["R"]
		d = 3 - 2 * coord["R"]
		
		self.subSequencePoint({"X" : [coord["X"], x], "Y" : [coord["Y"], y]}, color)

		while (y >= x):
			x = x + 1

			# Check for decision parameter and correspondly update d, x, y
			if (d >= 0):
				y = y - 1
				d = d + 4 * (x - y) + 4
			else:
				d = d + 4 * x + 4

			self.subSequencePoint({"X" : [coord["X"], x], "Y" : [coord["Y"], y]}, color)

	
	# Draw Triangle in coord= {"X" : [x0, x1, x2], "Y" : [y0, y1, y2]}
	def drawTriangle(self, coord, color):
		self.drawLine({"X" : [coord["X"][0], coord["X"][1]], "Y" : [coord["Y"][0], coord["Y"][1]]}, color)
		self.drawLine({"X" : [coord["X"][2], coord["X"][1]], "Y" : [coord["Y"][2], coord["Y"][1]]}, color)
		self.drawLine({"X" : [coord["X"][0], coord["X"][2]], "Y" : [coord["Y"][0], coord["Y"][2]]}, color)


	

	def fillRect(self, coord, color):
		if (coord["X"][0] > coord["X"][1]):
			coord["X"] = [coord["X"][1], coord["X"][0]]

		for x in range(coord["X"][0], coord["X"][1]):
			self.drawLine({"X" : [x, x], "Y" : [coord["Y"][0], coord["Y"][1]]}, color)



	# This method show picture that get from bits, where coord -- start point but also "Dimension" : "width_x_hight" (without '_'), picture -- bitMap (2D array)
	#   insert = 0 -- it's mean that it will draw whoole picture (even not set Pixel) 
	def drawPicture(self, coord={"X" : 0, "Y" : 0, "Dimension" : "0x0"}, picture=[], color=1, insert=0):
		coord["Dimension"] = [int(i) for i in coord["Dimension"].split('x')]
		coord["Dimension"] = {"W" : coord["Dimension"][0], "H" : coord["Dimension"][1]}		

		# This parmeter used for chose next Level of 8 bits for axis Y
		x = 0
		y = 0

		for i in range(len(picture)):
			if (x >= coord["Dimension"]["W"]):
				x = 0
				y += 1
			for j in range(8):
				if (not(insert)):
					self.drawPixel({"X" : coord["X"] + x, "Y" : coord["Y"] + y * 8 + j}, ((picture[i] & 0x01) == 0) ^ color)
				else:
					if (((picture[i] & 0x01) == 0) ^ color):
						self.drawPixel({"X" : coord["X"] + x, "Y" : coord["Y"] + y * 8 + j}, 1)
				picture[i] = picture[i] >> 1
			x += 1
		


# For Test this library see TestMoudule.py
