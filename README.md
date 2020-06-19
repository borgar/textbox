# Textbox

Textbox is a simple library to layout text for display on SVG or Canvas. It can fairly decently line-break and render rich text given some boundaries. It understands simple text, and a subset of HTML and LaTeX syntax. The original purpose of this software is to aid labeling charts.

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

<a name="textbox" href="#textbox">#</a> the **Textbox** class

For any use, you will need to start by defining a new Textbox instance. You may pass a configuration object as a parameter:

```js
const box = new Textbox({
  font: '12px/14px sans-serif',
  width Infinity,
  height: Infinity,
  align: 'left'
  valign: 'top'
  x: 0,
  overflow: 'ellipsis',
  parser: Textbox.defaultparser,
  createElement: Textbox.createElement
});
```
Shown here are the defaults, but any or all of the above parameters can be provided. The Textbox instance will provide methods by the same name, along with line-breaking and rendering methods:

```js
const box = new Textbox()
  .font('12px/14px sans-serif')
  .align('left')
  .createElement(React.createElement);
```


---


<a name="font" href="#font">#</a> .**font**( _[css_font_shorthand](https://developer.mozilla.org/en-US/docs/Web/CSS/font)_ )

Define what font to use. This will allow setting both font-size and line-height as well as font-family. Defaults to `12px/14px sans-serif`.


<a name="width" href="#width">#</a> .**width**( _width_in_px_ )

Controls the horizontal dimension of the text. This can be a callback function if you want runaround text layout, or to flow the text into irregular space. Defaults to `Infinity` (a single line).

A callback provided to this will be called every line with the line number as a parameter.


<a name="height" href="#height">#</a> .**height**( _height_in_px_ )

Controls the vertical dimension of the text. Defaults to `Infinity`. If the text ends up with more lines than fit into the height, the text is cut and postfixed with an overflow indicator (see <a href="#overflow">overflow</a>).


<a name="x" href="#x">#</a> .**x**( _indent_in_px_ )

Sets text horizontal indent. This is most useful for flowing text into  irregular shapes. A callback provided to this will be called every line with the line number as a parameter.


<a name="align" href="#align">#</a> .**align**( _alignment_ )

Sets text horizontal alignment. Accepts all values you would expect CSS `text-align` to understand, as well as SVG `text-anchor` equivalents: *left, start, center, middle, right, end,* and *justify*.


<a name="valign" href="#valign">#</a> .**valign**( _alignment_ )

Sets text vertical alignment. Accepts all values you would expect CSS `vertical-align` to understand: *top, start, center, middle, bottom,* and *end*.


<a name="overflow" href="#overflow">#</a> .**overflow**( _indicator_ )

Sets text overflow mark, similar to CSS `text-overflow`. The keyword `ellipsis` will set the overflow mark to `…`, otherwise the provided string is used as-is.


<a name="overflowline" href="#overflowline">#</a> .**overflowLine**( _indicator_ )

Sets text per-line overflow mark, similar to `.overflow`. This setting is off by default. The keyword `ellipsis` will set the overflow mark to `…`, otherwise the provided string is used as-is.


<a name="parser" href="#parser">#</a> .**parser**( _parser_ )

Selects which text parser to use. The available parsers are:

 - `Textbox.textparser` (the default, may be selected with `"text"`)
 - `Textbox.htmlparser` (may be selected with `"html"`)
 - `Textbox.latexparser` (may be selected with `"latext"`)

Textbox will look for a parser on the instance first, then default to `Textbox.defaultparser`. So you if you know that you will exclusively be using the HTML parser, you can change the default once:

    Textbox.defaultparser = Textbox.htmlparser;

<a name="createElement" href="#createElement">#</a> .**createElement**( _element_factory_ )

Set the element factory method for creating elements for SVG rendering. This has the same interface as [`React.createElement`](https://reactjs.org/docs/react-api.html#createelement) so you may assign that if you are rendering a React application.

If nothing is provided Textbox will default to `Textbox.createElement` so you can change the default once globally:

    Textbox.createElement = React.createElement;


<a name="linebreak" href="#linebreak">#</a> .**linebreak**( _text_ )

Parses text, flows it into the set dimensions and returns a list of the lines. The returned object can then be passed on to <a href="#render">.render()</a>.

As well as a list of lines of tokens, the lines object has a height property which is useful if you want to set the render destination to the fit the text.

The lines object additionally has a render method so you can pass it on without having the originating Textbox instance.

```js
// No height is set to the box
const box = new Textbox({ width: 150 });
// Text is turned into lines
const lines = box.linebreak( longTextPassage );
// Destination canvas is set to the height of the output
myCanvas.height = lines.height;
// Lines are rendered to the canvas
lines.render( myCanvas );
```

The lines render method is flexible when it comes to its arguments. It can accept a `Canvas`, a `CanvasRenderingContext2D`, or nothing in which case it will emit SVG. See <a href="#render">.render()</a>.


<a name="render" href="#render">#</a> .**render**( _text_ )  
<a href="#render">#</a> .**render**( _text_, _Canvas_ )  
<a href="#render">#</a> .**render**( _text_, _CanvasRenderingContext2D_ )  
<a href="#render">#</a> .**render**( _text_, _d3-selection_ )

Render text or a "lines object" (see <a href="#linebreak">.linebreak()</a>) to either SVG or Canvas.

The lines render method is flexible when it comes to its arguments and their order. If provided either a `Canvas`, a `CanvasRenderingContext2D` it will render to the canvas, otherwise it will emit SVG built with the <a href="#createElement">.createElement()</a> interface.



## Limitations:

1. In SVG links do not automatically get color or pointer cursor. You will need to add your own styles to these.
  
       svg text a {
         fill: blue;
         text-decoration: underline;
         cursor: pointer;
       }

1. Multi-word links in SVG text are not necessarily a single entity/element like they are in HTML. If the text in a link is line broken, then hovering one segment will not cause segment in the next line over to trigger hover styles.

1. Text justification is fairly broken in SVG. Avoid it for formatted text.

   1. Justification does now work consistently in all browsers as they have buggy support for the `word-spacing` property. Google Chrome seems to work fine, Safari works for plain text but incorrectly for formatted text. Firefox is lost in the woods.

   1. Because of the way text handling is done in SVG, justifying underlined text will create gaps in the underlined text.

1. Subscript and superscript are bugged in Firefox because they have never implemented the `baseline-shift` property. The [bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=308338#c32) is **15 years old** when this is written so not likely to be solved soon.





