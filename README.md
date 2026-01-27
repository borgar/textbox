# Textbox

Textbox is a simple library to layout multiline text for display on SVG or Canvas. It can fairly decently line-break and render rich text given some boundaries. It understands simple text, and a small subset of HTML and LaTeX syntaxes. The original purpose of this software is to aid labeling charts.

Take a look at [Textbox example and demos](https://observablehq.com/collection/@borgar/textbox) if you are curious what this library can do.


#### Features:

- Line-break text to fit dimensions.
- Can overflow text into `...` if it doesn't fit designated area.
- Understands common text features: **bold**, *italic*, [links](https://en.wikipedia.org/wiki/Hyperlink), etc...
- Knows that there is different whitespace like thin, or non-breaking.
- Tries to be smart about line-breaking before or after certain characters (it can occur after `-` but not before).
- Supports hyphenation if text is prepared with [soft-hyphens](https://en.wikipedia.org/wiki/Soft_hyphen).
<!-- - Comes with a separate rotation module. -->


## Installing

If you don't want to download and build Textbox yourself, the library is also provided as an NPM package:

    $ npm install @borgar/textbox



## API Reference

For any use, you will need to start by defining a new Textbox instance. You may pass a configuration object as a parameter:

```js
const box = new Textbox({
  font: '12px/14px sans-serif',
  width: Infinity,
  height: Infinity,
  align: 'left',
  valign: 'top',
  x: 0,
  overflow: 'ellipsis',
  parser: 'text',
  createElement: Textbox.createElement
});
```
Shown here are the defaults, but any or all of the above parameters can be provided. The Textbox instance will provide methods by the same name, along with line-breaking and rendering methods:

```js
const box = new Textbox()
  .font('16px/19px sans-serif')
  .align('center')
  .parser('html')
  .createElement(React.createElement);
```


Full API documentation can be found in [docs/API.md](./docs/API.md).



## Limitations:

1. In SVG links do not automatically get color or pointer cursor. You will need to add your own styles to these.
  
       svg text a {
         fill: blue;
         text-decoration: underline;
         cursor: pointer;
       }

1. Multi-word links in SVG text are not necessarily a single entity/element like they are in HTML. If the text in a link is line-broken, then hovering one segment will not cause segment in the next line over to trigger hover styles.

1. Text justification does not work consistently in all browsers as they have buggy support for the `word-spacing` property. Google Chrome seems to work fine, Safari works for plain text but incorrectly for formatted text. Firefox is fairly random. Test your output in different browsers before you publish.

1. Subscript and superscript are bugged in Firefox because they have never implemented the `baseline-shift` property. The [bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=308338) is **20 years old** currently, so aaaaaany day now.
