

def index():
	return dict()

def location_list():
	locations = db().select(db.Location.id, db.Location.name)
	return dict(locations=locations)