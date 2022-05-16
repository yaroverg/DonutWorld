import os
from flask import Flask, request
import requests
import datetime
import pymongo

MAX_DB_COUNT = 100
IP_API_URL = 'http://ip-api.com/json/'
DB_URI = os.getenv('MONGODB_URI', 'mongo_db_default_uri')

app = Flask(__name__)


def create_doc(ip_addr):
  doc = {
    "_id": ip_addr, 
    "time": datetime.datetime.now(),
    "isp": "",
    "city": "",
    "country": ""
  }

  url = IP_API_URL + ip_addr
  response = requests.get(url)

  if response.status_code == 200:
    rsp = response.json()

    doc["isp"] = rsp.get("isp", "")
    doc["city"] = rsp.get("city", "")
    doc["country"] = rsp.get("country", "")

  return doc


def add_to_db(db_uri, doc, max_db_count):
  with pymongo.MongoClient(db_uri) as client:
    db = client.ip_db
    users = db.users

    users.replace_one({"_id": doc["_id"]}, doc, upsert=True)

    if users.count_documents({}) > max_db_count:
      users.find_one_and_delete({}, {"sort": {"time": 1}})


@app.route('/')
def index():
  ip_addr = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
  doc = create_doc(ip_addr)    
  add_to_db(DB_URI, doc, MAX_DB_COUNT)
  
  return app.send_static_file('index.html')

if __name__ == '__main__':
  app.run()
