var softballControllers = angular.module('softballControllers', ['firebase']);

softballControllers.controller('FilterYearSeasonCtrl', ['$scope', '$stateParams', '$state', 'Games', 
	function ($scope, $stateParams, $state, Games) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;

		//console.log("Displaying filter for year:"+$scope.year+" and season:"+$scope.season);
	
		Games.getYears($scope.year).then(function(data) {
			$scope.curyear = data[$scope.year];
			//console.log(data);
			$scope.years = data;
		});
		
		$scope.seasons = Games.getSeasons($scope.season);
		$scope.curseason = $scope.seasons[$scope.season];

		$scope.changeYear = function(year){
			//console.log(year);
			var newyear = null;
			if (year && year.year)
				newyear = year.year;

			$state.go($state.current, {'year': newyear, 'season': $scope.season});
		};

		$scope.changeSeason = function(season){
			var newseason = null;
			if (season && season.season)
				newseason = season.season;

			$state.go($state.current, {'year': $scope.year, 'season': newseason});
		};
}]);

softballControllers.controller('FilterGamesCtrl', ['$scope', '$stateParams', '$state', 'Games', 'gameIdExplodeFilter', 
	function ($scope, $stateParams, $state, Games, gameIdExplodeFilter) {
		$scope.gameid = $stateParams.gameid;

		if ($scope.gameid)
		{
			var d = gameIdExplodeFilter($scope.gameid);
			$scope.year = d.year;
			$scope.season = d.season;
			$scope.game = d.game;
		}

		//console.log("Displaying filter for year:"+$scope.year+" and season:"+$scope.season);
	
		Games.getGames().then(function(data) {
			// remove games where status is new
			for (var i = 0; i < data.length; i++)
			{
				if ("new" == data[i].status)
					data.splice(i, 1);
			}
			$scope.games = data;
			if (data)
			{
				if (!$scope.gameid)
					$scope.changeGame(data[data.length-1]);
					//$scope.curgameid = data[data.length-1];
				else
				{
					// find the currently selected gameid
					for (var j = 0; j < data.length; j++)
					{
						if ($scope.gameid == data[j].gameid)
						{
							$scope.curgame = data[j];
							return;
						}
					}
				}
			}
			//console.log($scope.curgameid);
		});

		$scope.changeGame = function(gameid){
			//console.log(gameid);
			$scope.curgame = gameid;
			$state.go($state.current, {'gameid': gameid.gameid});
		};
}]);

softballControllers.controller('FilterPlayersCtrl', ['$scope', '$stateParams', '$state', 'Players', 
	function ($scope, $stateParams, $state, Players) {
		$scope.name = $stateParams.name;

		//console.log("Displaying filter for name:"+$scope.name);
	
		Players.getPlayers().then(function(data) {
			$scope.players = data;
			if (data)
			{
				if (!$scope.name)
				{
					// choose the first player (no break in forEach available)
					var first = null;
					angular.forEach($scope.players, function(i, key) {
						if (!first)
							first = $scope.players[key];
					});
					$scope.changePlayer(first);
				}
				else
				{
					// set the currently selected player name
					$scope.curname = data[$scope.name];
				}
			}
			//console.log($scope.curname);
		});

		$scope.changePlayer = function(name){
			//console.log(name);
			$scope.curname = name;
			$state.go($state.current, {'name': name.name});
		};
}]);

softballControllers.controller('FilterSubCtrl', ['$scope', '$stateParams', '$state',
	function ($scope, $stateParams, $state) {
		$scope.showsub = ("true" == $stateParams.showsub) ? true : false;

		//console.log("Displaying filter for showsub:"+$scope.showsub);

		$scope.changeShowSubStatus = function(showsub){
			//console.log("changeShowSubStatus to: "+showsub);
			$scope.showsub = showsub;
			$state.go($state.current, {'showsub': showsub});
		};
}]);

softballControllers.controller('DashboardGamesCtrl', ['$scope', '$stateParams', '$state', 'Games', 'Snacks', 'BattingTeam', 
	function ($scope, $stateParams, $state, Games, Snacks, BattingTeam) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;

		//console.log("Displaying dashboard for year:"+$scope.year+" and season:"+$scope.season);
	
		Games.getGames($scope.year, $scope.season).then(function(data) {
			$scope.games = data;
		});

		Games.getGameStats($scope.year, $scope.season).then(function(data) {
			$scope.gameChart = data;
		});

		Games.getGameScores($scope.year, $scope.season).then(function(data) {
			//console.log(data);
			$scope.gameScoreChart = data;
		});

		Snacks.getSnacks($scope.year, $scope.season).then(function(data) {
			$scope.snacks = data;
		});

		BattingTeam.getItemTotalsPerItem($scope.year, $scope.season, ["B1", "B2", "B3", "HR"], true).then(function(data) {
			//console.log(data);
			$scope.baseHitChart = data;
		});
}]);

