import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Item, Input, Label } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;

class FriendProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      FriendProfile: this.props.navigation.getParam('item')
    }
  }


  render() {
    const { FriendProfile } = this.state
    return (
      <>
        <View style={styles.root}>
          <View style={styles.containerHeader}>
            <View style={styles.containerMenuHeader}>
              <View style={styles.containerEdit}>
                <Text style={styles.textTitle}>Friend Profile</Text>
              </View>
              <View style={styles.containerImage}>
                <Image source={{ uri: FriendProfile.photo_users }} style={{
                  width: '100%', height: '100%', borderBottomLeftRadius: 40,
                  borderBottomRightRadius: 40
                }} />
              </View>
            </View>
            <View style={styles.containerBio}>
              <Item stackedLabel>
                <Label>Username</Label>
                <Input disabled value={FriendProfile.fullname_users} />
              </Item>
              <Item stackedLabel>
                <Label>Info</Label>
                <Input disabled value={FriendProfile.info_users} />
              </Item>
              <Item stackedLabel>
                <Label>email</Label>
                <Input disabled value={FriendProfile.email_users} />
              </Item>
              <Item stackedLabel>
                <Label>Phone Number</Label>
                <Input disabled value={FriendProfile.phone_users} />
              </Item>
            </View>
          </View>
          <View style={styles.containerBody}>
            <TouchableOpacity style={styles.btnUnFriend}
              onPress={this.signOutUser}>
              <Icon
                name="arrow-right-drop-circle-outline"
                size={20} color="#A7BF2E"
              />
              <Text style={styles.textBtnUnFriend}>Un Friend</Text>
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
    borderWidth: 3,
    borderColor: 'transparent',
    borderBottomColor: '#F95A37',
    borderTopWidth: 0,
    alignItems: 'center'
  },
  containerMenuHeader: {
    justifyContent: 'center',
    width: width
  },
  containerEdit: {
    height: 50,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#A7BF2E',
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
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
    alignSelf: 'center'
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
  btnUnFriend: {
    width: width / 4,
    height: 50,
    marginLeft: 2,
    backgroundColor: '#F95A37',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  textBtnUnFriend: {
    fontSize: 16,
    color: '#FAFBED'
  }
});

export default FriendProfile;
