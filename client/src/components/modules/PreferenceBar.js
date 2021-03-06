import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import { get, post } from "../../utilities";
import "./PreferenceBar.css";

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
      doDisplay: false,
      startDate: new Date(),
      price: 0,
      visibleprice: "",
      durationIndex: -1,
    };
    console.log(this.state.startDate);
    this.update = this.update.bind(this);
    this.pushToGlobals = this.pushToGlobals.bind(this);
    this.priceupdate = this.priceupdate.bind(this);
  }

  componentDidMount(){
    get("/api/sessionglobals").then((globals) => {
      this.setState(globals, () => {
        this.setState({doDisplay: true});
      })
    });
  }

  pushToGlobals (trigger) {
    post("/api/sessionglobals", {
        price: this.state.price,
        startDate: this.state.startDate,
        durationIndex: this.state.durationIndex
    }).then(() => {
      if (trigger)
        this.props.triggerSearch();
    });
  }
  
  update (price, startDate, durationIndex, trigger) {
    this.setState({
      price, startDate, durationIndex, 
    }, () => this.pushToGlobals(trigger));
    console.log(this.state.startDate);
    console.log("hello");
  }

  async priceupdate(event) {
    console.log("hi");
    console.log(this.state.startDate);
    let a = event.target.value;
    if (event.target.value === "") {
      a = 0;
    } else {
      a = parseInt(event.target.value);
    }
    this.setState({
      visibleprice: event.target.value,
      price: a,
    });
    this.pushToGlobals(false);
  }

  render(){
    if (!this.state.doDisplay)
      return null;
    const {
      state: {
        price, startDate, durationIndex
      }
    } = this;
    let durationOptions = ["1-3 months", "3-6 months", "6-12 months", "more than a year"];
    const today = new Date();
    return (
      <div className="PreferenceBar-container">
       
        <div className="PreferenceBar-dateContainer">
          <input className = "PreferenceBar-moveInDate PreferenceBar-dateinvisible"
            id="moveindatepicker"
            type="date"
            placeholder = "move-in date"
            name="startdate" 
            value={this.state.startDate}
            min={today.toISOString().split("T")[0]}
            onFocus={()=>{document.getElementById("moveindatepicker").placeholder = ""; document.getElementById("moveindatepicker").classList.remove("PreferenceBar-dateinvisible");}}
            onChange={(e) => this.update(price, e.target.value, durationIndex, false)}
          />
        </div>
        
        <span className="PreferenceBar-price" id="prefbarprice">
          $&nbsp;<input
            id="prefbarpriceinput"
            type="number"
            min="0"
            step="100"
            value={this.state.visibleprice}
            onChange={this.priceupdate}
            className="PreferenceBar-priceInput"
            placeholder="budget" 
            onFocus={()=>document.getElementById("prefbarprice").classList.add("PreferenceBar-pricefocus")}
            onBlur={()=>{document.getElementById("prefbarprice").classList.remove("PreferenceBar-pricefocus"); this.pushToGlobals(false);}}
        />/month
        </span>

          <div className="PreferenceBar-duration">
            {durationOptions.map((desc, i) => (
              <button
              key={i}
              style={{gridColumnStart: (i+1).toString(), gridColumnEnd: (i+2).toString()}}
              className={this.state.durationIndex !== i ? "durationButton PreferenceBar-durationButton" : "durationButton durationSelect"}
              onClick={()=>{
                this.update(price, startDate, (this.state.durationIndex !== i) ? i : -1, true);
              }}
              >
              {desc}
              </button>
            ))}
          </div>
        {/* <div className="PreferenceBar-durationContainer">
          <label className = "PreferenceBar-durationDropDown">
            <select className = "dropbtn"  
            value = {this.state.durationIndex}
            onChange={(e)=>this.update(price, startDate, (this.state.durationIndex !== parseInt(e.target.value)) ? parseInt(e.target.value) : -1)}>
              <option value={-1} disabled selected>duration</option>
              <option value = {0}>1&ndash;3 months</option>
              <option value = {1}>3&ndash;6 months</option>
              <option value = {2}>6&ndash;12 months</option>
              <option value = {3}>&gt;1 year</option>
            </select>
          </label>
            </div> */}
        <div>
          <button className="PreferenceBar-gobutton" onClick={() => this.props.triggerSearch()}>search</button>
        </div>
      </div>
    ) 
  }
}
PreferenceBar.propTypes = {
  triggerSearch: PropTypes.func.isRequired,
};

export default PreferenceBar;