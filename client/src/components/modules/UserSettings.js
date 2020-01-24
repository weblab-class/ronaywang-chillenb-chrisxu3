import React, { Component } from "react";
import "../../utilities.css";
import "../pages/ProfilePage.css";
import { SingleDatePicker } from "react-dates";
import moment from "moment";
import { get, post } from "../../utilities";
import { genders} from "./enums";
import ProfilePicUploader from "../modules/ProfilePicUploader";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      birthdate: undefined,
      email: '',
      fbProfileLink: '',
      datefocused: false,
      textBox: '',
      gender: '',
      maleButtonActive: false,
      femaleButtonActive: false,
      nbButtonActive: false,
      doRender: false,
      profilePicURL: "",
    };
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    if (this.state.profilePicURL.length == 0) {
      post("/api/getProfilePic", {userId: this.props.userId}).then((myres) => {
        this.setState({profilePicURL: myres.photoURL});
      });
    }
    get("/api/getthisuserinfo").then((userObj) => {
      console.log(userObj);
      this.setState({
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        birthdate: userObj.birthdate,
        fbProfileLink: userObj.fbProfileLink,
        gender: userObj.gender,
        textBox: userObj.aboutMe
      });
      if (this.state.gender === genders.M) {
        this.setState({maleButtonActive: true});
      } else if (this.state.gender === genders.F) {
        this.setState({femaleButtonActive: true});
      } else if (this.state.gender === genders.NB) {
        this.setState({nbButtonActive: true});
      }
      this.setState({doRender: true});
    });
  }

  async saveSettings () {
    console.log(this.state);
    post("/api/saveusersettings", this.state).then((result)=>{
      console.log(result);
    }).catch((err)=> {
      console.log(err);
    });
    console.log(this.state.birthdate);
  }

  render() {
    if (!this.state.doRender)
      return null;
    let mbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonM";
    let fbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonF";
    let nbbuttonclass = "UserSettings-genderbutton UserSettings-genderbuttonNB";
    if (this.state.maleButtonActive) {
      mbuttonclass += " UserSettings-genderbuttonActive";
    }
    if (this.state.femaleButtonActive) {
      fbuttonclass += " UserSettings-genderbuttonActive";
    }
    if (this.state.nbButtonActive) {
      nbbuttonclass += " UserSettings-genderbuttonActive";
    }

    let dispdate;
    if (this.state.birthdate) {
      dispdate = moment(this.state.birthdate);
    } else {
      dispdate = '';
    }
    return (
      <div className="UserSettings-container">
        <div className = "ProfileBar-container">
          <div>
            <img className = "ProfileBar-photo" src={this.state.profilePicURL || require("../../public/assets/account.png")}/>
          </div>
          {/*<div>
            Profile page for <b>{this.props.username}</b>
          </div>*/}
          <ProfilePicUploader/>
        
        </div>
        <div>
          <span className="fieldname">Name</span>
          <input
          type="text"
          name="firstname"
          placeholder = "First name"
          value={this.state.firstName}
          onChange={(event)=>{this.setState({firstName: event.target.value})}}/>
          <input
          type="text"
          name="lastname"
          placeholder = "Last name"
          value={this.state.lastName}
          onChange={(event)=>{this.setState({lastName: event.target.value})}}/>
        </div>
        <div>
          <span className="fieldname">Birthdate</span>
          <SingleDatePicker
          date={dispdate}
          onDateChange={date => this.setState({birthdate: date.toDate()})}
          id="profile-date-picker"
          focused={this.state.datefocused}
          onFocusChange={({ focused }) => this.setState({ datefocused: focused })}
          isOutsideRange={(date)=>{return false;}}
          initialVisibleMonth={() => moment().subtract(25, "Y")}
          numberOfMonths={2}
          transitionDuration={0}
          displayFormat="MMM DD, YYYY"/>
        </div>
        <div>
          <span className="fieldname">Gender</span>
          <button
          className={mbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: true, femaleButtonActive: false, nbButtonActive: false, gender: genders.M})}}
          >Male</button>
          <button className={fbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: false, femaleButtonActive: true, nbButtonActive: false, gender: genders.F})}}
          >Female</button>
          <button className={nbbuttonclass}
          onClick={()=>{this.setState({maleButtonActive: false, femaleButtonActive: false, nbButtonActive: true, gender: genders.NB})}}
          >Non-binary</button>
        </div>
        <div>
          <span className="fieldname">Link your FB profile</span>
          <input
          type="text"
          name="fblink"
          value={this.state.fbProfileLink}
          onChange={(event)=>{this.setState({fbProfileLink: event.target.value})}}/>
        </div>
        <div>
          <div className="fieldname">Tell us about yourself!</div>
            <textarea rows="10" cols="30" value={this.state.textBox} onChange={(e) => {this.setState({textBox: e.target.value})}}/>
        </div>

        <button id="savebutton"
        name="Save"
        onClick={this.saveSettings}>Save</button>
      </div>
    );
  }
}

export default UserSettings;