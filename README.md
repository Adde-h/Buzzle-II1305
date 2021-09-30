# ICT2021-Z-boson
## Complete Challenge Feature Branch

# Setting up environment
1. Download node: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. Install Expo CLI
`npm install -g expo-cli` or `yarn global add expo-cli`
3. Run app
`cd ChallengeApp`
`expo start`

# Structure
- ./src/components/atoms: Smallest possible components such as buttons, titles, fonts, animations, etc.
- ./src/components/molecules: Composition of one or more atoms
- ./src/components/organisms: Combination of molecules/atoms that work together and form more elaborate interfaces

- ./src/scenes/: Related screens are put in separate folders under scenes
- ./src/navigations/: Here we put the navigation interfaces

- ./src/styles: Shared styles
- ./src/utils: Shared utils  

# Add screen
1. Add a folder under ./src/scenes/ for the scene
2. Add an index.js file in the new folder
3. Add key and functionname to appropriate navigator under ./src/navigators/