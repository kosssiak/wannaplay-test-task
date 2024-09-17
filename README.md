# Test task for WannaPlay (Match-3 Playable Ad)

## Project Description

This project consists of two main directories:

- **builder** — contains scripts and logic for building the project.
- **playable** — contains the playable that can be run in development mode or built for production.

## Installation

To run the project properly, you need to install dependencies in both directories:

1. Navigate to the `builder` directory and run the following command:

   npm install

2. Navigate to the `playable` directory and run the following command:

   npm install

## Scripts

1. Launches the playable in development mode:

   npm run dev

   The project will be available at: localhost:8080.

2. Builds the playable for production:

   npm run build

   Builds are saved in playable/builds.

3. Loads necessary playable assets:

   npm run assets

   All assets are located in playable/src/img.