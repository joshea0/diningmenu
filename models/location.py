

db.define_table('location',
                Field('name', 'string', notnull=True), 
                Field('menu_url', 'string', notnull=True),
                Field('menu_json', 'text', notnull=False, default="", length=100000),
                Field('time_last_update', 'datetime', notnull=False)
                )
