import React from 'react';
import PropTypes from 'prop-types';
import {
  RECEIVE_CHECK_RECORDS,
  CHECK_RECORD_UPDATE,
  CHECK_RECORD_SET,
} from './constants';
import { fetchCheckRecords } from './actions';
import { CheckRecordsChannel } from '../channels';
import store from './store';

import CheckRecordsTableItem from './check_records_table_item.jsx';

class CheckRecordsTable extends React.Component {
  constructor() {
    super();
    this.state = {
      checkRecords: [],
    };
  }

  componentWillMount() {
    fetchCheckRecords(this.props.eventId);
    CheckRecordsChannel.follow({ event_id: this.props.eventId });
  }

  componentDidMount() {
    store.on(RECEIVE_CHECK_RECORDS, checkRecords => this.setState({ checkRecords }));
    store.on(
      CHECK_RECORD_UPDATE,
      checkRecords => this.setState({ checkRecords }),
    );
    store.on(
      CHECK_RECORD_SET,
      checkRecords => this.setState({ checkRecords }),
    );
  }

  componentWillUnmount() {
    CheckRecordsChannel.unfollow();
    store.off();
  }

  checkRecords() {
    const checkRecords = this.state.checkRecords;
    return checkRecords.map(
      checkRecord => <CheckRecordsTableItem key={checkRecord.id} checkRecord={checkRecord} />,
    );
  }

  render() {
    return (
      <div>
        <table className="table table-bordered table-striped table-condensed">
          <thead>
            <tr>
              <th>會眾</th>
              <th>打卡點</th>
              <th>次數</th>
              <th>時間</th>
            </tr>
          </thead>
          <tbody>
            { this.checkRecords() }
          </tbody>
        </table>
      </div>
    );
  }
}

CheckRecordsTable.propTypes = {
  eventId: PropTypes.string.isRequired,
};

export default CheckRecordsTable;
