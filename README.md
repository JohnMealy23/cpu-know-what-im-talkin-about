# DataDog Challenge
A simple CPU monitoring application

## Overview

This application consists of a local server and a frontend module.

The local server surfaces a single endpoint.  This endpoint returns the average load of the user's CPU.

The browser client monitors the user's CPU usage, giving them insight into trends in load, and alerting them when load becomes extreme.

## Approach
I've designed the state to keep `state.snapshots.load`, an array of time-based snapshots retained for the preset amount of time.  This array is populated by the app's heartbeat, and is intended to be a single source of truth by which the app's readouts and eventing are designed around.

All behavior is configured in the `/src/constants.ts` file.

## To Setup
Install node modules:
```bash
npm i
```

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
Run unit tests with:
```bash
npm test
```

To test functionality at runtime, I've also left a backdoor in place for testing at runtime.  Adjusting `window.fakeLoad = mockLoadNum` in the developer console will cause the API calls to be overridden with `mockLoadNum`.  This can be used to trigger the various required behaviors.

All behavior thresholds are configured in the `/src/constants.ts` file.  Updating these thresholds to lower numbers may be necessary to trigger some events.

I've also included a pause button, which is helpful if one needs to halt the app to investigate state.

## Given more time...

* Use middleware to contain logic.
* Research directory structure.  Still coming up to speed about modern organization practices.
* Asked for more clarity from Product in terms of what "alert the user" means.
* Install linter
* More comprehensive unit tests
* Fixed up the GUI
    * CSS animations to avoid the jank
    * Add media queries
    * Beef up the chart. Better integration with state.
