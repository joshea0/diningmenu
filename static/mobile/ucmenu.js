
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
		load_location_list: function(){ return ucmenu.url.base_url + 'mobile/location_list.html' },
		load_menu_list: function(){ return ucmenu.url.base_url + 'location/menus' },
		load_food_list: function(){ return ucmenu.url.base_url + 'menu/food' },
		get_food: function(){ return ucmenu.url.base_url + 'food/get.html' },
		rate_food: function() { return ucmenu.url.base_url + ' food/rate.json' }
	},
	events: {
		init_handlers: function(){
			$('#location-list').on('click' ,'ul.location-list li.location a', ucmenu.events.location_btn_click);
			$('#location').on('click' ,'ul.menu-list li.menu a', ucmenu.events.menu_btn_click);
		},
		location_btn_click: function(event){
			var loc_id = $(this).data('id');
			ucmenu.ui.show_menu_list(loc_id);
		},
		menu_btn_click: function(event){
			var menu_id = $(this).data('id');
			ucmenu.ui.show_food_list(menu_id);
		},
		food_btn_click: function(event){
			var id = $(this).data('id');
			ucmenu.ui.food.show(id);
		}
	},
	ajax: {
		locations: {},
		load_location_list: function(){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.load_location_list(),
				dataType: 'HTML',
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
		load_menu_list: function(location_id){
			var request = $.ajax({
				type: 'GET',
				url: ucmenu.url.load_menu_list(),
				dataType: 'HTML',
				data: {id: location_id},
				success: ucmenu.ajax.load_menu_list_success,
				error: ucmenu.ajax.ajax_error
			});
		},
		load_menu_list_success: function(data, textStatus){
			$menu_list = $(data);
			ucmenu.ui.insert_and_show_menu_list($menu_list);
		},
		food: {
			data: {}, // db.Food.id => food/get.html view (jQuery)
			get: function(food_id) {
				var request = $.ajax({
					type: 'GET',
					url: ucmenu.url.get_food(),
					dataType: 'HTML',
					success: ucmenu.ajax.food.get_success,
					error: ucmenu.ajax.load_location_list_error
				});
			},
			get_success: function(data, textStatus){
				ucmenu.ui.food.show_item(data);
			},
			rate: function(food_id, rating){
				var request = $.ajax({
					type: 'POST',
					url: ucmenu.url.rate_food(),
					dataType: 'JSON',
					success: ucmenu.ajax.food.rate_success,
					error: ucmenu.ajax.load_location_list_error
				});
			}
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
			$include.empty().html($list);
			$page.trigger('create');
		},
		show_menu_list: function(location_id){
			$loc_page = $('#location');
			$menu_list = $loc_page.find('.menu-list');
			preloaded_data = ucmenu.ajax.locations;
			if($menu_list.length == 0){
				ucmenu.ajax.load_menu_list(location_id);
			}else{
				var cur_loc_id = $menu_list.data('location-id');
				if(cur_loc_id == location_id){
					$.mobile.changePage($loc_page);
				}else{
					//first save the current page incase we need it later...
					if( !preloaded_data.hasOwnProperty(cur_loc_id)){
						preloaded_data[cur_loc_id] = $menu_list.detach();
					}
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
			$loc_page.find('.content-include').html($menu_list);
			var $m = $.mobile;
			var jq = $;
			debugger
			$.mobile.changePage($loc_page, {
				allowSamePageTransition: true,
				transition: 'none',
				reloadPage: true
			});
		},
		food: {
			insert_and_show: function($item){
				$page = $('#food');
				$page.find('.content-include').html($item);
				$.mobile.changePage($page, {
					allowSamePageTransition: true,
					transition: 'none',
					reloadPage: true
				});
			},
			show: function(item_id){
				$page = $('#food');
				$item = $page.find('.food-item');
				preloaded_data = ucmenu.ajax.food.data;
				if($page.length == 0){
					ucmenu.ajax.food.get(item_id);
				}else{
					var cur_id = $menu_list.data('food-id');
					if(cur_id == item_id){
						$.mobile.changePage($page);
					}else{
						//first save the current page incase we need it later...
						if( !preloaded_data.hasOwnProperty(cur_id)){
							preloaded_data[cur_id] = $item.detach();
						}
						if(item_id in preloaded_data){
							//we already have data for this one, so just swap it in and go
							$item = preloaded_data[item_id]
							ucmenu.ui.food.insert_and_show($item);
						}else{
							ucmenu.ajax.food.get(item_id);
						}
					}
				}
			},
		}

	},
	util: {
	}
};