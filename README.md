# CPU Know What I'm Talkin' About
A simple CPU monitoring application

## Overview

This application consists of a local server and a frontend module.

The local server surfaces a single endpoint.  This endpoint returns the average load of the user's CPU.

The browser client monitors the user's CPU usage, giving them insight into trends in load, alerting them when load becomes extreme, and alerting again when back within nominal range:
- A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.
- A CPU is considered recovered from high average load when it drops below 1 for 2 minutes or more.

## Approach
I've designed the state to keep `state.snapshots.load`, an array of time-based snapshots retained for the preset amount of time.  This array is populated by the app's heartbeat, and is intended to be a single source of truth by which the app's readouts and eventing are designed around.

All behavior is configured in the `/src/constants.ts` file.

I've been out of the React/Redux space for quite awhile now, so I still have learning to do in terms of project organization.  Comments on this would be appreciated.

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
