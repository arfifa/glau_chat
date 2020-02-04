import React, { Component } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Spinner } from 'native-base';

class LoadingScreen extends Component {
  render() {
    return (
      <>
        <StatusBar backgroundColor="#2F2D32" />
        <LinearGradient colors={['#A7BF2E', '#DCE9A3', '#FAFBED']} style={styles.root}>
          <Spinner color="#F95A37" />
        </LinearGradient>
      </>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#2F2D32',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default LoadingScreen;
