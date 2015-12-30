var softballServices = angular.module('softballServices', ['firebase', 'softballConfig', 'softballFilters']);


softballServices.factory("Auth", ["CONFIG", "$firebaseAuth",
	function(CONFIG, $firebaseAuth) {
		var ref = new Firebase(CONFIG.AUTH_URL);
		return $firebaseAuth(ref);
	}
]);

softballServices.factory("Messaging", ['$rootScope',
	function($rootScope) {
		var dataFactory = {};

		dataFactory.msg = {};
		dataFactory.msg.type = null;
		dataFactory.msg.text = null;
		dataFactory.msg.keepopen = null;

		dataFactory.setMsg = function(type, text, keepopen, callbackyes, callbackno)
		{
			dataFactory.msg.type = type;
			dataFactory.msg.text = text;
			dataFactory.msg.keepopen = keepopen;
			dataFactory.msg.callbackyes = callbackyes;
			dataFactory.msg.callbackno = callbackno;
			$rootScope.$broadcast("messagingSet", dataFactory.msg);
		};

		dataFactory.clearMsg = function()
		{
			dataFactory.resetMsg();
			$rootScope.$broadcast("messagingClear", dataFactory.msg);
		};

		dataFactory.resetMsg = function()
		{
			dataFactory.msg = {};
			dataFactory.msg.type = null;
			dataFactory.msg.text = null;
			dataFactory.msg.keepopen = null;
			dataFactory.msg.callbackyes = null;
			dataFactory.msg.callbackno = null;
		};

		return dataFactory;
}]);

softballServices.factory('Players', ['CONFIG', '$firebaseObject', '$q',
	function(CONFIG, $firebaseObject, $q){
		var dataFactory = {};

		dataFactory.getPlayersWithColors = function()
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/players");
			var data = $firebaseObject(dRef);

			var players = {};
			data.$loaded().then(function() {
				dataFactory.getColors().then(function(colors) {
					//console.log(colors);
					angular.forEach(data, function(i, key) {
						players[data[key].name] = data[key];
						colors.forEach(function(col, j) {
							if (data[key].name == colors[j].name)
							{
								players[data[key].name].color = colors[j].color;
								players[data[key].name].highlight = colors[j].highlight;
							}
						});
					});
					//console.log(players);
					deferred.resolve(players);
				});
			});

			return deferred.promise;
		};

		dataFactory.getPlayers = function()
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/players");
			var data = $firebaseObject(dRef);

			var players = {};
			data.$loaded().then(function() {
				angular.forEach(data, function(i, key) {
					players[data[key].name] = data[key];
				});
				deferred.resolve(players);
			});

			return deferred.promise;
		};

		dataFactory.getPlayer = function(name)
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/players");
			var data = $firebaseObject(dRef);

			var player = {};
			data.$loaded().then(function() {
				angular.forEach(data, function(i, key) {
					if (name == data[key].name)
						player = data[key];
				});
				deferred.resolve(player);
			});

			return deferred.promise;
		};

		return dataFactory;
}]);

/** not used yet, will allow users to change their own colors **/
softballServices.factory('Colors', ['CONFIG', '$firebaseObject', '$q',
	function(CONFIG, $firebaseObject, $q){
		var dataFactory = {};

		dataFactory.getColors = function()
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/colors");
			var data = $firebaseObject(dRef);

			var colors = [];
			data.$loaded().then(function() {
				angular.forEach(data, function(i, key) {
					colors.push(data[key]);
				});
				deferred.resolve(colors);
			});

			return deferred.promise;
		};

		dataFactory.getColor = function(name)
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/colors");
			var data = $firebaseObject(dRef);

			var color = {};
			data.$loaded().then(function() {
				angular.forEach(data, function(i, key) {
					if (name == data[key].name)
						color = data[key];
				});
				deferred.resolve(color);
			});

			return deferred.promise;
		};

		return dataFactory;
}]);

