import Textbox from './Textbox';
import Rotator from './Rotator';

import {
  textparser, htmlparser, latexparser,
  Token, Break, LineBreak, SoftHyphen
} from './parser';
import measureText from './measure';
import parseFont from './font';

import createElement from './svg/createElement';

Textbox.createElement = createElement;

Textbox.textparser = textparser;
Textbox.defaultparser = textparser;
Textbox.htmlparser = htmlparser;
Textbox.latexparser = latexparser;

Textbox.measureText = function (text, font) {
  return measureText(text, parseFont(font), false);
};

Textbox.Token = Token;
Textbox.Break = Break;
Textbox.LineBreak = LineBreak;
Textbox.SoftHyphen = SoftHyphen;

Textbox.Rotator = Rotator;
Rotator.createElement = createElement;

export default Textbox;
