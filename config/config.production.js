module.exports = {
  blog: {
    googleCustomSearchKey: 'AIzaSyBOhMyOU9e5cMIUrZFR4Yr2a32FF1ePfn0',
    googleCustomSearchCx: '005909242293933576388:h9kkzcmu7y8'
  },
  sequelize: {
    logging: false
  },
  evernote: {
    consumerKey: 'allovince',
    consumerSecret: process.env.EVERNOTE_CONSUMERSECRET || '',
    sandbox: false,
    china: false,
    callbackDomain: process.env.EVERNOTE_CALLBACK_DOMAIN || 'https://api.avnpc.com',
    sharedId: 's7',
    defaultNotebookId: '4127acd7-f384-4d16-bed2-2aa3084a7d5c'
  },
  db: {
    database: 'avnpc',
    replication: {
      write: {
        host: process.env.DB_REPLICATION_WRITE_HOST || 'db',
        username: process.env.DB_REPLICATION_WRITE_USERNAME || 'avnpc',
        password: process.env.DB_REPLICATION_WRITE_PASSWORD || 'MySQL_password'
      },
      read: [
        {
          host: process.env.DB_REPLICATION_READ0_HOST || 'db',
          username: process.env.DB_REPLICATION_READ0_USERNAME || 'avnpc',
          password: process.env.DB_REPLICATION_READ0_PASSWORD || 'MySQL_password'
        }
      ]
    }
  }
};