softballServices.factory('Games', ['CONFIG', '$firebaseObject', '$q', 'yearSeasonDisplayFilter', 'yearSeasonGameDisplayFilter', 'seasonIconFilter', 
	function(CONFIG, $firebaseObject, $q, yearSeasonDisplayFilter, yearSeasonGameDisplayFilter, seasonIconFilter){
		var dataFactory = {};

		// cache details
		dataFactory.yearseason = null;
		// firebases promise
		dataFactory.refGames = null;
		// promise of a firebase object
		dataFactory.fObjGames = null;


		dataFactory.getYears = function(currentyear)
		{
			ref = loadGames();

			var years = {};
			return ref.then(function(data) {
				//build the list of unique years from games
				angular.forEach(data, function(i, key) {
					if (!years[data[key].year])
						years[data[key].year] = {};
					years[data[key].year].year = data[key].year;
					years[data[key].year].current = (currentyear == data[key].year) ? true : false;
				});
				return years;
			});
		};

		/**
		 * 1 = Winter - removed
		 * 2 = Spring
		 * 3 = Summer
		 * 4 = Fall - removed
		 */
		dataFactory.getSeasons = function(currentseason)
		{
			var seasons = {};

			for(var i = 2; i <= 3; i++)
			{
				seasons[i] = {};
				seasons[i].season = i;
				seasons[i].current = (currentseason == i) ? true : false;
				seasons[i].displayname = yearSeasonDisplayFilter(false, i);
			}
			//console.log(seasons);

			return seasons;
		};

		dataFactory.getYearSeasons = function()
		{
			// return cache data if we have it
			if (dataFactory.yearseason)
				return $q.resolve(dataFactory.yearseason);

			ref = loadGames();

			var years = {};
			return ref.then(function(data) {
				angular.forEach(data, function(i, key) {
					if (!years[data[key].year])
						years[data[key].year] = {};
					years[data[key].year].season = data[key].season;
					years[data[key].year].year = data[key].year;
				});
				return years;
			});
		};

		dataFactory.getGames = function(year, season)
		{
			ref = loadGames();

			var games = [];
			return ref.then(function(data) {
				var skip = false;
				console.log('getGames from firebase:', data);
				// filter out games not in specified year and season, if provided
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season))
						skip = true;
					if (!skip)
						games.push(data[key]);
				});
				console.log('getGames processed:', games);
				return games;
			});
		};

		dataFactory.getGame = function(year, season, game)
		{
			console.log('getGame:', year, season, game);
			ref = loadGames();

			return ref.then(function(data) {
				var c = dataFactory.refGames.child(year+'-'+season+'-'+game);
				var d = $firebaseObject(c);
					console.log('getGame from child processing');
				return d.$loaded().then(function() {
					console.log('getGame from child loaded', d);
					return d;
				});
			});
		};

		dataFactory.saveGame = function(gameFireObj)
		{
			console.log('saveGame:', gameFireObj);
			return gameFireObj.$save().then(function(ref) {
				console.log('saveGame from firebase success');
				return ref;
			}, function(ref) {
				console.log('saveGame from firebase failed');
				return $q.reject();
			});
		};

		dataFactory.deleteGame = function(year, season, game)
		{
			console.log('deleteGame:', year, season, game);
			var data = dataFactory.getGame(year, season, game);
			return data.then(function(ref) {
				console.log('deleteGame loaded:', ref);
				return ref.$remove().then(function(ref) {
					console.log('deleteGame from firebase success');
					return ref;
				}, function(ref) {
					console.log('deleteGame from firebase failed');
					return $q.reject();
				});
			});
		};

		dataFactory.addGame = function(gameObj)
		{
			console.log('addGame:', gameObj);
			ref = loadGames();

			return ref.then(function(data) {
				dataFactory.fObjGames[gameObj.gameid] = gameObj;
				return dataFactory.fObjGames.$save().then(function(ref) {
					console.log('addGame from firebase success');
					return ref;
				}, function(ref) {
					console.log('addGame from firebase failed');
					return $q.reject();
				});
			});
		};

		dataFactory.getGameStats = function(year, season)
		{
			ref = loadGames();

			var gamestats = [];
			return ref.then(function(data) {
				var win = 0, lose = 0, tie = 0, newg = 0;
				var skip = false;
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season))
						skip = true;
					if (!skip)
					{
						if ("new" == data[key].status)
							newg++;
						else if ("win" == data[key].result)
							win++;
						else if ("lose" == data[key].result)
							lose++;
						else if ("tie" == data[key].result)
							tie++;
					}
				});
				// only send stats that are non-zero
				if (win)
					gamestats.push({"label": "Win", "value": win, "color": CONFIG.COLORS.win.color, "highlight": CONFIG.COLORS.win.highlight});
				if (lose)
					gamestats.push({"label": "Lose", "value": lose, "color": CONFIG.COLORS.lose.color, "highlight": CONFIG.COLORS.lose.highlight});
				if (tie)
					gamestats.push({"label": "Tie", "value": tie, "color": CONFIG.COLORS.tie.color, "highlight": CONFIG.COLORS.tie.highlight});

				return gamestats;
			});
		};

		dataFactory.getGameScores = function(year, season)
		{
			ref = loadGames();

			var gamedata = {};
			var gamelabels = [];
			var scoreus = [];
			var scorethem = [];

			return ref.then(function(data) {
				var skip = false;
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season))
						skip = true;
					if (!skip)
					{
						if ("new" != data[key].status)
						{
							gamelabels.push(yearSeasonDisplayFilter(data[key].year, data[key].season) + " #"+data[key].game);
							scoreus.push(data[key].scoreus);
							scorethem.push(data[key].scorethem);
						}
					}
				});
				var datasets = [
				{
					label: "Score Us",
					fillColor: "rgba(92,184,92,1)",
					strokeColor: "rgba(68,157,68,1)",
					highlightFill: "rgba(68,157,68,1)",
					highlightStroke: "rgba(68,157,68,1)",
					data: scoreus
				},
				{
					label: "Score Them",
					fillColor: "rgba(220,220,220,1)",
					strokeColor: "rgba(220,220,220,1)",
					highlightFill: "rgba(220,220,220,1)",
					highlightStroke: "rgba(220,220,220,1)",
					data: scorethem
				}
				];
				gamedata.labels = gamelabels;
				gamedata.datasets = datasets;

				return gamedata;
			});
		};

		///////////////////////////////////////////////////////////////////////

		var loadGames = function()
		{
			console.log('loadGames requested');
			if (!dataFactory.fObjGames)
			{
				console.log('loadGames processing');
				dataFactory.refGames = new Firebase(CONFIG.BASE_URL+"/games");
				dataFactory.fObjGames = $firebaseObject(dataFactory.refGames);
				dataFactory.fObjGames.$loaded().then(function(data) {
					console.log('loadGames loaded');
					dataFactory.gamesData = dataFactory.fObjGames;
				});
			}
			return dataFactory.fObjGames.$loaded();
		};

		return dataFactory;
}]);

