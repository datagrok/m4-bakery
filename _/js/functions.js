var dirname_re = /^.*\//;

// Given the data from pages.json, build the navigation links that should
// appear in the header, and insert them there.
function build_header_nav(data) {
    // FIXME this code is disgusting, rewrite it
    var nav = $.map(data, function(item, i){
        // data will contain all pages in the site. Toplevel nav header should
        // contain all children nodes of the root node. That is, all nodes of
        // the form:
        //      (root)/something/index.html
        // but not
        //      (root)/index.html

        // Skip the dummy object marking the end of the array
        if (!item.title) return '';

        // Throw out anything that's not sub/index.html
        var path = item.path.substr(1).split('/');
        if (path.length > 2) return '';
        if (path.length == 2 && path[1] != "index.html") return '';
        if (path.length < 1) return '';
        if (path[0] == "index.html") return '';

        var target = site_root + path.join('/');
        // If the current item is the page we're on, set a class so it can
        // be displayed differently.
        var current = (
            window.location.pathname == target ||
            (window.location.pathname.substr(-1) == '/' &&
             window.location.pathname + "index.html" == target));

        // Build up the HTML for the object.
        return `
            <li class='nav-item'><a
                class='nav-link ${current?"active":""}'
                ${current?'aria-current="page"':''}
                href='${target}'>${item.short_title || item.title}</a>
            </li>");`;
    }).join("");
    nav = $(nav);
    $(document).ready(function(){
        $('#navbar-items>ul').append(nav);
    });
}

// Can be passed in data.sort() to sort by modification date
function sort_modified(a,b) {
    // FIXME use this somewhere...
    return a.modified - b.modified;
}

// Given data in the form of pages.json, build an object tree
function build_tree(data) {
    // FIXME TODO
    data.forEach(function(v){

    });
}

// Given the data from pages.json, build a hierarchical site-map
function build_sitemap(data) {
    // FIXME TODO
    var target = $('#sitemap');
    if (!target.length) return;
}

// Given the data from pages.json, build a list of child nodes of current.
function build_child_links(data) {
    // FIXME this code is disgusting, rewrite it
    var nav = $.map(data, function(item, i){
        // data will contain all pages in the site. Child links should contain
        // all children nodes of the current node. That is, all nodes of the
        // form:
        //      (blah)/something/index.html
        // where window.location.pathname is of the form
        //      (blah)/ or
        //      (blah)/index.html

        // Skip the dummy object marking the end of the array
        if (!item.title) return '';

        // Throw out anything that's not this directory or sub/index.html
        var current = window.location.pathname;
        var path = site_root + item.path.substr(1);
        if (current.substr(-10) == "index.html") {
            current = current.slice(0,-10);
        }

        if (path.substr(0,current.length) != current) return '';
        if (path.substr(current.length).split('/').length != 2) return '';

        // Build up the HTML for the object.
        return (
            "<li><a href=\'"+
            path +
            "\'>" +
            (item.short_title || item.title) +
            "</a></li>");

    }).join("");
    nav = $("<ul>" + nav + "</ul>");
    $(document).ready(function(){
        $('nav#interior').replaceWith(nav);
    });
}

// Bootstrap wants me to use classes, not css selectors, to style the page, so I
// have to do this, I think? Is there no pure css way aside from writing my own
// overrides from scratch?
$(document).ready(function(){
    $('figure').addClass(['figure', 'float-end', 'w-25', 'ms-3', 'my-3']);
    $('figure > img').addClass(['figure-img', 'img-fluid']);
    $('figcaption').addClass(['figure-caption', 'd-none', 'd-sm-block', 'text-end']);
});

$.getJSON(site_root + 'pages.json')
    .done(build_header_nav)
    .done(build_child_links);
// .done(build_sitemap)
