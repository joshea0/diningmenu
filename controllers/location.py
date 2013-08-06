#track_changes makes sure the scanner module is reloaded whenever it is changed on disk (for development)
from gluon.custom_import import track_changes
track_changes(True)
from menu_parser import MenuParser
from datetime import datetime, timedelta
import json

def index():
	locations = db().select(db.Location.id, db.Location.name)
	loc_data = []
	for loc in locations:
		loc_data.append(dict(id=loc.id, name=loc.name))
	return json.dumps(loc_data)

def get():
	loc_id = request.vars.id
	if loc_id is not None:
		location = db(db.Location.id == loc_id).select(db.Location.ALL).first()
		mparser = MenuParser(db)
		menu_data_json = mparser.parse_menu_page_json(location.menu_url)
		db(db.Location.id == loc_id).update(menu_json=menu_data_json, time_last_update=request.now)
		return json.dumps(dict(loc=json.loads(menu_data_json), location_id=loc_id))
	else:
		return "Error - must specify location id."

def update_all():
	mparser = MenuParser(db)
	locations = db().select(db.Location.ALL)
	for loc in locations:
		mparser.update_location_menus(loc.id)

def menus():
	loc_id = int(request.vars.id)
	menu_rows = db(db.Menu.location == loc_id).select(db.Menu.ALL)
	return dict(menu_list=menu_rows)