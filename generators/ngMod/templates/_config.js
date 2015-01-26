angular.module('<%= modName %>.config', ['ui.router'])
	.config(function ($stateProvider) {

		$stateProvider
			.state('<%= modName %>', {
				abstract: true
			})
			.state('<%= modName %>.index', {
				url: '/<%= modURL %>',
				views: {
					'nav@': {
						template: ''
					},
					'content@': {
						templateUrl: '<%= modName %>.index.html',
						controller: '<%= modName %>Ctrl'
					}
				}
			})
	});
