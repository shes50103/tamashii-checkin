# frozen_string_literal: true
# missing top-level class documentation comment
class CheckrecordsChannel < ApplicationCable::Channel
  EVENTS = {
    register: 'REGISTER',
    update: 'REGISTER_UPDATE',
    set: 'REGISTER_SET'
  }.freeze

  class << self
    def update(check_record)
      broadcast_to(check_record.check_point.event, type: EVENTS[:update], check_record: check_record.de_json)
    end

    def set(check_record)
      broadcast_to(check_record.check_point.event, type: EVENTS[:set], check_record: check_record.de_json)
    end
  end

  def follow(data)
    stop_all_streams
    event = Event.find(data['event_id'])
    stream_for event
  end

  def unfollow
    stop_all_streams
  end
end
