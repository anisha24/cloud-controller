const cron = require('node-cron');
const moment = require('moment');
const { execSync } = require('child_process');
const fs = require('fs')

const promises = require('../utils/promises/file.promise')

// cronjob to take db backup at 6AM each day
// to change backup time, please change cronjob schedule below
var task = cron.schedule('0 6 * * * ', () => {
    let date = moment(new Date()).format('YYYY-MM-DD_HH:mm:ss');
    try {
        let stdout = execSync(`mongodump --db cdt --out ../backup_mongodb/${date}_ccCommon_backup`);
    } catch (error) {
        console.log(error)
    }
})

// clearing out backups older than 1 year
var task = cron.schedule('30 6 * * * ', async () => {
    var getDifferenceInDays = (date1, date2) => {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }
    try {
        let backupList = await promises.readDirPromise('../../backup_mongodb/');
        backupList = backupList.map(file => {
            if (getDifferenceInDays(new Date(), new Date(file.slice(0, 16).replace('_', 'T', 10).replace('_', ':'))) > 0.39) {
                fs.rmdirSync(`../../backup_mongodb/${file}`, { recursive: true });
            }
        });
    } catch (error) {
        console.log(error)
    }
})