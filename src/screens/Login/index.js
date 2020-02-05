import React, { Component } from 'react'
import {
  View, Image, StatusBar, StyleSheet, Dimensions, Text, Alert, ToastAndroid, PermissionsAndroid
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Item, Input } from 'native-base';
import firebase from 'react-native-firebase';
import Geolocation from 'react-native-geolocation-service';

const height = Dimensions.get('window').height / 3.10;
const width = Dimensions.get('window').width;

const Toast = props => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      1,
      800,
    );
    return null;
  }
  return null;
};

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      latitude: null,
      longitude: null,
      errorMessage: null
    }
  }

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            this.setState({ latitude, longitude });
          },
          error => {
            this.setState(
              {
                errorMessage: 'Check your GPS',
                visible: true,
              },
              () => {
                this.hideToast();
              },
            );
            return;
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              this.setState({ latitude, longitude });
            },
            error => {
              this.setState(
                {
                  errorMessage: 'Check your GPS',
                  visible: true,
                },
                () => {
                  this.hideToast();
                },
              );
              return;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          this.setState(
            {
              errorMessage: 'location denied',
              visible: true,
            },
            () => {
              this.hideToast();
            },
          );
          return;
        }
      }
    } catch (err) {
      this.setState(
        {
          errorMessage: err,
          visible: true,
        },
        () => {
          this.hideToast();
        },
      );
      return;
    }
  }

  loginPress = () => {
    const { email, password, longitude, latitude } = this.state
    if (email && password !== null) {
      if (longitude !== null && latitude !== null) {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(response => {
            firebase
              .database()
              .ref('users/' + response.user.uid)
              .update({
                online: true,
                latitude: this.state.latitude,
                longitude: this.state.longitude
              });
            Alert.alert(
              'Success',
              'Welcome to GlauChat',
              [
                {
                  text: 'Ok',
                  onPress: () => this.props.navigation.navigate('Home'),
                },
              ],
              { cancelable: false },
            );
          })
          .catch(error => {
            this.setState({ errorMessage: error.message })
            Alert.alert(error.message)
          })
      } else {
        Alert.alert("Please turn on your location!")
        this.componentDidMount()
      }
    } else {
      Alert.alert("Email and password must be filled!")
    }
  }

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    firebase.analytics().logEvent('openAppLogin');
    return (
      <>
        <StatusBar hidden />
        <View style={styles.root}>
          <View style={styles.containerLogo}>
            <Toast
              visible={this.state.visible}
              message={this.state.errorMessage}
            />
            <View style={styles.containerImage}>
              <Image source={require('../../assets/images/logo/GlauChat.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.textLogin}>LOGIN</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.containerBackLogin} />
            <View style={styles.containerLogin}>
              <Item>
                <Input
                  placeholder="email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email} />
              </Item>
              <Item>
                <Input
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password} />
              </Item>
              <TouchableOpacity style={styles.linkCreateAccount}
                onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={styles.textCreateAccount}>Create Account?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnLogin}
                onPress={this.loginPress}>
                <Text style={styles.textBtnLogin}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#2F2D32',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerLogo: {
    width: '80%',
    position: 'absolute',
    top: 0,
    height: height,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  textLogin: {
    fontSize: 20,
    color: '#FAFBED',
    fontWeight: 'bold'
  },
  containerImage: {
    width: 160,
    height: 80,
    borderWidth: 1,
    borderColor: '#A7BF2E',
    borderRadius: 100,
    backgroundColor: '#F95A37',
    marginBottom: 20
  },
  logoImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  container: {
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: height,
    position: 'relative'
  },
  containerBackLogin: {
    width: '75%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#88838F'
  },
  containerLogin: {
    width: '80%',
    height: '100%',
    top: -8,
    borderRadius: 10,
    backgroundColor: '#E8E7E9',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 30
  },
  linkCreateAccount: {
    marginVertical: 20
  },
  textCreateAccount: {
    color: '#0064D2'
  },
  btnLogin: {
    width: 150,
    height: 45,
    backgroundColor: '#A7BF2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: '#FAFBED',
    borderWidth: 1
  },
  textBtnLogin: {
    color: '#FAFBED',
    fontWeight: 'bold'
  },
  boxMessage: {
    height: 100,
    width: '100%',
    backgroundColor: 'pink'
  }
});

export default Login;
