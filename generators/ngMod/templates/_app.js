angular.module('<%= modName %>', [<%= deps %>])
	.run(function () {
		console.log('<%= modName %> initialized');
	});
