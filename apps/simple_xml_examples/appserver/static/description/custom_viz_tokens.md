This example shows how to use tokens in combination with Custom Visualizations 

Regular token replacement cannot be used since the HTML element itself would handle tokens, replacing the entire content of the element
once the value of the token changes. Instead, use the following form for token-driven settings:
 
```
{ "type": "token_safe", "value": "$$mytoken$$" }
```
