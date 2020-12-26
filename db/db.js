import mongodb from 'mongodb'

const db = {
  url: 'mongodb://localhost:27017/stats',
  dbName: 'stats',
  client: mongodb.MongoClient
}

const getConnection = async () => {
  const client = await db.client.connect(db.url)
  return client.db(db.dbName)
}

export const getCollection = async collection => {
  const conn = await getConnection()
  return conn.collection(collection)
}