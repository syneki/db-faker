[![GitHub license](https://img.shields.io/github/license/syneki/db-faker)](https://github.com/syneki/db-faker/blob/main/LICENSE)

# 💽 DB Faker

**DB Faker** is a CLI to easily dump your production databases for development ones.

- 📚 Sample your production to avoid filling your disk !
- 🕵 Anonymize your dumps to avoid exposing sensible data !

## 🚧 This library is under heavy development 🚧

Use it at your own risks !

Help us to make this library **Production ready** by [Contributing](#contribute).

### 📅 Roadmap

- [x] Dump any SQL database using Knex
- [x] Easy configuration
- [ ] Automatic relations detection
- [ ] Improved subset configuration
- [ ] Performance improvements
- [ ] Add multiple output formats
  - [x] CSV files
  - [] SQL
  - [] JSON

## CLI

### Install

```sh
# Install the CLI
npm install -g @db-faker/cli

# And install your SQL client
$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```

### Configure

```yaml
# Connection to the source database
# Must be a valid Knex configuration
# https://knexjs.org/guide/#configuration-options
source:
  connection:
    client: 'pg' # Make sure that you have this dependency installed globally
    connection: postgres://root:root@localhost:5432/public

dumper:
  # List of tables to be sampled
  tables:
    - name: users
      subset:
        limit: 1000
      # Dump rows related to the sample
      # (automatic schema detection not yet implemented)
      relations:
        - name: profiles
          from: id
          to: user_id
      relations:
        - name: accounts
          from: id
          to: user_id
    - name: products
      subset:
        limit: 100 # Number of rows to subset

anonymizer:
  # Anonymize columns to a specific table
  tables:
    - name: users
      columns:
        - name: firstname
          engine: name.firstName # The FakerJS function to fake the data
        - name: lastname
          engine: name.lastName

  # Columns to anonymize over every file
  columns:
    - name: email
      engine: internet.email

dumpDirectory: tmp
anonymizedDirectory: tmp/anonymized

```

## Library

WIP

## 👀 Looking for more

If you only want to sample your database, you can directly use [Dumper](packages/dumper/).

And if you only want to anonymize your data, you can use [Anonymizer](packages/anonymizer/)

## <a href="#contribute">🔨 Contribute</a>

WIP
