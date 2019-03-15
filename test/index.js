import { assert } from 'chai';
import pinyin2ipa from '../src';

describe('Conversion tests', () => {
  it('should convert nĭhăoma', () => {
    const expectedVal = 'ni3 xau3 ma'
    assert.equal(pinyin2ipa('nĭhăoma'), expectedVal);
  });

  it('should convert nĭhăoma mith markNeutral option', () => {
    const expectedVal = 'ni3 xau3 ma5'
    assert.equal(pinyin2ipa('nĭhăoma', {
      markNeutral: true
    }), expectedVal);
  });

  it('should convert nĭhăoma mith markNeutral option and chao numbers', () => {
    const expectedVal = 'ni214 xau214 ma'
    assert.equal(pinyin2ipa('nĭhăoma', {
      toneMarker: 'chaonumber',
      markNeutral: true
    }), expectedVal);
  });

  it('should convert nĭ hăo ma', () => {
    const expectedVal = 'ni3 xau3 ma'
    assert.equal(pinyin2ipa('nĭ hăo ma'), expectedVal);
  });

  it('should convert nĭhăoma with superscript', () => {
    const expectedVal = 'ni³ xau³ ma'
    assert.equal(pinyin2ipa('nĭhăoma', {
      superscript: true
    }), expectedVal);
  });

  it('should convert nĭhăoma with sophisticated method and superscript chao numbers', () => {
    const expectedVal = 'ni²¹⁴ xɑʊ̯²¹⁴ mɑ'
    assert.equal(pinyin2ipa('nĭhăoma', {
      method: "sophisticated",
      toneMarker: "chaonumber",
      superscript: true
    }), expectedVal);
  });

  it('should convert nĭhăoma with sophisticated method and chao letters', () => {
    const expectedVal = 'ni˨˩˦ xɑʊ̯˨˩˦ mɑ'
    assert.equal(pinyin2ipa('nĭhăoma', {
      method: "sophisticated",
      toneMarker: "chaoletter"
    }), expectedVal);
  });

  it('should convert ni3hao3ma with superscript numbers', () => {
    const expectedVal = 'ni³ xau³ ma'
    assert.equal(pinyin2ipa('ni3hao3ma', {
      toneMarker: "number",
      superscript: true
    }), expectedVal);
  });

  it('should convert ni3 hao3 ma with superscript chao numbers', () => {
    const expectedVal = 'ni²¹⁴ xau²¹⁴ ma'
    assert.equal(pinyin2ipa('ni3 hao3 ma', {
      toneMarker: "chaonumber",
      superscript: true
    }), expectedVal);
  });

  it('should convert dé dè de de5', () => {
    const expectedVal = 'tɤ2 tɤ4 tə tə'
    assert.equal(pinyin2ipa('dé dè de de5'), expectedVal);
  });

  it('should convert dé dè de de5 with markNeutral option', () => {
    const expectedVal = 'tɤ2 tɤ4 tə5 tə5'
    assert.equal(pinyin2ipa('dé dè de de5', {
      markNeutral: true
    }), expectedVal);
  });

  it('should convert ni3 foo bar baz with filterUnknown', () => {
    const expectedVal = 'ni3'
    assert.equal(pinyin2ipa('ni3 foo bar baz', {
      filterUnknown: true
    }), expectedVal);
  });

  it('should convert ni3 foo bar baz without filterUnknown', () => {
    const expectedVal = 'ni3 *foo* *bar* *baz*'
    assert.equal(pinyin2ipa('ni3 foo bar baz', {
      filterUnknown: false
    }), expectedVal);
  });

  it('should convert nĭ\\r\\nhăo\\nma with line breaks', () => {
    const expectedVal = 'ni3\nxau3\nma'
    assert.equal(pinyin2ipa('nĭ\r\nhăo\nma'), expectedVal);
  });

});

describe('Custom method test', () => {
  it('should convert nĭmenhăoma ménhào with custom method', () => {
    const expectedVal = 'foo3 bar baz3 bat lorem2 ipsum4'
    pinyin2ipa.methods.myCustomMethod = {
      'ni': 'foo',
      'men': 'lorem',
      'men5': 'bar',
      'hao': 'ipsum',
      'hao3': 'baz',
      'ma': 'bat'
    }
    assert.equal(pinyin2ipa('nĭmenhăoma ménhào', {
      method: 'myCustomMethod'
    }), expectedVal);
  });
});
