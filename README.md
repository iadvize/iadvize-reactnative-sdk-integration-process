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

#### Step 3.2 - Add microphone and camera permissions

Since the version 2.5.0, the iAdvize iOS SDK supports video conversations. Thus it will request camera and microphone access before entering a video call. To prevent the app from crashing at this stage, you have to setup two keys in your app `Info.plist`:

```
$ ios/IntegrationDemoApp/Info.plist

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

#### Step 3.3 - Download native iOS SDK pod

Once this is done, is it possible to download the iOS dependency pod:

```
cd ios
pod install
cd ..
```

### Step 4 - Configure Android project

#### Step 4.1 - Add Android SDK dependency repository

The iAdvize Android SDK is hosted on GitHub, this repository should be declared in the Android app in order for it to find the SDK artifacts:

```
$ android/build.gradle

allprojects {
  repositories {
    ...

    // Add this line
    maven { url "https://raw.github.com/iadvize/iadvize-android-sdk/master" }
  }
}
```

#### Step 4.2 - Configure Gradle

ReactNative 0.66 uses Gradle 6.9 but the iAdvize Android SDK needs Gradle 7 or newer.

First of all configure the gradle wrapper to use Gradle 7:

```
$ android/gradle/wrapper/gradle-wrapper.properties

distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.3-all.zip // Modify this line
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

Then you can update the Gradle Android plugin to a higher version :

```
$ android/build.gradle

buildscript {
  ...
  dependencies {
    classpath("com.android.tools.build:gradle:7.0.0") // Modify this line
  }
}
```

Update the Gradle properties:

```
$ android/gradle.properties

org.gradle.caching=true
org.gradle.daemon=true
org.gradle.jvmargs=-Xms1024m -Xmx4096m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseParallelGC
org.gradle.parallel=true
kotlin.code.style=official
android.nonTransitiveRClass=false
```
