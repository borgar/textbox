
<a name="readmemd"></a>

# @borgar/textbox

## Classes

- [Rotator](#classesrotatormd)
- [Textbox](#classestextboxmd)

## Interfaces

- [Break](#interfacesbreakmd)
- [LineBreak](#interfaceslinebreakmd)
- [SoftHyphen](#interfacessofthyphenmd)
- [Token](#interfacestokenmd)

## Type Aliases

- [Alignment](#type-aliasesalignmentmd)
- [FontProps](#type-aliasesfontpropsmd)
- [FontStyle](#type-aliasesfontstylemd)
- [FontVariant](#type-aliasesfontvariantmd)
- [HAlignment](#type-aliaseshalignmentmd)
- [LayoutOptions](#type-aliaseslayoutoptionsmd)
- [Line](#type-aliaseslinemd)
- [Lines](#type-aliaseslinesmd)
- [LinesProps](#type-aliaseslinespropsmd)
- [MeasureOptions](#type-aliasesmeasureoptionsmd)
- [MinimalCanvas](#type-aliasesminimalcanvasmd)
- [MinimalCanvasContext](#type-aliasesminimalcanvascontextmd)
- [NumberFunc](#type-aliasesnumberfuncmd)
- [NumberLineFunc](#type-aliasesnumberlinefuncmd)
- [Overflow](#type-aliasesoverflowmd)
- [OverflowWrap](#type-aliasesoverflowwrapmd)
- [RotatorOptions](#type-aliasesrotatoroptionsmd)
- [VAlignment](#type-aliasesvalignmentmd)

## Functions

- [htmlparser](#functionshtmlparsermd)
- [latexparser](#functionslatexparsermd)
- [measureText](#functionsmeasuretextmd)
- [setMeasureCanvas](#functionssetmeasurecanvasmd)
- [textparser](#functionstextparsermd)

## References

### default

Renames and re-exports [Textbox](#classestextboxmd)


<a name="classesrotatormd"></a>

# Rotator

A convenience utility class to assist rotating text.

## Constructors

### Constructor

```ts
new Rotator(opts: RotatorOptions): Rotator;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `opts` | [`RotatorOptions`](#type-aliasesrotatoroptionsmd) |

#### Returns

`Rotator`

## Properties

| Property | Modifier | Type | Default value |
| ------ | ------ | ------ | ------ |
| <a id="createelement"></a> `createElement` | `static` | (`name`: `string`, `props?`: \| `Record`\<`string`, `string` \| `number` \| `boolean` \| `null`\> \| `null`, ...`children`: (`string` \| `SVGElement` \| `null` \| `undefined`)[]) => `SVGElement` | `createElement` |

## Accessors

### origin

#### Get Signature

```ts
get origin(): [number, number];
```

Origin point of the rotation

##### Returns

\[`number`, `number`\]

## Methods

### align()

#### Call Signature

```ts
align(): HAlignment;
```

Controls the horizontal alignment of the text.

By default this will be set to `"left"`.

##### Returns

[`HAlignment`](#type-aliaseshalignmentmd)

#### Call Signature

```ts
align(align: HAlignment): this;
```

Controls the horizontal alignment of the text.

By default this will be set to `"left"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `align` | [`HAlignment`](#type-aliaseshalignmentmd) |

##### Returns

`this`

***

### anchor()

#### Call Signature

```ts
anchor(): string;
```

A convenience method to set or get a rotation anchor.

A rotation anchor controls the origin point of the rotation relative to textbox.
It is a string of one or more of alignment keywords separated by spaces.

Keywords: [ `top`, `middle`, `bottom`, `left`, `center`, `right` ].

By default it is set to `"top left"`

##### Returns

`string`

#### Call Signature

```ts
anchor(anchor: string): this;
```

A convenience method to set or get a rotation anchor.

A rotation anchor controls the origin point of the rotation relative to textbox.
It is a string of one or more of alignment keywords separated by spaces.

Keywords: [ `top`, `middle`, `bottom`, `left`, `center`, `right` ].

By default it is set to `"top left"`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `anchor` | `string` |

##### Returns

`this`

***

### createElement()

#### Call Signature

```ts
createElement(): CreateElementFunc;
```

The element factory function to use when constructing SVG elements within the SVG renderer.

The interface conforms to React's `React.createElement` so you may simply set that function as
the factory if you want to use the rendered text in a React render tree.

##### Returns

`CreateElementFunc`

#### Call Signature

```ts
createElement(factory: CreateElementFunc): this;
```

The element factory function to use when constructing SVG elements within the SVG renderer.

The interface conforms to React's `React.createElement` so you may simply set that function as
the factory if you want to use the rendered text in a React render tree.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `factory` | `CreateElementFunc` |

##### Returns

`this`

***

### height()

#### Call Signature

```ts
height(): number;
```

Controls the height of the rotation box in pixels.

By default this will be set to `Infinity`.

##### Returns

`number`

#### Call Signature

```ts
height(height: number): this;
```

Controls the height of the rotation box in pixels.

By default this will be set to `Infinity`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `height` | `number` |

##### Returns

`this`

***

### ~~render()~~

#### Call Signature

```ts
render(contentOrCallback: SVGElement): SVGElement;
```

Render onto a Canvas or as an SVG element based on whether a canvas based
target was supplied or not.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `contentOrCallback` | `SVGElement` |

##### Returns

`SVGElement`

##### Deprecated

#### Call Signature

```ts
render(contentOrCallback: () => void, ctx: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
```

Render onto a Canvas or as an SVG element based on whether a canvas based
target was supplied or not.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `contentOrCallback` | () => `void` |
| `ctx` | `OffscreenCanvas` \| `HTMLCanvasElement` \| `CanvasRenderingContext2D` |

##### Returns

`void`

##### Deprecated

***

### renderCanvas()

```ts
renderCanvas(callback: (ctx: CanvasRenderingContext2D) => void, target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
```

Set up a rotated context for additional rendering.

The method will set up a rotated context, call the supplied callback argument
with a CanvasRenderingContext2D as its argument, and then clean up.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`ctx`: `CanvasRenderingContext2D`) => `void` |
| `target` | `OffscreenCanvas` \| `HTMLCanvasElement` \| `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderSVG()

```ts
renderSVG(content: SVGElement): SVGElement;
```

Render an SVG <g> element that is rotated around its origin point and
place the given content inside it.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `content` | `SVGElement` |

#### Returns

`SVGElement`

***

### rotate()

#### Call Signature

```ts
rotate(): number;
```

Controls the angle of rotation in degrees.

By default this will be set to `0`.

##### Returns

`number`

#### Call Signature

```ts
rotate(degrees: number): this;
```

Controls the angle of rotation in degrees.

By default this will be set to `0`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `degrees` | `number` |

##### Returns

`this`

***

### valign()

#### Call Signature

```ts
valign(): VAlignment;
```

Controls the vertical anchor point of the rotation.

By default this will be set to `"top"`.

##### Returns

[`VAlignment`](#type-aliasesvalignmentmd)

#### Call Signature

```ts
valign(align: VAlignment): this;
```

Controls the vertical anchor point of the rotation.

By default this will be set to `"top"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `align` | [`VAlignment`](#type-aliasesvalignmentmd) |

##### Returns

`this`

***

### width()

#### Call Signature

```ts
width(): number;
```

Controls the width of the rotation box in pixels.

By default this will be set to `Infinity`.

##### Returns

`number`

#### Call Signature

```ts
width(width: number): this;
```

Controls the width of the rotation box in pixels.

By default this will be set to `Infinity`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |

##### Returns

`this`


<a name="classestextboxmd"></a>

# Textbox

A Textbox formatter that allows flowing rich text into a preset area.

## Constructors

### Constructor

```ts
new Textbox(options?: Partial<LayoutOptions>): Textbox;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `Partial`\<[`LayoutOptions`](#type-aliaseslayoutoptionsmd)\> |

#### Returns

`Textbox`

## Properties

| Property | Modifier | Type | Default value | Description |
| ------ | ------ | ------ | ------ | ------ |
| <a id="createelement"></a> `createElement` | `static` | (`name`: `string`, `props?`: \| `Record`\<`string`, `string` \| `number` \| `boolean` \| `null`\> \| `null`, ...`children`: (`string` \| `SVGElement` \| `null` \| `undefined`)[]) => `SVGElement` | `createElement` | Default factory function to use when constructing SVG elements. |
| <a id="defaultparser"></a> `defaultparser` | `static` | (`text?`: `string` \| `null`) => [`Token`](#interfacestokenmd)[] | `textparser` | Default parser to use when consuming text. |
| <a id="measuretext"></a> `measureText` | `static` | (`token`: `string` \| [`Token`](#interfacestokenmd), `font`: `string` \| [`FontProps`](#type-aliasesfontpropsmd), `options`: [`MeasureOptions`](#type-aliasesmeasureoptionsmd)) => `number` | `measureText` | Measure a string of text as printed with a specified font and return its width. |
| <a id="setmeasurecanvas"></a> `setMeasureCanvas` | `static` | (`canvas`: [`MinimalCanvas`](#type-aliasesminimalcanvasmd) \| `null`) => `void` | `setMeasureCanvas` | Set the canvas to use when measuring text (in a non-browser environment). |

## Methods

### align()

#### Call Signature

```ts
align(): Alignment;
```

Controls the horizontal alignment of the text.

By default this will be set to `"left"`.

##### Returns

[`Alignment`](#type-aliasesalignmentmd)

#### Call Signature

```ts
align(align: Alignment): this;
```

Controls the horizontal alignment of the text.

By default this will be set to `"left"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `align` | [`Alignment`](#type-aliasesalignmentmd) |

##### Returns

`this`

***

### createElement()

#### Call Signature

```ts
createElement(): CreateElementFunc;
```

The element factory function to use when constructing SVG elements within the SVG renderer.

The interface conforms to React's `React.createElement` so you may simply set that function as
the factory if you want to use the rendered text in a React render tree.

##### Returns

`CreateElementFunc`

#### Call Signature

```ts
createElement(factory: CreateElementFunc): this;
```

The element factory function to use when constructing SVG elements within the SVG renderer.

The interface conforms to React's `React.createElement` so you may simply set that function as
the factory if you want to use the rendered text in a React render tree.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `factory` | `CreateElementFunc` |

##### Returns

`this`

***

### font()

#### Call Signature

```ts
font(): string;
```

Set or get a default font for the text. Parts of the text
may override the default font, but this defines the font used
when nothing else is specified.

The method assumes a [CSS-style font declaration])(eb/CSS/Reference/Properties/font)
string.

By default this will be set to `"12px/14px sans-serif"`.

##### Returns

`string`

#### Call Signature

```ts
font(font: string): this;
```

Set or get a default font for the text. Parts of the text
may override the default font, but this defines the font used
when nothing else is specified.

The method assumes a [CSS-style font declaration])(eb/CSS/Reference/Properties/font)
string.

By default this will be set to `"12px/14px sans-serif"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `font` | `string` |

##### Returns

`this`

***

### height()

#### Call Signature

```ts
height(): number | NumberFunc;
```

Controls the height of the textbox in which to fit the text.

By default this will be set to `Infinity` which mean text will
not be subject to overflow.

##### Returns

`number` \| [`NumberFunc`](#type-aliasesnumberfuncmd)

#### Call Signature

```ts
height(height: number | NumberFunc): this;
```

Controls the height of the textbox in which to fit the text.

By default this will be set to `Infinity` which mean text will
not be subject to overflow.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `height` | `number` \| [`NumberFunc`](#type-aliasesnumberfuncmd) |

##### Returns

`this`

***

### linebreak()

```ts
linebreak(text: string): Lines;
```

Parses text, flows it into the set dimensions and returns a list of the lines.
The returned object can then be passed on to the renderer.

As well as a list of lines of tokens, the lines object has a height property
which is useful if you want to set the render destination to the fit the text.

The lines object also includes a .hasOverflow property which indicates if the
text was able to fit a designated height. It will be `true` if the text did not
fit the defined space.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

#### Returns

[`Lines`](#type-aliaseslinesmd)

***

### overflow()

#### Call Signature

```ts
overflow(): string;
```

The symbol to use when indicating text overflow (text that
is cut off because it doesn't fit within the set boundaries).

May be set to any string or the keyword `"ellipsis"`.

By default this will be set to `"ellipsis"` which prints `…`.

##### Returns

`string`

#### Call Signature

```ts
overflow(overflow: string): this;
```

The symbol to use when indicating text overflow (text that
is cut off because it doesn't fit within the set boundaries).

May be set to any string or the keyword `"ellipsis"`.

By default this will be set to `"ellipsis"` which prints `…`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `overflow` | `string` |

##### Returns

`this`

***

### overflowLine()

#### Call Signature

```ts
overflowLine(): string;
```

The symbol to use when indicating a single line text overflow.

May be set to any string or `""` to turn off line overflow cutoff.

By default this will be set to `""` which will allow words longer
than the width of the textbox to print in full.

##### Returns

`string`

#### Call Signature

```ts
overflowLine(overflow: string): this;
```

The symbol to use when indicating a single line text overflow.

May be set to any string or `""` to turn off line overflow cutoff.

By default this will be set to `""` which will allow words longer
than the width of the textbox to print in full.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `overflow` | `string` |

##### Returns

`this`

***

### overflowWrap()

#### Call Signature

```ts
overflowWrap(): OverflowWrap;
```

Controls whether line breaks should be inserted within an otherwise unbreakable
string to prevent text from overflowing the textbox.

- Set this to `"break-word"` to allow extra breaks mid-word.
- Set this to `"normal"` to only allow natural breaks at whitespace, punctuation, or hyphens.

By default this will be set to `"normal"`.

##### Returns

[`OverflowWrap`](#type-aliasesoverflowwrapmd)

#### Call Signature

```ts
overflowWrap(wrap: OverflowWrap): this;
```

Controls whether line breaks should be inserted within an otherwise unbreakable
string to prevent text from overflowing the textbox.

- Set this to `"break-word"` to allow extra breaks mid-word.
- Set this to `"normal"` to only allow natural breaks at whitespace, punctuation, or hyphens.

By default this will be set to `"normal"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `wrap` | [`OverflowWrap`](#type-aliasesoverflowwrapmd) |

##### Returns

`this`

***

### parser()

#### Call Signature

```ts
parser(): (text: string) => Token[];
```

The parser to use when parsing text input.

- Set it to `"text"` for plaintext parsing.
- Set it to `"html"` for basic HTML parsing (it understands such things as `<b>`, `<sup>`, `<tt>`, ...).
- Set it to `"latex"` for a very basic LaTeX parser (it understands basic text commands and punctuation - no math mode).

An alternative parser may be provided as a callback, as long as it conforms to the parser interface.

By default the parser is set to `"text"`.

##### Returns

```ts
(text: string): Token[];
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

[`Token`](#interfacestokenmd)[]

#### Call Signature

```ts
parser(parser: 
  | "text"
  | (text: string) => Token[]
  | "html"
  | "latex"): this;
```

The parser to use when parsing text input.

- Set it to `"text"` for plaintext parsing.
- Set it to `"html"` for basic HTML parsing (it understands such things as `<b>`, `<sup>`, `<tt>`, ...).
- Set it to `"latex"` for a very basic LaTeX parser (it understands basic text commands and punctuation - no math mode).

An alternative parser may be provided as a callback, as long as it conforms to the parser interface.

By default the parser is set to `"text"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `parser` | \| `"text"` \| (`text`: `string`) => [`Token`](#interfacestokenmd)[] \| `"html"` \| `"latex"` |

##### Returns

`this`

***

### ~~render()~~

#### Call Signature

```ts
render(text: string | Lines): SVGElement;
```

Render text or linebreak-output onto a Canvas or as an SVG element.

This method determines which render output is desired based on whether a canvas based
target was supplied or not.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` \| [`Lines`](#type-aliaseslinesmd) |

##### Returns

`SVGElement`

##### Deprecated

#### Call Signature

```ts
render(text: string | Lines, target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
```

Render text or linebreak-output onto a Canvas or as an SVG element.

This method determines which render output is desired based on whether a canvas based
target was supplied or not.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` \| [`Lines`](#type-aliaseslinesmd) |
| `target` | `OffscreenCanvas` \| `HTMLCanvasElement` \| `CanvasRenderingContext2D` |

##### Returns

`void`

##### Deprecated

***

### renderCanvas()

```ts
renderCanvas(text: string | Lines, target: OffscreenCanvas | HTMLCanvasElement | CanvasRenderingContext2D): void;
```

Render text or linebreak-output onto a Canvas.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` \| [`Lines`](#type-aliaseslinesmd) |
| `target` | `OffscreenCanvas` \| `HTMLCanvasElement` \| `CanvasRenderingContext2D` |

#### Returns

`void`

***

### renderSVG()

```ts
renderSVG(text: string | Lines): SVGElement;
```

Render text or linebreak-output as an SVG element.

The output will be a single root text element with the lines and sections contained within.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` \| [`Lines`](#type-aliaseslinesmd) |

#### Returns

`SVGElement`

***

### valign()

#### Call Signature

```ts
valign(): VAlignment;
```

Controls the vertical alignment of the text.

By default this will be set to `"top"`.

##### Returns

[`VAlignment`](#type-aliasesvalignmentmd)

#### Call Signature

```ts
valign(align: VAlignment): this;
```

Controls the vertical alignment of the text.

By default this will be set to `"top"`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `align` | [`VAlignment`](#type-aliasesvalignmentmd) |

##### Returns

`this`

***

### width()

#### Call Signature

```ts
width(): number | NumberLineFunc;
```

Controls the width of the textbox in which to fit the text.

This can be a callback function if you want runaround text layout,
or to flow the text into irregular space.

By default this will be set to `Infinity` which prints a text
without linebreaks into a single line.

##### Returns

`number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd)

#### Call Signature

```ts
width(width: number | NumberLineFunc): this;
```

Controls the width of the textbox in which to fit the text.

This can be a callback function if you want runaround text layout,
or to flow the text into irregular space.

By default this will be set to `Infinity` which prints a text
without linebreaks into a single line.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd) |

##### Returns

`this`

***

### x()

#### Call Signature

```ts
x(): number | NumberLineFunc;
```

Controls the indentation of text lines.

This is useful for fitting text into non-rectanglular shapes. A callback
provided as an argument this will be called every line with the line number
as a parameter.

By default this will be set to `0`.

##### Returns

`number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd)

#### Call Signature

```ts
x(x: number | NumberLineFunc): this;
```

Controls the indentation of text lines.

This is useful for fitting text into non-rectanglular shapes. A callback
provided as an argument this will be called every line with the line number
as a parameter.

By default this will be set to `0`.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd) |

##### Returns

`this`


<a name="functionshtmlparsermd"></a>

# htmlparser()

```ts
function htmlparser(text?: string | null): Token[];
```

Parse a very small subset of HTML.

This parser can handle linebreaks, as well as inline text
instruction tags such as `<b>`, `<tt>`, `<em>`, `<sup>`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `text?` | `string` \| `null` |

## Returns

[`Token`](#interfacestokenmd)[]


<a name="functionslatexparsermd"></a>

# latexparser()

```ts
function latexparser(text?: string | null): Token[];
```

Parse a very small subset of LaTeX.

This parser can handle linebreaks, verbatim, as well as inline text
instructions for non-math text. Math mode is not supported at all.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `text?` | `string` \| `null` |

## Returns

[`Token`](#interfacestokenmd)[]


<a name="functionsmeasuretextmd"></a>

# measureText()

```ts
function measureText(
   token: string | Token, 
   font: string | FontProps, 
   options: MeasureOptions): number;
```

Measure a string of text as printed with a specified font and return its width.

Be careful that in non-browser environments you may want to supply an alternative
canvas using [setMeasureCanvas](#functionssetmeasurecanvasmd) or this method will default to a crude
"best guess" method.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `token` | `string` \| [`Token`](#interfacestokenmd) | `undefined` | A string or token of text to measure. |
| `font` | `string` \| [`FontProps`](#type-aliasesfontpropsmd) | `undefined` | A CSS font shorthand string or a collection of font properties. |
| `options` | [`MeasureOptions`](#type-aliasesmeasureoptionsmd) | `defaultOptions` | Text handling options. |

## Returns

`number`


<a name="functionssetmeasurecanvasmd"></a>

# setMeasureCanvas()

```ts
function setMeasureCanvas(canvas: MinimalCanvas | null): void;
```

Set the canvas to use when measuring text. This will be needed when using [measureText](#functionsmeasuretextmd)
in a non-browser environment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `canvas` | [`MinimalCanvas`](#type-aliasesminimalcanvasmd) \| `null` | The canvas interface to use. |

## Returns

`void`


<a name="functionstextparsermd"></a>

# textparser()

```ts
function textparser(text?: string | null): Token[];
```

A basic text parser that sections texts into words but also
deals with inserting appropriate breaks at correct points.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `text?` | `string` \| `null` |

## Returns

[`Token`](#interfacestokenmd)[]


<a name="interfacesbreakmd"></a>

# Break

Represents a unit of text, typically a single word.

## Extends

- [`Token`](#interfacestokenmd)

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="font"></a> `font` | [`FontProps`](#type-aliasesfontpropsmd) | [`Token`](#interfacestokenmd).[`font`](#font) |
| <a id="line"></a> `line?` | `number` | [`Token`](#interfacestokenmd).[`line`](#line) |
| <a id="value"></a> `value` | `string` | [`Token`](#interfacestokenmd).[`value`](#value) |
| <a id="whitespace"></a> `whitespace` | `boolean` \| `undefined` | [`Token`](#interfacestokenmd).[`whitespace`](#whitespace) |
| <a id="width"></a> `width` | `number` | [`Token`](#interfacestokenmd).[`width`](#width) |

## Methods

### toJSON()

```ts
toJSON(): any;
```

#### Returns

`any`

#### Overrides

[`Token`](#interfacestokenmd).[`toJSON`](#tojson)


<a name="interfaceslinebreakmd"></a>

# LineBreak

Represents a unit of text, typically a single word.

## Extends

- [`Token`](#interfacestokenmd)

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="font"></a> `font` | [`FontProps`](#type-aliasesfontpropsmd) | [`Token`](#interfacestokenmd).[`font`](#font) |
| <a id="line"></a> `line?` | `number` | [`Token`](#interfacestokenmd).[`line`](#line) |
| <a id="value"></a> `value` | `string` | [`Token`](#interfacestokenmd).[`value`](#value) |
| <a id="whitespace"></a> `whitespace` | `boolean` \| `undefined` | [`Token`](#interfacestokenmd).[`whitespace`](#whitespace) |
| <a id="width"></a> `width` | `number` | [`Token`](#interfacestokenmd).[`width`](#width) |

## Methods

### toJSON()

```ts
toJSON(): any;
```

#### Returns

`any`

#### Overrides

[`Token`](#interfacestokenmd).[`toJSON`](#tojson)


<a name="interfacessofthyphenmd"></a>

# SoftHyphen

Represents a unit of text, typically a single word.

## Extends

- [`Token`](#interfacestokenmd)

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="font"></a> `font` | [`FontProps`](#type-aliasesfontpropsmd) | [`Token`](#interfacestokenmd).[`font`](#font) |
| <a id="line"></a> `line?` | `number` | [`Token`](#interfacestokenmd).[`line`](#line) |
| <a id="value"></a> `value` | `string` | [`Token`](#interfacestokenmd).[`value`](#value) |
| <a id="whitespace"></a> `whitespace` | `boolean` \| `undefined` | [`Token`](#interfacestokenmd).[`whitespace`](#whitespace) |
| <a id="width"></a> `width` | `number` | [`Token`](#interfacestokenmd).[`width`](#width) |

## Methods

### toJSON()

```ts
toJSON(): any;
```

#### Returns

`any`

#### Overrides

[`Token`](#interfacestokenmd).[`toJSON`](#tojson)


<a name="interfacestokenmd"></a>

# Token

Represents a unit of text, typically a single word.

## Extended by

- [`Break`](#interfacesbreakmd)
- [`LineBreak`](#interfaceslinebreakmd)
- [`SoftHyphen`](#interfacessofthyphenmd)

## Properties

| Property | Type |
| ------ | ------ |
| <a id="font"></a> `font` | [`FontProps`](#type-aliasesfontpropsmd) |
| <a id="line"></a> `line?` | `number` |
| <a id="value"></a> `value` | `string` |
| <a id="whitespace"></a> `whitespace` | `boolean` \| `undefined` |
| <a id="width"></a> `width` | `number` |

## Methods

### toJSON()

```ts
toJSON(): any;
```

#### Returns

`any`


<a name="type-aliasesalignmentmd"></a>

# Alignment

```ts
type Alignment = "left" | "center" | "right" | "justify";
```

Text alignment.


<a name="type-aliasesfontpropsmd"></a>

# FontProps

```ts
type FontProps = {
  baseline?: number;
  class?: string;
  color?: string;
  family?: string;
  height?: number;
  href?: string;
  rel?: string;
  size?: number;
  sizeAdjust?: number;
  style?: FontStyle;
  target?: string;
  tracking?: number;
  variant?: FontVariant;
  weight?: number;
};
```

A collection of font properties or styles.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="baseline"></a> `baseline?` | `number` | Baseline adjustment factor (such as for sub-/superscript). |
| <a id="class"></a> `class?` | `string` | Class identifier to be applied to emitted elements. |
| <a id="color"></a> `color?` | `string` | Color of the text. |
| <a id="family"></a> `family?` | `string` | Name of the font's type family. |
| <a id="height"></a> `height?` | `number` | Height of the leading (line-height). |
| <a id="href"></a> `href?` | `string` | HREF URL property for the text. |
| <a id="rel"></a> `rel?` | `string` | Rel identifier to be applied to emitted link elements (use with href). |
| <a id="size"></a> `size?` | `number` | Size of the font in pixels. |
| <a id="sizeadjust"></a> `sizeAdjust?` | `number` | Size adjustment multiplier (such as for sub-/superscript). |
| <a id="style"></a> `style?` | [`FontStyle`](#type-aliasesfontstylemd) | Style of the font (italics or not). |
| <a id="target"></a> `target?` | `string` | Link target identifier to be applied to emitted link elements (use with href). |
| <a id="tracking"></a> `tracking?` | `number` | Tracking (multiplier) for the text. |
| <a id="variant"></a> `variant?` | [`FontVariant`](#type-aliasesfontvariantmd) | Variant of the font (Small-Caps or not). |
| <a id="weight"></a> `weight?` | `number` | Weight of the font as a number (400 is regular). |


<a name="type-aliasesfontstylemd"></a>

# FontStyle

```ts
type FontStyle = "normal" | "italic";
```

Font style.


<a name="type-aliasesfontvariantmd"></a>

# FontVariant

```ts
type FontVariant = "normal" | "small-caps";
```

Font variant.


<a name="type-aliaseshalignmentmd"></a>

# HAlignment

```ts
type HAlignment = "left" | "center" | "right";
```

Horizontal alignment.


<a name="type-aliaseslayoutoptionsmd"></a>

# LayoutOptions

```ts
type LayoutOptions = {
  align: Alignment;
  createElement: CreateElementFunc;
  font: string;
  height: number | NumberFunc;
  overflow: Overflow;
  overflowLine: Overflow;
  overflowWrap: OverflowWrap;
  parser: (text: string) => Token[];
  valign: VAlignment;
  width: number | NumberLineFunc;
  x: number | NumberLineFunc;
};
```

Options for a textbox and how text flows inside it.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="align"></a> `align` | [`Alignment`](#type-aliasesalignmentmd) | `"top"` | Horizontal alignment of the text. |
| <a id="createelement"></a> `createElement` | `CreateElementFunc` | `Infinity` | Factory function to use when constructing SVG elements. |
| <a id="font"></a> `font` | `string` | `Infinity` | Default font to use (as CSS shorthand). |
| <a id="height"></a> `height` | `number` \| [`NumberFunc`](#type-aliasesnumberfuncmd) | `Infinity` | Height of the textbox in pixels. |
| <a id="overflow"></a> `overflow` | [`Overflow`](#type-aliasesoverflowmd) | `"ellipsis"` | The symbol to use when indicating text overflow ("…"). |
| <a id="overflowline"></a> `overflowLine` | [`Overflow`](#type-aliasesoverflowmd) | `""` | Symbol to use when indicating line overflow, or "" when line overflow is off. |
| <a id="overflowwrap"></a> `overflowWrap` | [`OverflowWrap`](#type-aliasesoverflowwrapmd) | `"normal"` | Whether breaks should be inserted within an otherwise unbreakable word to prevent overflowing the textbox. |
| <a id="parser"></a> `parser` | (`text`: `string`) => [`Token`](#interfacestokenmd)[] | `Textbox.defaultparser` | Which parser to use when parsing text input. |
| <a id="valign"></a> `valign` | [`VAlignment`](#type-aliasesvalignmentmd) | `"left"` | Vertical alignment of the text. |
| <a id="width"></a> `width` | `number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd) | `Infinity` | Width of the textbox in pixels. |
| <a id="x"></a> `x` | `number` \| [`NumberLineFunc`](#type-aliasesnumberlinefuncmd) | `0` | Line horizontal offset factor or per-line callback to control horizontal offset. |


<a name="type-aliaseslinemd"></a>

# Line

```ts
type Line = Token[] & {
  width: number;
};
```

A (linebroken) line of Tokens

## Type Declaration

### width

```ts
width: number;
```


<a name="type-aliaseslinesmd"></a>

# Lines

```ts
type Lines = Line[] & LinesProps;
```

A collection of flowed text lines & their properties.


<a name="type-aliaseslinespropsmd"></a>

# LinesProps

```ts
type LinesProps = {
  font: FontProps;
  hasLineOverflow: boolean;
  hasOverflow: boolean;
  height: number;
  width: number;
};
```

Additional properties for linebroken text.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="font"></a> `font` | [`FontProps`](#type-aliasesfontpropsmd) | Default font properties used. |
| <a id="haslineoverflow"></a> `hasLineOverflow` | `boolean` | Does any line have line-overflow? |
| <a id="hasoverflow"></a> `hasOverflow` | `boolean` | Did the text overflow? |
| <a id="height"></a> `height` | `number` | Height of the layed-out text. |
| <a id="width"></a> `width` | `number` | Width of the layed-out text. |


<a name="type-aliasesmeasureoptionsmd"></a>

# MeasureOptions

```ts
type MeasureOptions = {
  collapse?: boolean;
  trim?: boolean;
};
```

Options for text measuring.

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="collapse"></a> `collapse?` | `boolean` | `true` | Should whitespace in the text get collapsed (like in HTML)? |
| <a id="trim"></a> `trim?` | `boolean` | `true` | Should the text be trimmed before measuring? |


<a name="type-aliasesminimalcanvasmd"></a>

# MinimalCanvas

```ts
type MinimalCanvas = {
  getContext: (contextId: "2d") => MinimalCanvasContext | null;
};
```

Minimal Canvas interface needed.

## Properties

| Property | Type |
| ------ | ------ |
| <a id="getcontext"></a> `getContext` | (`contextId`: `"2d"`) => [`MinimalCanvasContext`](#type-aliasesminimalcanvascontextmd) \| `null` |


<a name="type-aliasesminimalcanvascontextmd"></a>

# MinimalCanvasContext

```ts
type MinimalCanvasContext = {
  font: string;
  measureText: (text: string) => {
     width: number;
  };
};
```

Minimal CanvasRenderingContext2D interface needed.

## Properties

| Property | Type |
| ------ | ------ |
| <a id="font"></a> `font` | `string` |
| <a id="measuretext"></a> `measureText` | (`text`: `string`) => \{ `width`: `number`; \} |


<a name="type-aliasesnumberfuncmd"></a>

# NumberFunc()

```ts
type NumberFunc = () => number;
```

A function that emits a width or height in pixels.

## Returns

`number`


<a name="type-aliasesnumberlinefuncmd"></a>

# NumberLineFunc()

```ts
type NumberLineFunc = (line?: number) => number;
```

A function accepting a line number that emits a width or height in pixels.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `line?` | `number` |

## Returns

`number`


<a name="type-aliasesoverflowmd"></a>

# Overflow

```ts
type Overflow = "ellipsis" | string;
```

Overflow indication symbol.


<a name="type-aliasesoverflowwrapmd"></a>

# OverflowWrap

```ts
type OverflowWrap = "break-word" | "normal";
```

Overflow wrap behavior.


<a name="type-aliasesrotatoroptionsmd"></a>

# RotatorOptions

```ts
type RotatorOptions = {
  anchor: string;
  createElement: CreateElementFunc;
  height: number;
  rotate: number;
  width: number;
};
```

Options for the Rotator class

## Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="anchor"></a> `anchor` | `string` | `"top left"` | An anchor point for the rotation orientation (such as `top center`) |
| <a id="createelement"></a> `createElement` | `CreateElementFunc` | `Rotator.createElement` | SVG Element factory |
| <a id="height"></a> `height` | `number` | `Infinity` | Height of the rotated box (in pixels) |
| <a id="rotate"></a> `rotate` | `number` | `0` | Rotation of the content (in degrees) |
| <a id="width"></a> `width` | `number` | `Infinity` | Width of the rotated box (in pixels) |


<a name="type-aliasesvalignmentmd"></a>

# VAlignment

```ts
type VAlignment = "top" | "middle" | "bottom";
```

Vertical alignment.
