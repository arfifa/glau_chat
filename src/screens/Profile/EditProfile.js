import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, Alert, TouchableOpacity, ToastAndroid } from 'react-native'
import { Item, Input, Label, Form } from 'native-base';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';
import LoadingScreen from '../../components/LoadingScreen';

const height = Dimensions.get('window').height / 1.7;
const width = Dimensions.get('window').width;

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone_users: '',
      fullname_users: '',
      info_users: '',
      uidUsers: null,
      isLoading: false,
      permissionsGranted: null,
      updatesEnabled: false
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
          phone_users: item.phone_users,
          fullname_users: item.fullname_users,
          info_users: item.info_users,
          isLoading: false
        })
      })
      .catch(error => Alert.alert(error.messages))
  }

  handleEdit = () => {
    const { fullname_users, phone_users, info_users } = this.state;
    this.setState({
      isLoading: true
    })
    if (fullname_users === '') {
      ToastAndroid.show('Fullname must be fiiled!', ToastAndroid.LONG);
    } else {
      const { uid } = firebase.auth().currentUser
      Alert.alert(
        'Submit form?',
        'Your data will change',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              firebase
                .database()
                .ref('users/' + uid)
                .update({
                  fullname_users,
                  phone_users,
                  info_users
                })
                .then(data => {
                  this.setState({
                    isLoading: false
                  })
                  Alert.alert(
                    'Data successfully changed!',
                    '',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          this.props.navigation.replace('Profile')
                        }
                      },
                    ],
                    { cancelable: false },
                  );
                })
                .catch(error => {
                  this.setState({
                    isLoading: false
                  })
                  Alert.alert(
                    "No data changed",
                    error.messages)
                });
            }
          },
        ],
        { cancelable: false },
      );
    }
  };

  render() {
    const { fullname_users, phone_users, info_users } = this.state
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
                <View style={styles.containerTitle}>
                  <Text style={styles.textTitle}>EditProfile</Text>
                </View>
              </View>
              <View style={styles.containerBio}>
                <Form>

                  <Item stackedLabel>
                    <Label>Fullname</Label>
                    <Input
                      type="text"
                      value={fullname_users}
                      autoFocus
                      onChangeText={fullname_users =>
                        this.setState({
                          fullname_users
                        })
                      } />
                  </Item>
                  <Item stackedLabel>
                    <Label>Info</Label>
                    <Input
                      type="text"
                      value={info_users}
                      onChangeText={info_users =>
                        this.setState({
                          info_users
                        })
                      } />
                  </Item>
                  <Item stackedLabel>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      value={phone_users}
                      keyboardType="number-pad"
                      maxLength={13}
                      onChangeText={phone_users =>
                        this.setState({
                          phone_users
                        })
                      } />
                  </Item>
                </Form>
              </View>
            </View>
            <View style={styles.containerBody}>
              <TouchableOpacity style={styles.btnSave}
                onPress={this.handleEdit}>
                <IconF5 name="smile-wink" size={25} color="#F95A37" />
                <Text style={styles.textBtnSave}>Save</Text>
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
    height: height,
    borderWidth: 3,
    borderColor: 'transparent',
    borderBottomColor: '#F95A37',
    borderTopWidth: 0,
    alignItems: 'flex-end'
  },
  containerMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: width
  },
  containerTitle: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginLeft: 10,
    backgroundColor: '#F95A37',
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
    marginTop: 20
  },
  textTitle: {
    fontSize: 20,
    color: '#FAFBED',
    fontWeight: 'bold'
  },
  containerBody: {
    flex: 1
  },
  btnSave: {
    width: width / 4,
    height: 50,
    backgroundColor: '#A7BF2E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 10
  },
  textBtnSave: {
    fontSize: 16,
    color: '#FAFBED'
  }
});

export default EditProfile;
