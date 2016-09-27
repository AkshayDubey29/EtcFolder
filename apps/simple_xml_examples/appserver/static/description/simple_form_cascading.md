One form input's selected value can be used to populate a token in
another form input's populating search.

In this example, the selected value in the dropdown populates the token
`$username$`, which is part of the populating search string of the radio
button. The radio button's options are therefore dependent on the
selected dropdown value through the `$username$` token:

```
<populatingSearch fieldForValue="sourcetype" fieldForLabel="sourcetype" earliest="-24h" latest="now">
    index=_internal user=$username$ | stats count by sourcetype
</populatingSearch>
```

For additional information, refer to the Simple XML Reference:

[Form inputs](http://docs.splunk.com/Documentation/Splunk/latest/Viz/PanelreferenceforSimplifiedXML#Form_inputs)
