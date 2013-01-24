
ucmenu = {


	location_data = {},

	/** User options which can be turned on/off by the user **/
	options: {
	},

	init: function(){
		
	},

	/** URLs for AJAX requests and such */
	url: {
		load_location: '',
		load_menu: ''
	},

	ajax: {
		load_location: function(){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.load_location,
				data: params,
				success: ucmenu.ajax.load_location_success,
				error: ucmenu.ajax.load_location_error
			});
		},
		load_location_success: function(data, textStatus){
			location_data[data.location_id] = data.loc;
			ucmenu.ui.create_location_page(data.location_id);
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
	},
	events: {
	},
	ui: {
		/** Configuration options which cannot be changed by users, only developers **/
		config: {
			//initliazes any config values that must be set after ucmenu.init is called
			init: function(){
			},	
		},

		create_location_page: function(location_id){
			var location_data = ucmenu.location_data[location_id];
			var template_page = $('#location-template');
			page = template_page.clone().attr('id', ucmenu.sel.location_page_id(location_id));
			var menu_list = page.find('ul.menu-list');
			var template_menu_li = menu_list.find('li.menu_li.template');
			for(var i=0; i < location_data.length; i++){
				menu_data = location_data[i];
				menu_li = template_item.clone().removeClass('template');
				menu_li.children('a').text(menu_data['name']);
				menu_li.attr('href', '#' + ucmenu.sel.menu_page_id(menu_data['id']))
				menu_list.append(menu_li);
			}
		},

		create_menu_page: function(location_id, menu_id){
			var location_data = ucmenu.location_data[location_id];
			var menu_data = location_data[menu];
			var template_page = $('#menu-template');
			page = template_page.clone().attr('id', ucmenu.sel.menu_page_id(menu_id));
			var item_list = page.find('ul.item-list');
			var template_item = item_list.find('li.item.template');
			for(var i=0; i < menu_data.length; i++){
				menu_item = menu_data[i];
				item_li = template_item.clone().removeClass('template');
				item_li.children('a').text(menu_item.name);
				item_list.append(item_li);
			}
		},
	},
	util: {
	}
};