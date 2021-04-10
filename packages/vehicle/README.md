# TypeScript Implementation of code which runs in a vehicle

 - Vehicle needs to have a
   - location sensor
   - internet connection
   - IoT device which can send data via MQTT
 - Vehicle will publish it's location every 5 seconds to the Message Broker residing on the server.
 - Actual implementation could be in another language, which the IoT device supports.

## How to Use

Any consumer has to extend the class [LocationPublisher](src/LocationPublisher.ts) and implement the method getPosition. Once this is done, Publishing the location can the started by creating an instance of the class and calling the start method.

## Important Files
 - [Vehicle.ts](src/Vehicle.ts) - Implementation of publishing message to mesage broker
 - [LocationPublisher.ts](src/LocationPublisher.ts) - Abstract class which has method to get location and periodically update it to the message broker
 - [SimulateVehicle.ts](test/SimulateVehicle.ts) - Creates random location data. Entry point of ```yarn run simulate```