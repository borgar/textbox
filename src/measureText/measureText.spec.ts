import { describe, it, expect, afterEach } from 'vitest';
import { measureText, setMeasureCanvas } from './measureText.ts';
import { Token } from '../parser/tokens.ts';

describe('setMeasureCanvas()', () => {
  afterEach(() => {
    setMeasureCanvas(null);
  });

  it('measures text', () => {
    // faking the canvas interface
    const mockCanvas = {
      getContext: () => {
        return { font: '', measureText: () => ({ width: 0.36 }) };
      }
    };
    setMeasureCanvas(mockCanvas);
    expect(measureText('TEST', '20px sans-serif')).toBe(0.36);
  });
});

describe('measureText()', () => {
  it('measures given token', () => {
    const token = new Token('TEST');
    const font = '20px sans-serif';
    expect(measureText(token, font)).toBe(43.199999999999996);
  });

  it('measures given string', () => {
    const font = '20px sans-serif';
    expect(measureText('test', font)).toBe(36);
  });
});

describe('measureText() with whitespace trimming', () => {
  it('measures given token', () => {
    const token = 'TEST';
    const tokenWithWhitespace = '   TEST ';
    const font = '20px sans-serif';
    expect(measureText(token, font)).toBe(measureText(tokenWithWhitespace, font));
  });
});

describe('measureText() without whitespace trimming', () => {
  it('measure can include trailing whitespace', () => {
    const token = 'TEST';
    const tokenWithWhitespace = '   TEST ';
    const font = '20px sans-serif';
    const measureBasic = measureText(token, font);
    const measureNoTrim = measureText(tokenWithWhitespace, font, { trim: false });
    expect(measureBasic).toBeLessThan(measureNoTrim);
  });
});

describe('measureText() without collapsing whitespace', () => {
  it('measure can leave repeated whitespace alone', () => {
    const token = 'A TEST';
    const tokenWithWhitespace = 'A  TEST';
    const font = '20px sans-serif';
    expect(measureText(token, font)).toBeLessThan(
      measureText(tokenWithWhitespace, font, { collapse: false })
    );
  });
});

describe('measureText() handles newlines when not trimming or collapsing whitespace', () => {
  const tokenWithWhitespace = 'A   TEST ';
  const tokenWithNewLines = 'A \n TEST\n';
  const font = '20px sans-serif';

  it('Newlines count as spaces when not trimming whitespace', () => {
    expect(
      measureText(tokenWithWhitespace, font, { trim: false, collapse: true })
    ).toBe(
      measureText(tokenWithNewLines, font, { trim: false, collapse: true })
    );
  });

  it('Newlines count as spaces when not collapsing whitespace', () => {
    expect(
      measureText(tokenWithWhitespace, font, { trim: true, collapse: false })
    ).toBe(
      measureText(tokenWithNewLines, font, { trim: true, collapse: false })
    );
  });

  it('Newlines count as spaces when neither trimming nor collapsing whitespace', () => {
    expect(
      measureText(tokenWithWhitespace, font, { trim: false, collapse: false })
    ).toBe(
      measureText(tokenWithNewLines, font, { trim: false, collapse: false })
    );
  });
});
