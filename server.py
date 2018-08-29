from flask import Flask, request
from rockset import Client, Q
import json

app = Flask(__name__, static_url_path='')
rs = Client()

@app.route("/")
def index():
    return app.send_static_file('explore.html')

@app.route("/rs/collections")
def rs_collections():
    return json.dumps(rs.list())

@app.route("/rs/collections/<collectionName>")
def rs_collection(collectionName):
    return json.dumps(list(rs.sql(Q('DESCRIBE "' + collectionName + '"'))))

@app.route("/rs/check")
def rs_check():
    state = json.loads(request.args.get('state'))
    return json.dumps(list(rs.sql(Q('SELECT DISTINCT "{}".{} FROM "{}" JOIN "{}" ON "{}".{} = "{}".{} LIMIT 5'.format(
        state['leftCollection'], 
        state['leftField'], 
        state['leftCollection'], 
        state['rightCollection'], 
        state['leftCollection'], 
        state['leftField'], 
        state['rightCollection'], 
        state['rightField']
      )))))

@app.route("/hello")
def hello():
    return 'hello'

@app.route("/viz")
def viz():
    return app.send_static_file('viz.html')

@app.route("/viz2")
def viz2():
    return app.send_static_file('viz2.html')

@app.route("/climbing")
def climbing():
    return app.send_static_file('climbing.html')

@app.route("/yelp")
def yelp():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    return json.dumps(list(
        rs.sql(Q('SELECT name, city, latitude, longitude FROM yelp_business \
              WHERE latitude IS NOT NULL \
                  AND longitude IS NOT NULL \
                  AND categories LIKE \'%food%\' \
              ORDER BY abs(latitude - ({})) + abs(longitude - ({})) \
              LIMIT 20'.format(lat, lon)))))

if __name__ == "__main__":  
    app.run(debug=True)