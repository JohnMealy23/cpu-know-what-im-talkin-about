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

## To Run
Starting the server:
```bash
npm run start-server
```

Starting the client:
```bash
npm run start-client
```

Navigate to http://localhost:1234/

__Note__: The constants.ts file can be adjusted to reduce threshold for what determines "high load".  

## To Test
```bash
npm test
```

## Given more time...

* Use Thunk to contain logic.
* Research directory structure.  Still coming up to speed about modern organization practices.
* Asked for more clarity from Product
    * getCpuRange
* Remove all unneeded //s
* Install linter
* Fixed up the GUI
    * CSS animations to avoid the jank
    * Add media queries
    * Beef up the chart. Better integration with state. 
* Caching
* More memoizing
