// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/canopy_ds__test.db'
    }
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: './data/canopy_ds__test.db'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);  }
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2, 
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
