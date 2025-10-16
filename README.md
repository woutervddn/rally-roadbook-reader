# Rally Roadbook Reader

This application is used for viewing Tulip Roadbooks for TSD, Offroad,... Rallies designed in Rally Navigator 2. It works using the Rally Navigator 2 GPX export for TerraPirata. It's built as the solution that I hoped would be available for download in the appstore.

It's fully open-source, free to use and modify. 
It uses 100% web technology and should run on any platform with a modern webbrowser (and local filesystem access - We're working on removing this requirement)

It installs through the browser, without an appstore but still works 100% offline.

## Features

### Standalone Instrument view

Show any or a subset of the following instruments:

- Total Distance Driven (with start/stop and reverse support)
- Waypoint Distance Driven
- Current GPS Speed
- Heading/CAP 
- GPS position

### Roadbook view

Show the following:

- Current WP Total distance
- Current WP Tulip
- Current WP note
- Short WP distance indication
- Use metric or imperial depending on roadbook

Show any or a subset of the following:

- Instrumentpanel as described above
- Per waypoint
  - Current WP distance
  - CAP indications
  - GPS location
  - WP number
  - Keep track of progress Checking of/clearing specific waypoints
  - Adding notes

Has the following helper functions that an be individually enabled/disabled:

- Automatically check off waypoints when close (-15 meters)
- Automatically clear WP distance when WP checked off
- Automatically sync up TOTAL distance when WP checked off
- Automatically scroll view to WP n-1 when WP checked off
- Show distance to next WP in instrumentspanel

Hardware support for Bluetooth Pedals/keyboards (music page turners work great and are cheap).

Set individual keys for any or multiple of the following settings:

- Clear WP Distance
- Check off WP
- Sync TOTAL distance

### Local Roadbook storing

The application stores GPX files in local indexedDB for offline use.

## To Do

- Fix missing openrally features
- Fix any screensize
- Check iOS compatiblity
- Option to load a route from a weblink or QR code
- Add an FAQ
- Add a Welcome Wizard
- Add file Bug/Feature request
- Pick a Software License

## Potential To Do

- Add different navigation modes (herring bone,...)
- Add game modes (foxhunt,...)
- Open library of routes (if community interest)

## Potential commercial development 
- Easy Whitelabel version with lockable settings and route(s)
- (Paying) option for zero-hassle 'host my event and route'

## Development

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```
