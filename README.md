# Fleet Management System

![Demo](./assets/demo.gif)

## Summary

An application which tracks the location of a fleet of vehicles in realtime. Consists of a Message Broker through which Vehicles and server communicate. Vehicles publish messages about the location and server subscribes to it and updates it in the dashboard via WebSockets.

Here, vehicles are simple JavaScript programs which publishes random location coordinates. 

## Structure of the project

There are 3 components in this System.
 - Vehicles, which sends their location updates to a server
 - Server which stores the current location information of the vehicles and provides information to the dashboard
 - Dashboard which displays information about the Live location of the vehicles.

This is built as a monorepo with each components having it's code segregated in it's own [package](./packages).

The solution can be run on Docker by running ```yarn run docker:simulate:start```. More details [here](#how-to-use).

### Architecture
![Architecture](assets/architecture.jpg)

### Vehicle

These are vehicles deployed on the road, which has to be tracked. Vehicles sends location updates to the Message Broker every 5 seconds. This has a Dockerfile [here](./packages/vehicle/Dockerfile_simulate).

[More Information](packages/vehicle/README.md)

### Server

Server consists of a Message Broker as well as an API Server.

#### Message Broker

Message broker protocol used is MQTT. It uses a pub-sub pattern. Vehicles 'publish' it's locations, and the API Server 'subscrbes' to the location updates. Here, there are multiple publishers and a single subscriber.

Here Eclipse Mosquitto is used as the Message Broker. It's usage can be seen in the [docker-compose-simulate.yaml](./docker-compose-simulate.yaml).

#### API Server

API Server is built on Express.js. There is an API endpoint ```/api/v1/fleet``` which can be used to do CRUD operations on the In-memory locations store. It uses Socket.IO for WebSocket connections. This is used to send location updates to the Dashboard. This has a Dockerfile [here](./Dockerfile).

[More Information](packages/api/README.md)

### Dashboard

Dashboard is built on Angular. It has a Table which displays the details of vehicles in the fleet, it's UUID, last updated date, Latitude, Longitude, Speed. This gets updated in realtime as new imformation gets pushed via the WebSocket connection. The Speed column values are shown in red if the speed is less than 1 and green, otherwise.

![Dashboard](./assets/dashboard.jpg)

[More Information](packages/dashboard/README.md)

## Assumptions

 - MQTT was chosen for communication between vehicles and server as it's lightweight, runs on TCP and there are IoT devices capable of using this protocol.
 - Vehicle's [code implementation](packages/vehicle) was done in TypeScript but in an actual scenario, it could be another language. This was done for demonstration purposes.
 - Implementation was done in such a way that Vehicles talk to the server via MQTT and the Server stores the information and sends it to the dashboard via a WebSocket connection. The server is used because it models the real world scenario better. An easier messy solution is to use just an MQTT Message broker and let the dashboard also subscribe to the updates of vehicles via MQTT. This is not an ideal because, the historical data might need to be stored. Other Information about the vehicles might need to be stored, so it's useful to have a server too.
 - The Simulation also runs the vehicles' docker containers in the same Docker environment to generate random location data. In an actual system, the vehicles would have it's code running on the vehicles on an IoT device.

## How to Use

A Simulation has been implemented and it has been packaged into a [docker-compose file](./docker-compose-simulate.yaml). It can be started by running the below command.

```
yarn run docker:simulate:start
```
OR
```
docker-compose -f docker-compose-simulate.yaml --compatibility up -d
```

[Dashboard](http://localhost:3000)

To stop, run the below command.

```
yarn run docker:simulate:stop
```

### Containers

 - Mosquitto (mq)
 - API Server (fleet-api-server)
 - Simulation of vehicles (fleet-vehicle)

This runs the vehicles' random location data as separate containers. There are 5 replicas running for fleet-vehicle.

## Out of Scope

 - Authentication for vehicles publishing messages to Message Broker - Vehicles and the Server are physically separate and there needs to be a way to authenticate the vehicles. This can be done using a private key stored on the vehicles, which can be verified by the server. A key rotation mechanism can also be added for more security.
 - Authentication for viewing the Dashboard - There can be many ways authentication can be done for a person viewing the Dashboard. SSO would be ideal for an enterprise. Here, providing a local login using [Passport.js](www.passportjs.org) would just add some boilerplate code.

## Docker Screenshots

Overview

![Overview](./assets/docker.png)

Vehicle

![Vehicle](./assets/vehicle.png)

API Server

![API Server](./assets/server.png)
