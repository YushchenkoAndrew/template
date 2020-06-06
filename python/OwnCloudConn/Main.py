import owncloud

USER = 'GrimReaper'
PASS = ''

oc = owncloud.Client('http://127.0.0.1/owncloud')
oc.login(USER, PASS)

oc.put_file('TestFile.txt', 'testFile.txt')

link_info = oc.share_file_with_link("TestFile.txt")

print("Here is you link " + link_info.get_link())

