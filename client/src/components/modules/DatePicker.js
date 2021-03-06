import React, {Component} from "react";
import "../../utilities.css";
import {PropTypes} from "prop-types";
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './DatePicker.css';
import * as moment from "moment";
const momentPropTypes = require("react-moment-proptypes");


class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
  }

  componentDidMount() {

  }

  render () {
    return (
      <DateRangePicker
        startDate={moment(this.props.startDate)} // momentPropTypes.momentObj or null,
        startDateId={this.props.startDateId} // PropTypes.string.isRequired,
        endDate={moment(this.props.endDate)} // momentPropTypes.momentObj or null,
        endDateId={this.props.endDateId} // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => {
          endDate = (startDate > endDate) ? startDate : endDate;
          this.props.handleDateChange(startDate, endDate);
        }}
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        displayFormat={'MMM DD, YYYY'}
        daySize={28}
        transitionDuration={0}
        customArrowIcon={(
          <img src="/rightarr.svg"  width="10px"/>
        )}
      />
    );
  }
}

DatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  startDateId: PropTypes.string.isRequired,
  endDateId: PropTypes.string.isRequired,
};

export default DatePicker;