from menu_parser import MenuParser
from datetime import datetime, timedelta
import json

def index():
	locations = db().select(db.location.id, db.location.name)
	loc_data = []
	for loc in locations:
		loc_data.append(dict(id=loc.id, name=loc.name))
	return json.dumps(loc_data)

def get():
	loc_id = request.vars.id
	if loc_id is not None:
		location = db(db.location.id == loc_id).select(db.location.ALL).first()
		mparser = MenuParser()
		menu_data_json = mparser.parse_menu_page_json(location.menu_url)
		db(db.location.id == loc_id).update(menu_json=menu_data_json, time_last_update=request.now)
		return json.dumps(dict(loc=json.loads(menu_data_json), location_id=loc_id))
	else:
		return "Error - must specify location id."