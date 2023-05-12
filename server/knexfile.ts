import * as dotenv from 'dotenv'
dotenv.config()

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: process.env.POSTGRES_TEST_DB,
      user: process.env.DB_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.DB_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
