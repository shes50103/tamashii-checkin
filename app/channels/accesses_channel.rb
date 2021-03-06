# frozen_string_literal: true

# :nodoc:
class AccessesChannel < ApplicationCable::Channel
  EVENTS = {
    update: 'ACCESS_RECORD_UPDATE',
    set: 'ACCESS_RECORD_SET',
    request: 'REQUEST_ACCESS',
    update_access: 'ACCESS_UPDATE'
  }.freeze

  class << self
    def update(check_record)
      user = check_record.check_point.registrar
      broadcast_to([user, check_record.check_point], type: EVENTS[:update], record: check_record.as_json(include: :attendee))
    end

    def set(check_record)
      user = check_record.check_point.registrar
      broadcast_to([user, check_record.check_point], type: EVENTS[:set], record: check_record.as_json(include: :attendee))
    end

    def request(check_point, attendee)
      user = check_point.registrar
      broadcast_to([user, check_point], type: EVENTS[:request], record: attendee)
    end

    def update_access(check_point)
      user = check_point.registrar
      broadcast_to([user, check_point], type: EVENTS[:update_access])
    end
  end

  def follow(data)
    stop_all_streams
    check_point = CheckPoint.find(data['check_point_id'])
    stream_for [current_user, check_point]
  end

  def unfollow
    stop_all_streams
  end
end
