import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "../../utilities";
import "./SingleCard.css";
import { formatDate, calculateAge, get, post } from "../../utilities";
//import { duration } from "../../../../node_modules/moment";
import { Link } from "@reach/router";
import NewListing from "./NewListing";
import Popup from "reactjs-popup";


class SingleCardFast extends Component {
  /*static genderColorDict = {
    'm': 'Card-blue',
    'f': 'Card-pink',
    'nb': 'Card-purple'
  };*/

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      name: "",
      age: 0,
      /*gender: "m",*/
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      additionalText: "",
      profilePicURL: "",
      doRender: false,
      durationIndex: 0,
      loggedIn: false,
    };
  }

  componentDidMount() {
    this.setState({
      location: this.props.listing.location,
      startDate: this.props.listing.startDate,
      price: this.props.listing.price,
      additionalText: this.props.listing.additionalPrefText, // TODO: implement photo uploading
      name: this.props.listing.creator_ID.firstName, 
      age: calculateAge(new Date(this.props.listing.creator_ID.birthdate)),
      /*gender: this.props.listing.creator_ID.gender,*/
      profilePicURL: this.props.listing.creator_ID.profilePictureURL,
      durationIndex: this.props.listing.durationIndex,
      doRender: true,
    });
    get("/api/myuid").then((response)=>{
      this.setState({loggedIn: true});
    }).catch((err)=>{
    });
  }

  render() {
    const {expanded, name, age, /*gender,*/ location, startDate, endDate, price,
      smoking, pets, additionalText, lookingForRoom, profilePicURL} = this.state;
    if (!this.state.doRender)
      return null;

    let durationOptions = ["for 1-3 months", "for 3-6 months", "for 6-12 months", "for over a year"]
    return (
      <div className="Card-container" key={this.props.listingId}>
        <div className="Card-top">
          <div className="Card-profilePicContainer">
            <Link to={"/profile/"+this.props.listing.creator_ID._id}>
              <img src={this.state.profilePicURL || "/account.png"} title={`Click to view ${this.props.listing.creator_ID.firstName}'s profile`}
                className="Card-profilePic"/>
            </Link>
          </div>
          <div className="Card-topMiddle">
            <div className="Card-nameAgeGender" onClick={() => {this.props.setCenter(this.props.listing.coordinates);}}>
              <Link to={"/profile/"+this.props.listing.creator_ID._id} title={`Click to view ${this.props.listing.creator_ID.firstName}'s profile`}
                style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingBottom: '0.3rem', marginRight: "1rem"}}>
                {`${name}, ${age}`}
              </Link>
            </div>
            <div className="Card-date" title={`Move-in date: ${formatDate(startDate)}`} 
              onClick={() => {this.props.setCenter(this.props.listing.coordinates);}}>{formatDate(startDate)}</div>
            <div className="Card-duration" title={`Duration: ${durationOptions[this.state.durationIndex]}`}
              onClick={() => {this.props.setCenter(this.props.listing.coordinates);}}>{durationOptions[this.state.durationIndex]}</div>
            <div className="Card-location" title={`Location: ${location}`} onClick={() => {this.props.setCenter(this.props.listing.coordinates);}}>
              {location}
            </div>
              
            <div className="Card-inbox">
              {this.props.editDeletePerms ? 
                (<Popup
                  contentStyle={{backgroundColor: 'rgba(255,255,255,0)', border: 'none'}}
                  modal trigger={
                    <img src = "/edit.svg" width = "15px" title="Edit this listing"/>
                 }>
                   {close => (<NewListing 
                    key={this.props.listing._id} userId="" currentId={this.props.listing._id} close={close} 
                    delete={() => this.setState({doRender: false})}/>) }
                 </Popup>) : 
                (
                this.state.loggedIn && <Link to={"/inbox/"+this.props.listing.creator_ID._id}>
                  <img src = "/envelope-mod.svg" style={{alignSelf: 'center'}} title={`Message ${this.props.listing.creator_ID.firstName}`} width = "25px"></img></Link>
                )
              }
            </div>
            <div className="Card-expand" onClick={() => {
              this.setState((prev) => ({expanded: !prev.expanded}));
            }}>
              {expanded ?  <img src = "/up.svg" title="Collapse" width = "15px" /> : <img src = "/download.svg" title="Expand" width = "15px"/>}
            </div>
          </div>
        </div>
        {expanded ? <div className="Card-bottom">
          {additionalText}
        </div> : null}
      </div>
    );
  }
}

SingleCardFast.propTypes = {
  listing: PropTypes.object.isRequired,
};


export default SingleCardFast;