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

#### Step 3.3 - Enable Swift Library Evolution support

Add this step inside the `post_install` hook at the end of the `Podfile` to enable Swift Library Evolution:

```
# ios/Podfile

post_install do |installer|
  react_native_post_install(
    installer,
    # Set `mac_catalyst_enabled` to `true` in order to apply patches
    # necessary for Mac Catalyst builds
    :mac_catalyst_enabled => false
  )
  __apply_Xcode_12_5_M1_post_install_workaround(installer)

  # Add those lines
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'
    end
  end
end
```

Library evolution support allows developers of binary frameworks to make additive changes to the API of their framework while remaining binary compatible with previous versions.

#### Step 3.4 - Download native iOS SDK pod

Once this is done, is it possible to download the iOS dependency pod:

```
cd ios
pod install
cd ..
```

#### Step 3.5 - Add microphone and camera permissions

Since the version 2.5.0, the iAdvize iOS SDK supports video conversations. Thus it will request camera and microphone access before entering a video call. To prevent the app from crashing at this stage, you have to setup two keys in your app `Info.plist`:

```
# ios/IntegrationDemoApp/Info.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    ...
    <key>NSCameraUsageDescription</key>
    <string>This application will use the camera to share photos and during video calls.</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>This application will use the microphone during video calls.</string>
  </dict>
</plist>
```

### Step 4 - Configure Android project

#### Step 4.1 - Add Android SDK dependency repository

The iAdvize Android SDK is hosted on GitHub, this repository should be declared in the Android app in order for it to find the SDK artifacts:

```
# android/build.gradle

// Add those lines after the `buildscript` block
allprojects {
  repositories {
    maven { url "https://raw.github.com/iadvize/iadvize-android-sdk/master" }
    maven { url "https://jitpack.io" }
  }
}
```
