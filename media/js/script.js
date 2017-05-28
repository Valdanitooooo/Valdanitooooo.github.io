;(function() {
    'use strict';
    var body = document.body;
    var header = document.getElementById('header');
    var btnOpenSidebar = document.getElementById('btn-open-sidebar');
    var main = document.getElementById('main');
    var sidebar = document.getElementById('sidebar');
    var slided = false;
    function resize() {
        if (parseInt(window.innerWidth) > 768) {
            hideSidebar();
        }
    }
    function showSidebar() {
        body.className = 'pushed';
        header.className = 'pushed';
        main.className = 'pushed';
        sidebar.className = 'pushed';
        slided = true;
    }
    function hideSidebar() {
        body.className = '';
        header.className = '';
        main.className = '';
        sidebar.className = '';
        slided = false;
    }
    function controlSidebar() {
        if (slided === false) {
            showSidebar();
        } else {
            hideSidebar();
        }
    }
    window.onresize = resize;
    btnOpenSidebar.onclick = controlSidebar;
})();