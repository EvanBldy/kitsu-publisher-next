[![Kitsu](https://www.cg-wire.com/en/images/kitsu.png)](https://kitsu.cg-wire.com)

# Kitsu Publisher, send your files right from your DCC

Kitsu is a web application to share the progress of your productions and
validate your deliveries. It improves the communication between all stakeholders.
Which leads to better pictures, shipped faster.

The Kitsu Publisher is a desktop application that connects DCC Tools to Kitsu.
Through it, your artists can see their todo list, comment tasks and send previews to Kitsu
directly from their tools.

[![Build
badge](https://travis-ci.com/cgwire/kitsu-publisher-next.svg?branch=master)](https://travis-ci.com/cgwire/kitsu-publisher-next)

## DCCs status

Started development:

- Blender
- Toonboom Harmony

Planned:

- Unreal Engine

## Documentation

To develop or to build the Electron app you need [Node.js](https://nodejs.org/en/)>=16.11 installed.

To install all the dependencies needed by the Electron app you have to run in the project folder:

```console
npm install
```

### Development environment

To run the Electron app in development mode you have to run an npm script:

```console
npm run dev
```

### Build the electron app

#### Requirements

- On debian based Linux you need:

  - To install these packages:

    ```console
    sudo apt-get install build-essential libcairo2-dev libpango1.0-dev \
    libjpeg-dev libgif-dev librsvg2-dev
    ```

  - If you want to build specific target like rpm you need to install:

    ```console
    sudo apt-get install rpm
    ```

- On Windows you need:

  - coming soon

- On macOS you need:

  - coming soon

#### Building the app

You need to run npm scripts:

- If you only want to build an unpackaged directory:

  ```console
  npm run build
  ```

- If you want to build for all targets:

  ```console
  npm run build:all
  ```

## Contributing

As any open source project, we enjoy any contribution! You will find below
how you can help the Kitsu project to get better.

### Bug reports

All bugs must be submitted directly in
[the issue page](https://github.com/cgwire/kitsu-publisher-next/issues) of this repository.

### Feature requests

Feature requests must be posted on our [Canny page](https://cgwire.canny.io/).

### Translations

If you want to contribute to translations, you can connect directly to the
[POEditor platform](https://poeditor.com/join/project?hash=fpUejpWDVo).

### Code

All contributions are welcomed as long as they respect the [C4
contract](https://rfc.zeromq.org/spec:42/C4).

The Kitsu publisher code is written with Javascript (ES6) and is based on the
[Electron](https://www.electronjs.org/) and the
[VueJS](https://vuejs.org/v2/guide/) framework extended with the
[Vuex](https://vuex.vuejs.org) plugin.

## About authors

Kitsu Publisher is written by CGWire, a company based in France. We help teams of animation
studios to collaborate better. We provide tools to more than 50 studios spread
all around the world.

On the technical side, we apply software craftmanship principles as much as
possible. We love coding and consider that strong quality and good developer
experience matter a lot.

Visit [cg-wire.com](https://cg-wire.com) for more information.

[![CGWire Logo](https://zou.cg-wire.com/cgwire.png)](https://cg-wire.com)
