import { EventEmitter } from 'events';
import { fromJS, Record } from 'immutable';

import {
  RECEIVE_CHECK_RECORDS,
  START_REGISTER,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_UPDATE,
  CANCEL_REGISTER,
} from './constants';
import { CheckrecordsChannel } from '../channels';

const CheckRecord = Record({
  id: 0,
  attendee_id: '',
  check_point_id: '',
  times: '',
  created_at: '',
  updated_at: '',
});

const check_recordsToRecord = check_records => check_records.map(check_record => new CheckRecord(check_record));

class CheckRecordStore extends EventEmitter {
  constructor() {
    super();
    this.check_records = fromJS([]);
    this.nextRegisterCheckRecordId = 0;
    CheckrecordsChannel.onReceived(action => this.dispatch(action));
  }

  update(check_recordId, newCheckRecord) {
    const index = this.index(check_recordId);
    if (index >= 0) {
      this.check_records = this.check_records.set(index, newCheckRecord);
    }
  }

  index(check_recordId) {
    return this.check_records.findIndex(check_record => check_record.id === check_recordId);
  }

  dispatch(action) {
    switch (action.type) {
      case RECEIVE_CHECK_RECORDS: {
        this.check_records = fromJS(check_recordsToRecord(action.check_records));
        this.emit(action.type, this.check_records);
        break;
      }
      case START_REGISTER: {
        this.nextRegisterCheckRecordId = action.check_recordId;
        this.emit(action.type, this.nextRegisterCheckRecordId);
        break;
      }
      case REGISTER: {
        this.emit(action.type, action.serial);
        if (this.nextRegisterCheckRecordId > 0) {
          CheckrecordsChannel.perform(
            'register',
            {
              check_recordId: this.nextRegisterCheckRecordId,
              serial: action.serial,
            },
          );
        }
        break;
      }
      case REGISTER_SUCCESS: {
        this.nextRegisterCheckRecordId = 0;
        this.update(action.check_record.id, new CheckRecord(action.check_record));
        this.emit(action.type, this.check_records);
        break;
      }
      case REGISTER_UPDATE: {
        const check_record = new CheckRecord(action.check_record);
        this.update(check_record.id, check_record);
        if (this.nextRegisterCheckRecordId === check_record.id) {
          this.nextRegisterCheckRecordId = 0;
        }
        this.emit(action.type, this.check_records, this.nextRegisterCheckRecordId);
        break;
      }
      case CANCEL_REGISTER: {
        this.nextRegisterCheckRecordId = 0;
        break;
      }
      default: {
        break;
      }
    }
  }

  off() {
    this.removeAllListeners(RECEIVE_CHECK_RECORDS);
    this.removeAllListeners(START_REGISTER);
    this.removeAllListeners(REGISTER);
    this.removeAllListeners(REGISTER_SUCCESS);
    this.removeAllListeners(REGISTER_UPDATE);
    this.removeAllListeners(CANCEL_REGISTER);
  }
}

const check_records = new CheckRecordStore();

export default check_records;
