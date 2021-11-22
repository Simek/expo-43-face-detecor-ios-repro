import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { FaceDetectorMode, FaceDetectorLandmarks, FaceDetectorClassifications } from 'expo-face-detector';

const App = () => {
  const [faces, setFaces] = useState([]);
  const [hasPermission, setPermission] = useState(false);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status === 'granted');
  };

  if (!hasPermission) return <Text>Camera permission not granted.</Text>;

  return (
    <>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        faceDetectorSettings={{
          mode: FaceDetectorMode.accurate,
          detectLandmarks: FaceDetectorLandmarks.none,
          runClassifications: FaceDetectorClassifications.none,
          minDetectionInterval: 1000 / 5,
          tracking: true,
        }}
        onFacesDetected={({ faces }) => {
          setFaces(faces);
        }}
      />
      {faces.map(({ bounds: { size, origin } }, i) => (
        <View
          key={i}
          style={[{
            width: size.width,
            height: size.height,
            left: origin.x,
            top: origin.y,
          }, styles.faceMark]} />
        ))}
      <Text style={styles.paragraph}>Faces detected: {faces.length}</Text>
  </>);
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  paragraph: {
    color: '#fff',
    position: 'absolute',
    fontSize: 18,
    bottom: 80,
    alignSelf: 'center'
  },
  faceMark: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#89ff00',
    borderStyle: 'solid',
    zIndex: 9,
  }
});

export default App;
