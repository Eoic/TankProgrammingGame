var splitSizes = localStorage.getItem('split-sizes');
splitSizes = (splitSizes) ? JSON.parse(splitSizes) : [50, 50];

var split = Split(['#game-view', '#code-view'], {
    direction: 'vertical',
    sizes: splitSizes,
    gutterSize: 8,
    minSize: 0,
    onDragEnd: function(){
        resizeSceneToFit(),
        localStorage.setItem('split-sizes', JSON.stringify(split.getSizes()));
    },
});