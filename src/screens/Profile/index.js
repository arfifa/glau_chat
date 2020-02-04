import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Item, Input, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/AntDesign';
import firebase from 'react-native-firebase';

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
      isLoading: false
    };
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
          isLoading: false
        })
      })
      .catch(error => Alert.alert(error.messages))
  }


  signOutUser = () => {
    const { uid } = firebase.auth().currentUser
    firebase
      .database()
      .ref('users/' + uid)
      .update({
        online: "false",
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
