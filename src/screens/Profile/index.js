import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, Alert, TouchableOpacity, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Item, Input, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import IconI from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

import LoadingScreen from '../../components/LoadingScreen';

const width = Dimensions.get('window').width;

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email_users: '',
      phone_users: '',
      fullname_users: '',
      photo_users: '',
      info_users: '',
      uid_users: '',
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    })
    const { uid } = firebase.auth().currentUser
    const db = firebase.database().ref(`users/${uid}`)
    db.once('value')
      .then(data => {
        const item = data.val()
        this.setState({
          email_users: item.email_users,
          phone_users: item.phone_users,
          fullname_users: item.fullname_users,
          photo_users: item.photo_users,
          info_users: item.info_users,
          uid_users: item.uid_users,
          isLoading: false
        })
      })
      .catch(error => Alert.alert(error.messages))
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  _ChangeProfileImage = async type => {
    const Blob = RNFetchBlob.polyfill.Blob;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      cameraPermission = await this.requestCameraPermission();
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          ToastAndroid.show('You cancelled image picker', ToastAndroid.LONG);
        } else if (response.error) {
          ToastAndroid.show(response.error, ToastAndroid.LONG);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ToastAndroid.show('loading...', ToastAndroid.LONG);
          const imageRef = firebase
            .storage()
            .ref('profilePhotos/' + this.state.uid_users)
            .child('photo');
          imageRef
            .putFile(response.path)
            .then(data => {
              ToastAndroid.show('Upload success', ToastAndroid.LONG);
              firebase
                .database()
                .ref('users/' + this.state.uid_users)
                .update({ photo_users: data.downloadURL });
              this.setState({ photo_users: data.downloadURL });
            })

            .catch(err => console.log(err));
        }
      });
    }
  };


  signOutUser = () => {
    const { uid } = firebase.auth().currentUser
    firebase
      .database()
      .ref('users/' + uid)
      .update({
        online: false,
      })
      .then(response => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.props.navigation.navigate('Login')
            Alert.alert('Goodbye! see yoo soon..')
          })
          .catch(error => {
            Alert.alert(
              'Logout failed!',
              error.messages,
              [
                {
                  text: 'Ok'
                },
              ],
              { cancelable: false }
            );
          })
      })
      .catch(error => {
        Alert.alert(
          'Logout failed!',
          error.messages,
          [
            {
              text: 'Ok'
            },
          ],
          { cancelable: false }
        );
      })
  }

  render() {
    const { email_users, phone_users, fullname_users, photo_users, info_users } = this.state
    if (this.state.isLoading) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        <>
          <View style={styles.root}>
            <View style={styles.containerHeader}>
              <View style={styles.containerMenuHeader}>
                <View style={styles.containerEdit}>
                  <Text style={styles.textTitle}>Profile</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('EditProfile')}>
                    <Icon name="pencil" size={25} color="#F95A37" />
                  </TouchableOpacity>
                </View>
                <View style={styles.containerImage}>
                  <Image source={{ uri: photo_users }} style={{
                    width: '100%', height: '100%', borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40
                  }} />
                  <TouchableOpacity style={styles.editFoto}
                    onPress={this._ChangeProfileImage}>
                    <IconI name="md-camera" size={45} color="#A7BF2E" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.containerBio}>
                <Item stackedLabel>
                  <Label>Username</Label>
                  <Input disabled value={fullname_users} />
                </Item>
                <Item stackedLabel>
                  <Label>Info</Label>
                  <Input disabled value={info_users} />
                </Item>
                <Item stackedLabel>
                  <Label>email</Label>
                  <Input disabled value={email_users} />
                </Item>
                <Item stackedLabel>
                  <Label>Phone Number</Label>
                  <Input disabled value={phone_users} />
                </Item>
              </View>
            </View>
            <View style={styles.containerBody}>
              <TouchableOpacity style={styles.btnLogout}
                onPress={this.signOutUser}>
                <IconA name="logout" size={20} color="#A7BF2E" />
                <Text style={styles.textBtnLogout}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  containerHeader: {
    backgroundColor: '#FAFBED',
    borderWidth: 3,
    borderColor: 'transparent',
    borderBottomColor: '#F95A37',
    borderTopWidth: 0,
    alignItems: 'flex-end'
  },
  containerMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width
  },
  containerEdit: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#A7BF2E',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  containerImage: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: '#A7BF2E',
    backgroundColor: '#2F2D32',
    borderTopWidth: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginRight: 10
  },
  imageProfile: {
    width: undefined,
    height: undefined,
    flex: 1,
    resizeMode: 'contain',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  editFoto: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -6
  },
  containerBio: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    alignItems: 'flex-start'
  },
  textTitle: {
    fontSize: 20,
    color: '#FAFBED',
    fontWeight: 'bold',
    marginTop: 20
  },
  containerBody: {
    flex: 1
  },
  btnLogout: {
    width: width / 4,
    height: 50,
    backgroundColor: '#F95A37',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 10
  },
  textBtnLogout: {
    fontSize: 16,
    color: '#FAFBED'
  }
});

export default Profile;
