from bs4 import BeautifulSoup
import requests
import json


class MenuParser(object):

	def __init__(self):
		pass

	def parse_menu_page(self, page_url):
		menu = dict()
		html = requests.get(page_url).text
		soup = BeautifulSoup(html)
		meals = soup.find_all('div', class_='shortmenumeals')
		for meal in meals:
			meal_name = meal.getText()
			meal_table = meal.find_parent('table').find_parent('table') #yay tables everywhere (yes this is meant to be called twice)
			meal_cats = meal_table.find_all('div', class_='shortmenucats')
			menu[meal_name] = dict()
			for cat in meal_cats:
				cat_name = cat.find('span').getText()
				cat_tr = cat.find_parent('tr')
				cat_items_tr = cat_tr.find_next_siblings('tr')
				menu[meal_name][cat_name] = list()
				for tr in cat_items_tr:
					item = tr.find('div', class_='shortmenurecipes')
					if item is not None:
						item_name = item.find('span').getText()
					menu[meal_name][cat_name].append(item_name)

		out = json.dumps(menu)
		with open('menu-test.txt', 'w+') as f:
			for line in out.splitlines():
				f.write(line)