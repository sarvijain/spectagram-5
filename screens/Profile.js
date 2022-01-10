import React, { Component } from "react";
import { StyleSheet, Text, View, Switch,SafeAreaView,Platform,StatusBar,Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase';

let customFonts = {
  "Bubblegum-Sans": require("../assets/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      light_theme:true,
      profile_image:"",
      name:""
    };
  }

  toggleSwitch(){
    const previous_state=this.state.isEnabled
    const theme = !this.state.isEnabled?"dark":"light"
    var updates={}
    updates["/users/"+firebase.auth().currentUser.uid+"/current_theme"]=theme
    firebase.database().ref().update(updates)
    this.setState({isEnabled:previous_state,light_theme:previous_state})
  }

  async _fetchUser(){
    let theme,image,name
    await firebase.database().ref("/users/"+firebase.auth().currentUser.uid)
    .on("value",function (snapshot){
      theme=snapshot.val().current_theme
      name = '${snapshot.val().first_name} ${snapshot.val().last_name}'
      image = snapshot.val().profile_picture
    })
    this.setState({
      light_theme:theme === "light"?true:false,
      isEnabled:theme==="light"?false:true,
      name:name,
      profile_image:image
    })
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this._fetchUser();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={this.state.light_theme?styles.containerLight:styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

          <View style={styles.appTitle}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.appIcon}
            ></Image>
            <Text style={
              this.state.light_theme ? styles.appTitleTextLight:styles.appTitleText}>{`Profile`}
            </Text>
          </View>

          <View style={styles.profileImageContainer}>
            <Image 
              source={{uri:this.state.profile_image}}
              style={styles.profileImage}
            ></Image>
            <Text style={
              this.state.light_theme?styles.nameTextLight:styles.nameText}>{this.state.name}
            </Text>
          </View>

          <View style={styles.themeContainer}>
            <Text style={
              this.state.light_theme?styles.themeTextLight:styles.themeText}>darkTheme
            </Text>
            <Switch
              style={{
                transform:[{scaleX:1.3},{scaleY:1.3}]
              }}
              trackColor={{false:"#767577",true:"white"}}
              thumbColor={this.state.isEnabled?"#EE8249":"#F4F3F4"}
              ios_backgroundColor="#3E3E3E"
              onValueChange={()=>this.toggleSwitch()}
              value={this.state.isEnabled}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  profileImageContainer:{
    flex:0.5,
    justifyContent:"center",
    alignItems:"center"
  },
  profileImage:{
    width:RFValue(140),
    height:RFValue(140),
    borderRadius:70
  },
  nameText:{
    color:"white",
    fontSize:RFValue(40),
    fontFamily:"Bubblegum-Sans",
    marginTop:RFValue(10)
  },
  themeContainer:{
    flex:0.2,
    flexDirection:"row",
    justifyContent:"center",
    marginTop:RFValue(20)
  },
  themeText:{
    color:"white",
    fontSize:RFValue(30),
    fontFamily:"Bubblegum-Sams",
    marginRight:RFValue(50)
  },
  containerLight:{
    flex:1,
    backgroundColor:"white"
  },
  appTitleTextLight:{
    color:"black",
    fontSize:28,
    fontFamily:"Bubblegum-Sams",
    paddingLeft:20   
  },
  nameTextLight:{
    color:"black",
    fontSize:40,
    fontFamily:"Bubblegum-Sams"
  },
  themeTextLight:{
    color:"black",
    fontSize:30,
    fontFamily:"Bubblegum-Sams"
  }
})