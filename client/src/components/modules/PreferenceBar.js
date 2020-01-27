import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { get, post } from "../../utilities";
import "./PreferenceBar.css";
import DatePicker from "./DatePicker";
const momentPropTypes = require("react-moment-proptypes");

const houseIcon = (
  <img src="/house_icon.svg" width="13px"/>
);
const roommateIcon = (
  <img src="/roommate_icon.svg" width="13px"/>
);

class PreferenceBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      doDisplay: false
    };
  }

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState(globals, () => {
        this.setState({doDisplay: true});
      })
    });
  }
  
  update = (price, startDate, durationIndex) => {
    this.setState({
      price, startDate, durationIndex, 
    }, () => {
      post("/api/sessionglobals", {
        price, startDate, durationIndex
      })
    })
  }

  render(){
    if (!this.state.doDisplay)
      return null;
    const {
      state: {
        price, startDate, durationIndex
      }
    } = this;
    let durationOptions = ["1-3 months", "3-6 months", "6-12 months", "more than 1 year"];
    return (
      <div className="PreferenceBar-container">
        <div className="PreferenceBar-price">
          Budget:
          <span className="PreferenceBar-dollarsign"> $</span>
          <input type="number" min="0" step="100" value={price} onChange={(e) => {
              this.update(parseInt(e.target.value), startDate, durationIndex)
            }} 
            className="PreferenceBar-priceInput" placeholder="Enter approximate budget..." 
          />/month
        </div>
        <div className="PreferenceBar-dateContainer">
          <input className = "moveindate"
            type="date"
            name="startdate"
            value={this.state.startDate}
            onChange={(e) => this.update(price, e.target.value, durationIndex)}
          />
        </div>
        <div className="PreferenceBar-durationContainer">
          <div className="PreferenceBar-duration">
            {durationOptions.map((desc, i) => (
              <button
              className={this.state.durationIndex !== i ? "durationButton" : "durationButton durationSelect"}
              onClick={(e)=>{this.update(price, e.target.value, (this.state.durationIndex !== i) ? i : -1)}}
              >{desc}</button>
            ))}
          </div>
        </div>
        <div>
          <button className="PreferenceBar-gobutton" onClick={this.props.triggerSearch}>search</button>
        </div>
      </div>
    ) 
  }
}
PreferenceBar.propTypes = {
  triggerSearch: PropTypes.func.isRequired,
};

export default PreferenceBar;