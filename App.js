import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, StatusBar, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState('049000067316')
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('...Loading');

  // Request API
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'd5a9107caamsh123572a81b3a3b1p1f68a9jsn59b2f9b4d19e',
        'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com'
      }
    };
    
    fetch('https://barcodes1.p.rapidapi.com/?query=' + parseInt(barcode), options)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        setTitle(responseJson['product']['title'])
        setBarcode(responseJson['product']['barcode_formats']['ean_13'])
        setImage(responseJson['product']['images'][0])
      })
      .catch(err => console.error(err));
  }, [barcode]);



  // Scanning part
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode(data)
    console.log('Type: ' + type + '\nData: ' + data)
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      
      <Text style={styles.maintext}>{barcode}</Text>

      {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}

      {/* Showing product */}
      <View style={styles.container}>
        <View>
          <Text style={{margin:10, fontSize:16}}>Product:</Text>
          <Text style={{margin:10, fontSize:22}}>{title}</Text>
          <Image source={{uri: image, width: 100, height: 100,}}></Image>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  }
});