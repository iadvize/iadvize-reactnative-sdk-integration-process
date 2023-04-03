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

### Step 2 - Add the SDK ReactNative plugin

To integrate the iAdvize SDK ReactNative Plugin inside the demo project, run the following command:

```
npm install @iadvize-oss/iadvize-react-native-sdk
```

This will add the dependency inside the `package.json` file

```
# package.json

"dependencies": {
  "@iadvize-oss/iadvize-react-native-sdk": "^3.1.1",
  "react": "18.2.0",
  "react-native": "0.71.5"
},
```

### Step 3 - Configure iOS project

There are multiple ways to configure a ReactNative project, for simplicity this guide will simply hardcode the configuration, please note that you can use a configuration plugin using environment variables (like `react-native-config` or `react-native-dotenv`).

#### Step 3.1 - Add use_frameworks! directive

The iAdvize iOS SDK is delivered as a binary framework (in an XCFramework bundle), which is a standard way of distributing closed-source binaries. ReactNative is using the CocoaPods package manager and in order for it to work with binary frameworks, the directive `use_frameworks!` must be added in the `Podfile`:

```
# ios/Podfile

# Comment those lines
linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

# And add this one
use_frameworks!
```

If you are using an environment variable plugin you should be able to set the same behavior by adding the following line in your `.env` file:

```
# .env

USE_FRAMEWORKS='dynamic'
```

#### Step 3.2 - Disable Hermes & Flipper

Hermes and Flipper are not compatible (or at least unstable) when using `use_frameworks!` on iOS. Thus they need to be disabled:

```
# ios/Podfile

target 'IntegrationDemoApp' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :hermes_enabled => false,
    :flipper_configuration => FlipperConfiguration.disabled,

    ...
  )
  ...
end
```

If you are using an environment variable plugin you should be able to set the same behavior by adding the following line in your `.env` file:

```
# .env

RCT_NEW_ARCH_ENABLED=0
USE_HERMES=0
NO_FLIPPER=1
```
