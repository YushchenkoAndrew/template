import RPi.GPIO as GPIO
from lcd1202 import *
import time
import random

####################################################################
#                       Main.py                                    #
####################################################################
# Description:                                                     #
#     Create a pixel game that based on idea of dinosaurs game     #
#     Design for screen from Nokia 1202 (Pixel screen)             #
#                                                                  #
#                                                                  #
#                                                                  #
####################################################################

class DinosaursGame:

	LCD = 0

	RoadChank = dict()

	Dinosaurs = {"X" : 5, "Y" : 28}
	
	Physics = {"Velocity" : 0, "Gravity" : 4}
	
	def __init__(self, LCD_Identification, Button_Inditification):
		self.LCD = LCD1202(CS=LCD_Identification["CS"], Clock=LCD_Identification["Clock"],
			 Data=LCD_Identification["Data"], RES=LCD_Identification["RES"], mode=LCD_Identification["Mode"])

		self.LCD.Inicialize()

		GPIO.setup(Button_Inditification[0], GPIO.IN)

		self.StartScreen()



	def StartScreen(self):
		self.LCD.printString({"X" : 5, "Y" : 20}, 1, "Ganosaurs Game")
		self.LCD.printString({"X" : 0, "Y" : 60}, 1, "(Press to Start)")

		flag = True
		buttonState = 1
		prevTime = time.time()

		while(True):
			self.LCD.printString({"X" : 25, "Y" : 30}, flag, " Start")
			#flag = not(flag)

			if (GPIO.input(35) == 1 and buttonState == 0):
				break			

			if (time.time() - prevTime >= 0.5):
				prevTime = time.time()
				flag = not(flag)
				self.LCD.Update()

			buttonState = GPIO.input(35)

		self.LCD.Clear_LCD()
		


	
	def readBitMap(self, path, num):
		try:
			bitsMapFile = open(path, 'r')
		except:
			print("Something went wrong!\nCan find File ", path)
			pass
		
		totalLine = ''
		
		for line in bitsMapFile.readlines():
			totalLine += line
		
		for part in [chank.replace("\n", "").replace(" ", "").replace("=", "")  for chank in totalLine.replace("]", "[").split("\n\n")]:
			temp =  part.split("[")
			
			# Check first num for detect needed bitMap
			if (int(temp[0][0]) == num):
				bitMap = [int(i, base=16) for i in temp[1].split(",")]

				# Temporary save the Dimension value in temp parameter
				temp = temp[0].replace(")", "(").split("(")
				return {"BitMap" : bitMap, "Dimension" : temp[1]}	



	def Motion(self):
		CNT = 0	
		prevTime = time.time()
		jumpTime = time.time()
		ButtonState = 1
		Jump = False

		while(True):
			if (time.time() - prevTime >= 0.01):
				for key in self.RoadChank.keys():
					self.RoadChank[key]["X"] -= 4
				
				if (self.RoadChank[0]["X"] <= -16):
					for id in range(1, len(self.RoadChank)):
						self.RoadChank[id - 1] = {key : value for key, value in self.RoadChank[id].items()}

					temp = len(self.RoadChank) - 1
					self.RoadChank[temp] = {"X" : temp * 16, "Up" : random.choice([1, 3, 4, 5]), "Down" : random.choice([2, 6])}


				self.ShowRoad([i for i in range(3, len(self.RoadChank))])
				
				self.DinosaursMotion(CNT)
				
				self.CreateCactus()
				
				if not Jump:
					CNT = (CNT + 1) % 3
				
				self.LCD.Update()
				prevTime = time.time()


			if (Jump):
				self.MotionJump(0.8)

				if (self.Dinosaurs["Y"] >= 28):
					Jump = False
					self.Dinosaurs["Y"] = 28
					
				self.DinosaursMotion(CNT)
				#self.LCD.Update()

				

			
			if (ButtonState == 0 and GPIO.input(35) == 1):
				self.Physics["Velocity"] = -13
				Jump = True
				print("Button in pressed")

						


			ButtonState = GPIO.input(35)


	def MotionJump(self, time):
		self.Dinosaurs["Y"] += self.Physics["Velocity"] * time
		
		if (self.Dinosaurs["Y"] <= 0):
			self.Dinosaurs["Y"] = 0		

		self.Physics["Velocity"] += self.Physics["Gravity"] * time



	def CreateRoad(self):
		for x in range(0, 112, 16):
			self.RoadChank.update({int(x / 16) : {"X" : x, "Up" : random.choice([1, 3, 4, 5]), "Down" : random.choice([2, 6])}})


	def DinosaursMotion(self, CNT):
		self.LCD.fillRect({"X" : [int(self.Dinosaurs["X"]), int(self.Dinosaurs["X"]) + 32],
				   "Y" : [0, 60]}, 0)

		self.ShowRoad([0, 1, 2])

		self.CreateDinosaur(CNT + 1)

	
	
		

	def ShowRoad(self, keys=RoadChank.keys()):
		for id in keys:
			# Generate "Line Ground"
			pictureInf = self.readBitMap(r'BitsMap/Road.txt', self.RoadChank[id]["Up"])
			self.LCD.drawPicture({"X" : self.RoadChank[id]["X"], "Y" : 52, "Dimension" : pictureInf["Dimension"]}, 
				[i for i in pictureInf["BitMap"]], 1)

			# Generate "Under Ground"
			pictureInf = self.readBitMap(r'BitsMap/Road.txt', self.RoadChank[id]["Down"])
			self.LCD.drawPicture({"X" : self.RoadChank[id]["X"], "Y" : 60, "Dimension" : pictureInf["Dimension"]}, 
				[i for i in pictureInf["BitMap"]], 1)
		
		
		#self.LCD.Update()



	def CreateCactus(self):
		pictureInf = self.readBitMap(r'BitsMap/Cactus.txt', 1) 
	
		self.LCD.drawPicture({"X" : 50, "Y" : 28, "Dimension" : pictureInf["Dimension"]}, 
			[i for i in pictureInf["BitMap"]], insert=1)

		#self.LCD.Update()
		



	def CreateDinosaur(self, state):
		pictureInf = self.readBitMap(r'BitsMap/Dinosaur.txt', state)
		self.LCD.drawPicture({"X" : int(self.Dinosaurs["X"]), "Y" : int(self.Dinosaurs["Y"]), "Dimension" : pictureInf["Dimension"]},
			[i for i in pictureInf["BitMap"]], insert=1)


		#self.LCD.Update()




game = DinosaursGame({"CS" : 36, "Clock" : 37, "Data" : 40, "RES" : 38, "Mode" : GPIO.BOARD}, { 0 : 35})

game.CreateRoad()

game.Motion()


#time.sleep(15)

game.LCD.GPIO_CleanUp()







