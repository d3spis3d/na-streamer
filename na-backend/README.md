# na-backend

## Steps for setting up OrientDB docker

1. First step need to copy config from an OrientDB instance:

  `docker run --name orientdb -d orientdb/orientdb`

  `docker cp orientdb:/orientdb/config/orientdb-server-config.xml .`

* Open up the XML file and add a user line with a new user and password, same resources as root user.

* Discard current orientdb instance:

  `docker stop orientdb && docker rm orientdb`

* Setup the docker image with the modified config file mapped to the container:

  `docker run --name orientdb -d -v <path to config file>:/orientdb/config -p <localportnum>:2424 -p <anotherlocalportnum>:2480 orientdb/orientdb`

* Replace the username and password in `setup-orientdb.osql` with those in `orientdb-server-config.xml`

* Copy the setup script to the docker container:

  `docker cp ./na-backend/setup-orientdb.osql orientdb:/orientdb/bin/`

* Exec the script from within the container:

  `docker exec -it orientdb /bin/bash`

  `cd bin && ./console.sh setup-orientdb.osql`

* Exit the docker container and confirm the music database has been created by going to the OrientDB web console at `<docker-host>:<anotherlocalportnum>` in a web browser
