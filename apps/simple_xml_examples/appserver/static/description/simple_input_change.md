Set multiple tokens within form inputs to drive multiple searches, better labeling, and more.

Key use cases include:

- Set tokens for both label and value to use throughout your dashboard.
- Use this to create a special empty/null choice that includes a unique token transformation.
- Use the selection of a given form input to unset other tokens on the page.
- Create a "simple" time range picker dropdown input that sets a unique earliest and latest token.
- Set multiple tokens based on search results.

### How it Works

- Ability to set/unset multiple tokens within a form input is only available via the XML editor.
- Functional gets triggered on a user selected change event, `<change>`.
- Add conditions if you want to set/unset specific tokens and values based on user selection.
 - conditions can be based on user selected values, `<condition value="last_24hr">`.
 - conditions can be based on user selected labels, `<condition label="Last 24 hours">`.
 - wildcard (partial matching) is NOT support in conditions.
 - asterisk ("*") is interpreted as all other values, `<condition value="*">`.
- Note - conditions are not supported for multiselect and checkbox form inputs (any multivalue input).
- You have the following click information available for use in set/unset, `$label$`, `$value$`.
- For dynamic choices where you run a search, you can set tokens based on search results, $row.field_name.
- set and unset syntax works identical to contextual drilldown.
 - `<set token="my_token_value">$value$</set>`
 - `<set token="my_token_label">$label$</set>`
 - `<set token="my_token">field=$value|s$</set>`
 - `<set token="my_token" prefix="(" suffix=")" delimiter=" OR ">field=$value|s$</set>`
 - `<set token="my_token">$row.sourcetype$</set>`
 - `<unset token="showTable"/>`

Use a static choice "ANY" to represent an empty/null value, where it searches for events both with and without the existence of the field.
```
      <input type="dropdown" token="level">
        <label>Log Level:</label>
        <choice value="ANY">ANY</choice>
        <choice value="ERROR">ERROR</choice>
        <choice value="WARNING">WARNING</choice>
        <choice value="INFO">INFO</choice>
        <default>ANY</default>
        <change>
          <condition value="ANY">
            <set token="s_level"> </set>
          </condition>
          <condition value="*">
            <set token="s_level">log_level=$value|s$</set>
          </condition>
        </change>
      </input>
```
        
Simple Time Range Picker
```
      <input type="dropdown" token="simple">
        <label>Simple Time Picker</label>
        <choice value="last_24h">Last 24 Hours</choice>
        <choice value="last_7d">Last 7 days</choice>
        <choice value="last_30d">Last 30 days</choice>
        <default>last_24h</default>
        <change>
          <condition value="last_24h">
            <set token="simple.label">$label$</set>
            <set token="simple.earliest">-24h</set>
            <set token="simple.latest">now</set>
          </condition>
          <condition value="last_7d">
            <set token="simple.label">$label$</set>
            <set token="simple.earliest">-7d</set>
            <set token="simple.latest">now</set>
          </condition>
          <condition value="last_30d">
            <set token="simple.label">$label$</set>
            <set token="simple.earliest">-30d</set>
            <set token="simple.latest">now</set>
          </condition>
        </change>
      </input>
```
        
Setting token to represent the user selected label
```
      <input type="time" token="time">
        <label></label>
        <default>
           <earliest>-60m@m</earliest>
           <latest>now</latest>
        </default>
        <change>
           <set token="time.label">$label$</set>
        </change>
      </input>
```
        
Hidden Search Swapper
```
<!-- Based on user selected value, set a token to represent the full search string -->

      <form>
        <label>test search swapper</label>
        <fieldset submitButton="false">
          <input type="time" token="field1">
          <label></label>
          <default>
            <earliest>-60m@m</earliest>
            <latest>now</latest>
          </default>
          <change>
            <condition label="All time">
              <set token="new_search">`set_sos_index` sourcetype="ps" $host$
                | multikv
                | `get_splunk_process_type`
                | eval RSZ_MB=RSZ_KB/1024
                | eval VSZ_MB=VSZ_KB/1024
                | bin _time span=5s
                | stats first(pctCPU) AS pctCPU, first(RSZ_MB) AS RSZ_MB, first(VSZ_MB) AS VSZ_MB first(type) AS type by PID _time
                | stats sum(pctCPU) AS pctCPU, sum(RSZ_MB) AS RSZ_MB, sum(VSZ_MB) AS VSZ_MB by type, _time
                | bin _time span=10s
                | sistats avg(pctCPU), median(pctCPU), median(RSZ_MB), median(VSZ_MB) by type, _time</set>
            </condition>
            <condition label="Last 24 hours">
              <set token="new_search">index=_internal sourcetype=splunkd | table _time sourcetype message</set>
            </condition>
            <condition value="*">
              <set token="new_search">index=_internal sourcetype=splunkd | table _time source sourcetype message</set>
            </condition>
          </change>
        </input>
      </fieldset>
   </form>
```