softballControllers.controller('DashboardTeamCtrl', ['$scope', '$stateParams', '$state', 'Players', 'Games', 'BattingTeam', 'Batting', 'FieldingTeam',
	function ($scope, $stateParams, $state, Players, Games, BattingTeam, Batting, FieldingTeam) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;
		$scope.showsub = ("true" == $stateParams.showsub) ? true : false;

		//console.log("Displaying dashboard for year:"+$scope.year+" and season:"+$scope.season);

		$scope.players = Players.getPlayers();

		Games.getGames($scope.year, $scope.season).then(function(data) {
			$scope.games = data;
		});

		BattingTeam.getTopXFactor($scope.year, $scope.season, $scope.showsub).then(function(data) {
			$scope.topXFactor = data;
		});

		Batting.getTopXFactorGame($scope.year, $scope.season, $scope.showsub).then(function(data) {
			$scope.topXFactorGame = data;
		});

		FieldingTeam.getTopFielding($scope.year, $scope.season, $scope.showsub).then(function(data) {
			$scope.topFieldingOuts = data.outs;
			$scope.topFieldingAssists = data.assists;
		});

		BattingTeam.getItemTotalPerPlayer($scope.year, $scope.season, "HR", $scope.showsub).then(function(data) {
			//console.log(data);
			$scope.homeRunChart = data;
		});

		BattingTeam.getItemTotalsPerItem($scope.year, $scope.season, ["B1", "B2", "B3", "HR"], $scope.showsub).then(function(data) {
			//console.log(data);
			$scope.baseHitChart = data;
		});

		BattingTeam.getCalcItemTotalPerPlayer($scope.year, $scope.season, "Avg", $scope.showsub).then(function(data) {
			//console.log(data);
			$scope.battingAvgChart = data;
		});

}]);

softballControllers.controller('DashboardPlayersCtrl', ['$scope', '$stateParams', '$state', 'Players', 'Games', 'BattingSeason', 'Batting', 'FieldingTeam',
	function ($scope, $stateParams, $state, Players, Games, BattingSeason, Batting, FieldingTeam) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;

		//console.log("Displaying dashboard for year:"+$scope.year+" and season:"+$scope.season);

		$scope.players = Players.getPlayers($scope.season);

		Games.getGames($scope.year, $scope.season).then(function(data) {
			$scope.games = data;
		});

		BattingSeason.getTopXFactor($scope.year, $scope.season).then(function(data) {
			$scope.topXFactor = data;
		});
		Batting.getTopXFactorGame($scope.year, $scope.season).then(function(data) {
			$scope.topXFactorGame = data;
		});

		FieldingTeam.getTopFielding($scope.year, $scope.season).then(function(data) {
			$scope.topFieldingOuts = data.outs;
			$scope.topFieldingAssists = data.assists;
		});
}]);



///////////////////////////////////////////////////////////////////////////////////////
// BELOW context of season must be provided

softballControllers.controller('PlayerListCtrl', ['$scope', '$stateParams', 'Players',
	function ($scope, $stateParams, Players) {
		$scope.season = $stateParams.season;
		$scope.players = Players.getPlayers($scope.season);
}]);

softballControllers.controller('GameListCtrl', ['$scope', '$stateParams', 'Games',
	function ($scope, $stateParams, Games) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;
		Games.getGames($scope.year, $scope.season).then(function(data) {
			$scope.games = data;
		});
		Games.getYearSeasons().then(function(data) {
			$scope.yearseason = data;
		});
}]);


// FIELDING ///////////////////////////////////////////////////////////////////

softballControllers.controller('FieldingTeamCtrl', ['$scope', '$stateParams', 'Players', 'FieldingTeam', 
	function ($scope, $stateParams, Players, FieldingTeam) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;
		$scope.showsub = ("true" == $stateParams.showsub) ? true : false;

		$scope.players = Players.getPlayers();

		FieldingTeam.getFielding($scope.year, $scope.season, $scope.showsub).then(function(data) {
			$scope.fielding = data;
		});

		$scope.headings = FieldingTeam.getHeadings();

		$scope.sort = "name";
		$scope.reverse = false;

		$scope.changeSort = function(value){
			//console.log(value);
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
		};
}]);

