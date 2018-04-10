var editor = CodeMirror(document.getElementById('editor'), {
    lineNumbers: true,
    value: "console.log('Editor');",
    mode: "javascript",
    lineWrapping: true,
    theme: 'monokai'
});