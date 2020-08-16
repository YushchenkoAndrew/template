import sqlalchemy as db
import owncloud
import os
import sys
import select
import time

PATH = '/home/pi/Share'
FOLDER = 'Share'
TIMEOUT = 10


def connToDataBase(name, user, passw, table, host='127.0.0.1', port=''):
    engine = db.create_engine(
        'mysql+pymysql://{0}:{1}@{2}/{3}'.format(user, passw, host, name))

    metadata = db.MetaData()
    storage = db.Table(table, metadata, autoload=True,
                       autoload_with=engine)
    return (engine.connect(), metadata, storage)


def connToCloud(cloud, user, passw, host = '127.0.0.1', port = 80):
    cloud = owncloud.Client('http://{0}:{1}/{2}'.format(host, port, cloud))
    cloud.login(user, passw)
    return cloud


def getFilesName(conn, dbTable):
    return [f[1] for f in conn.execute(db.select([dbTable])).fetchall()]


def checkFolderExistenceInCloud(cloud, name):
    try:
        cloud.list("/" + name)
    except Exception:
        cloud.mkdir(name)
        print("~ Create Direcectory -- '{}'".format(name))


def walker(path):
    names = []
    location = []

    for root, dirs, files in  os.walk(path):
        names.extend(files)

        for f in files:
            location.append(root + '/' + f)

    return names, location


def deleteMissedFiles(files, conn, cloud):
    for f in files:
        op = storage.delete().where(storage.c.FileName == f)
        conn.execute(op)
        cloud.delete("Share/" + f)


def showDataBaseState(conn, dbTable):
    print("\n~Print current DataBase State")
    for data in conn.execute(db.select([dbTable])).fetchall():
        for el in data:
            print("\t{}".format(el), sep="\t", end="")
        print()


def checkFolder(dbTable, conn, cloud, storage):
    files = getFilesName(conn, dbTable)
    names, loc = walker(PATH)

    print("\n~ Check new Files")

    for f, path in zip(names, loc):
        print("\t{0} -- {1}".format(f, path))
        if not(f in files):
            op = storage.insert().values(Name=f, Type='f', Date=time.strftime("%Y-%m-%d"))
            cloud.put_file('Share/' + f, path)
            files.append(f)
        else:
            op = storage.update().values(Date=time.strftime("%Y-%m-%d"))

        files.remove(f)
        conn.execute(op)

    print("\n~ Delete Files:", files)

    # Delete files from cloud if they don't into a folder
    deleteMissedFiles(files, conn, cloud)


def Main():
    # Connect to DataBase
    try:
        conn, metadata, storage = connToDataBase(
            user='test', passw='test', name='FolderSharing', table='Storage', host='192.168.0.105')
        print("~ Success: Connection to DataBase")
    except:
        print("~ Faild: Connection to DataBase")
        sys.exit()

    # Connect to Cloud
    try:
        cloud = connToCloud(user='GrimReaper', passw='', cloud='nextcloud')
        print("~ Success: Login to Cloud")
        checkFolderExistenceInCloud(cloud, FOLDER)
    except:
        print("~ Faild: Connection to Cloud")
        sys.exit()


    checkFolder(storage, conn, cloud, storage)

    # Equivalent to 'SELECT * FROM User'
    showDataBaseState(conn, storage)


print("\n~ Wait for Command\n")
while 1:
    i, o, e = select.select([sys.stdin], [], [], TIMEOUT)

    command = 'auto'

    if (i):
        command = sys.stdin.readline().strip()

    if ('Refresh' in command or 'rf' in command):
        print("~ Check Changes")
        Main()
        print("\n~ Wait for Command\n\t")

    elif ('break' in command):
        print("~ Program Terminated")
        break

    elif ('auto' in command and time.strftime("%H-%M-%S").split("-")[0] == '21'):
        print("~ Auto update")
        Main()
        print("\n~ Wait for Command\n\t")