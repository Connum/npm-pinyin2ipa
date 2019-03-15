/* eslint-disable no-console */
const pinyin2ipa = require('../lib');
// const { awesomeFunction } = require('../lib');

console.log(pinyin2ipa('nĭhăoma'));

console.log(pinyin2ipa('nĭhăoma', {
    markNeutral: true
}));

console.log(pinyin2ipa('nĭhăoma', {
    superscript: true
}));

console.log(pinyin2ipa('nĭhăoma', {
    method: "sophisticated",
    toneMarker: "chaonumber",
    superscript: true
}));

console.log(pinyin2ipa('nĭhăoma', {
    method: "sophisticated",
    toneMarker: "chaoletter"
}));

console.log(pinyin2ipa('ni3hao3ma', {
    toneMarker: "number",
    superscript: true
}));
