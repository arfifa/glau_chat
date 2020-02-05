import React, { Component } from 'react';
import { View, Image, StatusBar, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';


class SplashScreen extends Component {
  async componentDidMount() {
    try {
      const { currentUser } = firebase.auth()
      if (currentUser === null) {
        setTimeout(() => {
          this.props.navigation.navigate('Login')
        }, 3000)
      } else {
        const { uid } = currentUser
        firebase
          .database()
          .ref('users/' + uid)
          .update({
            online: true,
          })
          .then(data => {
            setTimeout(() => {
              this.props.navigation.navigate('Home')
            }, 3000)
          })
          .catch(error => {
            Alert.alert(error.message)
          })
      }
    } catch ({ message }) {
      Alert.alert(
        'Unauthorized',
        'You must be login!',
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      )
      setTimeout(() => {
        this.props.navigation.navigate('Login')
      }, 3000)
    }
  }

  render() {
    return (
      <>
        <StatusBar hidden />
        <LinearGradient colors={['#A7BF2E', '#DCE9A3', '#FAFBED']} style={styles.root}>
          <View style={styles.containerImage}>
            <Image source={require('../../assets/images/logo/GlauChat.png')}
              style={styles.logoImage}
            />
          </View>
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
  containerImage: {
    width: 250,
    height: 100,
    borderWidth: 1,
    borderColor: '#A7BF2E',
    borderRadius: 300,
    backgroundColor: '#FAFBED'
  },
  logoImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderRadius: 20,
    resizeMode: 'contain',
  }
});

export default SplashScreen;
