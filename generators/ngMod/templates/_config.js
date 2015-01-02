angular.module('<%= modName %>.config', ['ui.router'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		
		$stateProvider
			.state('<%= modName %>', {
				abstract: true,
				url: '/<%= modURL %>'
			})
			.state('<%= modName %>.<%= modState %>', {
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
