# na-backend

## Steps for setting up OrientDB docker

1. First step need to copy config from an OrientDB instance:

  `docker run --name orientdb -d orientdb/orientdb`

  `docker cp orientdb:/orientdb/config/orientdb-server-config.xml .`

* Open up the XML file `orientdb-server-config.xml` and add update the user and passwords.

* Setup the docker image with the modified config file mapped to the container:

  `docker run --name orientdb -d -v <path to xml config file folder>:/orientdb/config -p 7000:2424 -p 7001:2480 orientdb/orientdb`

* Replace the username and password in `setup-orientdb.osql` with those in `orientdb-server-config.xml`

* Copy the setup script to the docker container:

  `docker cp ./na-backend/setup-orientdb.osql orientdb:/orientdb/bin/`

* Exec the script from within the container:

  `docker exec -it orientdb /bin/bash`

  `cd bin && ./console.sh setup-orientdb.osql`

* Exit the docker container and confirm the music database has been created by going to the OrientDB web console at `<docker-host>:7001` in a web browser

* Create a `config.js` file with the following configuration:

  `module.exports = {
    databaseHost: '<database-host>',
    databasePort: '7000',
    username: '<username-setup-in-xml>',
    password: '<password-of-username>'
  };`
