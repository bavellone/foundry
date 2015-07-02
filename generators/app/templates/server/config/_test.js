function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

module.exports = {
	db: 'mongodb://127.0.0.1:27017/<%= appNS %>-test',
	port: randomInt(10000, 50000),
};
