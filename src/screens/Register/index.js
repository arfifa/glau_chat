import React, { Component } from 'react'
import {
  View, Image, StatusBar, StyleSheet, Dimensions, Text, Alert, PermissionsAndroid, ToastAndroid
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Item, Input } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import Geolocation from 'react-native-geolocation-service';

import LoadingScreen from '../../components/LoadingScreen';

const height = Dimensions.get('window').height / 1.2;
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

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fullname: null,
      email: null,
      password: null,
      confirmPassword: null,
      latitude: null,
      longitude: null,
      errorMessage: null,
      isLoading: false
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

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  signUpButtonPress = () => {
    const { email, password, fullname, confirmPassword, longitude, latitude } = this.state
    if (email && password && fullname && confirmPassword != null) {
      if (password === confirmPassword && longitude != null && latitude != null) {
        this.setState({ isLoading: true })
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(user => {
            const uid = user.user.uid;
            const email = user.user.email;

            firebase.database().ref('users/' + uid)
              .set({
                uid_users: uid,
                fullname_users: fullname,
                email_users: email,
                photo_users: "https://firebasestorage.googleapis.com/v0/b/glauchat.appspot.com/o/profilePhotos%2FdefaultProfile.jpg?alt=media&token=4255ac80-5fc5-4df2-b6f5-68c23b5d584c",
                phone_users: '',
                info_users: '',
                latitude: latitude,
                longitude: longitude
              })
          })
          .then(data => {
            this.clearState()
            this.setState({ isLoading: false })
            Alert.alert(
              'Success',
              'Please login with email and password!',
              [
                {
                  text: 'Ok',
                  onPress: () => this.props.navigation.navigate('Login')
                },
              ],
              { cancelable: false },
            );
          })
          .catch(error => {
            alert(error);
            this.setState({
              isLoading: false
            })
          })
          .catch(error => {
            Alert.alert(error.message)
            this.setState({
              isLoading: false
            })
          })
      } else if (password !== confirmPassword) {
        Alert.alert("Password and Confirm password don't match")
      } else {
        Alert.alert("Please turn on your location!")
        this.componentDidMount()
      }
    } else {
      Alert.alert("All form data must be filled!")
    }
  }

  clearState() {
    this.setState({
      fullname: null,
      email: null,
      password: null,
      confirmPassword: null,
      latitude: null,
      longitude: null
    })
  }

  render() {
    firebase.analytics().logEvent('openAppSignUp')
    if (this.state.isLoading) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        <>
          <StatusBar hidden />
          <LinearGradient colors={['#DCE9A3', '#A7BF2E', '#3E3C42', '#2F2D32']} style={styles.root}>
            <Toast
              visible={this.state.visible}
              message={this.state.errorMessage}
            />
            <View style={styles.container}>
              <View style={styles.containerBackRegister} />
              <View style={styles.containerRegister}>
                <View style={styles.containerImage}>
                  <Image source={require('../../assets/images/logo/GlauChat.png')}
                    style={styles.logoImage}
                  />
                </View>
                <Text style={styles.textRegister}>REGISTER</Text>
                <Item>
                  <Input
                    placeholder="Fullname"
                    onChangeText={fullname => this.setState({ fullname })}
                    value={this.state.fullname} />
                </Item>
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
                <Item last>
                  <Input
                    placeholder="Confirm password"
                    secureTextEntry
                    onChangeText={confirmPassword => this.setState({ confirmPassword })}
                    value={this.state.confirmPassword} />
                </Item>
                <TouchableOpacity style={styles.linkHaveAccount}
                  onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styles.textHaveAccount}>Have Account?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRegister}
                  onPress={this.signUpButtonPress}>
                  <Text style={styles.textBtnRegister}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    position: 'relative',
  },
  containerBackRegister: {
    width: '75%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#88838F'
  },
  containerRegister: {
    width: '80%',
    height: '100%',
    top: -10,
    borderRadius: 10,
    backgroundColor: '#E8E7E9',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  textRegister: {
    fontSize: 20,
    color: '#2F2D32',
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
  linkHaveAccount: {
    marginVertical: 20
  },
  textHaveAccount: {
    color: '#0064D2'
  },
  btnRegister: {
    width: 150,
    height: 45,
    backgroundColor: '#A7BF2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: '#FAFBED',
    borderWidth: 1
  },
  textBtnRegister: {
    color: '#FAFBED',
    fontWeight: 'bold'
  }
});

export default Register;

