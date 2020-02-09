import React, { Component } from 'react'
import {
  View, StatusBar, StyleSheet, Dimensions, Text, Alert
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Item, Input } from 'native-base';
import firebase from 'react-native-firebase';

import LoadingScreen from '../../components/LoadingScreen';

const height = Dimensions.get('window').height / 1.2;
const width = Dimensions.get('window').width;

class AddContact extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      emailFriend: "",
      uid: ''
    }
    // this.handleSearch = this.handleSearch.bind(this);
    // this.send = this.send.bind(this);
  }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    this.setState({
      uid
    })
  }

  handleSearch = () => {
    const { emailFriend, uid, } = this.state;
    let rootRef = firebase.database().ref();
    rootRef
      .child('users')
      .orderByChild('email_users')
      .equalTo(emailFriend)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          let userData = snapshot.val();
          console.log(userData);

          let idFriend;
          for (const key in userData) {
            idFriend = key;
          }
          if (idFriend === uid) {
            Alert.alert('You cant add yourself');
          }
          const db = firebase.database();
          db.ref('users/' + uid)
            .child('contacts_users')
            .orderByChild('idFriend')
            .equalTo(idFriend)
            .once('value')
            .then(snapshot => {
              const data = snapshot.val();
              if (data === null) {
                this.send(uid, idFriend, userData);
                Alert.alert(
                  'User found',
                  'This user will add to your contacts',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => {
                        this.props.navigation.goBack();
                      },
                    },
                  ],
                  { cancelable: false },
                );
              }
              for (const key in data) {
                if (data[key].idFriend) {
                  Alert.alert(email + ' already exist in your contact');
                }
              }
            });
        } else {
          Alert.alert('email not found');
        }
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <LoadingScreen />
      )
    } else {
      return (
        <>
          <StatusBar hidden />
          <View style={styles.root}>
            <View style={styles.container}>
              <View style={styles.containerBackSearch} />
              <View style={styles.containerSearch}>
                <Text style={styles.textSearch}>ADD CONTACT</Text>
                <Item>
                  <Input
                    placeholder="email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email} />
                </Item>
                <TouchableOpacity style={styles.btnSearch}
                  onPress={this.signUpButtonPress}>
                  <Text style={styles.textBtnSearch}>Search</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2F2D32'
  },
  container: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    position: 'relative',
  },
  containerBackSearch: {
    width: '75%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#88838F'
  },
  containerSearch: {
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
  textSearch: {
    fontSize: 20,
    color: '#2F2D32',
    fontWeight: 'bold'
  },
  btnSearch: {
    width: 150,
    height: 45,
    backgroundColor: '#A7BF2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: '#FAFBED',
    borderWidth: 1,
    marginTop: 20
  },
  textBtnSearch: {
    color: '#FAFBED',
    fontWeight: 'bold'
  }
});

export default AddContact;
