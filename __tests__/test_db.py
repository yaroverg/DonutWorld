
import datetime
import pymongo
import pytest
from src.donut import add_to_db


DB_URI = 'mongodb://127.0.0.1:27017'
MAX_DB_COUNT = 5


@pytest.fixture(autouse=False)
def setup_db():
  for i in range(7):
    doc = {"_id": str(i), "time": datetime.datetime(2022, 5, 18, 3, i)}
    add_to_db(DB_URI, doc, MAX_DB_COUNT)

  doc = {"_id": str(6), "time": datetime.datetime(2022, 5, 18, 3, 55)}
  add_to_db(DB_URI, doc, MAX_DB_COUNT)


def test_add_to_db(setup_db):
  with pymongo.MongoClient(DB_URI) as client:
    db = client.ip_db
    users = db.users
    
    ids = set(x['_id'] for x in users.find({}))
    last = users.find_one({'_id': '6'})

    assert(ids == set('23456'))
    assert(last['time'].minute == 55)
