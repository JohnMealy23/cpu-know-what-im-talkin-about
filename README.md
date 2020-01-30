# DataDog Challenge
A simple CPU monitoring application

## Overview

This application consists of a local server and a frontend module.

The local server surfaces a single endpoint.  This endpoint returns the average load of the user's CPU.

The browser client monitors the user's CPU usage, giving them insight into trends in load, and alerting them when load becomes extreme.


Something confusing about the instructions:

// - Has my computer been under heavy CPU load for 2 minutes or more? When? How many times?
// - A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.

// - Has my computer recovered from heavy CPU load? When? How many times?
// - A CPU is considered recovered from high average load when it drops below 1 for 2 minutes or more

I took this to mean that a low period takes place only when two minutes of **consecutive** low readings occur **after** an uninterrupted high period occurs.  

## To run
Starting the server:
```bash
npm run start-server
```

Starting the client:
```bash
npm run start-client
```

## Given more time...

* Remove all unneeded //s
* Install linter
* Add media queries
* 
