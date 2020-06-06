import sqlalchemy as db

# Test if it works
engine = db.create_engine('mysql+pymysql://test:test@127.0.0.1/Scanner')
print("Tables: ", engine.table_names(), "\n")

connection = engine.connect()
metadata = db.MetaData()

user = db.Table('User', metadata, autoload=True, autoload_with=engine)

# Print full table metadata
print("Meta Data:\n", repr(metadata.tables['User']))

print()

#Equivalent to 'SELECT * FROM User'
query = db.select([user])
ResultProxy = connection.execute(query)

print("Data:")

for data in ResultProxy.fetchall():
	print(data)
