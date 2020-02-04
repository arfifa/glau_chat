import React, { Component } from 'react'
import { View, Image, StatusBar, StyleSheet, Dimensions, Text, Alert } from 'react-native'
import { TouchableOpacity, ScrollView, TextInput } from 'react-native-gesture-handler';
import { Item, Input, Button, Label, ListItem } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';

const height = Dimensions.get('window').height / 1.7;
const width = Dimensions.get('window').width;

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ email: currentUser.email })
  }
  render() {
    const { email } = this.state
    return (
      <>
        <View style={styles.root}>
          <View style={styles.containerHeader}>
            <View style={styles.containerMenuHeader}>
              <View style={styles.containerTitle}>
                <Text style={styles.textTitle}>EditProfile</Text>
              </View>
              <View style={styles.containerImage}>
                <Image source={require('../../assets/images/dummy/profile.jpg')} style={styles.imageProfile} />
              </View>
            </View>
            <View style={styles.containerBio}>
              <Item stackedLabel>
                <Label>Username</Label>
                <Input
                  value="Arfifa Rahman" />
              </Item>
              <Item stackedLabel>
                <Label>Info</Label>
                <Input
                  value="Fighting, figting, figting..." />
              </Item>
              <Item stackedLabel>
                <Label>email</Label>
                <Input
                  value={email} />
              </Item>
            </View>
          </View>
          <View style={styles.containerBody}>
            <TouchableOpacity style={styles.btnSave}
              onPress={this.signOutUser}>
              <IconF5 name="smile-wink" size={20} color="#F95A37" />
              <Text style={styles.textBtnSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
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
    justifyContent: 'space-around',
    width: width
  },
  containerTitle: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
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
    alignItems: 'flex-start'
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
