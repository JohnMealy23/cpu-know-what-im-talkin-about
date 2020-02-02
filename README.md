# DataDog Challenge
A simple CPU monitoring application

## Overview

This application consists of a local server and a frontend module.

The local server surfaces a single endpoint.  This endpoint returns the average load of the user's CPU.

The browser client monitors the user's CPU usage, giving them insight into trends in load, and alerting them when load becomes extreme.

## A Little Philosophy

From the onset, this sounds simple enough.  

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

* Use middleware to contain logic.
* Research directory structure.  Still coming up to speed about modern organization practices.
* Asked for more clarity from Product
    * Double-check logic for "high load" and "recovery period"
    * Get direction on what "alert the user" means.
    * How long is a recovery period?  The instructions only mention the starting point.
* Install linter
* Fixed up the GUI
    * CSS animations to avoid the jank
    * Add media queries
    * Beef up the chart. Better integration with state. 
* Caching
* More memoizing
