"use strict";!function n(o,r,t){function s(i,c){if(!r[i]){if(!o[i]){var u="function"==typeof require&&require;if(!c&&u)return u(i,!0);if(e)return e(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var h=r[i]={exports:{}};o[i][0].call(h.exports,function(n){var r=o[i][1][n];return s(r?r:n)},h,h.exports,n,o,r,t)}return r[i].exports}for(var e="function"==typeof require&&require,i=0;i<t.length;i++)s(t[i]);return s}({1:[function(n,o,r){function t(){l.innerHTML=d.name,m.innerHTML=j.name(),e()}function s(){d.chords.push(d.chords.shift()),j=d.chords[0],t()}function e(){m.classList.remove("right"),m.classList.remove("wrong"),m.classList.remove("reading")}function i(n){e(),m.classList.add(n)}function c(){i("reading")}function u(){i("right")}function a(){i("wrong")}var h=n("./midi.js"),f=n("./music/Chord.js"),v=(n("./music/progressions/CircleOfFourths-7-3-5.js"),n("./music/progressions/Diatonic-7-3-5.js")),d=v(6),j=d.chords[0],l=document.getElementById("voicing"),m=document.getElementById("card");t(),h.onchange=function(n){console.log(f(n).str()),n.some(function(n){return!j.notes.find(function(o){return n.data===o.data})})?a():n.length===j.notes.length&&j.notes.every(function(o,r){return n[r].data===o.data})?(u(),setTimeout(s,1e3)):n.length>0?c():e()},context=new AudioContext,oscillator=context.createOscillator(),oscillator.connect(context.destination),oscillator.start(0),oscillator.stop(0)},{"./midi.js":3,"./music/Chord.js":4,"./music/progressions/CircleOfFourths-7-3-5.js":18,"./music/progressions/Diatonic-7-3-5.js":19}],2:[function(n,o,r){new AudioContext;o.exports={play:function(n){return},stop:function(n){return}}},{}],3:[function(n,o,r){function t(n){var o=n.data,r=144===o[0],t=o[1],s=i(t);if(r)u.notes.push(s),e.play(t);else{var c=u.notes.findIndex(function(n){return n._key===t});c>-1&&u.notes.splice(c,1),e.stop(t)}u.notes.sort(function(n,o){return n._key>o._key}),u.onchange(u.notes)}function s(n){n.inputs.forEach(function(n){return n.onmidimessage=t})}var e=n("./audio.js"),i=n("./music/Note.js"),c=n("./music/Chord.js"),u={notes:[],onchange:function(){return console.log(c(u.notes).str())}};navigator.requestMIDIAccess().then(s),o.exports=u},{"./audio.js":2,"./music/Chord.js":4,"./music/Note.js":7}],4:[function(n,o,r){o.exports=function(n,o){var r={notes:n,root:n[0]};return r.name=function(){return r.root.str()+o},r.str=function(){return r.notes.map(function(n){return n.str()})},r}},{}],5:[function(n,o,r){o.exports=function(n){return n=n?n:MajorChord,Array(12).fill(0).reduce(function(o,r,t){return o.push(n(5*t)),o},[])}},{}],6:[function(n,o,r){var t=n("./Scale.js");o.exports=function(n,o,r,s,e){var i=(t(n),[o(n),r(n+2),r(n+4),o(n+5),s(n+7),r(n+9),e(n-1)]);return i.concat([i[0]]).concat(i.reverse())}},{"./Scale.js":9}],7:[function(n,o,r){var t=["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];o.exports=function(n){var o=(60+n)%12;return{data:o,_key:n,str:function(){return t[o]}}}},{}],8:[function(n,o,r){o.exports=function(n,o){return{name:n,chords:o}}},{}],9:[function(n,o,r){var t=n("./Note.js");o.exports=function(n){return{root:function(){return t(n)},minorThird:function(){return t(n+3)},majorThird:function(){return t(n+4)},diminishedFifth:function(){return t(n+6)},perfectFifth:function(){return t(n+7)},majorSeventh:function(){return t(n-1)},minorSeventh:function(){return t(n-2)}}}},{"./Note.js":7}],10:[function(n,o,r){var t=n("../chords/DominantSeventhChord.js"),s=n("../voicings/Rootless.js"),e=n("../voicings/Inversion.js");o.exports=function(n){return e(s(t(n)),2)}},{"../chords/DominantSeventhChord.js":14,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],11:[function(n,o,r){var t=n("../chords/HalfDiminishedChord.js"),s=n("../voicings/Rootless.js"),e=n("../voicings/Inversion.js");o.exports=function(n){return e(s(t(n)),2)}},{"../chords/HalfDiminishedChord.js":15,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],12:[function(n,o,r){var t=n("../chords/MajorSeventhChord.js"),s=n("../voicings/Rootless.js"),e=n("../voicings/Inversion.js");o.exports=function(n){return e(s(t(n)),2)}},{"../chords/MajorSeventhChord.js":16,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],13:[function(n,o,r){var t=n("../chords/MinorSeventhChord.js"),s=n("../voicings/Rootless.js"),e=n("../voicings/Inversion.js");o.exports=function(n){return e(s(t(n)),2)}},{"../chords/MinorSeventhChord.js":17,"../voicings/Inversion.js":20,"../voicings/Rootless.js":21}],14:[function(n,o,r){var t=n("../Scale.js"),s=n("../Chord.js");o.exports=function(n){var o=t(n);return s([o.root(),o.majorThird(),o.perfectFifth(),o.minorSeventh()],"<small>7</small>")}},{"../Chord.js":4,"../Scale.js":9}],15:[function(n,o,r){var t=n("../Scale.js"),s=n("../Chord.js");o.exports=function(n){var o=t(n);return s([o.root(),o.minorThird(),o.diminishedFifth(),o.minorSeventh()],"<small>&#8709;</small>")}},{"../Chord.js":4,"../Scale.js":9}],16:[function(n,o,r){var t=n("../Scale.js"),s=n("../Chord.js");o.exports=function(n){var o=t(n);return s([o.root(),o.majorThird(),o.perfectFifth(),o.majorSeventh()],"<small>maj7</small>")}},{"../Chord.js":4,"../Scale.js":9}],17:[function(n,o,r){var t=n("../Scale.js"),s=n("../Chord.js");o.exports=function(n){var o=t(n);return s([o.root(),o.minorThird(),o.perfectFifth(),o.minorSeventh()],"<small>m7</small>")}},{"../Chord.js":4,"../Scale.js":9}],18:[function(n,o,r){var t=n("../Progression.js"),s=n("../CircleOfFourths.js"),e=n("../chord-voicings/MajorSeventh-7-3-5.js"),i=n("../chord-voicings/DominantSeventh-7-3-5.js"),c=n("../chord-voicings/MinorSeventh-7-3-5.js");o.exports=function(){return t("Rootless 7-3-5",s(e).concat(s(i)).concat(s(c)))}},{"../CircleOfFourths.js":5,"../Progression.js":8,"../chord-voicings/DominantSeventh-7-3-5.js":10,"../chord-voicings/MajorSeventh-7-3-5.js":12,"../chord-voicings/MinorSeventh-7-3-5.js":13}],19:[function(n,o,r){var t=n("../Progression.js"),s=n("../Diatonic.js"),e=n("../chord-voicings/MajorSeventh-7-3-5.js"),i=n("../chord-voicings/MinorSeventh-7-3-5.js"),c=n("../chord-voicings/DominantSeventh-7-3-5.js"),u=n("../chord-voicings/HalfDiminished-7-3-5.js");o.exports=function(n){return t("Rootless 7-3-5",s(n,e,i,c,u))}},{"../Diatonic.js":6,"../Progression.js":8,"../chord-voicings/DominantSeventh-7-3-5.js":10,"../chord-voicings/HalfDiminished-7-3-5.js":11,"../chord-voicings/MajorSeventh-7-3-5.js":12,"../chord-voicings/MinorSeventh-7-3-5.js":13}],20:[function(n,o,r){o.exports=function(n,o){o=o?o:1;for(var r=0;r<o;r++)n.notes.push(n.notes.shift());return n}},{}],21:[function(n,o,r){o.exports=function(n){return n.notes=n.notes.filter(function(o){return o.data!==n.root.data}),n}},{}]},{},[1]);