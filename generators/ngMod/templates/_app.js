angular.module('<%= modName %>', ['ui.bootstrap', '<%= modName %>.ctrl', '<%= modName %>.config'])
	.run(function () {
		console.log('<%= modName %> initialized');
	});