softballServices.factory('Snacks', ['CONFIG', '$firebaseObject', '$q',
	function(CONFIG, $firebaseObject, $q){
		var dataFactory = {};
		
		dataFactory.getSnacks = function(year, season)
		{
			//console.log("Obtaining snacks for season: "+season);
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/snacks/");
			var data = $firebaseObject(dRef);

			// pre-process each data entry to group each person's total
			var snacks = [];
			data.$loaded().then(function() {
				var skip = false;
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season))
						skip = true;
					if (!skip)
					{
						// build the gameid
						data[key].gameid = data[key].year + '-' + data[key].season + '-' + data[key].game;
						snacks.push(data[key]);
					}
				});

				deferred.resolve(snacks);
			});

			return deferred.promise;
		};

		return dataFactory;
}]);

// FIELDING ///////////////////////////////////////////////////////////////////

softballServices.factory('FieldingTeam', ['CONFIG', '$firebaseObject', '$q', 'Players', 'yearSeasonGameDisplayFilter',
	function(CONFIG, $firebaseObject, $q, Players, yearSeasonGameDisplayFilter){
		var dataFactory = {};

		dataFactory.getHeadings = function()
		{
			return [
				{"id": "name", "name": "Name"},
				{"id": "outs", "name": "Outs"},
				{"id": "assists", "name": "Assists"},
				{"id": "total", "name": "Total"}
			];
		};
		
		dataFactory.getFielding = function(year, season, showsub)
		{
			//console.log("Obtaining fielding for season: "+season);
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/fielding");
				var data = $firebaseObject(dRef);

				// pre-process each data entry to group each person's total
				var fieldtotal = {};
				data.$loaded().then(function() {
					var name = null;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							// build the gameid
							data[key].gameid = data[key].year + '-' + data[key].season + '-' + data[key].game;
							// build display name
							data[key].displayname = yearSeasonGameDisplayFilter(data[key].year, data[key].season, data[key].game);
							if (!fieldtotal[name])
							{
								fieldtotal[name] = {
									"name": name,
									"outs": 0,
									"assists": 0,
									"total": 0
								};
							}
							fieldtotal[name].outs += (data[key].outs ? data[key].outs : 0);
							fieldtotal[name].assists += (data[key].assists ? data[key].assists : 0);
							fieldtotal[name].total += (data[key].outs ? data[key].outs : 0) +
										  (data[key].assists ? data[key].assists : 0);
						}
					});

					var res = [];
					angular.forEach(fieldtotal, function(val, key) {
						res.push(val);
					});
					deferred.resolve(res);
				});
			});

			return deferred.promise;
		};

		// return top 3 positions in xfactor - multiple ppl may be at same position
		dataFactory.getTopFielding = function(year, season, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/fielding");
				var data = $firebaseObject(dRef);

				var allfielding = {};
				allfielding.outs = {};
				allfielding.assists = {};
				var topfielding = [];
				topfielding.outs = [];
				topfielding.assists = [];
				topfielding.outs[0] = [];
				topfielding.outs[1] = [];
				topfielding.outs[2] = [];
				topfielding.assists[0] = [];
				topfielding.assists[1] = [];
				topfielding.assists[2] = [];
				var skip = false;
				data.$loaded().then(function() {

					// pre-process each data entry to group each person's total
					var name = null;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{

							if (data[key].outs && (0 < data[key].outs))
							{
								if (!allfielding.outs[name])
									allfielding.outs[name] = 0;
								allfielding.outs[name] += parseFloat(data[key].outs);
							}
							if (data[key].assists && (0 < data[key].assists))
							{
								if (!allfielding.assists[name])
									allfielding.assists[name] = 0;
								allfielding.assists[name] += parseFloat(data[key].assists);
							}
						}
					});
					//console.log(allfielding);

					// function to process each fielding info
					var fieldingfn = function(i, key) {
						// need this below format to use variable as object keyname
						tmpentry = {};
						tmpentry.name = key;
						tmpentry[f] = allfielding[f][key];
						// set first one
						if (!topfielding[f][0])
						{
							topfielding[f][0].push(tmpentry);
						}
						else
						{
							for (var j = 0; j < cnt; j++)
							{
								if (!topfielding[f][j][0] || (topfielding[f][j][0] && (allfielding[f][key] == topfielding[f][j][0][f])))
								{
									//console.log("Adding entry to pos: "+j+" name: "+key+" val: "+i);
									topfielding[f][j].push(tmpentry);
									j = cnt;
								}
								else if (allfielding[f][key] > topfielding[f][j][0][f])
								{
									//console.log("Insert entry to pos: "+j+" name: "+key+" val: "+i);
									// shift all items below down one level
									for (var k = cnt-1; k > j; k--)
									{
										//console.log("Shifting entry at pos: "+k+" with pos: "+k-1);
										topfielding[f][k] = topfielding[f][k-1];
									}
									topfielding[f][j] = [];
									topfielding[f][j].push(tmpentry);
									j = cnt;
								}
							}
						}
					};

					var cnt = 3;
					var ftypes = ['outs', 'assists'];
					var tmpentry = {};
					for (var n = 0; n < ftypes.length; n++)
					{
						f = ftypes[n];
						//console.log("running for type:"+f);
						angular.forEach(allfielding[f], fieldingfn);
					}
					//console.log(topfielding);
					deferred.resolve(topfielding);
				});
			});
			return deferred.promise;
		};

		return dataFactory;
}]);

