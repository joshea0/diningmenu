
ucmenu = {


	location_data: {},

	/** User options which can be turned on/off by the user **/
	options: {
	},

	init: function(){
		ucmenu.events.init_handlers();
		ucmenu.ajax.load_location_list();
	},

	/** URLs for AJAX requests and such */
	url: {
		base_url: '/diningmenu/',
		location_index: '/diningmenu/location/index.json',
		location_get: '/diningmenu/location/get.json',
		load_menu_list: function(){ return base_url + 'location/menus'; },
		load_location_list: function(){ return base_url + 'mobile/location_list.html' },
	},

	ajax: {
		locations: {},
		load_menu_list: function(location_id){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.load_menu_list(),
				dataType: 'html',
				data: {id: location_id},
				success: ucmenu.ajax.load_menu_list_success,
				error: ucmenu.ajax.ajax_error
			});
		},
		load_menu_list_success: function(data, textStatus){
			$menu_list = $(data);
			ucmenu.ui.insert_and_show_menu_list($menu_list);
		},
		load_location_list: function(){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.load_location_list,
				dataType: 'json',
				success: ucmenu.ajax.load_location_list_success,
				error: ucmenu.ajax.load_location_list_error
			});
		},
		load_location_list_success: function(data, textStatus){
			console.log(data);
			ucmenu.ui.show_location_list($(data));
		},
		load_location_list_error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(errorThrown);
			console.log('error. Please contact a developer');
		},
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
		init_handlers: function(){
			$('#location-list').on('click' ,'ul.location-list li.location>a', ucmenu.events.location_btn_click);
			$('#location').on('click' ,'ul.menu-list li.menu>a', ucmenu.events.menu_btn_click);
		},
		location_btn_click: function(event){
			var loc_id = $(this).data('id');
			ucmenu.ui.show_menu_list(loc_id);
		},
		menu_btn_click: function(event){
			var menu_id = $(this).data('id');
			ucmenu.ui.show_food_list(menu_id);
		}
	},
	ui: {
		/** Configuration options which cannot be changed by users, only developers **/
		config: {
			//initliazes any config values that must be set after ucmenu.init is called
			init: function(){
			},
		},
		show_location_list: function($list){
			var $page = $('#location-list');
			var $include = $page.find('.content-include');
			$include.empty().append($list);
		},
		show_menu_list: function(location_id){
			$loc_page = $('#location');
			$menu_list = $loc_page.find('.menu-list');
			preloaded_data = ucmenu.ajax.data.locations;
			if($menu_list.length == 0){
				ucmenu.ajax.load_menu_list(location_id);
			}else{
				var cur_loc_id = $menu_list.data('location-id');
				if(cur_loc_id == location_id){
					$.mobile.changePage($loc_page);
				}else{
					//first save the current page incase we need it later...
					preloaded_data[cur_loc_id] = $menu_list.detach();
					if(location_id in preloaded_data){
						//we already have data for this one, so just swap it in and go
						$menu_list = preloaded_data[location_id]
						ucmenu.ui.insert_and_show_menu_list($menu_list);
					}else{
						ucmenu.ajax.load_menu_list(location_id);
					}
				}
			}
		},
		insert_and_show_menu_list: function($menu_list){
			$loc_page = $('#location');
			$loc_page.find('.content-include').append($menu_list);
			$.mobile.changePage($loc_page, {
				allowSamePageTransition: true,
				transition: 'none',
				reloadPage: true
			});
		}

	},
	util: {
	}
};