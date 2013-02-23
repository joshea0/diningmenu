from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime


class MenuParser(object):

	def __init__(self, db):
		self.db = db
		pass

	def update_location_menus(self, location_id):
		location = self.db(self.db.Location.id == location_id).select(self.db.Location.menu_url).first()
		loc_url = location.menu_url
		parsed_loc_dict = self.parse_menu_page_dict(loc_url)
		for menu_name, menu_data in parsed_loc_dict.iteritems():
			menu_id = self.insert_or_update_menu(location_id, menu_name)
			for category_name, food_list in menu_data.iteritems():
				category_id = self.insert_or_update_category(menu_id, category_name)
				for food_item in food_list:
					#add food if it doesn't exist yet
					food_id = self.insert_or_update_food(category_id, food_item)

	def insert_or_update_menu(self, location_id, menu_name):
		rows = self.db((self.db.Menu.location == location_id) & (self.db.Menu.name == menu_name)).select(self.db.Menu.id)
		if len(rows) == 0:
			return self.db.Menu.insert(location=location_id, name=menu_name, time_last_update=datetime.now())
		else:
			menu_id = rows[0].id
			self.db(self.db.Menu.id == menu_id).update(time_last_update=datetime.now())
			return menu_id

	def insert_or_update_category(self, menu_id, category_name):
		rows = self.db((self.db.MenuCategory.menu == menu_id) & (self.db.MenuCategory.name == category_name)).select(self.db.MenuCategory.id)
		if len(rows) == 0:
			return self.db.MenuCategory.insert(menu=menu_id, name=category_name)
		else:
			category_id = rows[0].id
			return category_id

	def insert_or_update_food(self, category_id, food_name):
		rows = self.db((self.db.Food.category == category_id) & (self.db.Food.name == food_name)).select(self.db.Food.id)
		if len(rows) == 0:
			return self.db.Food.insert(category=category_id, name=food_name, time_last_update=datetime.now())
		else:
			food_id = rows[0].id
			self.db(self.db.Food.id == food_id).update(time_last_update=datetime.now())
			return food_id

	def parse_menu_page_dict(self, page_url):
		"""
		TODO: Make this force all string values it parses to be lower case (so there is no
		case sensitivity issues when doing string comparisons)
		"""
		menu = dict()
		html = requests.get(page_url).text
		soup = BeautifulSoup(html)
		meals = soup.find_all('div', class_='shortmenumeals')
		for meal in meals:
			meal_name = meal.getText()
			meal_table = meal.find_parent('table').find_parent('table') #yay tables everywhere (yes this is meant to be called twice)
			meal_rows = meal_table.find_all('tr')
			menu[meal_name] = dict()
			current_cat = None
			prev_item_name = None #getting duplicates due to crappy HTML structure, use this to preven it
			for row in meal_rows:
				#first check if its a category row, then check if it's a menu item
				cat = row.find('div', class_='shortmenucats')
				if cat is not None:
					cat_name = cat.find('span').getText()
					current_cat = cat_name
					menu[meal_name][current_cat] = list()
					continue
				item = row.find('div', class_='shortmenurecipes')
				if item is not None:
					item_name = item.find('span').getText()
					if prev_item_name is None or prev_item_name != item_name:
						menu[meal_name][current_cat].append(item_name)
						prev_item_name = item_name
					continue
				else:
					continue
		return menu

	def parse_menu_page_json(self, page_url):
		menu = self.parse_menu_page_dict(page_url)
		out = json.dumps(menu)
		return out