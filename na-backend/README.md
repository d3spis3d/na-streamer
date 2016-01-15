# na-backend

## Steps for setting up OrientDB docker

1. First step need to copy config from an OrientDB instance

`docker run --name orientdb -d orientdb/orientdb`

'docker cp orientdb:/orientdb/config/orientdb-server-config.xml .'

2. Open up the XML file and add a user line with a new user and password, same resources as root user.

3. Discard current orientdb instance

`docker stop orientdb && docker rm orientdb`

4. Setup the docker image with the modified config file mapped to the container

`docker run --name orientdb -d -v <path to config file>:/orientdb/config -p <localportnum>:2424 -p <anotherlocalportnum>:2480 orientdb/orientdb`
