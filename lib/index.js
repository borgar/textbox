import Textbox from './Textbox.js';
import Rotator from './Rotator.js';

import {
  textparser, htmlparser, latexparser,
  Token, Break, LineBreak, SoftHyphen
} from './parser/index.js';
import measureText from './measure/index.js';
import parseFont from './font/index.js';

import createElement from './svg/createElement.js';

Textbox.createElement = createElement;

Textbox.textparser = textparser;
Textbox.defaultparser = textparser;
Textbox.htmlparser = htmlparser;
Textbox.latexparser = latexparser;

Textbox.measureText = function (text, font, options) {
  return measureText(text, parseFont(font), options);
};

Textbox.Token = Token;
Textbox.Break = Break;
Textbox.LineBreak = LineBreak;
Textbox.SoftHyphen = SoftHyphen;

Textbox.Rotator = Rotator;
Rotator.createElement = createElement;

export default Textbox;
