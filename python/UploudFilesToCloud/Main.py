import sqlalchemy as db
import os
import owncloud

USER = 'GrimReaper'
PASS = ''
PATH = '/home/pi/Share'
FOLDER = 'Share'


def connToDataBase(name, user, passw, host='127.0.0.1', port=''):
    engine = db.create_engine(
        'mysql+pymysql://{0}:{1}@{2}/{3}'.format(user, passw, host, name))

    metadata = db.MetaData()
    storage = db.Table('Storage', metadata, autoload=True,
                       autoload_with=engine)
    return (engine.connect(), metadata, storage)


def connToCloud():
    cloud = owncloud.Client('http://127.0.0.1/owncloud')
    cloud.login(USER, PASS)
    return cloud


def getFilesName(dbTable):
    return [f[1] for f in conn.execute(db.select([dbTable])).fetchall()]


def checkFolderExistenceInCloud(name):
    try:
        cloud.list("/" + name)
    except Exception:
        cloud.mkdir(name)
        print("Folder {0} created".format(name))


def getFilesList(path):
    # Add files description to DataBase
    stream = os.popen('ls ' + PATH + ' --full-time')
    output = stream.read()

    return [i.split(" ") for i in output.split("\n") if '.' in i.split(" ")[- 1]]


def deleteMissedFiles(files, conn, cloud):
    for f in files:
        op = storage.delete().where(storage.c.FileName == f)
        conn.execute(op)
        cloud.delete("Share/" + f)


def showDataBaseState(conn, dbTable):
    print("Files:")
    for data in conn.execute(db.select([dbTable])).fetchall():
        print(data)


def checkFolder(dbTable, conn, cloud):
    files = getFilesName(dbTable)

    print("\nExistent Files:")

    for f in getFilesList(PATH):
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
    deleteMissedFiles(files, conn, cloud)


# Connect to DataBase
conn, metadata, storage = connToDataBase(
    user='test', passw='test', name='FolderSharing')
print("Success: Connected to DataBase")

# Connect to Cloud
cloud = connToCloud()
print("Success: Connected to Cloud")
checkFolderExistenceInCloud(FOLDER)

checkFolder(storage, conn, cloud)

# Equivalent to 'SELECT * FROM User'
#showDataBaseState(conn, storage)
