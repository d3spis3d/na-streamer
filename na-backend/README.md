# na-backend

## Steps for setting up OrientDB docker

1. Open up the XML file `orientdb-server-config.xml` and add update the user and passwords. Move this file to a new directory called config.

* Setup the docker image with the modified config file mapped to the container:

  `docker run --name orientdb -d -v $(pwd)/config/orientdb-server-config.xml:/orientdb/config/orientdb-server-config.xml -p 7000:2424 -p 7001:2480 orientdb`

* Create the database using orientjs client:

  `node_modules/orientjs/bin/orientjs --host=<docker-host> --port=7000 --user=<created-user> --password=<created-password> db create music graph memory`

* Run the migrations:

  `node_modules/orientjs/bin/orientjs --host=<docker-host> --port=7000 --user=<created-user> --password=<created-password> --dbname=music migrate up`

* Confirm the music database has been created and migrated by going to the OrientDB web console at `<docker-host>:7001` in a web browser

* Create a `config.js` file with the following configuration:

  `module.exports = {
    databaseHost: '<database-host>',
    databasePort: '7000',
    username: '<username-setup-in-xml>',
    password: '<password-of-username>',
    webPort: 4000,
    streamPort: 9000
  };`

## Running na-backend

`npm run start`
