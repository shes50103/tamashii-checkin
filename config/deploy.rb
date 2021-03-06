# frozen_string_literal: true
# config valid only for current version of Capistrano
lock '3.8.1'

set :application, 'tamashii-checkin'
set :repo_url, 'git@git.5xruby.tw:5xruby-codeme/tamashii-checkin.git'

# Default branch is :master
if ENV['CI_BUILD_REF_NAME'].nil?
  ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
else
  set :branch, ENV['CI_BUILD_REF_NAME']
end

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files,
       'config/database.yml',
       'config/settings.yml',
       'config/secrets.yml'

# Default value for linked_dirs is []
# append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system'

# Default value for default_env is {}
# set :default_env, { path: '/opt/ruby/bin:$PATH' }
set :default_env, path: '/usr/local/ruby-2.4.1/bin:$PATH'

# Default value for keep_releases is 5
# set :keep_releases, 5

# set :passenger_restart_with_touch, true
set :passenger_environment_variables, { PASSENGER_INSTANCE_REGISTRY_DIR: '/var/lib/passenger-instreg' }