softballServices.factory('Fielding', ['CONFIG', '$firebaseObject', '$q', 'yearSeasonGameDisplayFilter',
	function(CONFIG, $firebaseObject, $q, yearSeasonGameDisplayFilter){
		var dataFactory = {};

		dataFactory.getHeadings = function(typename)
		{
			switch(typename)
			{
				case 'game':
					return [
						{"id": "name", "name": "Name"},
						{"id": "outs", "name": "Outs"},
						{"id": "assists", "name": "Assists"},
						{"id": "total", "name": "Total"}
					];
				case 'player':
					return [
						{"id": "gameid", "name": "Game #"},
						{"id": "outs", "name": "Outs"},
						{"id": "assists", "name": "Assists"},
						{"id": "total", "name": "Total"}
					];
			}
		};

		dataFactory.getFielding = function(year, season, game, name)
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/fielding");
			var data = $firebaseObject(dRef);

			var fielding = [];
			data.$loaded().then(function() {
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season) ||
					   (game && game != data[key].game) ||
					   (name && name != data[key].name))
						skip = true;
					if (!skip)
					{
						// build the gameid
						data[key].gameid = data[key].year + '-' + data[key].season + '-' + data[key].game;
						// build display name
						data[key].displayname = yearSeasonGameDisplayFilter(data[key].year, data[key].season, data[key].game);
						data[key].total = (data[key].outs ? data[key].outs : 0) +
										(data[key].assists ? data[key].assists : 0);
						fielding.push(data[key]);
					}
				});
				deferred.resolve(fielding);
			});
			return deferred.promise;
		};

		return dataFactory;
}]);

