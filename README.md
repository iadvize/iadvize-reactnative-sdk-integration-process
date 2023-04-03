# iAdvize SDK ReactNative Plugin integration

This repository goal is to demonstrate the integration process of the iAdvize React Native SDK.
Each commit corresponds to an integration step and is described below.

## Prerequisites

```
brew install node
brew install watchman
brew install ruby
brew install rbenv
rbenv install 2.7.6
```

- Xcode (14.2) + Simulator + CocoaPods (> 1.9)
- Android Studio (Electric Eel | 2022.1.1 Patch 1) + Android SDK (33) + Emulator

## Steps

### Step 1 - Create ReactNative project

To install the ReactNative boilerplate code, run the following command:

```
npx react-native@latest init IntegrationDemoApp
```

This will create a `IntegrationDemoApp` folder containing the ReactNative project.
The React & ReactNative versions used in this case are:

```
"dependencies": {
  "react": "18.2.0",
  "react-native": "0.71.5"
}
```

For the rest of this guide, the root folder for all commands will be the `IntegrationDemoApp` repository so navigate to this folder:

```
cd IntegrationDemoApp
```

To launch the app on a device:

```
# Start the Metro server
npx react-native start

# Then run the app on iOS...
npx react-native run-ios

# ... or Android
npx react-native run-android
```
