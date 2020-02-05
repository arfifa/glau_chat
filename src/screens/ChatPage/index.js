import React, { Component } from 'react'
import { View, Image, StyleSheet, Text } from 'react-native';
import { Spinner } from 'native-base';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Bubble } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconE from 'react-native-vector-icons/Entypo';
import firebase from 'react-native-firebase';

class ChatPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: null,
      messageList: [],
      uid_friend: this.props.navigation.getParam('uid_friend'),
      friend_data: null,
      fullname_users: '',
      photo_users: '',
      info_users: '',
      uid_users: '',
      isLoading: true
    }
  }

  async componentDidMount() {
    const { uid } = firebase.auth().currentUser
    const db = firebase.database().ref(`users/${uid}`)
    const { uid_friend } = this.state
    const db_friend = firebase.database().ref(`users/${uid_friend}`)
    await db.once('value')
      .then(data => {
        const item = data.val()
        this.setState({
          isLoading: true
        })
        const { uid_friend } = this.state
        const db_friend = firebase.database().ref(`users/${uid_friend}`)
        this.setState({
          fullname_users: item.fullname_users,
          photo_users: item.photo_users,
          info_users: item.info_users,
          uid_users: uid
        })
        firebase
          .database()
          .ref('messages')
          .child(this.state.uid_users)
          .child(this.state.uid_friend)
          .on('child_added', val => {
            this.setState(previousState => ({
              messageList: GiftedChat.append(
                previousState.messageList,
                val.val()
              )
            }));
          });
        db_friend.once('value')
          .then(data => {
            const item = data.val()
            this.setState({
              friend_data: item,
              isLoading: false
            })
          })
          .catch(error => Alert.alert(error.messages))
      })
      .catch(error => Alert.alert(error.messages))
  };

  onSend = async () => {
    if (this.state.message !== null) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.uid_friend)
        .child(this.state.uid_users)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.uid_users,
          name: this.state.fullname_users,
          avatar: this.state.photo_users,
        },
      };
      updates[
        'messages/' + this.state.uid_users + '/' + this.state.uid_friend + '/' + msgId] = message;
      updates['messages/' + this.state.uid_friend + '/' + this.state.uid_users + '/' + msgId] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({ message: '' });
    }
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2F2D32',
          },
          left: {
            backgroundColor: '#A7BF2E',
          }
        }}
        textStyle={{
          right: {
            color: '#FAFBED',
          },
          left: {
            color: '#FAFBED',
          },
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <IconI name="ios-paper-plane" size={35} color="#A7BF2E" />
        </View>
      </Send>
    );
  }
  render() {
    const { isLoading } = this.state
    return (
      <>
        <View style={styles.root}>
          <View style={styles.containerHeader}>
            <View style={styles.headerTitleMenu}>
              <View style={styles.containerLeftHeader}>
                {isLoading == true ? (
                  <>
                    <Icon
                      onPress={() => this.props.navigation.goBack()}
                      name="arrow-left" size={25} color="#FAFBED" />
                    <View style={styles.containerImage}>
                      <Spinner color="#F95A37" style={{ alignSelf: 'center' }} />
                    </View>
                  </>
                ) : (
                    <>
                      <Icon
                        onPress={() => this.props.navigation.goBack()}
                        name="arrow-left" size={25} color="#FAFBED" />
                      <View style={styles.containerImage}>
                        <Image source={require('../../assets/images/dummy/profile.jpg')}
                          style={styles.imageProfile} />
                      </View>
                      <View>
                        <Text style={styles.textName}>{this.state.friend_data.fullname_users}</Text>
                        {this.state.friend_data.online ? (
                          <Text style={styles.textStatusOn}>online</Text>
                        ) : (
                            <Text style={styles.textStatusOff}>offline</Text>
                          )}
                      </View>
                    </>
                  )}
              </View>
              <View>
                <IconE name="dots-three-vertical" size={25} color="#FAFBED" />
              </View>
            </View>
          </View>
          <View style={styles.containerBody}>
            <GiftedChat
              renderSend={this.renderSend}
              renderBubble={this.renderBubble}
              text={this.state.message}
              onInputTextChanged={val => {
                this.setState({ message: val });
              }}
              messages={this.state.messageList}
              onSend={() => this.onSend()}
              user={{
                _id: this.state.uid_users
              }}
            />
          </View>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFBED',
  },
  containerHeader: {
    backgroundColor: '#2F2D32',
    height: 70,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 1,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#F95A37',
    borderTopWidth: 0,
  },
  headerTitleMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  containerLeftHeader: {
    flexDirection: "row",
    alignItems: 'center'
  },
  textName: {
    fontSize: 18,
    color: '#FAFBED'
  },
  textStatusOn: {
    fontSize: 14,
    color: '#A7BF2E'
  },
  textStatusOff: {
    fontSize: 14,
    color: '#F95A37'
  },
  containerImage: {
    height: 50,
    width: 50,
    backgroundColor: '#eddbb9',
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 5,
    justifyContent: 'center'
  },
  imageProfile: {
    height: undefined,
    width: undefined,
    flex: 1,
    borderRadius: 25
  },
  sendButton: {
    marginRight: 20,
    marginBottom: 5,
  },
  seacrhBar: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: '#A7BF2E',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 7,
    backgroundColor: '#FAFBED',
    height: 45
  },
  iconSearch: {
    marginHorizontal: 5
  },
  containerBody: {
    flex: 1
  }
});

export default ChatPage;


