import pyttsx3

# initialize Text-to-speech engine
engine = pyttsx3.init("espeak")

# get details of all voices available
voices = engine.getProperty("voices")

engine.setProperty('volume', 0.9)  # Volume 0-1

# set another voice
engine.setProperty("voice", voices[0].id)

# setting new voice rate (faster)
#engine.setProperty("rate", 150)

for voice in voices:
	engine.setProperty('voice', voice.id)
	text = "Hello men. You came to example of using speach convertation"
	engine.say(text)

# play the speech
engine.runAndWait()
