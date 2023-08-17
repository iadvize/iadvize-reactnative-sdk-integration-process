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

#### Step 4.2 - Configure Android

The latest iAdvize Android SDK is compiled using Android API 33, you will need to modify the Android configuration.
First in the project-level `android/build.gradle` file, update the `buildscript > ext` block to:

```
$ android/build.gradle

buildscript {
  ext {
    buildToolsVersion = "33.0.2"
    minSdkVersion = 21
    compileSdkVersion = 33
    targetSdkVersion = 33
    ndkVersion = "21.4.7075529"
  }
  ...
}
```

As of Android 12 the `exported` attribute must be explicitly declared in the `AndroidManifest.xml`:

```
$ android/app/src/main/AndroidManifest.xml

  <activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
    android:launchMode="singleTask"
    android:exported="true" // Add this line
    android:windowSoftInputMode="adjustResize">

    ...
```

#### Step 4.3 - Setup Kotlin

The latest iAdvize Android SDK is compiled with Java 17 and uses Kotlin `1.8.21`. To use it and avoid conflicts between the Kotlin versions used in the ReactNative dependencies, you will need to modify the Android configuration.

First in the project-level `android/build.gradle` file, add the kotlin version in the `buildscript > ext` block:

```
$ android/build.gradle

buildscript {
  ext {
    buildToolsVersion = "33.0.2"
    minSdkVersion = 21
    compileSdkVersion = 33
    targetSdkVersion = 33
    ndkVersion = "21.4.7075529"
    kotlinVersion = '1.8.21' // Add this line
  }
  ...
}
```

Add the Kotlin gradle plugin in the `buildscript > dependencies` block:

```
$ android/build.gradle

buildscript {
  ...
  dependencies {
    classpath("com.android.tools.build:gradle:7.0.0") // Modify the version to 7+
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion") // Add this line
  }
}
```

Then in the module-level `android/app/build.gradle` activate the Kotlin plugin at the top of the file:

```
$ android/app/build.gradle

apply plugin: "com.android.application"
apply plugin: "com.facebook.react"
// Add this line
apply plugin: "kotlin-android"
```

Add the Kotlin dependency in the `dependencies` block:

```
$ android/app/build.gradle

dependencies {
  // Add this line
  implementation("org.jetbrains.kotlin:kotlin-stdlib:$kotlinVersion")

  ...
}
```

#### Step 4.4 - Initiate the SDK

On Android, the iAdvize SDK needs to be initiated during the app startup to allow several functionnalities to work. 
Thus you need to add those lines in `android/app/src/main/java/com/integrationdemoapp/MainApplication.java` to initialize the SDK properly:

```
$ android/app/src/main/java/com/integrationdemoapp/MainApplication.java

// Add this line
import com.iadvize.conversation.sdk.IAdvizeSDK;

public class MainApplication extends Application implements ReactApplication {

  ...

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    // Add this line
    IAdvizeSDK.initiate(this);
  }

  ...
}
```

### Step 5 - Activate the SDK

Add the IAdvize SDK import statement:

```
$ App.js

import IAdvizeSDK, {
  LogLevel
} from '@iadvize-oss/iadvize-react-native-sdk';
```

Then you can activate using the relevant API:

```
$ App.tsx

IAdvizeSDK.activate(projectId, userId, gdprUrl);
```

### Step 6 - Trigger engagement

Add the ConversationChannel import statement:

```
$ App.js

import IAdvizeSDK, { LogLevel, ConversationChannel } from '@iadvize-oss/iadvize-react-native-sdk';
```

Then you can engage the visitor using the relevant API:

```
$ App.js

IAdvizeSDK.setLanguage("targetingLanguage");
IAdvizeSDK.activateTargetingRule("targetingRuleId", ConversationChannel.CHAT);
```

This will display the Default Floating Button that leads to the Chatbox.
