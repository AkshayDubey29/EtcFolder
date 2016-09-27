This example shows how you can set tokens using data attributes in HTML elements. The extension script `showtokens.js` 
enables this behavior.

Data attributes on clickable HTML elements (such as links or buttons) allow you to set or unset tokens for the 
dashboard. Available data attributes are:

- `data-set-token` in combination with `data-value` to set a token to a particular value
```
<a href="#" data-set-token="mytoken" data-value="the new token value">Click me</a>
```
- `data-unset-token` to unset a token
```
<a href="#" data-unset-token="mytoken">Click me</a>
```
- `data-token-json` to set or unset multiple tokens by supplying a JSON object (`null` values are used to unset tokens) 
```
<a href="#" data-token-json='{ "token1": "new value", "token2": "other value", "token3": null }'>Click me</a>
```
