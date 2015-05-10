module.exports = {
	db: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/<%= appName %>'
};
