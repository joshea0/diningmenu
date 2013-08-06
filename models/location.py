

db.define_table('Location',
	Field('name', 'string', notnull=True),
	Field('menu_url', 'string', notnull=True),
	Field('menu_json', 'text', notnull=False, default="", length=100000),
	Field('time_last_update', 'datetime', notnull=False)
)

db.define_table('Menu',
	Field('location', db.Location, notnull=True),
	Field('name', 'string', notnull=True),
	Field('start_time', 'datetime', notnull=False),
	Field('end_time', 'datetime', notnull=False),
	Field('time_last_update', 'datetime', notnull=False)
)

db.define_table('MenuCategory',
	Field('menu', db.Menu, notnull=True),
	Field('name', 'string', notnull=True)
)

db.define_table('Food',
	Field('category', db.MenuCategory, notnull=True),
	Field('name', 'string', notnull=True),
	Field('vegetarian', 'boolean', notnull=False),
	Field('vegan', 'boolean', notnull=False),
	Field('contains_nuts', 'boolean', notnull=False),
	Field('time_last_update', 'datetime', notnull=False)
)

db.define_table('User',
	Field('device_id', 'string', notnull=True),
	Field('name', 'string', notnull=False)
)

db.define_table('FoodRating',
	Field('user', db.User, notnull=True),
	Field('food', db.Food, notnull=True),
	Field('rating', 'integer', notnull=True),
	Field('time_created', 'datetime', notnull=False)
)
