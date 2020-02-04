import React, { Component } from 'react'
import { View, Image, StatusBar, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Item, Input, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';

const height = Dimensions.get('window').height / 5;
const width = Dimensions.get('window').width;

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [],
      refreshing: false,
      uid: ''
    }
  }

  componentDidMount = async () => {
    const uid = firebase.auth().currentUser.uid;
    this.setState({ uid: uid, refreshing: true });
    await firebase
      .database()
      .ref('/users')
      .on('child_added', data => {
        let person = data.val();
        if (person.uid_users != uid) {
          this.setState(prevData => {
            return { userList: [...prevData.userList, person] };
          });
          this.setState({ refreshing: false });
        }
      });
  }

  render() {
    const { userList } = this.state
    return (
      <>
        <View style={styles.root}>
          <StatusBar backgroundColor="#2F2D32" />
          <View style={styles.containerHeader}>
            <View style={styles.headerTitleMenu}>
              <Text style={styles.textTitle}>Your Chat</Text>
              <Icon name="dots-vertical" size={25} color="#2F2D32" />
            </View>
            <View style={styles.seacrhBar}>
              <IconI name="ios-search" size={25} color="#2F2D32" style={styles.iconSearch} />
              <Input placeholder="Search" />
            </View>
          </View>
          <View style={styles.containerBody}>
            <FlatList
              data={userList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listChat}
                  onPress={() => this.props.navigation.navigate('ChatPage', { uid_friend: item.uid_users })}>
                  <View style={styles.containerLeft}>
                    <View style={styles.profilePic}>
                      <Image source={{ uri: item.photo_users }} style={styles.photo} />
                    </View>
                    <View>
                      <Text style={styles.personName}>{item.fullname_users}</Text>
                      <Text style={styles.personInfo}>{item.info_users}</Text>
                    </View>
                  </View>
                  <View style={styles.containerRight}>
                    <Text style={styles.textDate}>01/01/2020</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.uid_users}
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
    backgroundColor: '#E8E7E9',
    height: height,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
    zIndex: 1,
    padding: 16,
    borderWidth: 1,
    borderBottomColor: '#F95A37',
    borderTopWidth: 0
  },
  headerTitleMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textTitle: {
    fontSize: 20,
    color: '#2F2D32',
    fontWeight: 'bold'
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
    flex: 1,
    width: width,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: -30,
    paddingBottom: 100
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10
  },
  photo: {
    width: undefined,
    height: undefined,
    flex: 1,
    borderRadius: 25,
    resizeMode: 'cover'
  },
  listChat: {
    padding: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F95A37',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  containerLeft: {
    flexDirection: 'row'
  },
  containerRight: {
    height: '100%',
    justifyContent: 'flex-start',
  },
  personName: {
    fontSize: 16,
    color: '#1f1f1f'
  },
  personChat: {
    color: '#1f1f1f',
    fontSize: 16
  },
  textDate: {
    color: '#88838F',
    fontSize: 12
  }
});

export default MainScreen;
