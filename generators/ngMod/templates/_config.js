angular.module('<%= modName %>.config', ['ui.router'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		
		$stateProvider
			.state('<%= modName %>', {
				abstract: true
			})
			.state('<%= modName %>.<%= modState %>', {
				url: '/<%= modURL %>',
				views: {
					'nav@': {
						template: ''
					},
					'content@': {
						templateUrl: '<%= modName %>.<%= modState %>.html',
						controller: '<%= modName %>Ctrl'
					}
				}
			})
	})
	.run(function () {

	});
