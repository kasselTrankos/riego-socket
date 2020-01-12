import {taggedSum} from 'daggy';
const Either = taggedSum('Either', {
    Left: ['x'],
    Right: ['x']
});


module.exports = Either;