# this script is to disable DMC on SHC members.
from __future__ import print_function
import sys
import splunk.rest as rest
import json
from splunk import LicenseRestriction

SHC_CONFIG_ENDPOINT = '/services/shcluster/config?output_mode=json'
DISABLE_DMC_APP_CONF_ENDPOINT = '/services/apps/local/splunk_management_console/disable?output_mode=json'


def log_to_splunkd(level, message):
    # the log event will be: log_level=<level> component="ExecProcessor" source=splunkd.log sourcetype=splunkd
    # note DEBUG won't show normally unless you lower your level setting
    print(level.upper() + ' ' + message, file=sys.stderr)


def disable_dmc_on_shc():
    session_key = sys.stdin.read()

    try:
        (shc_response, shc_content) = rest.simpleRequest(SHC_CONFIG_ENDPOINT, session_key)
    except LicenseRestriction:
        log_to_splunkd('info', 'Cannot detect SHC status because of License Restriction. Will not disable DMC.')
        return
    shc_config = json.loads(shc_content)
    mode = shc_config['entry'][0]['content']['mode']
    if mode != 'disabled':
        log_to_splunkd('info', 'SHC is enabled, mode is ' + mode + ', disable DMC ...')
        rest.simpleRequest(DISABLE_DMC_APP_CONF_ENDPOINT, sessionKey=session_key, method='POST')


if __name__ == '__main__':
    try:
        disable_dmc_on_shc()
    except:
        log_to_splunkd('error', 'DMC is not disabled due to an error.')
        raise
