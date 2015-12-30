var softballApp = angular.module('softballApp', [
	'ui.router', 
	'softballConfig', 
	'softballControllers', 
	'softballFilters', 
	'softballServices', 
	'softballDirectives'
	]);

softballApp.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
		// Now set up the states
		$stateProvider

			// MAIN //////////////////////////////////////////////////////

			.state('main', {
				abstract: true,
				url: "",
				views: {
					// load the master view in top level parent
					'masterview@': {
						template: '<div ui-view></div>'
					},
					// load nav menu in top level parent
					'navmenu@': {
						templateUrl: 'navmenu.html',
						controller: 'NavMenuCtrl'
					}
				}
			})

			.state('main.info', {
				url: "/info",
				views: {
					'': {
						templateUrl: 'info.html'
					}
				}

			})

			// ADMIN //////////////////////////////////////////////////////

			.state('main.admin', {
				abstract: true,
				url: "/admin",
				views: {
					'': {
						templateUrl: 'admin.html',
						controller: 'AdminCtrl'
					}
				},
				resolve: {
					// controller will not be loaded until $waitForAuth resolves
					// Auth refers to our $firebaseAuth wrapper in the example above
					"currentAuth": ["Auth", function(Auth) {
						// $waitForAuth returns a promise so the resolve waits for it to complete
						return Auth.$waitForAuth();
					}]
				}
			})

			.state('main.admin.login', {
				url: "/login",
				views: {
					'': {
						templateUrl: 'admin.login.html',
						controller: 'AdminLoginCtrl'
					}
				},
				params: {
					msg: {}
				}
			})

			.state('main.admin.games', {
				abstract: true,
				url: "/games",
				templateUrl: 'admin.games.html',
				controller: 'AdminGamesCtrl',
				resolve: {
					// controller will not be loaded until $requireAuth resolves
					// Auth refers to our $firebaseAuth wrapper in the example above
					"currentAuth": ["Auth", function(Auth) {
						// $requireAuth returns a promise so the resolve waits for it to complete
						// If the promise is rejected, it will throw a $stateChangeError (see above)
						return Auth.$requireAuth();
					}]
				},
				data: {
					"auth": true
				}
			})

			.state('main.admin.games.add', {
				url: "/add",
				views: {
					'': {
						templateUrl: 'admin.games.add.html',
						controller: 'AdminGamesAddCtrl'
					}
				},
				resolve: {
					// controller will not be loaded until $requireAuth resolves
					// Auth refers to our $firebaseAuth wrapper in the example above
					"currentAuth": ["Auth", function(Auth) {
						// $requireAuth returns a promise so the resolve waits for it to complete
						// If the promise is rejected, it will throw a $stateChangeError (see above)
						return Auth.$requireAuth();
					}]
				},
				data: {
					"auth": true
				}
			})

			.state('main.admin.games.edit', {
				url: "/edit",
				views: {
					'': {
						templateUrl: 'admin.games.edit.html',
						controller: 'AdminGamesEditCtrl'
					}
				},
				resolve: {
					// controller will not be loaded until $requireAuth resolves
					// Auth refers to our $firebaseAuth wrapper in the example above
					"currentAuth": ["Auth", function(Auth) {
						// $requireAuth returns a promise so the resolve waits for it to complete
						// If the promise is rejected, it will throw a $stateChangeError (see above)
						return Auth.$requireAuth();
					}]
				},
				data: {
					"auth": true
				}
			})

			.state('main.admin.games.delete', {
				url: "/delete",
				views: {
					'': {
						templateUrl: 'admin.games.delete.html',
						controller: 'AdminGamesDeleteCtrl'
					}
				},
				resolve: {
					// controller will not be loaded until $requireAuth resolves
					// Auth refers to our $firebaseAuth wrapper in the example above
					"currentAuth": ["Auth", function(Auth) {
						// $requireAuth returns a promise so the resolve waits for it to complete
						// If the promise is rejected, it will throw a $stateChangeError (see above)
						return Auth.$requireAuth();
					}]
				},
				data: {
					"auth": true
				}
			})
			// DASHBOARD //////////////////////////////////////////////////////

			.state('main.dashboard', {
				abstract: true,
				url: "/dashboard",
				templateUrl: 'main.filter.html'
			})

			.state('main.dashboard.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'dashboard.team.html',
						controller: 'DashboardTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.dashboard.games', {
				url: "/games?year&season",
				views: {
					'': {
						templateUrl: 'dashboard.games.html',
						controller: 'DashboardGamesCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseason.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.dashboard.player', {
				url: "/player?year&season",
				views: {
					'': {
						templateUrl: 'dashboard.player.html',
						controller: 'DashboardPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseason.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})

			// BATTING ////////////////////////////////////////////////////////

			.state('main.batting', {
				abstract: true,
				url: "/batting",
				templateUrl: 'main.filter.html'
			})

			.state('main.batting.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'batting.team.html',
						controller: 'BattingTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.batting.game', {
				url: "/game?gameid",
				views: {
					'': {
						templateUrl: 'batting.game.html',
						controller: 'BattingGameCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.games.html'
					}
				}
			})
			.state('main.batting.player', {
				url: "/player?name&year&season",
				views: {
					'': {
						templateUrl: 'batting.player.html',
						controller: 'BattingPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.players.html'
					}
				}
			})

			// FIELDING ////////////////////////////////////////////////////////

			.state('main.fielding', {
				abstract: true,
				url: "/fielding",
				templateUrl: 'main.filter.html'
			})

			.state('main.fielding.team', {
				url: "/team?year&season&showsub",
				views: {
					'': {
						templateUrl: 'fielding.team.html',
						controller: 'FieldingTeamCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.yearseasonsub.html',
						controller: 'FilterYearSeasonCtrl'
					}
				}
			})
			.state('main.fielding.game', {
				url: "/game?gameid&showsub",
				views: {
					'': {
						templateUrl: 'fielding.game.html',
						controller: 'FieldingGameCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.games.html'
					}
				}
			})
			.state('main.fielding.player', {
				url: "/player?name&year&season",
				views: {
					'': {
						templateUrl: 'fielding.player.html',
						controller: 'FieldingPlayerCtrl'
					},
					// load filter in main again with current stateParams
					'masterFilter': {
						templateUrl: 'filter.players.html'
					}
				}
			})

			;

		// route to root if no valid route found
		$urlRouterProvider
			.when('/batting', '/batting/team')
			.when('/fielding', '/fielding/team')
			.when('/dashboard', '/dashboard/team')

			// go to the current year and season dashboard
			.otherwise(function($injector, $location){
				var d = new Date();
				var y = d.getFullYear();
				// get the season 1-4 winter-fall
				// only allow 2-3
				var s = Math.ceil((d.getMonth()+1) / 3);
				// late in the year, show last season
				if (s > 3)
					s = 3;
				// early in the year, show last season of last year
				else if (s < 2)
				{
					s = 3;
					y--;
				}
				return '/dashboard/games?year='+y+'&season='+s;
			});

}]);


softballApp.run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
	// have the ui.router state available for setting active tabs for parents
	// ng-class="{active:$state.includes('season.dashboard')}"
	$rootScope.$state = $state;
	//console.log($state);

	// track status of authentication
	Auth.$onAuth(function(user) {
		// add the auth firebase object so we can call methods directly
		$rootScope.auth = Auth;

		$rootScope.loggedIn = !!user;
		$rootScope.user = user;
		console.log('Logged in value:', $rootScope.loggedIn, $rootScope.user);
	});

	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
		console.log('stateChangeStart');
		console.log(toState);

		if ($rootScope.auth && toState.data && toState.data.auth && !$rootScope.loggedIn)
		{
			console.log('Attempting to access restricted page');
			$state.go("main.admin.login");
			// prevent completing the transition
			event.preventDefault();
		}
	});

	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
		console.log('stateChangeError');
		// We can catch the error thrown when the $requireAuth promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			console.log('Not authenticated');
			$state.go("main.admin.login");
		}
	});
}]);
