import Textbox from './Textbox';
import Rotator from './Rotator';

import {
  textparser, htmlparser, latexparser,
  Token, Break, LineBreak, SoftHyphen
} from './parser';

import createElement from './svg/createElement';

Textbox.createElement = createElement;

Textbox.textparser = textparser;
Textbox.defaultparser = textparser;
Textbox.htmlparser = htmlparser;
Textbox.latexparser = latexparser;

Textbox.Token = Token;
Textbox.Break = Break;
Textbox.LineBreak = LineBreak;
Textbox.SoftHyphen = SoftHyphen;

Textbox.Rotator = Rotator;
Rotator.createElement = createElement;

export default Textbox;
