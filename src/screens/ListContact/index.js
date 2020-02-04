import React, { Component } from 'react'
import { View, Image, StatusBar, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Item, Input, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconI from 'react-native-vector-icons/Ionicons';

const height = Dimensions.get('window').height / 5;
const width = Dimensions.get('window').width;

const contact = [
  {
    id: 1,
    name: 'User 1',
    status: 'Pagi',
  },
  {
    id: 2,
    name: 'User 2',
    status: 'Siang',
  },
  {
    id: 3,
    name: 'User 3',
    status: 'Sore',
  },
  {
    id: 4,
    name: 'User 4',
    status: 'Love',
  },
  {
    id: 5,
    name: 'User 5',
    status: 'Semangat Terus',
  },
];

class ListContact extends Component {
  render() {
    return (
      <>
        <View style={styles.root}>
          <View style={styles.containerHeader}>
            <View style={styles.headerTitleMenu}>
              <Text style={styles.textTitle}>Contact</Text>
              <Icon name="dots-vertical" size={25} color="#2F2D32" />
            </View>
            <View style={styles.seacrhBar}>
              <IconI name="ios-search" size={25} color="#2F2D32" style={styles.iconSearch} />
              <Input placeholder="Search" />
            </View>
          </View>
          <View style={styles.containerBody}>
            <FlatList
              data={contact}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listChat}>
                  <View style={styles.containerLeft}>
                    <View style={styles.profilePic}>
                      <Text>{item.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.personName}>{item.name}</Text>
                      <Text style={styles.personChat}>{item.status}</Text>
                    </View>
                  </View>
                  <View style={styles.containerRight}>
                    <TouchableOpacity>
                      <Text style={styles.linkEdit}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.linkDelete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity style={styles.containerPlusContact}
              onPress={() => this.props.navigation.navigate('AddContact')}>
              <Icon name="plus" size={35} color="#A7BF2E" />
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
    backgroundColor: '#FAFBED'
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
    position: 'relative',
    paddingBottom: 100
  },
  profilePic: {
    height: 50,
    width: 50,
    backgroundColor: '#eddbb9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  listChat: {
    width: width,
    padding: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F95A37',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  containerLeft: {
    flexDirection: 'row'
  },
  containerRight: {
    width: 80,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  linkEdit: {
    color: '#A7BF2E'
  },
  linkDelete: {
    color: '#F95A37',
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2F2D32'
  },
  personChat: {
    color: '#1f1f1f',
  },
  containerPlusContact: {
    backgroundColor: '#2F2D32',
    width: 50,
    height: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    bottom: 120,
    right: 20
  }
});

export default ListContact;
