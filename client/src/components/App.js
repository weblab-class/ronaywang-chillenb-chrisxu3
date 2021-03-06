import React, { Component } from "react";
import { Router } from "@reach/router";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import SplashPage from "./pages/SplashPage";

import NavBar from "./modules/NavBar.js";
import MainPage from "./pages/MainPage.js";
import ProfilePage from "./pages/ProfilePage";
import InboxPage from "./pages/InboxPage.js";
import "./App.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      email: "",
      doDisplay: false,
      mapCenter: {
        lat: 0,
        lng: 0
      }
    };
    // this.generateListings = this.generateListings.bind(this);
    // this.handleLogin = this.handleLogin.bind(this);
    // this.handleLogout = this.handleLogout.bind(this);
    // this.updateSearchPrefs = this.updateSearchPrefs.bind(this);
    // this.setSelectedCenter = this.setSelectedCenter.bind(this);
    this.initializeSockets = this.initializeSockets.bind(this);
  }

  componentDidMount() {
    get("/api/myuid").then((response) => {
      if (response.userId) {
        // they are registed in the database, and currently logged in
        this.setState({ userId: response.userId, email: response.email});
        this.initializeSockets();
        console.log("initialized sockets");
      }
    }).catch(error => {console.log(error)}).finally(() => {
      this.setState({doDisplay: true});
    })
  }

  initializeSockets() {
    post("/api/initsocket", {socketid: socket.id});
  }

  handleLogin (res) {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  }

  handleLogout () {
    post("/api/logout").then(() => {
      window.location.pathname="/";
      this.setState({ userId: "", email: ""});
    })
  }

  setSelectedCenter (center) {
    this.setState({ mapCenter: center });
  }

  render() {
    return (
      <>
        <NavBar userId={this.state.userId} handleLogout={this.handleLogout} />
        <div className="App-container">
        <Router className="routerClass">
          <SplashPage path="/"/>
          <MainPage path="/main" userId={this.state.userId}
          />
          
          <ProfilePage path="/profile/:userId" id="profile"/>
          {/* EVERY SINGLE FUCKING OTHER URL */}
          <InboxPage path="/inbox/:userId" />
          {/* <LoginPage path="/login" userId={this.state.userId} username={this.state.username} handleLogout={this.handleLogout}/>
          <RegistrationPage path="/register" username={this.state.username} userId={this.state.userId} handleLogout={this.handleLogout}/>
          <Skeleton
            path="/skeleton"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          /> */}
          {/* <MapComponent
            path="/map"
            initialCenter={{lat: 42.360495, lng: -71.093779 }}
            newCenter = {this.state.mapCenter}
            initialZoom={14}
          /> */}
          {/* <TryCard path="/cardsample"/>
          <ProfilePicUploader path="/profilepicuploader"/>
          <DatePicker path="/datepicker/" handleDateChange={(s,d) => null} />
          <NewListing path="/newlistingprototype/" userId={this.state.userId} addNewListing={(listingInfo) => null} lookingForRoom={true}/>
          <NotFound default /> */}
        </Router>
        </div>
      </>
    );
  }
}

export default App;
