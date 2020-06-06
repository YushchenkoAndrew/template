import mysql.connector

# Connect to server
cnx = mysql.connector.connect(user='test', password='test', host='127.0.0.1', database='Scanner')

# Get a cursor
cur = cnx.cursor()

# Execute a query
cur.execute("SELECT * FROM User")

# Fetch results
for row in cur.fetchall():
	#print(row)
	print("|{0:3} |\t{1}\t| {2}\t| {3} |".format(*row))

# Close connection
cnx.close()
