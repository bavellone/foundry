module.exports = {
	db: process.env.MONGO_URI || 'mongodb://db:27017/<%= appNS %>'
};