// BATTING ////////////////////////////////////////////////////////////////////

softballServices.factory('BattingTeam', ['CONFIG', '$firebaseObject', '$q', 'Players', '$filter', 'avgFilter', 'slugFilter', 'xfactorFilter', 'baseDisplayFilter', 
	function(CONFIG, $firebaseObject, $q, Players, $filter, avgFilter, slugFilter, xfactorFilter, baseDisplayFilter){
		var dataFactory = {};

		dataFactory.getHeadings = function()
		{
			return [
				{"id": "name", "name": "Name"},
				{"id": "GP", "name": "GP"},
				{"id": "AB", "name": "AB"},
				{"id": "H", "name": "H"},
				{"id": "R", "name": "R"},
				{"id": "B1", "name": "1B"},
				{"id": "B2", "name": "2B"},
				{"id": "B3", "name": "3B"},
				{"id": "HR", "name": "HR"},
				{"id": "RBI", "name": "RBI"},
				{"id": "Avg", "name": "Avg"},
				{"id": "Slug", "name": "Slug%"},
				{"id": "XFactor", "name": "X-Factor"}
			];
		};

		dataFactory.getBatting = function(year, season, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
				var data = $firebaseObject(dRef);

				var battotal = {};
				data.$loaded().then(function() {
					// pre-process each data entry to group each person's total
					var name = null;
					var skip = false;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							if (!battotal[name])
							{
								battotal[name] = {
									"name": name,
									"color": players[name].color,
									"highlight": players[name].highlight,
									"GP": 0,
									"AB": 0,
									"H": 0,
									"R": 0,
									"B1": 0,
									"B2": 0,
									"B3": 0,
									"HR": 0,
									"RBI": 0,
									"Avg": 0,
									"Slug": 0,
									"XFactor": 0
								};
							}
							battotal[name].GP += 1;
							battotal[name].AB += (data[key].AB ? data[key].AB : 0);
							battotal[name].H += (data[key].H ? data[key].H : 0);
							battotal[name].R += (data[key].R ? data[key].R : 0);
							battotal[name].B1 += (data[key].B1 ? data[key].B1 : 0);
							battotal[name].B2 += (data[key].B2 ? data[key].B2 : 0);
							battotal[name].B3 += (data[key].B3 ? data[key].B3 : 0);
							battotal[name].HR += (data[key].HR ? data[key].HR : 0);
							battotal[name].RBI += (data[key].RBI ? data[key].RBI : 0);
						}
					});

					// post-process each person's entry to set averages from their totals
					angular.forEach(battotal, function(i, key) {
						// get the average of these values over games played
						battotal[key].Avg = parseFloat(avgFilter(battotal[key].H, battotal[key].AB, 3));
						battotal[key].Slug = parseFloat(slugFilter(battotal[key].B1, battotal[key].B2, battotal[key].B3,
													battotal[key].HR, battotal[key].AB, 3));
						battotal[key].XFactor = parseFloat((xfactorFilter(battotal[key].B1, battotal[key].B2,
													battotal[key].B3, battotal[key].HR,
													battotal[key].R, battotal[key].RBI) /
													battotal[key].GP));
					});

					var res = [];
					angular.forEach(battotal, function(val, key) {
						res.push(val);
					});
					deferred.resolve(res);
				});
			});
			return deferred.promise;
		};

		// return total of a specific item per player
		// ex: homeruns for all players
		dataFactory.getCalcItemTotalPerPlayer = function(year, season, item, showsub)
		{
			var deferred = $q.defer();

			this.getBatting(year, season, showsub).then(function(battotal) {

				var resdata = {};
				var itemlabels = [];
				var itemdata = [];
				angular.forEach(battotal, function(i, key) {
					itemlabels.push(battotal[key].name);
					itemdata.push(battotal[key][item]);
				});
				var datasets = [
				{
					label: "Player",
					fillColor: "rgba(92,184,92,1)",
					strokeColor: "rgba(68,157,68,1)",
					highlightFill: "rgba(68,157,68,1)",
					highlightStroke: "rgba(68,157,68,1)",
					data: itemdata
				}
				];
				resdata.labels = itemlabels;
				resdata.datasets = datasets;

				//console.log(resdata);
				deferred.resolve(resdata);
			});
			return deferred.promise;
		};

		// return total of a specific item per player
		// ex: homeruns for all players
		dataFactory.getItemTotalPerPlayer = function(year, season, item, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
				var data = $firebaseObject(dRef);

				var playertotal = {};
				var itemtotal = [];
				data.$loaded().then(function() {
					// pre-process each data entry to group each person's total
					var name = null;
					var skip = false;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!item || !data[key][item]) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							if (!playertotal[name])
							{
								playertotal[name] = {
									"name": name,
									"label": name,
									"color": players[name].color,
									"highlight": players[name].highlight,
									"value": 0
								};
							}
							playertotal[name].value += (data[key][item] ? data[key][item] : 0);
						}
					});

					angular.forEach(playertotal, function(val, key) {
						itemtotal.push(val);
					});
					//console.log(itemtotal);
					deferred.resolve(itemtotal);
				});
			});
			return deferred.promise;
		};

		// return total of a specific item per player
		// ex: homeruns for all players
		dataFactory.getItemTotalsPerItem = function(year, season, itemlist, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
				var data = $firebaseObject(dRef);

				var itemlisttotal = {};
				// build list of items
				var icnt = itemlist.length;
				for (var i = 0; i < icnt; i++)
				{
					itemlisttotal[itemlist[i]] = {
						'color': CONFIG.COLORS[itemlist[i]].color,
						'highlight': CONFIG.COLORS[itemlist[i]].highlight,
						'label': baseDisplayFilter(itemlist[i]),
						'value': 0
					};
				}
				var itemtotal = [];
				data.$loaded().then(function() {
					// pre-process each data entry to group each person's total
					var name = null;
					var skip = false;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							angular.forEach(data[key], function(i2, key2) {
								if (itemlisttotal[key2] && data[key][key2])
									itemlisttotal[key2].value += data[key][key2];
							});
						}
					});

					angular.forEach(itemlisttotal, function(val, key) {
						itemtotal.push(val);
					});
					//console.log(itemtotal);
					deferred.resolve(itemtotal);
				});
			});
			return deferred.promise;
		};

		// return top 3 positions in xfactor - multiple ppl may be at same position
		dataFactory.getTopXFactor = function(year, season, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
				var data = $firebaseObject(dRef);

				var allxfactor = {};
				var allgamesplayed = {};
				var topxfactor = [];
				topxfactor[0] = [];
				topxfactor[1] = [];
				topxfactor[2] = [];
				data.$loaded().then(function() {
					// pre-process each data entry to group each person's total
					var name = null;
					var skip = false;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							if (!allxfactor[name])
								allxfactor[name] = 0;
							allxfactor[name] += parseFloat(xfactorFilter((data[key].B1 ? data[key].B1 : 0),
													(data[key].B2 ? data[key].B2 : 0),
													(data[key].B3 ? data[key].B3 : 0),
													(data[key].HR ? data[key].HR : 0),
													(data[key].R ? data[key].R : 0),
													(data[key].RBI ? data[key].RBI : 0)));
							if (!allgamesplayed[name])
								allgamesplayed[name] = 0;
							allgamesplayed[name]++;
						}
					});
					//console.log(allxfactor);

					var cnt = 3;
					var curx = null;
					angular.forEach(allxfactor, function(i, key) {
						curx = allxfactor[key]/allgamesplayed[key];
						// set first one
						if (!topxfactor[0])
						{
							topxfactor[0].push({'name': key, 'xfactor': curx});
						}
						else
						{
							for (var j = 0; j < cnt; j++)
							{
								if (!topxfactor[j][0] || (topxfactor[j][0] && (curx == topxfactor[j][0].xfactor)))
								{
									topxfactor[j].push({'name': key, 'xfactor': curx});
									j = cnt;
								}
								else if (curx > topxfactor[j][0].xfactor)
								{
									// shift all items below down one level
									for (var k = cnt-1; k > j; k--)
									{
										topxfactor[k] = topxfactor[k-1];
									}
									topxfactor[j] = [];
									topxfactor[j].push({'name': key, 'xfactor': curx});
									j = cnt;
								}
							}
						}
					});
					deferred.resolve(topxfactor);
				});
			});
			return deferred.promise;
		};
		return dataFactory;
}]);

