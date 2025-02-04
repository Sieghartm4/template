const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

mongoose.connect("mongodb://localhost:27017/Template", {
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const store = new MongoDBStore({
    uri: "mongodb://localhost:27017/Template",
    collection: "enrollment_session"
});

store.on('error', function(error) {
    console.error('Session Store Error:', error);
});

module.exports = { mongoose, store };
