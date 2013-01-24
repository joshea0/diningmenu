from bs4 import BeautifulSoup
import requests
import json


class MenuParser(object):

	def __init__(self):
		pass

	def parse_menu_page_json(self, page_url):
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
		out = json.dumps(menu)
		return out