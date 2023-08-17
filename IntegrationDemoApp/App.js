import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IAdvizeSDK, { LogLevel } from '@iadvize-oss/iadvize-react-native-sdk';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

// iAdvize SDK configuration
const idzConfig = {
  logLevel: LogLevel.VERBOSE,
  projectId: -1, // TODO Replace with your project id
  userId: "user-unique-identifier", // TODO Replace with relevant user id
  gdprUrl: "http://dummy.url/gdpr", // TODO Replace with your own GDPR URL
};

export default function App() {
  const [isSDKActivated, setIsSDKActivated] = useState(false);

  const ActivationLabel = () => {
    if (isSDKActivated) {
      return <Text>iAdvize SDK is activated!</Text>;
    } else {
      return <Text>iAdvize SDK is disabled.</Text>;
    }
  };

  const activateSDK = async () => {
    try {
      await IAdvizeSDK.activate(idzConfig.projectId, idzConfig.userId, idzConfig.gdprUrl);
      setIsSDKActivated(true);
    } catch (e) {
      console.error(e);
      setIsSDKActivated(false);
    }
  };

  useEffect(() => {
    // Set iAdvize SDK log level to verbose
    IAdvizeSDK.setLogLevel(idzConfig.logLevel);

    if (!isSDKActivated) {
      // Activate iAdvize SDK
      activateSDK();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivationLabel />
    </View>
  );
}
