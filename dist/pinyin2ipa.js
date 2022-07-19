/*!
 * pinyin2ipa v1.0.4 (July 19th 2022)
 * Converts Mandarin Chinese pinyin notation to IPA (international phonetic alphabet) notation
 * 
 * https://github.com/Connum/npm-pinyin2ipa#readme
 * 
 * @author  Connum <connum@gmail.com>
 * @license MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pinyin2ipa = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pinyinSeparate = require('pinyin-separate');

var _pinyinSeparate2 = _interopRequireDefault(_pinyinSeparate);

var _default = require('./methods/default.json');

var _default2 = _interopRequireDefault(_default);

var _sophisticated = require('./methods/sophisticated.json');

var _sophisticated2 = _interopRequireDefault(_sophisticated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  method: 'default',
  toneMarker: 'number',
  markNeutral: false,
  superscript: false,
  filterUnknown: true
};

var toneReps = {
  number: ['1', '2', '3', '4', '5'],
  numberSuperscript: ['¹', '²', '³', '⁴', '⁵'],
  chaonumber: ['55', '35', '214', '51', ''],
  chaonumberSuperscript: ['⁵⁵', '³⁵', '²¹⁴', '⁵¹', ''],
  chaoletter: ['˥', '˧˥', '˨˩˦', '˥˩', '']
};

var pinyinRegEx = /^(((miu|[pm]ou|[bpm](o|e(i|ng?)?|a(ng?|i|o)?|i(e|ng?|a[no])?|u))|(f(ou?|[ae](ng?|i)?|u))|(d(e(i|ng?)|i(a[on]?|u))|[dt](a(i|ng?|o)?|e(i|ng)?|i(a[on]?|e|ng|u)?|o(ng?|u)|u(o|i|an?|n)?))|(neng?|[ln](a(i|ng?|o)?|e(i|ng)?|i(ang|a[on]?|e|ng?|u)?|o(ng?|u)|u(o|i|an?|n)?|ve?))|([ghk](a(i|ng?|o)?|e(i|ng?)?|o(u|ng)|u(a(i|ng?)?|i|n|o)?))|(zh?ei|[cz]h?(e(ng?)?|o(ng?|u)?|ao|u?a(i|ng?)?|u?(o|i|n)?))|(song|shua(i|ng?)?|shei|sh?(a(i|ng?|o)?|en?g?|ou|u(a?n|o|i)?|i))|(r([ae]ng?|i|e|ao|ou|ong|u[oin]|ua?n?))|([jqx](i(a(o|ng?)?|[eu]|ong|ng?)?|u(e|a?n)?))|((a(i|o|ng?)?|ou?|e(i|ng?|r)?))|(w(a(i|ng?)?|o|e(i|ng?)?|u))|y(a(o|ng?)?|e|in?g?|o(u|ng)?|u(e|a?n)?))[0-5]?)+$/i;

function removeDiacritics(word) {
  return word.replace(/[āáǎăà]/ig, 'a').replace(/[ēéěěĕè]/ig, 'e').replace(/[īíǐĭì]/ig, 'i').replace(/[ōóǒŏò]/ig, 'o').replace(/[ūúǔŭù]/ig, 'u').replace(/([ǖǘǚǚü̆ǜv̄v́v̆v̌v̀]|[ūúǔŭù]:)/ig, 'ü');
}

function numberifyTones(wordIn) {
  var word = wordIn;
  if (/\d$/.test(word)) {
    return word;
  }

  if (/[āēīōūǖv̄]/.test(word)) {
    word += '1';
  } else if (/[áéíóúǘv́]/.test(word)) {
    word += '2';
  } else if (/[ǎăěĕǐĭǒŏǔŭǚǚü̆v̆v̌]/.test(word)) {
    word += '3';
  } else if (/[àèìòùǜv̀]/.test(word)) {
    word += '4';
  } else {
    word += '5';
  }
  return removeDiacritics(word);
}

function isNumberPinYin(wordIn) {
  var word = wordIn;
  word = word.replace(/\r?\n/g, '');
  return pinyinRegEx.test(word);
}

function isPinYin(wordIn) {
  var word = wordIn;
  word = removeDiacritics(word.replace(/\r?\n/g, ''));
  return pinyinRegEx.test(word);
}

function pinyinWord2IPA(wordIn, methodTable, toneRep, options) {
  var word = wordIn;
  if (word === '#~linebreak~#') return '\n';

  if (parseInt(word, 10) === word) {
    return word;
  }

  if (!isNumberPinYin(word)) {
    var splits = (0, _pinyinSeparate2.default)(word);
    var convertedWords = [];
    if (splits.length > 1) {
      var part = null;
      var convertedWord = null;
      for (var i = 0; i < splits.length; i++) {
        part = splits[i];
        convertedWord = pinyinWord2IPA(part, methodTable, toneRep, options);
        if (convertedWord.length) {
          convertedWords.push(convertedWord);
        }
      }
      return convertedWords.join(' ');
    }
    word = numberifyTones(word.toLowerCase());
  }

  var pureWord = word.replace(/([^\d]+)\d+/g, '$1');
  if (!isPinYin(pureWord)) {
    return options.filterUnknown ? '' : '*' + pureWord + '*';
  }

  var toneMatch = word.match(/\d$/);
  var toneIndex = (toneMatch ? parseInt(toneMatch[0], 10) : 5) - 1;
  var toneMark = toneIndex === 4 && (!options.markNeutral || options.toneMarker !== 'number') ? '' : toneRep[toneIndex];
  if (pureWord === '\\n') return '\n';

  var result = '';
  if (word === pureWord && methodTable[word + '5']) {
    result = methodTable[word + '5'] + toneMark;
  } else if (methodTable[word]) {
    result = methodTable[word] + toneMark;
  } else if (methodTable[pureWord]) {
    result = methodTable[pureWord] + toneMark;
  } else {
    result = options.filterUnknown ? '' : '*' + pureWord + '*';
  }

  return result;
}

function pinyin2ipa(pinyIn) {
  var optionsArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

  var options = optionsArg;
  var output = pinyIn;

  if (options !== defaultOptions) {
    options = Object.assign({}, defaultOptions, options);
  }

  if (options.superscript && options.toneMarker !== 'number' && options.toneMarker !== 'chaonumber') {
    options.superscript = false;
  }

  var toneRep = toneReps['' + options.toneMarker + (options.superscript ? 'Superscript' : '')];

  output = output.replace(/(\d+)([^ ])/g, '$1 $2');
  output = output.replace(/\r?\n/g, ' #~linebreak~# ');

  var words = output.split(/[ '".,;:?!*“”\-—$§€()/´`]+/g);
  words = words.filter(function (w) {
    return !/^ +$/.test(w);
  });

  var methodTable = pinyin2ipa.methods[options.method];
  words = words.map(function (word) {
    return pinyinWord2IPA(word, methodTable, toneRep, options);
  });

  words = words.filter(function (w) {
    return !/^ +$/.test(w);
  });

  return words.join(' ').replace(/ ?(#~linebreak~#|\n) ?/g, '\n').trim();
}

pinyin2ipa.methods = {
  default: _default2.default,
  sophisticated: _sophisticated2.default
};

exports.default = pinyin2ipa;

// export { pinyin2ipa };

module.exports = exports.default;
},{"./methods/default.json":2,"./methods/sophisticated.json":3,"pinyin-separate":5}],2:[function(require,module,exports){
module.exports={
    "a": "a",
    "ê": "ɛ",
    "ai": "ai",
    "an": "an",
    "ang": "aŋ",
    "ao": "au",
    "bai": "pai",
    "bang": "paŋ",
    "ban": "pan",
    "bao": "pau",
    "ba": "pa",
    "bei": "pei",
    "beng": "pəŋ",
    "ben": "pən",
    "bian": "piɛn",
    "biao": "piau",
    "bie": "piɛ",
    "bing": "piŋ",
    "bin": "pin",
    "bi": "pi",
    "bo": "po",
    "bu": "pu",
    "cai": "tsʰai",
    "cang": "tsʰaŋ",
    "can": "tsʰan",
    "cao": "tsʰau",
    "ca": "tsʰa",
    "cei": "tsʰei",
    "ceng": "tsʰəŋ",
    "cen": "tsʰən",
    "ce5": "tsʰə",
    "ce": "tsʰɤ",
    "chai": "tʂʰai",
    "chang": "tʂʰaŋ",
    "chan": "tʂʰan",
    "chao": "tʂʰau",
    "cha": "tʂʰa",
    "cheng": "tʂʰəŋ",
    "chen": "tʂʰən",
    "che5": "tʂʰə5",
    "che": "tʂʰɤ",
    "chi": "tʂʰʅ",
    "chong": "tʂʰuŋ",
    "chou": "tʂʰou",
    "chuai": "tʂʰuai",
    "chuang": "tʂʰuaŋ",
    "chuan": "tʂʰuan",
    "chua": "tʂʰua",
    "chui": "tʂʰuei",
    "chun": "tʂʰuən",
    "chuo": "tʂʰuo",
    "chu": "tʂʰu",
    "ci": "tsʰɿ",
    "cong": "tsʰuŋ",
    "cou": "tsʰou",
    "cuan": "tsʰuan",
    "cui": "tsʰuei",
    "cun": "tsʰuən",
    "cuo": "tsʰuo",
    "cu": "tsʰu",
    "dai": "tai",
    "dang": "taŋ",
    "dan": "tan",
    "dao": "tau",
    "da": "ta",
    "dei": "tei",
    "deng": "təŋ",
    "den": "tən",
    "de5": "tə",
    "de": "tɤ",
    "dian": "tiɛn",
    "diao": "tiau",
    "dia": "tia",
    "die": "tiɛ",
    "ding": "tiŋ",
    "di": "ti",
    "diu": "tiəu",
    "dong": "tuŋ",
    "dou": "tou",
    "duan": "tuan",
    "dui": "tuei",
    "dun": "tuən",
    "duo": "tuo",
    "du": "tu",
    "e5": "ə",
    "e": "ɤ",
    "ei": "ei",
    "en": "ən",
    "eng": "əŋ",
    "er": "ər",
    "fa": "fa",
    "fan": "fan",
    "fang": "faŋ",
    "fe5": "fə",
    "fe": "fɤ",
    "fei": "fei",
    "fen": "fən",
    "feng": "fəŋ",
    "fo": "fo",
    "fou": "fou",
    "fu": "fu",
    "gai": "kai",
    "ga": "ka",
    "gang": "kaŋ",
    "gan": "kan",
    "gao": "kau",
    "gei": "kei",
    "ge5": "kə",
    "ge": "kɤ",
    "geng": "kəŋ",
    "gen": "kən",
    "gong": "kuŋ",
    "gou": "kou",
    "guai": "kuai",
    "gua": "kua",
    "guang": "kuaŋ",
    "guan": "kuan",
    "gui": "kuei",
    "gu": "ku",
    "gun": "kuən",
    "guo": "kuo",
    "hai": "xai",
    "hang": "xaŋ",
    "han": "xan",
    "hao": "xau",
    "ha": "xa",
    "hei": "xei",
    "heng": "xəŋ",
    "hen": "xən",
    "he5": "xə",
    "he": "xɤ",
    "hong": "xuŋ",
    "hou": "xou",
    "huai": "xuai",
    "huang": "xuaŋ",
    "huan": "xuan",
    "hua": "xua",
    "hui": "xuei",
    "hun": "xuən",
    "huo": "xuo",
    "hu": "xu",
    "jiang": "tɕiɑŋ",
    "jian": "tɕiɛn",
    "jiao": "tɕiau",
    "jia": "tɕia",
    "jie": "tɕiɛ",
    "jing": "tɕiŋ",
    "jin": "tɕin",
    "jiong": "tɕyŋ",
    "ji": "tɕi",
    "jiu": "tɕiəu",
    "juan": "tɕyan",
    "jue": "tɕyɛ",
    "jun": "tɕyn",
    "ju": "tɕy",
    "kai": "kʰai",
    "ka": "kʰa",
    "kang": "kʰaŋ",
    "kan": "kʰan",
    "kao": "kʰau",
    "kei": "kʰei",
    "ke5": "kʰə",
    "ke": "kʰɤ",
    "keng": "kʰəŋ",
    "ken": "kʰən",
    "kong": "kʰuŋ",
    "kou": "kʰou",
    "kuai": "kʰuai",
    "kua": "kʰua",
    "kuang": "kʰuaŋ",
    "kuan": "kʰuan",
    "kui": "kʰuei",
    "ku": "kʰu",
    "kun": "kʰuən",
    "kuo": "kʰuo",
    "lai": "lai",
    "la": "la",
    "lang": "laŋ",
    "lan": "lan",
    "lüe": "lyɛ",
    "lü": "ly",
    "lao": "lau",
    "lei": "lei",
    "le5": "lə",
    "le": "lɤ",
    "leng": "ləŋ",
    "lia": "lia",
    "liang": "liɑŋ",
    "lian": "liɛn",
    "liao": "liau",
    "lie": "liɛ",
    "li": "li",
    "ling": "liŋ",
    "lin": "lin",
    "liu": "liəu",
    "lo": "lo",
    "long": "luŋ",
    "lou": "lou",
    "luan": "luan",
    "lu": "lu",
    "lun": "luən",
    "luo": "luo",
    "mai": "mai",
    "ma": "ma",
    "mang": "maŋ",
    "man": "man",
    "mao": "mau",
    "mei": "mei",
    "me5": "mə",
    "me": "mɤ",
    "meng": "məŋ",
    "men": "mən",
    "mian": "miɛn",
    "miao": "miau",
    "mie": "miɛ",
    "mi": "mi",
    "ming": "miŋ",
    "min": "min",
    "miu": "miəu",
    "mo": "mo",
    "mou": "mou",
    "mu": "mu",
    "nai": "nai",
    "na": "na",
    "nang": "naŋ",
    "nan": "nan",
    "nüe": "nyɛ",
    "nü": "ny",
    "nao": "nau",
    "nei": "nei",
    "ne5": "nə",
    "ne": "nɤ",
    "neng": "nəŋ",
    "nen": "nən",
    "niang": "niɑŋ",
    "nian": "niɛn",
    "niao": "niau",
    "nie": "niɛ",
    "ning": "niŋ",
    "ni": "ni",
    "nin": "nin",
    "niu": "niəu",
    "nong": "nuŋ",
    "nou": "nou",
    "nuan": "nuan",
    "nun": "nuən",
    "nu": "nu",
    "nuo": "nuo",
    "o": "o",
    "ou": "ou",
    "pai": "pʰai",
    "pang": "pʰaŋ",
    "pan": "pʰan",
    "pao": "pʰau",
    "pa": "pʰa",
    "pei": "pʰei",
    "peng": "pʰəŋ",
    "pen": "pʰən",
    "pian": "pʰiɛn",
    "piao": "pʰiau",
    "pie": "pʰiɛ",
    "ping": "pʰiŋ",
    "pin": "pʰin",
    "pi": "pʰi",
    "po": "pʰo",
    "pou": "pʰou",
    "pu": "pʰu",
    "qiang": "tɕʰiɑŋ",
    "qian": "tɕʰiɛn",
    "qiao": "tɕʰiau",
    "qia": "tɕʰia",
    "qie": "tɕʰiɛ",
    "qing": "tɕʰiŋ",
    "qin": "tɕʰin",
    "qiong": "tɕʰyŋ",
    "qi": "tɕʰi",
    "qiu": "tɕʰiəu",
    "quan": "tɕʰyan",
    "que": "tɕʰyɛ",
    "qun": "tɕʰyn",
    "qu": "tɕʰy",
    "ran": "ʐan",
    "rang": "ʐaŋ",
    "rao": "ʐau",
    "re5": "ʐə",
    "re": "ʐɤ",
    "ren": "ʐən",
    "reng": "ʐəŋ",
    "ri": "ʐʅ",
    "rong": "ʐuŋ",
    "rou": "ʐou",
    "rua": "ʐua",
    "ruan": "ʐuan",
    "ru": "ʐu",
    "rui": "ʐuei",
    "run": "ʐuən",
    "ruo": "ʐuo",
    "sai": "sai",
    "sang": "saŋ",
    "san": "san",
    "sao": "sau",
    "sa": "sa",
    "seng": "səŋ",
    "sen": "sən",
    "se5": "sə",
    "se": "sɤ",
    "sha": "ʂa",
    "shai": "ʂai",
    "shan": "ʂan",
    "shang": "ʂaŋ",
    "shao": "ʂau",
    "she5": "ʂə",
    "she": "ʂɤ",
    "shei": "ʂei",
    "shen": "ʂən",
    "sheng": "ʂəŋ",
    "shi": "ʂʅ",
    "shou": "ʂou",
    "shua": "ʂua",
    "shuai": "ʂuai",
    "shuan": "ʂuan",
    "shuang": "ʂuaŋ",
    "shu": "ʂu",
    "shui": "ʂuei",
    "shun": "ʂuən",
    "shuo": "ʂuo",
    "si": "sɿ",
    "song": "suŋ",
    "sou": "sou",
    "suan": "suan",
    "sui": "suei",
    "sun": "suən",
    "suo": "suo",
    "su": "su",
    "tai": "tʰai",
    "tang": "tʰaŋ",
    "tan": "tʰan",
    "tao": "tʰau",
    "ta": "tʰa",
    "teng": "tʰəŋ",
    "te5": "tʰə",
    "te": "tʰɤ",
    "tian": "tʰiɛn",
    "tiao": "tʰiau",
    "tie": "tʰiɛ",
    "ting": "tʰiŋ",
    "ti": "tʰi",
    "tong": "tʰuŋ",
    "tou": "tʰou",
    "tuan": "tʰuan",
    "tui": "tʰuei",
    "tun": "tʰuən",
    "tuo": "tʰuo",
    "tu": "tʰu",
    "wai": "uai",
    "wang": "uaŋ",
    "wan": "uan",
    "wa": "ua",
    "wei": "uei",
    "weng": "uəŋ",
    "wen": "uən",
    "wo": "uo",
    "wu": "u",
    "xia": "ɕia",
    "xian": "ɕiɛn",
    "xiang": "ɕiɑŋ",
    "xiao": "ɕiau",
    "xie": "ɕiɛ",
    "xi": "ɕi",
    "xin": "ɕin",
    "xing": "ɕiŋ",
    "xiong": "ɕyŋ",
    "xiu": "ɕiəu",
    "xuan": "ɕyan",
    "xue": "ɕyɛ",
    "xu": "ɕy",
    "xun": "ɕyn",
    "ya": "ia",
    "yang": "iɑŋ",
    "yan": "iɛn",
    "yao": "iau",
    "ye": "iɛ",
    "yi": "i",
    "ying": "iŋ",
    "yin": "in",
    "yong": "yŋ",
    "you": "iəu",
    "yuan": "yan",
    "yue": "yɛ",
    "yun": "yn",
    "yu": "y",
    "zai": "tsai",
    "zang": "tsaŋ",
    "zan": "tsan",
    "zao": "tsau",
    "za": "tsa",
    "zei": "tsei",
    "zeng": "tsəŋ",
    "zen": "tsən",
    "ze5": "tsə",
    "ze": "tsɤ",
    "zhai": "tʂai",
    "zhang": "tʂaŋ",
    "zhan": "tʂan",
    "zhao": "tʂau",
    "zha": "tʂa",
    "zhei": "tʂei",
    "zheng": "tʂəŋ",
    "zhen": "tʂən",
    "zhe5": "tʂə",
    "zhe": "tʂɤ",
    "zhi": "tʂʅ",
    "zhong": "tʂuŋ",
    "zhou": "tʂou",
    "zhuai": "tʂuai",
    "zhuang": "tʂuaŋ",
    "zhuan": "tʂuan",
    "zhua": "tʂua",
    "zhui": "tʂuei",
    "zhun": "tʂuən",
    "zhuo": "tʂuo",
    "zhu": "tʂu",
    "zi": "tsɿ",
    "zong": "tsuŋ",
    "zou": "tsou",
    "zuan": "tsuan",
    "zui": "tsuei",
    "zun": "tsuən",
    "zuo": "tsuo",
    "zu": "tsu"
}
},{}],3:[function(require,module,exports){
module.exports={
    "an": "an",
    "ai": "aɪ̯",
    "ei": "eɪ̯",
    "fan": "fan",
    "fei": "feɪ̯",
    "fu": "fu",
    "fo": "fu̯ɔ",
    "fa": "fɑ",
    "fang": "fɑŋ",
    "fen": "fən",
    "feng": "fəŋ",
    "fou": "fɤʊ̯",
    "yi": "i",
    "yin": "in",
    "ying": "iŋ",
    "yong": "jʊŋ",
    "ye": "iɛ",
    "yan": "iɛn",
    "ya": "i̯ɑ",
    "yang": "i̯ɑŋ",
    "yao": "i̯ɑʊ̯",
    "you": "i̯ɤʊ̯",
    "gan": "kan",
    "gai": "kaɪ̯",
    "gei": "keɪ̯",
    "gu": "ku",
    "guan": "ku̯an",
    "guai": "ku̯aɪ̯",
    "gui": "ku̯eɪ̯",
    "gua": "ku̯ɑ",
    "guang": "ku̯ɑŋ",
    "guo": "ku̯ɔ",
    "gun": "ku̯ən",
    "ga": "kɑ",
    "gang": "kɑŋ",
    "gao": "kɑʊ̯",
    "gen": "kən",
    "geng": "kəŋ",
    "gou": "kɤʊ̯",
    "ge": "kɯ̯ʌ",
    "gong": "kʊŋ",
    "kan": "kʰan",
    "kai": "kʰaɪ̯",
    "kei": "kʰeɪ̯",
    "ku": "kʰu",
    "kuan": "kʰu̯an",
    "kuai": "kʰu̯aɪ̯",
    "kui": "kʰu̯eɪ̯",
    "kua": "kʰu̯ɑ",
    "kuang": "kʰu̯ɑŋ",
    "kuo": "kʰu̯ɔ",
    "kun": "kʰu̯ən",
    "ka": "kʰɑ",
    "kang": "kʰɑŋ",
    "kao": "kʰɑʊ̯",
    "ken": "kʰən",
    "keng": "kʰəŋ",
    "kou": "kʰɤʊ̯",
    "ke": "kʰɯ̯ʌ",
    "kong": "kʰʊŋ",
    "lan": "lan",
    "lai": "laɪ̯",
    "lei": "leɪ̯",
    "li": "li",
    "lin": "lin",
    "ling": "liŋ",
    "lie": "liɛ",
    "lian": "liɛn",
    "lia": "li̯ɑ",
    "liang": "li̯ɑŋ",
    "liao": "li̯ɑʊ̯",
    "liu": "li̯ɤʊ̯",
    "lu": "lu",
    "luan": "lu̯an",
    "lo": "lu̯ɔ",
    "luo": "lu̯ɔ",
    "lun": "lu̯ən",
    "lü": "ly",
    "lüe": "ly̯œ",
    "la": "lɑ",
    "lang": "lɑŋ",
    "lao": "lɑʊ̯",
    "leng": "ləŋ",
    "lou": "lɤʊ̯",
    "le": "lɯ̯ʌ",
    "long": "lʊŋ",
    "man": "man",
    "mai": "maɪ̯",
    "mei": "meɪ̯",
    "mi": "mi",
    "min": "min",
    "ming": "miŋ",
    "mie": "miɛ",
    "mian": "miɛn",
    "miao": "mi̯ɑʊ̯",
    "miu": "mi̯ɤʊ̯",
    "mu": "mu",
    "mo": "mu̯ɔ",
    "ma": "mɑ",
    "mang": "mɑŋ",
    "mao": "mɑʊ̯",
    "men": "mən",
    "meng": "məŋ",
    "mou": "mɤʊ̯",
    "me": "mɯ̯ʌ",
    "nan": "nan",
    "nai": "naɪ̯",
    "nei": "neɪ̯",
    "ni": "ni",
    "nin": "nin",
    "ning": "niŋ",
    "nie": "niɛ",
    "nian": "niɛn",
    "niang": "ni̯ɑŋ",
    "niao": "ni̯ɑʊ̯",
    "niu": "ni̯ɤʊ̯",
    "nu": "nu",
    "nuan": "nu̯an",
    "nuo": "nu̯ɔ",
    "nü": "ny",
    "nüe": "ny̯œ",
    "na": "nɑ",
    "nang": "nɑŋ",
    "nao": "nɑʊ̯",
    "nen": "nən",
    "neng": "nəŋ",
    "nou": "nɤʊ̯",
    "ne": "nɯ̯ʌ",
    "nong": "nʊŋ",
    "ban": "pan",
    "bai": "paɪ̯",
    "bei": "peɪ̯",
    "bi": "pi",
    "bin": "pin",
    "bing": "piŋ",
    "bie": "piɛ",
    "bian": "piɛn",
    "biang": "pi̯ɑŋ",
    "biao": "pi̯ɑʊ̯",
    "bu": "pu",
    "bo": "pu̯ɔ",
    "ba": "pɑ",
    "bang": "pɑŋ",
    "bao": "pɑʊ̯",
    "ben": "pən",
    "beng": "pəŋ",
    "pan": "pʰan",
    "pai": "pʰaɪ̯",
    "pei": "pʰeɪ̯",
    "pi": "pʰi",
    "pin": "pʰin",
    "ping": "pʰiŋ",
    "pie": "pʰiɛ",
    "pian": "pʰiɛn",
    "piao": "pʰi̯ɑʊ̯",
    "pu": "pʰu",
    "po": "pʰu̯ɔ",
    "pa": "pʰɑ",
    "pang": "pʰɑŋ",
    "pao": "pʰɑʊ̯",
    "pen": "pʰən",
    "peng": "pʰəŋ",
    "pou": "pʰɤʊ̯",
    "san": "san",
    "sai": "saɪ̯",
    "su": "su",
    "suan": "su̯an",
    "sui": "su̯eɪ̯",
    "suo": "su̯ɔ",
    "sun": "su̯ən",
    "sa": "sɑ",
    "sang": "sɑŋ",
    "sao": "sɑʊ̯",
    "sen": "sən",
    "seng": "səŋ",
    "sou": "sɤʊ̯",
    "se": "sɯ̯ʌ",
    "si": "sɿ",
    "song": "sʊŋ",
    "dan": "tan",
    "dai": "taɪ̯",
    "dei": "teɪ̯",
    "di": "ti",
    "ding": "tiŋ",
    "die": "tiɛ",
    "dian": "tiɛn",
    "diao": "ti̯ɑʊ̯",
    "diu": "ti̯ɤʊ̯",
    "zan": "tsan",
    "zai": "tsaɪ̯",
    "zei": "tseɪ̯",
    "zu": "tsu",
    "zuan": "tsu̯an",
    "zui": "tsu̯eɪ̯",
    "zuo": "tsu̯ɔ",
    "zun": "tsu̯ən",
    "za": "tsɑ",
    "zang": "tsɑŋ",
    "zao": "tsɑʊ̯",
    "zen": "tsən",
    "zeng": "tsəŋ",
    "zou": "tsɤʊ̯",
    "ze": "tsɯ̯ʌ",
    "zi": "tsɿ",
    "zong": "tsʊŋ",
    "can": "tsʰan",
    "cai": "tsʰaɪ̯",
    "cei": "tsʰeɪ̯",
    "cu": "tsʰu",
    "cuan": "tsʰu̯an",
    "cui": "tsʰu̯eɪ̯",
    "cuo": "tsʰu̯ɔ",
    "cun": "tsʰu̯ən",
    "ca": "tsʰɑ",
    "cang": "tsʰɑŋ",
    "cao": "tsʰɑʊ̯",
    "cen": "tsʰən",
    "ceng": "tsʰəŋ",
    "cou": "tsʰɤʊ̯",
    "ce": "tsʰɯ̯ʌ",
    "ci": "tsʰɿ",
    "cong": "tsʰʊŋ",
    "du": "tu",
    "duan": "tu̯an",
    "dui": "tu̯eɪ̯",
    "duo": "tu̯ɔ",
    "dun": "tu̯ən",
    "da": "tɑ",
    "dang": "tɑŋ",
    "dao": "tɑʊ̯",
    "ji": "tɕi",
    "jin": "tɕin",
    "jing": "tɕiŋ",
    "jie": "tɕiɛ",
    "jian": "tɕiɛn",
    "jia": "tɕi̯ɑ",
    "jiang": "tɕi̯ɑŋ",
    "jiao": "tɕi̯ɑʊ̯",
    "jiu": "tɕi̯ɤʊ̯",
    "jiong": "tɕi̯ʊŋ",
    "ju": "tɕy",
    "jun": "tɕyn",
    "jue": "tɕy̯œ",
    "juan": "tɕy̯ɛn",
    "qi": "tɕʰi",
    "qin": "tɕʰin",
    "qing": "tɕʰiŋ",
    "qie": "tɕʰiɛ",
    "qian": "tɕʰiɛn",
    "qia": "tɕʰi̯ɑ",
    "qiang": "tɕʰi̯ɑŋ",
    "qiao": "tɕʰi̯ɑʊ̯",
    "qiu": "tɕʰi̯ɤʊ̯",
    "qiong": "tɕʰi̯ʊŋ",
    "qu": "tɕʰy",
    "qun": "tɕʰyn",
    "que": "tɕʰy̯œ",
    "quan": "tɕʰy̯ɛn",
    "den": "tən",
    "deng": "təŋ",
    "dou": "tɤʊ̯",
    "de": "tɯ̯ʌ",
    "de5": "tə",
    "zhan": "tʂan",
    "zhai": "tʂaɪ̯",
    "zhei": "tʂeɪ̯",
    "zhu": "tʂu",
    "zhuan": "tʂu̯an",
    "zhuai": "tʂu̯aɪ̯",
    "zhui": "tʂu̯eɪ̯",
    "zhua": "tʂu̯ɑ",
    "zhuo": "tʂu̯ɔ",
    "zhun": "tʂu̯ən",
    "zha": "tʂɑ",
    "zhang": "tʂɑŋ",
    "zhao": "tʂɑʊ̯",
    "zhen": "tʂən",
    "zheng": "tʂəŋ",
    "zhou": "tʂɤʊ̯",
    "zhe": "tʂɯ̯ʌ",
    "zhi": "tʂʅ",
    "zhong": "tʂʊŋ",
    "chan": "tʂʰan",
    "chai": "tʂʰaɪ̯",
    "chu": "tʂʰu",
    "chuan": "tʂʰu̯an",
    "chuai": "tʂʰu̯aɪ̯",
    "chui": "tʂʰu̯eɪ̯",
    "chua": "tʂʰu̯ɑ",
    "chuang": "tʂʰu̯ɑŋ",
    "chuo": "tʂʰu̯ɔ",
    "chun": "tʂʰu̯ən",
    "cha": "tʂʰɑ",
    "chang": "tʂʰɑŋ",
    "chao": "tʂʰɑʊ̯",
    "chen": "tʂʰən",
    "cheng": "tʂʰəŋ",
    "chou": "tʂʰɤʊ̯",
    "che": "tʂʰɯ̯ʌ",
    "chi": "tʂʰʅ",
    "chong": "tʂʰʊŋ",
    "zhuang": "tʂ̯u̯ɑŋ",
    "dong": "tʊŋ",
    "tan": "tʰan",
    "tai": "tʰaɪ̯",
    "ti": "tʰi",
    "ting": "tʰiŋ",
    "tie": "tʰiɛ",
    "tian": "tʰiɛn",
    "tiao": "tʰi̯ɑʊ̯",
    "tu": "tʰu",
    "tuan": "tʰu̯an",
    "tui": "tʰu̯eɪ̯",
    "tuo": "tʰu̯ɔ",
    "tun": "tʰu̯ən",
    "ta": "tʰɑ",
    "tang": "tʰɑŋ",
    "tao": "tʰɑʊ̯",
    "teng": "tʰəŋ",
    "tou": "tʰɤʊ̯",
    "te": "tʰɯ̯ʌ",
    "tong": "tʰʊŋ",
    "wu": "u",
    "wan": "u̯an",
    "wai": "u̯aɪ̯",
    "wei": "u̯eɪ̯",
    "wa": "u̯ɑ",
    "wang": "u̯ɑŋ",
    "wo": "u̯ɔ",
    "wen": "u̯ən",
    "weng": "u̯əŋ",
    "han": "xan",
    "hai": "xaɪ̯",
    "hei": "xeɪ̯",
    "hu": "xu",
    "huan": "xu̯an",
    "huai": "xu̯aɪ̯",
    "hui": "xu̯eɪ̯",
    "hua": "xu̯ɑ",
    "huang": "xu̯ɑŋ",
    "huo": "xu̯ɔ",
    "hun": "xu̯ən",
    "ha": "xɑ",
    "hang": "xɑŋ",
    "hao": "xɑʊ̯",
    "hen": "xən",
    "heng": "xəŋ",
    "hou": "xɤʊ̯",
    "he": "xɯ̯ʌ",
    "hong": "xʊŋ",
    "yu": "y",
    "yun": "yn",
    "yue": "y̯œ",
    "yuan": "y̯ɛn",
    "a": "ɑ",
    "ang": "ɑŋ",
    "er": "ɑɻ",
    "ao": "ɑʊ̯",
    "o": "ɔ",
    "xi": "ɕi",
    "xin": "ɕin",
    "xing": "ɕiŋ",
    "xie": "ɕiɛ",
    "xian": "ɕiɛn",
    "xia": "ɕi̯ɑ",
    "xiang": "ɕi̯ɑŋ",
    "xiao": "ɕi̯ɑʊ̯",
    "xiu": "ɕi̯ɤʊ̯",
    "xiong": "ɕi̯ʊŋ",
    "xu": "ɕy",
    "xun": "ɕyn",
    "xue": "ɕy̯œ",
    "xuan": "ɕy̯ɛn",
    "en": "ən",
    "eng": "əŋ",
    "ou": "ɤʊ̯",
    "e": "ɯ̯ʌ",
    "shan": "ʂan",
    "shai": "ʂaɪ̯",
    "shei": "ʂeɪ̯",
    "shu": "ʂu",
    "shuan": "ʂu̯an",
    "shuai": "ʂu̯aɪ̯",
    "shui": "ʂu̯eɪ̯",
    "shua": "ʂu̯ɑ",
    "shuang": "ʂu̯ɑŋ",
    "shuo": "ʂu̯ɔ",
    "shun": "ʂu̯ən",
    "sha": "ʂɑ",
    "shang": "ʂɑŋ",
    "shao": "ʂɑʊ̯",
    "shen": "ʂən",
    "sheng": "ʂəŋ",
    "shou": "ʂɤʊ̯",
    "she": "ʂɯ̯ʌ",
    "shi": "ʂʅ",
    "ran": "ʐan",
    "ru": "ʐu",
    "ruan": "ʐu̯an",
    "rui": "ʐu̯eɪ̯",
    "rua": "ʐu̯ɑ",
    "ruo": "ʐu̯ɔ",
    "run": "ʐu̯ən",
    "rang": "ʐɑŋ",
    "rao": "ʐɑʊ̯",
    "ren": "ʐən",
    "reng": "ʐəŋ",
    "rou": "ʐɤʊ̯",
    "re": "ʐɯ̯ʌ",
    "ri": "ʐʅ",
    "rong": "ʐʊŋ"
}
},{}],4:[function(require,module,exports){
'use strict';

// @ts-check

var vowels = 'aāáǎăàeēéěĕèiīíǐĭìoōóǒŏòuūúǔŭùüǖǘǚǚü̆ǜvv̄v́v̆v̌v̀';
var tones = 'ā|á|ǎ|ă|à|ē|é|ě|ĕ|è|ī|í|ǐ|ĭ|ì|ō|ó|ǒ|ŏ|ò|ū|ú|ǔ|ŭ|ù|ǖ|ǘ|ǚ|ǚ|ü̆|ǜ|v̄|v́|v̆|v̌|v̀';
var initials = 'b|p|m|f|d|t|n|l|g|k|h|j|q|x|zh|ch|sh|r|z|c|s';
function separate(pinyin) {
  return pinyin.replace(/'/g, ' ') // single quote used for separation
  .replace(new RegExp('(' + tones + ')(' + tones + ')', 'gi'), '$1 $2') // split two consecutive tones
  .replace(new RegExp('([' + vowels + '])([^' + vowels + 'nr])', 'gi'), '$1 $2') // This line does most of the work
  .replace(new RegExp('(\\w)([csz]h)', 'gi'), '$1 $2') // double-consonant initials
  .replace(new RegExp('([' + vowels + ']{2}(ng? )?)([^\\snr])', 'gi'), '$1 $3') // double-vowel finals
  .replace(new RegExp('([' + vowels + ']{2})(n[' + vowels + '])', 'gi'), '$1 $2') // double-vowel followed by n initial
  .replace(new RegExp('(n)([^' + vowels + 'vg])', 'gi'), '$1 $2') // cleans up most n compounds
  .replace(new RegExp('((ch|sh|(y|b|p|m|f|d|t|n|l|j|q|x)i)(a|\u0101|\xE1|\u01CE|\u0103|\xE0)) (o)', 'gi'), '$1$5') // fix https://github.com/Connum/npm-pinyin-separate/issues/1
  .replace(new RegExp('(w|gu|ku|hu|zhu|chu|shu)(a|\u0101|\xE1|\u01CE|\u0103|\xE0) (i)', 'gi'), '$1$2$3') // fix "i" being split from syllables ending in (u)ai
  .replace(new RegExp('((a|\u0101|\xE1|\u01CE|\u0103|\xE0)o)(' + initials + ')', 'gi'), '$1 $3') // fix syllable ending in ao followed by another syllable
  .replace(new RegExp('((o|\u014D|\xF3|\u01D2|\u014F|\xF2)u)(' + initials + ')', 'gi'), '$1 $3') // fix syllable ending in ou followed by another syllable
  .replace(new RegExp('(y(u|\u016B|\xFA|\u01D4|\u016D|\xF9|\xFC|\u01D6|\u01D8|\u01DA|u\u0308\u030C|u\u0308\u0306|\u01DC|v|v\u0304|v\u0301|v\u0306|v\u030C|v\u0300))(n)(u|\u016B|\xFA|\u01D4|\u016D|\xF9|\xFC|\u01D6|\u01D8|\u01DA|u\u0308\u030C|u\u0308\u0306|\u01DC|v|v\u0304|v\u0301|v\u0306|v\u030C|v\u0300)', 'gi'), '$1 $3$4') // fix two "u" (or "ü") separated by an "n" not being split
  .replace(new RegExp('([' + vowels + 'v])([^' + vowels + '\\w\\s])([' + vowels + 'v])', 'gi'), '$1 $2$3') // assumes correct Pinyin (i.e., no missing apostrophes)
  .replace(new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])', 'gi'), '$1$2 $3$4') // assumes correct Pinyin, i.e. changan = chan + gan
  .replace(new RegExp('([gr])([^' + vowels + '])', 'gi'), '$1 $2') // fixes -ng and -r finals not followed by vowels
  .replace(new RegExp('([^eēéěĕè\\w\\s])(r)', 'gi'), '$1 $2') // r an initial, except in er
  .replace(new RegExp('([^\\w\\s])([eēéěĕè]r)', 'gi'), '$1 $2') // er
  .replace(/\s{2,}/g, ' ') // remove double-spaces
  ;
}

module.exports = function separatePinyinInSyllables(pinyin, separateBySpaces) {
  if (!pinyin) {
    return [];
  }

  if (separateBySpaces) {
    return pinyin.split(String.fromCharCode(160));
  }

  var pinyinSeparated = separate(pinyin).split(' ');
  var newPinyin = [];

  pinyinSeparated.forEach(function (p, i) {
    var totalTones = 1;
    var pregMatch = p.match(new RegExp('(' + tones + ')', 'g'));
    if (pregMatch) {
      totalTones = pregMatch.length;
    }

    if (p.length > 4 || totalTones > 1) {
      separate(p).split(' ').forEach(function (newP) {
        pregMatch = newP.match(new RegExp('(' + tones + ')', 'g'));
        if (pregMatch) {
          totalTones = pregMatch.length;
        }

        if (newP.length > 4 || totalTones > 1) {
          separate(newP).split(' ').forEach(function (newP2) {
            newPinyin.push(newP2.trim());
          });
        } else {
          newPinyin.push(newP.trim());
        }
      });
    } else {
      newPinyin.push(p.trim());
    }
  });

  return newPinyin;
};
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _separatePinyinInSyllables = require('./helpers/separate-pinyin-in-syllables');

var _separatePinyinInSyllables2 = _interopRequireDefault(_separatePinyinInSyllables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  byNbsp: false
};

var pinyinSeparate = function pinyinSeparate(pinyIn) {
  var optionsArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

  var options = optionsArg;
  if (options !== defaultOptions) {
    options = Object.assign({}, defaultOptions, options);
  }

  return (0, _separatePinyinInSyllables2.default)(pinyIn, options.byNbsp);
};

exports.default = pinyinSeparate;

// export { pinyinSeparate };

module.exports = exports.default;
},{"./helpers/separate-pinyin-in-syllables":4}]},{},[1])(1)
});