softballServices.factory('Batting', ['CONFIG', '$firebaseObject', '$q', 'Players', 'avgFilter', 'slugFilter', 'xfactorFilter', 'yearSeasonGameDisplayFilter', 
	function(CONFIG, $firebaseObject, $q, Players, avgFilter, slugFilter, xfactorFilter, yearSeasonGameDisplayFilter){
		var dataFactory = {};

		dataFactory.getHeadings = function(typename)
		{
			switch(typename)
			{
				case 'game':
					return [
							{"id": "name", "name": "Name"},
							{"id": "AB", "name": "AB"},
							{"id": "H", "name": "H"},
							{"id": "R", "name": "R"},
							{"id": "B1", "name": "1B"},
							{"id": "B2", "name": "2B"},
							{"id": "B3", "name": "3B"},
							{"id": "HR", "name": "HR"},
							{"id": "RBI", "name": "RBI"},
							{"id": "Avg", "name": "Avg"},
							{"id": "Slug", "name": "Slug%"},
							{"id": "XFactor", "name": "X-Factor"}
					];
				case 'player':
					return [
							{"id": "gameid", "name": "Game"},
							{"id": "AB", "name": "AB"},
							{"id": "H", "name": "H"},
							{"id": "R", "name": "R"},
							{"id": "B1", "name": "1B"},
							{"id": "B2", "name": "2B"},
							{"id": "B3", "name": "3B"},
							{"id": "HR", "name": "HR"},
							{"id": "RBI", "name": "RBI"},
							{"id": "Avg", "name": "Avg"},
							{"id": "Slug", "name": "Slug%"},
							{"id": "XFactor", "name": "X-Factor"}
					];
			}
		};

		dataFactory.getBatting = function(year, season, game, name)
		{
			var deferred = $q.defer();

			var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
			var data = $firebaseObject(dRef);

			var batting = [];
			data.$loaded().then(function() {
				var skip = false;
				angular.forEach(data, function(i, key) {
					skip = false;
					if ((year && year != data[key].year) ||
					   (season && season != data[key].season) ||
					   (game && game != data[key].game) ||
					   (name && name != data[key].name))
						skip = true;
					if (!skip)
					{
						// build the gameid
						data[key].gameid = data[key].year + '-' + data[key].season + '-' + data[key].game;
						// build display name
						data[key].displayname = yearSeasonGameDisplayFilter(data[key].year, data[key].season, data[key].game);
						// make empty values be 0
						var stats = ['AB','H','R','B1','B2','B3','HR','RBI'];
						for (var s = 0; s < stats.length; s++)
							data[key][stats[s]] = (data[key][stats[s]] ? data[key][stats[s]] : 0);
						//console.log(data[key]);
						data[key].Avg = parseFloat(avgFilter((data[key].H),
											data[key].AB, 3));
						data[key].Slug = parseFloat(slugFilter(data[key].B1,
											data[key].B2, data[key].B3,
											data[key].HR, data[key].AB, 3));
						data[key].XFactor = parseFloat(xfactorFilter(data[key].B1,
												data[key].B2, data[key].B3,
												data[key].HR, data[key].R,
												data[key].RBI));
						batting.push(data[key]);
					}
				});
				deferred.resolve(batting);
			});
			return deferred.promise;
		};


		// return top 3 best games in xfactor - multiple ppl may be at same position
		dataFactory.getTopXFactorGame = function(year, season, showsub)
		{
			var deferred = $q.defer();

			Players.getPlayers().then(function(players) {
				var dRef = new Firebase(CONFIG.BASE_URL+"/batting");
				var data = $firebaseObject(dRef);

				var allxfactor = {};
				var topxfactor = [];
				topxfactor[0] = [];
				topxfactor[1] = [];
				topxfactor[2] = [];
				data.$loaded().then(function() {
					// pre-process each data entry to group each top score
					var name = null;
					var skip = false;
					var xf = null;
					angular.forEach(data, function(i, key) {
						name = data[key].name;
						skip = false;
						if ((year && year != data[key].year) ||
						   (season && season != data[key].season) ||
						   (!players[name] || (!showsub && players[name].sub)))
							skip = true;
						if (!skip)
						{
							xf = xfactorFilter((data[key].B1 ? data[key].B1 : 0),
													(data[key].B2 ? data[key].B2 : 0),
													(data[key].B3 ? data[key].B3 : 0),
													(data[key].HR ? data[key].HR : 0),
													(data[key].R ? data[key].R : 0),
													(data[key].RBI ? data[key].RBI : 0));
							if (!allxfactor[xf])
								allxfactor[xf] = {};
							// key by name to avoid duplicate scores for same person
							allxfactor[xf][name] = {'name': name, 'xfactor': xf};
						}
					});
					//console.log(allxfactor);

					var cnt = 3;
					var curx = null;
					angular.forEach(allxfactor, function(i, key) {
						curx = key;
						//console.log("Cur x val: "+curx);
						// set first one
						if (!topxfactor[0])
						{
							topxfactor[0] = {'xfactor': key, 'names': allxfactor[key]};
						}
						else
						{
							for (var j = 0; j < cnt; j++)
							{
								//console.log(curx + " vs "+topxfactor[j].xfactor);
								if (!topxfactor[j].xfactor || (topxfactor[j].xfactor && curx == parseInt(topxfactor[j].xfactor)))
								{
									topxfactor[j] = {'xfactor': key, 'names': allxfactor[key]};
									j = cnt;
								}
								else if (curx > parseInt(topxfactor[j].xfactor))
								{
									//console.log("shift");
									// shift all items below down one level
									for (var k = cnt-1; k > j; k--)
									{
										topxfactor[k] = topxfactor[k-1];
									}
									topxfactor[j] = {'xfactor': key, 'names': allxfactor[key]};
									j = cnt;
								}
							}
						}
					});
					//console.log(topxfactor);

					// function to process each xfactor entry
					var xfactorfn = function(i, key) {
						res.push(topxfactor[m].names[key]);
					};

					// convert names list from object to array
					for (var m = 0; m < cnt; m++)
					{
						var res = [];
						// ignore nested function in loop error
						angular.forEach(topxfactor[m].names, xfactorfn);
						topxfactor[m].names = res;
					}
					//console.log(topxfactor);


					deferred.resolve(topxfactor);
				});
			});
			return deferred.promise;
		};

		return dataFactory;
}]);
