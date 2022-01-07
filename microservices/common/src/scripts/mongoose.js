var mongoose = require('mongoose');

const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME || 'ccCommonadmin';
const dbPass = process.env.MONGO_INITDB_ROOT_PASSWORD || 'ccCommon#123';
const dbServer = process.env.MONGO_HOST || 'localhost';
const dbPort = process.env.MONGO_PORT || '27017';
let dbName = process.env.MONGO_INITDB_DATABASE || 'ccCommon';
const dbUrl = `mongodb://${dbServer}:${dbPort}/${dbName}`;
const mongoURI = `mongodb://${dbUser}:${encodeURI(dbPass)}@${dbServer}:${dbPort}/${dbName}?retryWrites=true&w=majority`;

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000
};

mongoose.connect(dbUrl, dbOptions, (err, db) => {

    if (err) console.log(`Error connecting to DB ${dbName} ==> ${err}`);
    else console.log(`Successfully connected to DB ${dbName}`);
}
);
mongoose.set('useFindAndModify', false);

module.exports = mongoose; 