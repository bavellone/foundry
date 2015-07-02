module.exports = {
	db: process.env.DB_URI || 'mongodb://127.0.0.1:27017/<%= appNS %>-dev'
};
