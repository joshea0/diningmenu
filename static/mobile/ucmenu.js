
ucmenu = {


	location_data: {},

	/** User options which can be turned on/off by the user **/
	options: {
	},

	init: function(){
		ucmenu.ajax.load_location_list();
	},

	/** URLs for AJAX requests and such */
	url: {
		location_index: '/diningmenu/location/index.json',
		location_get: '/diningmenu/location/get.json'
	},

	ajax: {
		load_location_list: function(){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.location_index,
				dataType: 'json',
				success: ucmenu.ajax.load_location_list_success,
				error: ucmenu.ajax.load_location_list_error
			});
		},
		load_location_list_success: function(data, textStatus){
			console.log(data);
			ucmenu.ui.populate_location_list(data);
		},
		load_location_list_error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(errorThrown);
			console.log('error. Please contact a developer');
		},
		load_location: function(loc_id){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.location_get,
				dataType: 'json',
				data: {id: loc_id},
				success: ucmenu.ajax.load_location_success,
				error: ucmenu.ajax.load_location_error
			});
		},
		load_location_success: function(data, textStatus){
			ucmenu.location_data[data.location_id] = data.loc;
			ucmenu.ui.create_location_page(data.location_id, data.loc_name);
			ucmenu.ui.show_location_page(data.location_id);
		},
		load_location_error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(errorThrown);
			console.log('error. Please contact a developer');
		}
	},
	/**
	 * @author Joey
	 * Selectors, IDs, classes, etc. are generated here. These helper functions will construct an ID or
	 * some other selector for given DOM elements. 'sel' is short for 'selectors' and is used for terser
	 * function calls. The functions provided here use suffixes to denote what they return (and thus the correct usage).
	 * Suffix:          Returns:
	 * _id              element ID (no '#' prepended)
	 * [no suffix]      complete selector (can be placed directly in jQuery() )
	 * _$               jQuery object
	 *
	 * These functions are important for maintainability because if the format of an ID or class needs to
	 * be changed in the future, the change can be made here instead of in several places throughout the code.
	*/
	sel: {
		location_page_id: function(loc_id){
			return 'location-'+loc_id;
		},
		location_page_$: function(loc_id){
			return $('#'+ucmenu.sel.location_page_id(loc_id));
		},
		menu_page_id: function(loc_id, menu_id){
			return 'loc-'+loc_id+'-menu-'+menu_id;
		}
	},
	events: {
		location_li_click: function(event){
			var splits = $(this).attr('href').split('-');
			var loc_id = splits[1];
			console.log('loc.id == '+loc_id);
			if(ucmenu.sel.location_page_$(loc_id).length == 0){
				ucmenu.ajax.load_location(loc_id);
				//TODO: show loading icon
			}else{
				//ucmenu.ui.show_location_page(loc_id);
				//JQM should handle it...
			}
		}
	},
	ui: {
		/** Configuration options which cannot be changed by users, only developers **/
		config: {
			//initliazes any config values that must be set after ucmenu.init is called
			init: function(){
			},
		},

		populate_location_list: function(locations){
			var $page = $('#home');
			var $loc_ul = $page.find('ul.location-list');
			for(var i=0; i < locations.length; i++){
				loc = locations[i];
				$li = $loc_ul.find('li.location.template').clone().removeClass('template');
				var $a = $li.find('a');
				$a.attr('href', '#'+ucmenu.sel.location_page_id(loc.id));
				$a.text(loc.name);
				$a.data('location-id', loc.id)
				$a.bind("click", ucmenu.events.location_li_click);
				$loc_ul.append($li);
			}
		},

		create_location_page: function(location_id, name){
			var location_data = ucmenu.location_data[location_id];
			var template_page = $('#location-template');
			var page_id = ucmenu.sel.location_page_id(location_id);
			var $page = template_page.clone().attr('id', page_id);
			$page.data('url', page_id);
			$page.find('.page-header').text(name);
			var menu_list = $page.find('ul.menu-list');
			var template_menu_li = menu_list.find('li.menu.template');
			for(var menu in location_data){
				if(location_data.hasOwnProperty(menu)) {
					menu_data = location_data[menu];
					console.log(menu_data);
					$menu_li = template_menu_li.clone().removeClass('template');
					$a = $menu_li.find('a');
					$a.text(menu);
					$a.attr('href', '#'+ucmenu.sel.menu_page_id(location_id, menu))
					console.log($menu_li);
					menu_list.append($menu_li);
					ucmenu.ui.create_menu_page(location_id, menu, menu_data);
				}
			}
			$('body').append($page);
		},

		show_location_page: function(location_id){
			$loc_page = ucmenu.sel.location_page_$(location_id);
			$.mobile.changePage($loc_page);
		},

		create_menu_page: function(location_id, menu, menu_data){
			var template_page = $('#menu-template');
			page = template_page.clone().attr('id', ucmenu.sel.menu_page_id(location_id, menu));
			var $template_cat = page.find('div.category.template');
			for(var cat in menu_data){
				//first make the section div
				cat_items = menu_data[cat];
				cat_div = $template_cat.clone().removeClass('template');
				var item_list = cat_div.find('ul.item-list');
				var $template_item = item_list.find('li.item.template');
				cat_div.find('h2').text(cat);
				//now add all the menu items to the section
				for(var i=0; i < cat_items.length; i++){
					item_name = cat_items[i];
					item_li = $template_item.clone().removeClass('template');
					item_li.find('a').text(item_name);
					item_list.append(item_li);
				}
				page.find('div.content').append(cat_div);

			}
			$('body').append(page);
		},
	},
	util: {
	}
};