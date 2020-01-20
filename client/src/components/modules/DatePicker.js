import React, {Component} from "react";
import "../../utilities.css";
import {PropTypes} from "prop-types";
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './DatePicker.css';

class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate || null,
      startDateId: "startdateid",
      endDate: this.props.endDate || null,
      endDateId: "enddateid",
      focusedInput: null,
    };
  }

  componentDidMount() {

  }

  render () {
    return (
      <DateRangePicker
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        startDateId={this.state.startDateId} // PropTypes.string.isRequired,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        endDateId={this.state.endDateId} // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => {
          this.setState({ startDate, endDate });
          this.props.handleDateChange(startDate, endDate);
        }}
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        displayFormat={'MMM DD, YYYY'}
      />
    );
  }
}

DatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

export default DatePicker;