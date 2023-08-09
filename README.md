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
- Android Studio (Giraffe | 2022.3.1) + Android SDK (33) + Emulator

## Steps

### Step 1 - Create ReactNative project

To install the ReactNative boilerplate code, run the following command:

```
npx react-native@0.66.5 init IntegrationDemoApp --version 0.66.5
```

This will create a `IntegrationDemoApp` folder containing the ReactNative project.
The React & ReactNative versions used in this case are:

```
"dependencies": {
  "react": "17.0.2",
  "react-native": "0.66.5"
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

### Step 2 - Add the SDK ReactNative plugin

To integrate the iAdvize SDK ReactNative Plugin inside the demo project, run the following command:

```
npm install @iadvize-oss/iadvize-react-native-sdk
```

This will add the dependency inside the `package.json` file

```
$ package.json

"dependencies": {
  "@iadvize-oss/iadvize-react-native-sdk": "^3.3.0",
  "react": "18.2.0",
  "react-native": "0.71.5"
},
```

### Step 3 - Configure iOS project

#### Step 3.1 - Update minimum supported platform

The iAdvize iOS SDK support down to iOS 13 so this minimum supported platform must be set into the `Podfile`:

```
$ ios/Podfile

# Update this lines
platform :ios, '13.0'
```