softballControllers.controller('FieldingGameCtrl', ['$scope', '$stateParams', 'Games', 'Fielding', 'gameIdExplodeFilter',
	function ($scope, $stateParams, Games, Fielding, gameIdExplodeFilter) {
		$scope.gameid = $stateParams.gameid;
		$scope.showsub = $stateParams.showsub;

		if ($scope.gameid)
		{
			var s = gameIdExplodeFilter($scope.gameid);
			$scope.year = s.year;
			$scope.season = s.season;
			$scope.game = s.game;
		}
		//console.log("Displaying field for game #"+$scope.gamenumber);

		Games.getGame($scope.year, $scope.season, $scope.game).then(function(data) {
			$scope.game = data;
		});

		Fielding.getFielding($scope.year, $scope.season, $scope.game, $scope.showsub).then(function(data) {
			$scope.fielding = data;
		});

		$scope.headings = Fielding.getHeadings('game');

		$scope.sort = "name";
		$scope.reverse = false;

		$scope.changeSort = function(value){
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
		};
}]);

softballControllers.controller('FieldingPlayerCtrl', ['$scope', '$stateParams', 'Players', 'Fielding',
	function ($scope, $stateParams, Players, Fielding) {
		$scope.name = $stateParams.name;
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;

		//console.log("Displaying field for player name: "+$scope.playername);

		Players.getPlayer($scope.name).then(function(data) {
			$scope.player = data;
		});

		Fielding.getFielding($scope.year, $scope.season, null, $scope.name).then(function(data) {
			$scope.fielding = data;
		});

		$scope.headings = Fielding.getHeadings('player');

		$scope.sort = "gameid";
		$scope.reverse = false;

		$scope.changeSort = function(value){
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
		};
}]);


// BATTING ////////////////////////////////////////////////////////////////////

softballControllers.controller('BattingTeamCtrl', ['$scope', '$stateParams', 'Players', 'BattingTeam', 
	function ($scope, $stateParams, Players, BattingTeam) {
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;
		$scope.showsub = ("true" == $stateParams.showsub) ? true : false;

		$scope.players = Players.getPlayers();

		BattingTeam.getBatting($scope.year, $scope.season, $scope.showsub).then(function(data){
			$scope.batting = data;
		});

		$scope.headings = BattingTeam.getHeadings();

		$scope.sort = "name";
		$scope.reverse = false;

		$scope.changeSort = function(value){
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
			//console.log("New sort set to: "+$scope.sort+" dir: "+$scope.reverse);
		};
}]);

softballControllers.controller('BattingGameCtrl', ['$scope', '$stateParams', 'Games', 'Batting', 'gameIdExplodeFilter',
	function ($scope, $stateParams, Games, Batting, gameIdExplodeFilter) {
		$scope.gameid = $stateParams.gameid;

		if ($scope.gameid)
		{
			var s = gameIdExplodeFilter($scope.gameid);
			$scope.year = s.year;
			$scope.season = s.season;
			$scope.game = s.game;
		}
		//console.log("Displaying batting for game #"+$scope.gamenumber);

		Games.getGame($scope.year, $scope.season, $scope.game).then(function(data) {
			$scope.game = data;
		});

		Batting.getBatting($scope.year, $scope.season, $scope.game).then(function(data) {
			$scope.batting = data;
		});

		$scope.headings = Batting.getHeadings('game');

		$scope.sort = "name";
		$scope.reverse = false;
		$scope.changeSort = function(value){
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
		};

}]);

softballControllers.controller('BattingPlayerCtrl', ['$scope', '$stateParams', 'Players', 'Batting', 
	function ($scope, $stateParams, Players, Batting) {
		$scope.name = $stateParams.name;
		$scope.year = $stateParams.year;
		$scope.season = $stateParams.season;

		//console.log("Displaying batting for player name: "+$scope.name);

		Players.getPlayer($scope.name).then(function(data) {
			$scope.player = data;
		});

		Batting.getBatting($scope.year, $scope.season, null, $scope.name).then(function(data) {
			$scope.batting = data;
		});

		$scope.headings = Batting.getHeadings('player');

		$scope.sort = "gameid";
		$scope.reverse = false;

		$scope.changeSort = function(value){
			if ($scope.sort == value){
 				$scope.reverse = !$scope.reverse;
				return;
			}

			$scope.sort = value;
			$scope.reverse = false;
		};
}]);
