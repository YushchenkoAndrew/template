import gtts
from playsound import playsound

# make request to google to get synthesis
tts = gtts.gTTS("Hello world")

# save the audio file
tts.save("hello.mp3")

# play the audio file
playsound("hello.mp3")
