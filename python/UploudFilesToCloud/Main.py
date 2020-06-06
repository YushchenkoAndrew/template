import sqlalchemy as db
import os
import owncloud

USER = 'GrimReaper'
PASS = 'JKaKTV5stU4xbiz'
PATH = '/home/pi/Share'

def connToCloud():
	cloud = owncloud.Client('http://127.0.0.1/owncloud')
	cloud.login(USER, PASS)
	return cloud

def getFilesName():
	query = db.select([storage])
	ResultProxy = conn.execute(query)
	return [f[1] for f in ResultProxy.fetchall()]

# Connect to DataBase
engine = db.create_engine('mysql+pymysql://test:test@127.0.0.1/FolderSharing')
print("Success: Connected to DataBase")

conn = engine.connect()
metadata = db.MetaData()

storage = db.Table('Storage', metadata, autoload=True, autoload_with=engine)

# Connect to Cloud
cloud = connToCloud()
print("Success: Connected to Cloud")
try:
	cloud.list("/Share")
except Exception:
	cloud.mkdir("Share")


# Add files description to DataBase
stream = os.popen('ls '+ PATH +' --full-time')
output = stream.read()

filesList = [i.split(" ") for i in output.split("\n") if '.' in i.split(" ")[- 1]]

files = getFilesName()

print("\nExistent Files:")

for f in filesList:
	print("{0} -- {1}".format(f[-1], f[-4]))
	if not(f[-1] in files):
		op = storage.insert().values(FileName=f[-1], Date=f[-4])
		cloud.put_file('Share/' + f[-1], PATH + "/" + f[-1])
		files.append(f[-1])
	else:
		op = storage.update().values(Date=f[-4])
	files.remove(f[-1])
	conn.execute(op)


print("\nDelete Files: ", files)

# Delete files from cloud if they don't into a folder
for f in files:
	op = storage.delete().where(storage.c.FileName==f)
	conn.execute(op)
	cloud.delete("Share/" + f)

#Equivalent to 'SELECT * FROM User'
#query = db.select([storage])
#ResultProxy = conn.execute(query)
#
#print("Files:")
#
#for data in ResultProxy.fetchall():
#        print(data)
#
