
var UTIL;
(function (UTIL) {
    var Browser = (function () {
        function Browser() {
            this.msie = false;
            this.chrome = false;
            this.safari = false;
            this.firefox = false;
        }
        return Browser;
    })();
    UTIL.Browser = Browser;

    /*
    Function: getBrowserInfo
    
    Browser 정보를 반환.
    
    Returns:
    >Browser : {
    >    msie: boolean,
    >    chrome: boolean,
    >    safari: boolean,
    >    firefox: boolean,
    >    version: number
    >}
    
    Example:
    >var browser = UTIL.getBrowserInfo();
    >if (browser.chrome) {
    >    console.log('크롬 버전 - ' + browser.version);
    >}
    */
    function getBrowserInfo() {
        var info = new Browser();

        if (new RegExp("msie", "i").test(navigator.userAgent)) {
            info.msie = true;
            info.version = parseInt(navigator.userAgent.match(/(msie)\s[0-9|.]*/ig).toString().replace(/(msie)\s/ig, "").replace(/\..*[0-9]+$/ig, ""));
        } else if (new RegExp("chrome", "i").test(navigator.userAgent)) {
            info.chrome = true;
            info.version = parseInt(navigator.userAgent.match(/(chrome)\/[0-9|\.]*/ig).toString().replace(/(chrome)\//ig, "").replace(/\..*[0-9]+$/ig, ""));
        } else if (new RegExp("safari", "i").test(navigator.userAgent)) {
            info.safari = true;
            info.version = parseInt(navigator.userAgent.match(/(safari)\/[0-9|\.]*/ig).toString().replace(/(safari)\//ig, "").replace(/\..*[0-9]+$/ig, ""));
        } else if (new RegExp("firefox", "i").test(navigator.userAgent)) {
            info.firefox = true;
            info.version = parseInt(navigator.userAgent.match(/(firefox)\/[0-9|\.]*/ig).toString().replace(/(firefox)\//ig, "").replace(/\..*[0-9]+$/ig, ""));
        }

        return info;
    }
    UTIL.getBrowserInfo = getBrowserInfo;

    /*
    Function: trim
    
    문자열 공백을 제거한다.
    브라우저별 호환문제로 함수 구현.
    
    Parameters:
    
    input : string - 공백을 제거할 입력 문자열.
    
    Returns:
    
    result : string - 공백이 제거된 문자열.
    
    Example:
    
    >var input = " 문자 ";
    >var result = UTIL.trim(input);
    */
    function trim(input) {
        if (getBrowserInfo().msie && getBrowserInfo().version < 9) {
            return input.replace(/(^\s*)|(\s*$)/g, "");
        } else {
            return input.trim();
        }
    }
    UTIL.trim = trim;

    /*
    Function: loadJavascripts
    
    자바스크립트를 동적으로 불러온다.
    
    Parameters:
    
    uris : string[] - 동적으로 불러올 스크립트 경로를 배열로 정의한다.
    callback : Function - 자바스크립트 로드 후 작동할 함수.
    
    Example:
    
    >UTIL.loadJavascripts(['script_1.js', 'script_2.js', 'script_3.js'], function() { console.log('script loaded'); });
    */
    function loadJavascripts(uris, callback) {
        if (typeof uris != "undefined" && uris != null) {
            if (uris instanceof Array && uris.length > 0) {
                var temp = _.first(uris);
                var uris = _.rest(uris);

                UTIL.loadJavascript(temp, function () {
                    UTIL.loadJavascripts(uris, callback);
                });
            } else {
                if (typeof callback == "function" && callback != null) {
                    callback();
                }
            }
        }
    }
    UTIL.loadJavascripts = loadJavascripts;

    /*
    Function: loadJavascript
    
    자바스크립트를 동적으로 불러온다.
    
    Parameters:
    
    uris : string - 동적으로 불러올 스크립트 경로.
    callback : Function - 자바스크립트 로드 후 작동할 함수.
    
    Example:
    
    >UTIL.loadJavascript('script_1.js', function() { console.log('script loaded'); });
    */
    function loadJavascript(uri, callback) {
        var head = document.getElementsByTagName('head')[0];
        var element = document.createElement('script');
        element.setAttribute('type', 'text/javascript');
        element.setAttribute('src', uri);

        if (typeof callback == "function" && callback != null) {
            var loaded = false;
            element.onreadystatechange = function () {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    if (loaded) {
                        return;
                    }
                    loaded = true;
                    console.log("loadedJavascript :: " + uri);
                    callback();
                }
            };
            element.onload = function () {
                console.log("loadedJavascript :: " + uri);
                callback();
            };
        }

        head.appendChild(element);
    }
    UTIL.loadJavascript = loadJavascript;

    /*
    Function: loadStylesheets
    
    CSS를 동적으로 불러온다.
    
    Parameters:
    
    uris : string[] - 동적으로 불러올 CSS 경로를 배열로 정의한다.
    callback : Function - CSS 로드 후 작동할 함수.
    
    Example:
    
    >UTIL.loadStylesheets(['css_1.css', 'css_2.css', 'css_3.css'], function() { console.log('css loaded'); });
    */
    function loadStylesheets(uris, callback) {
        if (typeof uris != "undefined" && uris != null) {
            if (uris instanceof Array && uris.length > 0) {
                var temp = _.first(uris);
                var uris = _.rest(uris);

                UTIL.loadStylesheet(temp, function () {
                    UTIL.loadStylesheets(uris, callback);
                });
            } else {
                if (typeof callback == "function" && callback != null) {
                    callback();
                }
            }
        }
    }
    UTIL.loadStylesheets = loadStylesheets;

    /*
    Function: loadStylesheet
    
    CSS를 동적으로 불러온다.
    
    Parameters:
    
    uris : string - 동적으로 불러올 CSS 경로.
    callback : Function - CSS 로드 후 작동할 함수.
    
    Example:
    
    >UTIL.loadStylesheet(['css_1.css', 'css_2.css', 'css_3.css'], function() { console.log('css loaded'); });
    */
    function loadStylesheet(uri, callback) {
        var head = document.getElementsByTagName('head')[0];
        var element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', uri);

        if (typeof callback == "function" && callback != null) {
            var loaded = false;
            element.onreadystatechange = function () {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    if (loaded) {
                        return;
                    }
                    loaded = true;

                    console.log("loadedStylesheet :: " + uri);
                    callback();
                }
            };
            element.onload = function () {
                console.log("loadedStylesheet :: " + uri);
                callback();
            };
        }

        head.appendChild(element);
    }
    UTIL.loadStylesheet = loadStylesheet;

    function appendStyle(css) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.setAttribute('type', 'text/css');
        if (style.styleSheet) {
            style.styleSheet["cssText"] = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }
    UTIL.appendStyle = appendStyle;
})(UTIL || (UTIL = {}));
//# sourceMappingURL=UTIL.js.map
;
define("UTIL", function(){});

/* 
 * MIT License
 */
var contextMenu = contextMenu || (function () {
    var options = {
        fadeSpeed: 100,
        filter: function ($obj) {
            // Modify $obj, Do not return
        },
        above: 'auto',
        preventDoubleContext: true,
        compress: false
    };

    function initialize(opts) {

        options = $.extend({}, options, opts);

        // $(gmap.map.div.firstElementChild).click(function () { console.log("eeeee"); });
        // $("#" + gmap.map.div.firstElementChild.id).click(function () { console.log("eeeee"); });
        if (typeof options.clickExtend != 'undefined' && options.clickExtend != null) {
            var clickTarget = [];
            if (typeof options.clickExtend == "string") {
                clickTarget.push(options.clickExtend);
            } else if (options.clickExtend instanceof Array) {
                clickTarget = options.clickExtend;
            }

            for (var i in clickTarget) {
                var item = clickTarget[i];

                $(item).click(function () {
                    $('.dropdown-context').fadeOut(options.fadeSpeed, function () {
                        $('.dropdown-context').css({ display: '' }).find('.drop-left').removeClass('drop-left');
                    });
                });
            }
        }

        $(document).on('click', 'html', function () {
            $('.dropdown-context').fadeOut(options.fadeSpeed, function () {
                $('.dropdown-context').css({ display: '' }).find('.drop-left').removeClass('drop-left');
            });
        });
        if (options.preventDoubleContext) {
            $(document).on('contextmenu', '.dropdown-context', function (e) {
                e.preventDefault();
            });
        }
        $(document).on('mouseenter', '.dropdown-submenu', function () {
            var $sub = $(this).find('.dropdown-context-sub:first'),
                subWidth = $sub.width(),
                subLeft = $sub.offset().left,
                collision = (subWidth + subLeft) > window.innerWidth;
            if (collision) {
                $sub.addClass('drop-left');
            }
        });

    }

    function updateOptions(opts) {
        options = $.extend({}, options, opts);
    }

    function buildMenu(data, id, subMenu) {
        var subClass = (subMenu) ? ' dropdown-context-sub' : '',
            compressed = options.compress ? ' compressed-context' : '',
            $menu = $('<ul class="dropdown-menu dropdown-context' + subClass + compressed + '" id="dropdown-' + id + '"></ul>');
        var i = 0, linkTarget = '';
        for (i; i < data.length; i++) {
            if (typeof data[i].divider !== 'undefined') {
                $menu.append('<li class="divider"></li>');
            } else if (typeof data[i].header !== 'undefined') {
                $menu.append('<li class="nav-header">' + data[i].header + '</li>');
            } else {
                if (typeof data[i].href == 'undefined') {
                    data[i].href = '#';
                }
                if (typeof data[i].target !== 'undefined') {
                    linkTarget = ' target="' + data[i].target + '"';
                }
                if (typeof data[i].subMenu !== 'undefined') {
                    $sub = ('<li class="dropdown-submenu"><a tabindex="-1" href="' + data[i].href + '">' + data[i].text + '</a></li>');
                } else {
                    $sub = $('<li><a tabindex="-1" href="' + data[i].href + '"' + linkTarget + '>' + data[i].text + '</a></li>');
                }
                if (typeof data[i].action !== 'undefined') {
                    var actiond = new Date(),
                        actionID = 'event-' + actiond.getTime() * Math.floor(Math.random() * 100000),
                        eventAction = data[i].action;
                    $sub.find('a').attr('id', actionID);
                    $('#' + actionID).addClass('context-event');
                    $(document).on('click', '#' + actionID, eventAction);
                }
                $menu.append($sub);
                if (typeof data[i].subMenu != 'undefined') {
                    var subMenuData = buildMenu(data[i].subMenu, id, true);
                    $menu.find('li:last').append(subMenuData);
                }
            }
            if (typeof options.filter == 'function') {
                options.filter($menu.find('li:last'));
            }
        }
        return $menu;
    }

    function addContext(selector, data, isClear) {

        if (typeof isClear == 'boolean' && isClear) {
            $('.dropdown-menu').remove();
        }

        var d = new Date(),
            id = d.getTime(),
            $menu = buildMenu(data, id);

        $('body').append($menu);

        $(document).on('contextmenu', selector, function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('.dropdown-context:not(.dropdown-context-sub)').hide();

            $dd = $('#dropdown-' + id);
            if (typeof options.above == 'boolean' && options.above) {
                $dd.addClass('dropdown-context-up').css({
                    top: e.pageY - 20 - $('#dropdown-' + id).height(),
                    left: e.pageX - 13
                }).fadeIn(options.fadeSpeed);
            } else if (typeof options.above == 'string' && options.above == 'auto') {
                $dd.removeClass('dropdown-context-up');
                var autoH = $dd.height() + 12;
                if ((e.pageY + autoH) > $('html').height()) {
                    $dd.addClass('dropdown-context-up').css({
                        top: e.pageY - 20 - autoH,
                        left: e.pageX - 13
                    }).fadeIn(options.fadeSpeed);
                } else {
                    $dd.css({
                        top: e.pageY + 10,
                        left: e.pageX - 13
                    }).fadeIn(options.fadeSpeed);
                }
            }
        });
    }

    function onContext(event, data, isClear) {
        if (typeof isClear == 'boolean' && isClear) {
            $('.dropdown-menu').remove();
        }

        var d = new Date(),
            id = d.getTime(),
            $menu = buildMenu(data, id);

        $('body').append($menu);

        event.preventDefault();
        event.stopPropagation();

        $('.dropdown-context:not(.dropdown-context-sub)').hide();

        $dd = $('#dropdown-' + id);
        if (typeof options.above == 'boolean' && options.above) {
            $dd.addClass('dropdown-context-up').css({
                top: event.pageY - 20 - $('#dropdown-' + id).height(),
                left: event.pageX - 13
            }).fadeIn(options.fadeSpeed);
        } else if (typeof options.above == 'string' && options.above == 'auto') {
            $dd.removeClass('dropdown-context-up');
            var autoH = $dd.height() + 12;
            if ((event.pageY + autoH) > $('html').height()) {
                $dd.addClass('dropdown-context-up').css({
                    top: event.pageY - 20 - autoH,
                    left: event.pageX - 13
                }).fadeIn(options.fadeSpeed);
            } else {
                $dd.css({
                    top: event.pageY + 10,
                    left: event.pageX - 13
                }).fadeIn(options.fadeSpeed);
            }
        }
    }

    function destroyContext(selector) {
        $(document).off('contextmenu', selector).off('click', '.context-event');

        clickTarget = [];
        if (typeof options.clickExtend == "string") {
            clickTarget.push(options.clickExtend);
        } else if (options.clickExtend instanceof Array) {
            clickTarget = options.clickExtend;
        }

        for (var i in clickTarget) {
            var item = clickTarget[i];
            // $("#" + gmap.map.div.firstElementChild.id).off('click')
            $(item).off('click');
        }

        $('.dropdown-menu').remove();
    }

    return {
        init: initialize,
        settings: updateOptions,
        attach: addContext,
        destroy: destroyContext,
        on: onContext
    };

})();

/*

���� ���� ������ ����.

context.standalone.css �� ���� �ε��ϰ�, ������ ���� context �� �ʱ�ȭ �Ѵ�.
context.init({ compress: true, clickExtend: "#" + gmap.map.div.firstElementChild.id });

�� ��, clickExtend �� contextMenu�� clickout ���ɿ� ������ target element �� �߰��� �����Ѵ�.
���� ������ ���� �޴��� Ȱ��ȭ �Ѵ�.

contextMenu.attach(target, [
  { header: 'Download' }
  , {
    text: 'The Script', subMenu: [
      { header: 'Requires jQuery' }
      , {
        text: 'context.js', href: 'http://contextjs.com/context.js', target: '_blank', action: function (e) {
          console.log("action");
        }
      }
    ]
  }
], true);

���⼭ target�� click�� element�̴�. �� target�� Ŭ���ϸ� �޴��� ���´ٴ� ��,


*/;
define("contextMenu", function(){});

/// <reference path="underscore.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../UTIL/UTIL.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.ServerInfo
    
    GeoNURIS.ServerInfo 클래스.
    */
    var ServerInfo = (function () {
        /*
        Constructor: ServerInfo
        생성자.
        
        Parameters:
        
        >host: string,                      // 서비스 호스트명
        >port: number,                      // 서비스 포트
        >context: string,                   // 서비스 컨텍스트
        >gdx: string,                       // 서비스 GDX이름
        >options?: {                        // 추가옵션
        >    cacheKey?: string;             // 캐시KEY
        >    zoomLevel?: number;            // 줌레벨
        >    maxResolution?: number;        // 최대해상도
        >    maxExtent?: {                  // 최대크기
        >       left: number;
        >       bottom: number;
        >       right: number;
        >       top: number;
        >    }
        >    tileSize?: {                   // 타일크기
        >       width: number;
        >       height: number;
        >    };
        >    buffer?: number;               // 버퍼
        >    projection?: string;           // 좌표계
        >    singleTile?: boolean;          // 싱글타일 여부
        >    autoVisible?: boolean;         // MAP에 자동으로 표시될 것인지 여부(해당 설정의 기본값은 true이나, false로 설정하면 MAP에 표시되지 않는다.)
        >    isCapabilitySupport?: boolean; // capability지원 여부, 기본 값은 false이다.
        >    layers?: string[];             // 사용할 레이어명 배열, isCapabilitySupport가 true일 경우 생략된다.
        >}
        
        Example:
        
        >// ServerInfo를 저장할 배열
        >var serverInfos = [];
        >
        >// case #1. capability를 지원하는 일반 non-cache ServerInfo 생성,
        >// 기본 옵션설정이 capability를 통해 자동으로 정의되며 map에 proxyHost 설정이 필요하다.
        >serverInfos.push(new GeoNURIS.ServerInfo(
        >   '127.0.0.1',                        // 서비스 호스트네임
        >   8080,                               // 서비스 포트
        >   '/geonuris',                        // 서비스 컨텍스트
        >   'MAP.xml',                          // GDX
        >   {                                   // 추가 옵션
        >       isCapabilitySupport: true,      // capability지원 여부, 생략 가능하며 생략시 기본 값은 false이다.
        >   }
        >));
        >
        >// case #2. capability를 지원하지 않는 non-cache ServerInfo 생성,
        >// 기본 옵션설정을 수동으로 해주어야 하며 map에 proxyHost가 설정되지 않아도 WMS를 사용할 수 있다.
        >serverInfos.push(new GeoNURIS.ServerInfo(
        >   '127.0.0.1',                                    // 서비스 호스트네임
        >   8080,                                           // 서비스 포트
        >   '/geonuris',                                    // 서비스 컨텍스트
        >   'MAP2.xml',                                     // GDX
        >   {                                               // 추가 옵션
        >       isCapabilitySupport: false,                 // capability지원 여부, 생략 가능하며 생략시 기본 값은 false이다.
        >       layers: ['GSS.layer_1','GSS.layer_2',...],  // 서비스할 레이어 목록
        >       maxExtent: {                                // 최대크기
        >           bottom: 4504689.2534526
        >           , left: 14086065.172944
        >           , right: 14179666.166347
        >           , top: 4549862.9949213
        >       },
        >       tileSize: { width: 256, height: 256 },      // 타일크기
        >       maxResolution: 365.6288804804717,           // 최대 해상도
        >       projection: "EPSG:900913"                   // 좌표계
        >   }
        >));
        >
        >// case #3. cache를 지원하는 ServerInfo 생성,
        >// capability를 지원하더라도 옵션설정을 임의로 지정해 주어야 한다.
        >serverInfos.push(new GeoNURIS.ServerInfo(
        >   '127.0.0.1',                                // 서비스 호스트네임
        >   8080,                                       // 서비스 포트
        >   '/geonuris',                                // 서비스 컨텍스트
        >   'CacheMAP.xml',                             // GDX
        >   {                                           // 추가 옵션
        >       isCapabilitySupport: true,              // capability지원 여부, 생략 가능하며 생략시 기본 값은 false이다.
        >       cacheKey: "turk",                       // 캐쉬키
        >       zoomLevel: 9,                           // 줌레벨
        >       maxResolution: 64,                      // 최대해상도
        >       maxExtent: {                            // 최대 크기
        >           left: 607995.3821230334
        >           , bottom: 4187538.00625121
        >           , right: 631305.0770494939
        >           , top: 4212722.257063365
        >       },
        >       tileSize: { width: 512, height: 512 },  // 타일크기
        >       singleTile: false                       // 싱글타일여부
        >));
        >
        >// 맵의 생성자 파라메터로 정의한다.
        >var gmap = new GeoNURIS.Map(
        >   "map",                                  // 맵 div 이름
        >   {
        >       proxyHost: "/proxy/",               // 프록시
        >       serverInfos: serverInfos,           // serverInfos 설정
        >       ...
        >   }
        >);
        
        */
        function ServerInfo(host, port, context, gdx, options) {
            this.isCapabilitySupport = false;
            this.isCache = false;
            this.wmsLayerOptions = {};
            this.staticLayers = [];
            this.autoVisible = true;
            this.host = host;
            this.port = port;
            this.context = context;
            this.gdx = gdx;

            //this.id = _.uniqueId(UTIL.trim(this.getGDXName().toLowerCase()) + "_");
            this.id = _.uniqueId("info_");

            if (typeof options != "undefined" && options != null) {
                var opts = options;

                if (typeof opts.tileSize != "undefined" && opts.tileSize != null) {
                    var tileSize = opts.tileSize;
                    if (typeof tileSize.width == "number" && typeof tileSize.height == "number") {
                        this.wmsLayerOptions.tileSize = new OpenLayers.Size(tileSize.width, tileSize.height);
                    }
                }

                if (typeof opts.maxExtent != "undefined" && opts.maxExtent != null) {
                    var maxExtent = opts.maxExtent;
                    if (typeof maxExtent.left == "number" && typeof maxExtent.bottom == "number" && typeof maxExtent.right == "number" && typeof maxExtent.top == "number") {
                        this.wmsLayerOptions.maxExtent = [maxExtent.left, maxExtent.bottom, maxExtent.right, maxExtent.top];
                    }
                }

                if (typeof opts.projection == "string") {
                    this.wmsLayerOptions.projection = opts.projection;
                }

                if (typeof opts.zoomLevel == "number") {
                    this.wmsLayerOptions.numZoomLevels = opts.zoomLevel;
                }

                if (typeof opts.buffer == "number") {
                    this.wmsLayerOptions.buffer = opts.buffer;
                }

                if (typeof opts.singleTile == "boolean") {
                    this.wmsLayerOptions.singleTile = opts.singleTile;
                }

                if (opts.cacheKey && opts.zoomLevel && opts.maxResolution && opts.maxExtent && opts.tileSize) {
                    this.cacheKey = opts.cacheKey;
                    this.isCache = true;
                    this.wmsLayerOptions.maxResolution = opts.maxResolution;
                }

                if (typeof opts.autoVisible == "boolean") {
                    this.autoVisible = opts.autoVisible;
                }

                if (typeof opts.isCapabilitySupport == "boolean") {
                    this.isCapabilitySupport = opts.isCapabilitySupport;
                }

                // capability를 이용하지 않고, layers가 정의되었다면,
                if (typeof opts.layers != "undefined") {
                    this.staticLayers = opts.layers;
                }
            }
        }
        /*
        Function: getStaticLayers
        
        생성자에서 지정한 layers의 값{string[]}을 반환한다.
        
        Returns:
        
        layers : string[]
        
        Example:
        
        >// layers를 파라메터 값으로 갖는 ServerInfo를 생성한다.
        >var sInfo = new GeoNURIS.ServerInfo(..., {..., layers:['l1','l2','l3']});
        >
        >var layers = sInfo.getStaticLayers();
        >
        >for(var key in layers) {
        >   console.log(layers[key]);
        >}
        
        */
        ServerInfo.prototype.getStaticLayers = function () {
            return this.staticLayers;
        };

        /*
        Function: getURI
        
        서비스 URI를 반환한다.
        
        Parameters:
        
        type? : string - URI종류, wfs / wms 를 선택할 수 있다. 생략할 경우 base URI를 반환한다.
        
        Returns:
        
        uri : string
        
        Example:
        
        >var sInfo = new GeoNURIS.ServerInfo(...생략);
        >
        >// case #1.
        >console.log(svc.getURI());
        >
        >// case #2.
        >console.log(svc.getURI('wms'));
        >
        >// case #3.
        >console.log(svc.getURI('wfs'));
        */
        ServerInfo.prototype.getURI = function (type) {
            var baseURI = "http://" + this.host + ":" + this.port + this.context;
            if (type) {
                if (UTIL.trim(type.toLowerCase()) == "wfs") {
                    return baseURI + "/wfs?GDX=" + this.gdx + "&";
                } else if (UTIL.trim(type.toLowerCase()) == "wms") {
                    var wmsURI = baseURI + "/wms?GDX=" + this.gdx + "&";
                    if (this.isCache) {
                        return wmsURI + "CACHE_KEY=" + this.cacheKey + "&";
                    } else {
                        return wmsURI;
                    }
                }
            } else {
                return baseURI;
            }
        };

        /*
        Function: getID
        ServiceInfo의 고유ID를 반환한다.
        
        Returns:
        
        id : string
        
        Example:
        
        >var sInfo = new GeoNURIS.ServerInfo(...생략);
        >
        >sInfo.getID();
        */
        ServerInfo.prototype.getID = function () {
            return this.id;
        };

        /*
        Function: getGDXName
        
        서비스 GDX이름을 반환한다.
        
        Parameters:
        
        isExtension? : boolean - GDX파일명의 확장자 반환 여부, 기본값은 true이다.
        
        Returns:
        
        gdxName : string
        
        Example:
        
        >var sInfo = new GeoNURIS.ServerInfo(...생략);
        >
        >// case #1.
        >sInfo.getGDXName();
        >
        >// case #2.
        >sInfo.getGDXName(false);
        
        */
        ServerInfo.prototype.getGDXName = function (isExtension) {
            if (this.gdx) {
                if (typeof isExtension != "undefined" && isExtension) {
                    return this.gdx;
                } else {
                    return this.gdx.replace(".xml", "").replace(/\./ig, "_");
                }
            } else {
                return "unknow";
            }
        };

        /*
        Function: getWMSLayerOptions
        
        {OpenLayers.Layer.WMS} 에 설정할 Options를 반환한다.
        
        Returns:
        
        >wmsLayerOptions : {
        >   numZoomLevels?: number;         // 줌레벨
        >   maxResolution?: number;         // 최대해상도
        >   maxExtent?: number[];           // 최대크기(배열)
        >   tileSize?: OpenLayers.Size;     // 타일사이즈
        >   projection?: string;            // 좌표계
        >   singleTile?: boolean;           // 싱글타일 여부
        >}
        
        Example:
        
        >var sInfo = new GeoNURIS.ServerInfo(...생략);
        >
        >var wmsInfo = sInfo.getWMSLayerOptions();
        >wmsInfo.maxResolution;
        
        */
        ServerInfo.prototype.getWMSLayerOptions = function () {
            // WMSLayer 를 만들 때 필요한 옵션 값  제공하는 함수
            // ServerInfo 생성자를 통해 입력 받는 옵션 값을 반환한다.
            return this.wmsLayerOptions;
        };
        return ServerInfo;
    })();
    GeoNURIS.ServerInfo = ServerInfo;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=ServerInfo.js.map
;
define("ServerInfo", function(){});

/// <reference path="underscore.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../UTIL/UTIL.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.CustomServerInfo
    
    GeoNURIS.CustomServerInfo 클래스.
    GeoNURIS.ServerInfo를 상속받아 구현됨.
    
    */
    var CustomServerInfo = (function (_super) {
        __extends(CustomServerInfo, _super);
        /*
        Constructor: CustomServerInfo
        
        생성자.
        
        Parameters:
        
        >options : {
        >    autoVisible?: boolean;      // MAP에 자동으로 표시될 것인지 여부(해당 설정의 기본값은 true이나, false로 설정하면 MAP에 표시되지 않는다.)
        >    provider?: string;          // 사용할 CustomServerInfo 공급자 정보, vworld / daum / naver / google / osm(생략시 자동설정)
        >    serviceType?: string;       // 사용할 서비스종류, 생략시 기본 서비스, hybrid / satellite / physical(provider가 구글일 경우만 사용가능)
        >}
        
        Example:
        
        >// ServerInfo를 저장할 배열
        >var serverInfos = [];
        >
        >// case #1. OpenStreetMap
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true }));
        >
        >// case #2-1. VWorldMap 기본맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "vworld" }));
        >
        >// case #2-2. VWorldMap 위성,항공맵 + 하이브리드맵
        >// 위성,항공맵과 하이브리드맵을 각각 따로 사용할 수 있으나 구글맵을 제외한 네이버,다음도 VWorld와 같이
        >// 아래 순서대로 맵을 등록해 사용해야 원하는 결과를 얻을 수 있다.
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "vworld", serviceType: "satellite" }));
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "vworld", serviceType: "hybrid" }));
        >
        >// case #3-1. Daum 기본맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "daum"}));
        >
        >// case #3-2. Daum 위성,항공맵 + 하이브리드맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "daum", serviceType: "satellite" }));
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "daum", serviceType: "hybrid" }));
        >
        >// case #4-1. Naver 기본맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "naver"}));
        >
        >// case #4-2. Naver 위성,항공맵 + 하이브리드맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "naver", serviceType: "satellite" }));
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "naver", serviceType: "hybrid" }));
        >
        >// case #5-1. 구글 기본맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, provider: "google" }));
        >
        >// case 5-2. 구글 하이브리드맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, serviceType: "hybrid", provider: "google" }));
        >
        >// case 5-3. 구글 항공,위성맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, serviceType: "satellite", provider: "google" }));
        >
        >// case 5-4. 구글 physical맵
        >serverInfos.push(new GeoNURIS.CustomServerInfo({ autoVisible: true, serviceType: "physical", provider: "google" }));
        >
        >// 맵의 생성자 파라메터로 정의한다.
        >var gmap = new GeoNURIS.Map(
        >   "map",                                  // 맵 div 이름
        >   {
        >       serverInfos: serverInfos,           // serverInfos 설정
        >       ...
        >   }
        >);
        
        
        */
        function CustomServerInfo(options) {
            _super.call(this, "", 80, "", "", options);

            // 기본값으로 OSM(OpenStreetMap)을 정의한다.
            this.provider = "OSM";
            this.serviceType = "";

            // 옵션값이 존재한다면,
            if (typeof options != "undefined" && options != null) {
                var opt = options;

                // 옵션중 provider가 존재할 경우
                if (typeof opt.provider == "string" && opt.provider != null) {
                    // 옵션으로 정의된 provider 값을 this.provider에 정의한다.
                    this.provider = opt.provider;
                }

                // 옵션중 serviceType이 존재할 경우
                if (typeof opt.serviceType == "string" && opt.serviceType != null) {
                    // 옵션으로 정의된 serviceType값을 this.serviceType에 정의한다.
                    this.serviceType = opt.serviceType;
                } else if (this.provider.toLowerCase() == "google" || this.provider.toLowerCase() == "g") {
                    // provider의 값이 google인데, serviceType이 지정되지 않았을 경우, Streets를 정의한다.
                    this.serviceType = "Streets";
                }
            }
        }
        /*
        Function: getURI
        
        서비스 URI를 대신해 'provider_serviceType'을 반환한다.
        
        Returns:
        
        uri : string
        
        Example:
        
        >var sInfo = new GeoNURIS.CustomServerInfo(...생략);
        >
        >sInfo.getURI();
        */
        CustomServerInfo.prototype.getURI = function (type) {
            return this.provider + "_" + this.serviceType;
        };

        /*
        Function: getID
        ServiceInfo의 고유ID를 반환한다.
        
        Returns:
        
        id : string
        
        Example:
        
        >var sInfo = new GeoNURIS.CustomServerInfo(...생략);
        >
        >sInfo.getID();
        */
        CustomServerInfo.prototype.getID = function () {
            return this.id;
        };

        /*
        Function: getGDXName
        서비스 GDX이름을 대신해 'provider_serviceType'을 반환한다.
        
        Returns:
        
        gdxName : string
        
        Example:
        
        >var sInfo = new GeoNURIS.CustomServerInfo(...생략);
        >
        >sInfo.getGDXName();
        */
        CustomServerInfo.prototype.getGDXName = function (isExtension) {
            return this.provider + "_" + this.serviceType;
        };
        return CustomServerInfo;
    })(GeoNURIS.ServerInfo);
    GeoNURIS.CustomServerInfo = CustomServerInfo;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=CustomServerInfo.js.map
;
define("CustomServerInfo", function(){});

/// <reference path="ServerInfo.ts" />
/// <reference path="OpenLayers.d.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.BaseLayer
    
    GeoNURIS.BaseLayer 클래스.
    GeoNURIS.Layer 와 GeoNURIS.GroupLayer의 부모 클래스이기도 하며 OpenLayers.Layer를 추상화한 클래스이다.
    */
    var BaseLayer = (function () {
        /*
        Constructor: BaseLayer
        
        생성자.
        
        Parameters:
        
        >serverInfo: GeoNURIS.ServerInfo,    // GeoNURIS.ServerInfo
        >name: string,                       // 레이어 이름(식별자)
        >title: string,                      // 레이어 타이틀(표시이름)
        >projection: string,                 // 좌표계, 'EPSG:900913' 등과 같이 정의한다.
        
        */
        function BaseLayer(serverInfo, name, title, projection) {
            this.visibility = true;
            this.serverInfo = serverInfo;

            this.name = name;
            this.title = title;
            this.projection = projection;

            //this.id = _.uniqueId(UTIL.trim(this.name.toLowerCase()) + "_");
            this.id = _.uniqueId("layer_");
        }
        /*
        Function: getWFSProtocol
        
        레이어의 WFS프로토콜을 반환한다.
        
        Returns:
        
        protocol: OpenLayers.Protocol.WFS.v1
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어의 아이디가 'target_layer' 라고 가정한다.
        >var layerName = 'target_layer';
        >var layer = svc.getLayer(layerName);
        >
        >var protocol = layer.getWFSProtocol();
        >protocol.read(...생략);
        */
        BaseLayer.prototype.getWFSProtocol = function () {
            return new OpenLayers.Protocol.WFS({
                version: "1.1.0",
                url: this.getURI("wfs"),
                featureType: this.name,
                schema: this.getURI("wfs") + "SERVICE=WFS&VERSION=1.1.0&REQUEST=DescribeFeatureType&TYPENAME=" + this.name,
                srsName: this.projection
            });
        };

        /*
        Function: getURI
        
        레이어가 소속된 서비스{GeoNURIS.Service}의 URI를 반환한다.
        
        Parameters:
        
        type? : string - URI종류, wfs / wms 를 선택할 수 있다. 생략할 경우 base URI를 반환한다.
        
        Returns:
        
        uri : string
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어의 아이디가 'target_layer' 라고 가정한다.
        >var layerName = 'target_layer';
        >var layer = svc.getLayer(layerName);
        >
        >// case #1.
        >console.log(layer.getURI());
        >
        >// case #2.
        >console.log(layer.getURI('wms'));
        >
        >// case #3.
        >console.log(layer.getURI('wfs'));
        */
        BaseLayer.prototype.getURI = function (type) {
            return this.serverInfo.getURI(type);
        };

        /*
        Function: getVisibility
        
        레이어의 Visibility 값을 반환한다.
        
        Returns:
        
        visible: boolean        // Visibility 값을 boolean으로 반환
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어의 아이디가 'target_layer' 라고 가정한다.
        >var layerName = 'target_layer';
        >var layer = svc.getLayer(layerName);
        >
        >var isVisible = layer.getVisibility();
        >console.log('isVisible : ' + isVisible);
        */
        BaseLayer.prototype.getVisibility = function () {
            return this.visibility;
        };

        /*
        Function: setVisibility
        
        레이어의 Visibility 값을 설정한다.
        
        Parameters:
        
        isVisible: boolean          // 레이어에 정의할 Visibility 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어의 아이디가 'target_layer' 라고 가정한다.
        >var layerName = 'target_layer';
        >var layer = svc.getLayer(layerName);
        >
        >// case #1. visible 활성(=true)으로 설정
        >layer.setVisibility(true);
        >
        >// case #2. visible 비활성(=false)으로 설정
        >layer.setVisibility(false);
        */
        BaseLayer.prototype.setVisibility = function (isVisible) {
            console.log("base");
            this.visibility = isVisible;
        };
        return BaseLayer;
    })();
    GeoNURIS.BaseLayer = BaseLayer;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=BaseLayer.js.map
;
define("BaseLayer", function(){});

/// <reference path="ServerInfo.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="BaseLayer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Layer
    
    GeoNURIS.Layer 클래스.
    GeoNURIS.BaseLayer 를 상속받아 구현됨
    */
    var Layer = (function (_super) {
        __extends(Layer, _super);
        /*
        Constructor: Layer
        
        생성자.
        
        Parameters:
        
        >serverInfo: GeoNURIS.ServerInfo,    // GeoNURIS.ServerInfo
        >name: string,                       // 레이어 이름(식별자)
        >title: string,                      // 레이어 타이틀(표시이름)
        >projection: string,                 // 좌표계, 'EPSG:900913' 등과 같이 정의한다.
        
        */
        function Layer(serverInfo, name, title, projection) {
            _super.call(this, serverInfo, name, title, projection);
            /*
            Property: isGroup
            
            {boolean} 레이어 속성이 GroupLayer인지 여부를 나타냄
            
            Property: zIndex
            
            {number} 레이어 Z인덱스 값
            */
            this.isGroup = false;
            this.zIndex = -1;
        }
        /*
        Function: setZIndex
        
        레이어의 인덱스를 설정한다.
        
        Parameters:
        
        zIndex: number      // 정의하고자 하는 인덱스 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어가 rootLayer 바로 아래 있고, 아이디가 'target_layer'라고 가정한다.
        >var lName = 'target_layer';
        >
        >var layer = svc.rootLayer.getLayer(lName);
        >
        >// 인덱스 설정
        >layer.setZIndex(1000);
        
        */
        Layer.prototype.setZIndex = function (zIndex) {
            this.zIndex = zIndex;
            this.redraw();
        };

        /*
        Function: setVisibility
        
        레이어의 Visibility 값을 설정한다.
        
        Parameters:
        
        isVisible: boolean          // 레이어에 정의할 Visibility 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어가 rootLayer 바로 아래 있고, 아이디가 'target_layer'라고 가정한다.
        >var lName = 'target_layer';
        >
        >var layer = svc.rootLayer.getLayer(lName);
        >
        >// case #1. visible 활성(=true)으로 설정
        >layer.setVisibility(true);
        >
        >// case #2. visible 비활성(=false)으로 설정
        >layer.setVisibility(false);
        */
        Layer.prototype.setVisibility = function (isVisible) {
            console.log("layer");
            _super.prototype.setVisibility.call(this, isVisible);
            this.redraw();
        };

        /*
        Function: redraw
        
        해당 레이어를 다시 그린다.
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 사용할 레이어가 rootLayer 바로 아래 있고, 아이디가 'target_layer'라고 가정한다.
        >var lName = 'target_layer';
        >
        >var layer = svc.rootLayer.getLayer(lName);
        >
        >layer.redraw();
        
        */
        Layer.prototype.redraw = function () {
            console.log("redraw is not defined");
        };
        return Layer;
    })(GeoNURIS.BaseLayer);
    GeoNURIS.Layer = Layer;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Layer.js.map
;
define("Layer", function(){});

/// <reference path="ServerInfo.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="Layer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.GroupLayer
    
    GeoNURIS.GroupLayer 클래스.
    GeoNURIS.Layer 를 상속받아 구현됨
    */
    var GroupLayer = (function (_super) {
        __extends(GroupLayer, _super);
        /*
        Constructor: GroupLayer
        
        생성자.
        
        Parameters:
        
        >serverInfo: GeoNURIS.ServerInfo,    // GeoNURIS.ServerInfo
        >name: string,                       // 레이어 이름(식별자)
        >title: string,                      // 레이어 타이틀(표시이름)
        >projection: string,                 // 좌표계, 'EPSG:900913' 등과 같이 정의한다.
        
        */
        function GroupLayer(serverInfo, name, title, subLayers, isGroup) {
            _super.call(this, serverInfo, name, title, "unknown");

            //this.id = _.uniqueId(UTIL.trim(this.name.toLowerCase()) + "_");
            this.id = _.uniqueId("group_layer_");

            if (subLayers != null) {
                this.subLayers = subLayers;
            }

            if (isGroup) {
                this.isGroup = isGroup;
            }
        }
        /*
        Function: getGroupLayers
        
        현재 그룹레이어에 속한 하위 그룹레이어만 반환한다. 일반레이어는 포함되지 않는다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        layer: GeoNURIS.Layer[]     // 레이어 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용한다.
        >
        >// case #1. 모든 레이어 반환
        >var layerAll = svc.rootLayer.getGroupLayers();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerAll = svc.rootLayer.getGroupLayers(true);
        >
        >// 반환받은 레이어 확인
        >for(var key in layerAll) {
        >   var layerItem = layerAll[key];
        >   console.log(layerItem.name + " is " + layerItem.isGroup? 'Group':'Normal');
        >}
        
        */
        GroupLayer.prototype.getGroupLayers = function (options) {
            var filter = _.filter(this.subLayers, function (obj) {
                if (typeof options != "undefined" && typeof options.isVisibleOnly != "undefined" && options.isVisibleOnly) {
                    return obj.isGroup && obj.getVisibility();
                } else {
                    return obj.isGroup;
                }
            });

            if (typeof options != "undefined" && typeof options.isSort != "undefined" && options.isSort) {
                return _.sortBy(filter, function (obj) {
                    return obj.zIndex;
                });
            } else {
                return filter;
            }
        };

        /*
        Function: getLayers
        
        현재 그룹레이어에 속한 하위 레이어만 반환한다. 그룹레이어는 포함되지 않는다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        layer: GeoNURIS.Layer[]     // 레이어 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용한다.
        >
        >// case #1. 모든 레이어 반환
        >var layerAll = svc.rootLayer.getLayers();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerAll = svc.rootLayer.getLayers(true);
        >
        >// 반환받은 레이어 확인
        >for(var key in layerAll) {
        >   var layerItem = layerAll[key];
        >   console.log(layerItem.name + " is " + layerItem.isGroup? 'Group':'Normal');
        >}
        
        */
        GroupLayer.prototype.getLayers = function (options) {
            var filter = _.filter(this.subLayers, function (obj) {
                if (typeof options != "undefined" && typeof options.isVisibleOnly != "undefined" && options.isVisibleOnly) {
                    return obj.isGroup == false && obj.getVisibility();
                } else {
                    return obj.isGroup == false;
                }
            });

            if (typeof options != "undefined" && typeof options.isSort != "undefined" && options.isSort) {
                return _.sortBy(filter, function (obj) {
                    return obj.zIndex;
                });
            } else {
                return filter;
            }
        };

        /*
        Function: getSubLayers
        
        현재 그룹레이어에 속한 바로 아래 하위 레이어를 반환한다. 반환 대상은 그룹,일반레이어 모두 포함한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        layer: GeoNURIS.Layer[] or GroNURIS.GroupLayer[]   // 레이어 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용한다.
        >
        >// case #1. 모든 레이어 반환
        >var layerAll = svc.rootLayer.getSubLayers();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerAll = svc.rootLayer.getSubLayers(true);
        >
        >// 반환받은 레이어 확인
        >for(var key in layerAll) {
        >   var layerItem = layerAll[key];
        >   console.log(layerItem.name + " is " + layerItem.isGroup? 'Group':'Normal');
        >}
        
        */
        GroupLayer.prototype.getSubLayers = function (options) {
            var filter = _.filter(this.subLayers, function (obj) {
                if (typeof options != "undefined" && typeof options.isVisibleOnly != "undefined" && options.isVisibleOnly) {
                    return obj.getVisibility();
                } else {
                    return true;
                }
            });

            if (typeof options != "undefined" && typeof options.isSort != "undefined" && options.isSort) {
                return _.sortBy(filter, function (obj) {
                    return obj.zIndex;
                });
            } else {
                return filter;
            }
        };

        /*
        Function: getGroupLayerIDs
        
        그룹레이어에 속한 하위 그룹레이어의 아이디 목록을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        ids: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용한다.
        >
        >// case #1. 모든 레이어 아이디 반환
        >var layerIds = svc.rootLayer.getGroupLayerIDs();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerIds = svc.rootLayer.getGroupLayerIDs(true);
        >
        >// 반환받은 레이어 아이디를 출력한다.
        >for(var key in layerIds) {
        >   console.log(layerIds[key]);
        >}
        
        */
        GroupLayer.prototype.getGroupLayerIDs = function (isVisibleOnly) {
            return _.pluck(this.getGroupLayers({ isVisibleOnly: isVisibleOnly }), "id");
        };

        /*
        Function: getGroupLayer
        
        지정한 아이디에 해당하는 그룹레이어를 반환한다.
        
        Parameters:
        
        id: string                  // 반환할 레이어의 아이디
        
        Returns:
        
        layer: GeoNURIS.GroupLayer   // 레이어
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용하고 반환할 그룹레이어의 아이디가 'layer_3'라고 가정.
        >var lid = 'layer_3';
        >var gLayer = svc.rootLayer.getGroupLayer(lid);
        >
        >console.log(gLayer.name);
        
        */
        GroupLayer.prototype.getGroupLayer = function (id) {
            return _.findWhere(this.getGroupLayers(), { id: id });
        };

        /*
        Function: getLayerNames
        
        그룹레이어에 속한 하위 그룹레이어 이름(배열)을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        names: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용
        >
        >// case #1. 모든 레이어 이름 반환
        >var layerNames = svc.rootLayer.getGroupLayerNames();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerNames = svc.rootLayer.getGroupLayerNames(true);
        >
        >// 반환받은 그룹레이어 이름을 출력한다.
        >for(var key in layerNames) {
        >   console.log(layerNames[key]);
        >}
        
        */
        GroupLayer.prototype.getGroupLayerNames = function (isVisibleOnly) {
            return _.pluck(this.getGroupLayers({ isVisibleOnly: isVisibleOnly }), "name");
        };

        /*
        
        Function: getGroupLayerforName
        
        이름으로 그룹레이어에 소속된 하위 그룹레이어를 반환한다.
        
        Parameters:
        
        name: string            // 반환할 그룹레이어의 이름
        
        Returns:
        
        layer: GeoNURIS.GroupLayer
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용하고, 반환할 그룹레이어의 이름을 'target_Grplayer'로 가정한다.
        >var glName = 'target_Grplayer';
        >
        >var gLayer = svc.rootLayer.getGroupLayerforName(glName);
        >console.log(gLayer.name);
        
        */
        GroupLayer.prototype.getGroupLayerforName = function (name) {
            return _.filter(this.getGroupLayers(), function (obj) {
                return obj.name == name;
            });
        };

        /*
        Function: getLayerIDs
        
        그룹레이어에 속한 하위 레이어의 아이디 목록을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        ids: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용한다.
        >
        >// case #1. 모든 레이어 아이디 반환
        >var layerIds = svc.rootLayer.getLayerIDs();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerIds = svc.rootLayer.getLayerIDs(true);
        >
        >// 반환받은 레이어 아이디를 출력한다.
        >for(var key in layerIds) {
        >   console.log(layerIds[key]);
        >}
        
        */
        GroupLayer.prototype.getLayerIDs = function (isVisibleOnly) {
            return _.pluck(this.getLayers({ isVisibleOnly: isVisibleOnly }), "id");
        };

        /*
        Function: getLayer
        
        지정한 아이디에 해당하는 레이어를 반환한다.
        
        Parameters:
        
        id: string                  // 반환할 레이어의 아이디
        
        Returns:
        
        layer: GeoNURIS.Layer   // 레이어
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용하고 반환할 레이어의 아이디가 'layer_3'라고 가정.
        >var lid = 'layer_3';
        >var gLayer = svc.rootLayer.getLayer(lid);
        >
        >console.log(gLayer.name);
        
        */
        GroupLayer.prototype.getLayer = function (id) {
            return _.findWhere(this.getLayers(), { id: id });
        };

        /*
        Function: getLayerNames
        
        그룹레이어에 속한 하위 레이어 이름(배열)을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        names: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용
        >
        >// case #1. 모든 레이어 이름 반환
        >var layerNames = svc.rootLayer.getLayerNames();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerNames = svc.rootLayer.getLayerNames(true);
        >
        >// 반환받은 레이어 이름을 출력한다.
        >for(var key in layerNames) {
        >   console.log(layerNames[key]);
        >}
        
        */
        GroupLayer.prototype.getLayerNames = function (isVisibleOnly) {
            return _.pluck(this.getLayers({ isVisibleOnly: isVisibleOnly }), "name");
        };

        /*
        
        Function: getLayerforName
        
        이름으로 그룹레이어에 소속된 하위 레이어를 반환한다.
        
        Parameters:
        
        name: string            // 반환할 레이어의 이름
        
        Returns:
        
        layer: GeoNURIS.Layer
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 예제에 사용할 그룹레이어로 rootLayer를 이용하고, 반환할 레이어의 이름을 'target_layer'로 가정한다.
        >var lName = 'target_layer';
        >
        >var layer = svc.rootLayer.getLayerforName(lName);
        >console.log(layer.name);
        
        */
        GroupLayer.prototype.getLayerforName = function (name) {
            return _.filter(this.getLayers(), function (obj) {
                return obj.name == name;
            });
        };

        /*
        Function: getWFSProtocol
        
        {GeoNURIS.BaseLayer} 와 {GeoNURIS.Layer}에서만 지원된다. {GeoNURIS.GroupLayer} 의 경우 Null을 반환한다.
        
        Returns:
        
        {null}
        */
        GroupLayer.prototype.getWFSProtocol = function () {
            return null;
        };
        return GroupLayer;
    })(GeoNURIS.Layer);
    GeoNURIS.GroupLayer = GroupLayer;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=GroupLayer.js.map
;
define("GroupLayer", function(){});

/// <reference path="ServerInfo.ts" />
/// <reference path="BaseLayer.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Service
    
    GeoNURIS.Service 클래스.
    */
    var Service = (function () {
        //allLayers: IBaseLayer[] = [];
        /*
        Constructor: Service
        
        생성자.
        
        Parameters:
        
        serverInfo: GeoNURIS.ServerInfo     // 서비스를 생성하기 위해 사용할 ServerInfo
        
        */
        function Service(serverInfo) {
            /*
            Property: rootLayer
            
            {GeoNURIS.GroupLayer} 객체로 서비스가 제공하는 레이어를 트리구조의 데이터로 제공한다.
            */
            this.rootLayer = null;
            this.serverInfo = serverInfo;

            //this.id = _.uniqueId(UTIL.trim(this.serverInfo.getGDXName().toLowerCase()) + "_service_");
            this.id = _.uniqueId("service_");

            //
            this.initService(this.serverInfo);
        }
        /*
        Function: getServiceLayer
        
        실제 서비스될 레이어{OpenLayers.Layer}를 반환한다.
        
        Returns:
        
        layer: OpenLayers.Layer
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 서비스 레이어 추출
        >var svcLayer = svc.getServiceLayer();
        
        */
        Service.prototype.getServiceLayer = function () {
            return this.wmsLayer;
        };

        /*
        Function: getLayerIDs
        
        서비스가 제공하는 레이어 아이디 목록을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        ids: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. 모든 레이어 아이디 반환
        >var layerIds = svc.getLayerIDs();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerIds = svc.getLayerIDs(true);
        >
        >// 반환받은 레이어 아이디를 출력한다.
        >for(var key in layerIds) {
        >   console.log(layerIds[key]);
        >}
        
        */
        Service.prototype.getLayerIDs = function (isVisibleOnly) {
            return _.map(this.getAllLayers(isVisibleOnly), function (obj) {
                return obj.id;
            });
        };

        /*
        Function: getLayer
        
        지정한 아이디에 해당하는 레이어를 반환한다.
        
        Parameters:
        
        id: string                  // 반환할 레이어의 아이디
        
        Returns:
        
        layer: GeoNURIS.BaseLayer   // 레이어
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 얻어올 레이어의 아이디가 'layer_3'라고 가정.
        >var lid = 'layer_3';
        >var bLayer = svc.getLayer(lid);
        
        */
        Service.prototype.getLayer = function (id) {
            return _.findWhere(this.getAllLayers(false), { id: id });
        };

        /*
        Function: getLayerNames
        
        레이어 이름(배열)을 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        names: string[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. 모든 레이어 이름 반환
        >var layerNames = svc.getLayerNames();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerNames = svc.getLayerNames(true);
        >
        >// 반환받은 레이어 이름을 출력한다.
        >for(var key in layerNames) {
        >   console.log(layerNames[key]);
        >}
        
        */
        Service.prototype.getLayerNames = function (isVisibleOnly) {
            return _.map(this.getAllLayers(isVisibleOnly), function (obj) {
                return obj.name;
            });
        };

        /*
        Function: getLayerforName
        
        지정된 이름으로 레이어를 반환한다.
        
        Parameters:
        
        name: string                // 반환할 레이어의 이름
        
        Returns:
        
        layer: GeoNURIS.BaseLayer[]   // 레이어
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >var svc = gmap.toc.getService(svcName);
        >
        >// 얻어올 레이어의 이름이 'lName_1'라고 가정.
        >var lName = 'lName_1';
        >var bLayer = svc.getLayer(lName)[0];
        
        */
        Service.prototype.getLayerforName = function (name) {
            return _.filter(this.getAllLayers(false), function (obj) {
                return obj.name == name;
            });
        };

        /*
        Function: getAllLayers
        
        레이어 전체를 반환한다.
        
        Parameters:
        
        isVisibleOnly?: boolean     // 레이어 Visible값이 true인 항목들만 반환할 것인지 여부, 기본 값은 false이다.
        
        Returns:
        
        layer: GeoNURIS.BaseLayer[]   // 레이어 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. 모든 레이어 반환
        >var layerAll = svc.getAllLayers();
        >
        >// case #2. 레이어 Visible 정보가 true인 항목들만 반환
        >var layerAll = svc.getAllLayers(true);
        >
        >// 반환받은 레이어 확인
        >for(var key in layerAll) {
        >   var layerItem = layerAll[key];
        >   console.log(layerItem.name);
        >}
        
        */
        Service.prototype.getAllLayers = function (isVisibleOnly) {
            // default sort
            var tempAllLayers = [];

            // 정렬된 순서대로 layer 목록을 만든다.
            if (typeof this.rootLayer != "undefined" && this.rootLayer != null) {
                var tempSubLayers = this.rootLayer.getSubLayers({ isVisibleOnly: isVisibleOnly, isSort: true });
                for (var i in tempSubLayers) {
                    var tempLayer = tempSubLayers[i];
                    this.reflectionSubLayers(tempLayer, tempAllLayers, isVisibleOnly);
                }
            }

            return tempAllLayers;
        };

        Service.prototype.reflectionSubLayers = function (layer, allLayers, isVisibleOnly) {
            if (layer.isGroup) {
                var tempLayers = layer.getSubLayers({ isSort: true, isVisibleOnly: isVisibleOnly });
                for (var i in tempLayers) {
                    this.reflectionSubLayers(tempLayers[i], allLayers, isVisibleOnly);
                }
            } else {
                var tempBaseLayer = new GeoNURIS.BaseLayer(layer.serverInfo, layer.name, layer.title, layer.projection);
                tempBaseLayer.id = layer.id;
                tempBaseLayer.setVisibility = function (isVisible) {
                    return layer.setVisibility(isVisible);
                };
                tempBaseLayer.getVisibility = function () {
                    return layer.getVisibility();
                };

                allLayers.push(tempBaseLayer);
            }
        };

        Service.prototype.initCapability = function (serverInfo) {
            this.capability = null;

            //
            OpenLayers.Request.GET({
                url: serverInfo.getURI("wms"),
                params: {
                    SERVICE: "WMS",
                    VERSION: "1.3.0",
                    REQUEST: "GetCapabilities"
                },
                success: function (request) {
                    var doc = request.responseXML;
                    if (!doc || !doc.documentElement) {
                        doc = request.responseText;
                    }

                    //var read: OpenLayers.Format.read = new OpenLayers.Format.WMSCapabilities().read(doc);
                    this.capability = new OpenLayers.Format.WMSCapabilities().read(doc).capability;

                    if (typeof doc.activeElement == "object" && doc.activeElement != null) {
                        if (typeof doc.activeElement.children == "object" && doc.activeElement.children != null) {
                            for (var i = 0; i < doc.activeElement.children.length; i++) {
                                if (doc.activeElement.children.item(i).tagName.toLowerCase().indexOf("serviceexception") > -1) {
                                    alert(serverInfo.getGDXName() + " :: " + doc.activeElement.children.item(i).textContent);
                                    break;
                                }
                            }
                        }
                    }
                },
                failure: function () {
                    alert(serverInfo.getURI() + " :: " + "Trouble getting capabilities doc");
                },
                scope: this,
                async: false
            });
        };

        Service.prototype.getWMSLayerNames = function () {
            var tempLayers = [];
            if (this.serverInfo.isCache) {
                tempLayers = [this.rootLayer.name];
            } else {
                tempLayers = _.map(this.getAllLayers(true), function (obj) {
                    return obj.name;
                });
            }

            return tempLayers;
        };

        Service.prototype.redraw = function () {
            if (typeof this.wmsLayer != "undefined" && this.wmsLayer != null) {
                if (typeof this.wmsLayer.params == "object" && this.wmsLayer.params != null) {
                    this.wmsLayer.params.LAYERS = this.getWMSLayerNames();

                    if (typeof this.wmsLayer.redraw == "function") {
                        this.wmsLayer.redraw(true);
                    }
                }
            }
        };

        Service.prototype.initLayers = function (layer, projection) {
            var _this = this;
            var tempLayer = null;
            if (layer.nestedLayers.length == 0) {
                tempLayer = new GeoNURIS.Layer(this.serverInfo, layer.name, layer.title, projection);
                //var tempBaseLayer: IBaseLayer = new BaseLayer(this.serverInfo, layer.name, layer.title);
                //tempBaseLayer.id = tempLayer.id;
                //this.allLayers.push(tempBaseLayer);
            } else {
                var tempLayers = [];
                for (var i in layer.nestedLayers) {
                    tempLayers.push(this.initLayers(layer.nestedLayers[i], projection));
                }

                tempLayer = new GeoNURIS.GroupLayer(this.serverInfo, layer.name, layer.title, tempLayers, true);
            }

            tempLayer.redraw = function () {
                return _this.redraw();
            };

            return tempLayer;
        };

        Service.prototype.initService = function (serverInfo) {
            var _this = this;
            var wmsLayerOptions = serverInfo.getWMSLayerOptions();

            //
            var tempSubLayers = [];
            var rootName = "ROOT";
            var rootTitle = "ROOT";

            // capability를 사용할 경우
            if (serverInfo.isCapabilitySupport) {
                // capability를 초기화 한다.
                this.initCapability(serverInfo);

                if (typeof this.capability != "undefined" && this.capability != null) {
                    var srs = this.capability.nestedLayers[0].srs;

                    for (var key in srs) {
                        if (this.capability.nestedLayers[0].bbox.hasOwnProperty(key)) {
                            //console.log(key + " = " + srs[key]);
                            var bbox = this.capability.nestedLayers[0].bbox[key];

                            if (typeof wmsLayerOptions.projection == "undefined") {
                                wmsLayerOptions.projection = bbox.srs;
                            }

                            if (typeof wmsLayerOptions.maxExtent == "undefined") {
                                wmsLayerOptions.maxExtent = bbox.bbox;
                            }
                            break;
                        }
                    }

                    //
                    var tempOLayer = this.capability.nestedLayers[0];
                    for (var i in tempOLayer.nestedLayers) {
                        var tempLayer = this.initLayers(tempOLayer.nestedLayers[i], wmsLayerOptions.projection);
                        tempSubLayers.push(tempLayer);
                    }

                    //
                    rootName = tempOLayer.name;
                    rootTitle = tempOLayer.title;
                }
            } else {
                // capability를 사용하지 않을 경우
                var layerNames = serverInfo.getStaticLayers();
                for (var key in layerNames) {
                    var tempLayer = null;
                    var lName = layerNames[key];
                    tempLayer = new GeoNURIS.Layer(this.serverInfo, lName, lName, wmsLayerOptions.projection);
                    tempLayer.redraw = function () {
                        return _this.redraw();
                    };

                    //
                    tempSubLayers.push(tempLayer);
                }
            }

            //
            this.rootLayer = new GeoNURIS.GroupLayer(this.serverInfo, rootName, rootTitle, tempSubLayers, true);
            this.rootLayer.getVisibility = function () {
                return _this.getVisibility();
            };
            this.rootLayer.setVisibility = function (isVisible) {
                return _this.setVisibility(isVisible);
            };
            this.rootLayer.setZIndex = function (zIndex) {
                console.log("rootLayer setZIndex is not supported. service setZIndex use.");
            };

            //
            this.wmsLayer = new OpenLayers.Layer.WMS(serverInfo.getGDXName(), serverInfo.getURI("wms"), { format: "image/png", transparent: true, layers: this.getWMSLayerNames() }, {
                buffer: 2,
                transitionEffect: "resize",
                opacity: 1.0
            });

            //
            this.wmsLayer.addOptions(wmsLayerOptions, false);
        };

        /*
        Function: getURI
        
        서비스 URI를 반환한다. GeoNURIS.ServerInfo의 getURI()를 호출한다.
        
        Parameters:
        
        type? : string - URI종류, wfs / wms 를 선택할 수 있다. 생략할 경우 base URI를 반환한다.
        
        Returns:
        
        uri : string
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1.
        >console.log(svc.getURI());
        >
        >// case #2.
        >console.log(svc.getURI('wms'));
        >
        >// case #3.
        >console.log(svc.getURI('wfs'));
        
        */
        Service.prototype.getURI = function (type) {
            return this.serverInfo.getURI(type);
        };

        /*
        Function: setZIndex
        
        서비스 레이어의 인덱스를 설정한다.
        
        Parameters:
        
        zIndex: number      // 정의하고자 하는 인덱스 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 인덱스 설정
        >svc.setZIndex(1000);
        
        */
        Service.prototype.setZIndex = function (zIndex) {
            this.wmsLayer.setZIndex(zIndex);
        };

        /*
        Function: getZIndex
        
        서비스 레이어의 인덱스를 반환한다.
        
        Returns:
        
        zIndex: number      // 서비스 레이어에 정의된 인덱스 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >var idx = svc.getZIndex();
        >console.log('index value : ' + idx);
        */
        Service.prototype.getZIndex = function () {
            return this.wmsLayer.getZIndex();
        };

        /*
        Function: getGDXName
        
        서비스 GDX이름을 반환한다. 내부적으로 GeoNURIS.ServerInfo의 getGDXName을 호출한다.
        
        Parameters:
        
        isExtension? : boolean - GDX파일명의 확장자 반환 여부, 기본값은 true이다.
        
        Returns:
        
        gdxName : string
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. GDX의 확장자(.xml)를 포함한 전체 이름 반환
        >var gdxName = sInfo.getGDXName();
        >
        >// case #2. GDX의 확장자를 지외한 이름만 반환
        >var gdxName = sInfo.getGDXName(false);
        >
        >console.log('gdx name is : ' + gdxName);
        
        */
        Service.prototype.getGDXName = function (isExtension) {
            return this.serverInfo.getGDXName(isExtension);
        };

        /*
        Function: getVisibility
        
        서비스레이어의 Visibility 값을 반환한다.
        
        Returns:
        
        visible: boolean        // Visibility 값을 boolean으로 반환
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >var isVisible = svc.getVisibility();
        >console.log('isVisible : ' + isVisible);
        */
        Service.prototype.getVisibility = function () {
            return this.wmsLayer.getVisibility();
        };

        /*
        Function: setVisibility
        
        서비스레이어의 Visibility 값을 설정한다.
        
        Parameters:
        
        isVisible: boolean          // 서비스레이어에 정의할 Visibility 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 서비스 이름이 'target_service' 라고 가정한다.
        >var svcName = 'target_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. visible 활성(=true)으로 설정
        >svc.setVisibility(true);
        >
        >// case #2. visible 비활성(=false)으로 설정
        >svc.setVisibility(false);
        */
        Service.prototype.setVisibility = function (isVisible) {
            this.wmsLayer.setVisibility(isVisible);
        };
        return Service;
    })();
    GeoNURIS.Service = Service;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Service.js.map
;
define("Service", function(){});

/// <reference path="ServerInfo.ts" />
/// <reference path="BaseLayer.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.CustomService
    
    GeoNURIS.CustomService 클래스.
    GeoNURIS.Service를 상속받아 구현됨.
    */
    var CustomService = (function (_super) {
        __extends(CustomService, _super);
        /*
        Constructor: CustomService
        
        생성자.
        
        Parameters:
        
        serverInfo: GeoNURIS.ServerInfo
        
        */
        function CustomService(serverInfo) {
            _super.call(this, serverInfo);
        }
        /*
        Function: getServiceLayer
        
        실제 서비스될 레이어{OpenLayers.Layer}를 반환한다.
        
        Returns:
        
        layer: OpenLayers.Layer
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 CustomService 이름이 'custom_service' 라고 가정한다.
        >var svcName = 'custom_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 서비스 레이어 추출
        >var svcLayer = svc.getServiceLayer();
        
        */
        CustomService.prototype.getServiceLayer = function () {
            return this.serviceLayer;
        };

        /*
        Function: getAllLayers
        
        레이어 전체를 반환하는 함수이나 CustomService의 경우 아무것도 반환하지 않는다.
        
        Returns:
        
        아무것도 없는 초기화된 배열
        
        */
        CustomService.prototype.getAllLayers = function (isVisibleOnly) {
            // default sort
            return [];
        };

        CustomService.prototype.createDaumMap = function (serviceType) {
            var type = "";
            var tempURLs = [];

            if (typeof serviceType == "string" && serviceType != null) {
                type = serviceType.toLowerCase();
            }

            if (type == "satellite" || type == "s") {
                type = "SATELLITE";
                tempURLs = [
                    "http://s0.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=131210",
                    "http://s1.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=131210",
                    "http://s2.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=131210",
                    "http://s3.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=131210"
                ];
            } else if (type == "hybrid" || type == "h") {
                type = "HYBRID";
                tempURLs = [
                    "http://h0.maps.daum-img.net/map/image/G03/h/1.04/L${z}/${y}/${x}.png",
                    "http://h1.maps.daum-img.net/map/image/G03/h/1.04/L${z}/${y}/${x}.png",
                    "http://h2.maps.daum-img.net/map/image/G03/h/1.04/L${z}/${y}/${x}.png",
                    "http://h3.maps.daum-img.net/map/image/G03/h/1.04/L${z}/${y}/${x}.png"
                ];
            } else {
                type = "";
                tempURLs = [
                    "http://i0.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
                    "http://i1.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
                    "http://i2.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
                    "http://i3.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png"
                ];
            }

            type = type != "" ? "." + type : type;
            var tempClass = OpenLayers.Class(OpenLayers.Layer.XYZ, {
                name: "DaumMap" + type,
                url: tempURLs,
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
                /*attribution: '',*/
                sphericalMercator: false,
                transitionEffect: "resize",
                buffer: 1,
                numZoomLevels: 14,
                minResolution: 0.5,
                maxResolution: 2048,
                units: "m",
                projection: new OpenLayers.Projection("EPSG:5181"),
                displayOutsideMaxExtent: true,
                maxExtent: new OpenLayers.Bounds(-30000, -60000, 494288, 988576),
                initialize: function (name, options) {
                    if (!options) {
                        options = { resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] };
                    } else if (!options.resolutions) {
                        options.resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
                    }
                    var newArgs = [name, null, options];

                    //OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
                    var temp = OpenLayers.Layer.XYZ;
                    temp.prototype.initialize.apply(this, newArgs);
                },
                clone: function (obj) {
                    if (obj == null) {
                        //obj = new OpenLayers.Layer.Daum(this.name, this.getOptions());
                        obj = new tempClass(this.name, this.getOptions());
                    }
                    obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
                    return obj;
                },
                getXYZ: function (bounds) {
                    var res = this.getServerResolution();
                    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                    var y = Math.round((bounds.bottom - this.maxExtent.bottom) / (res * this.tileSize.h));
                    var z = 14 - this.getServerZoom();

                    if (this.wrapDateLine) {
                        var limit = Math.pow(2, z);
                        x = ((x % limit) + limit) % limit;
                    }

                    return { 'x': x, 'y': y, 'z': z };
                },
                CLASS_NAME: "Daum" + type
            });

            return new tempClass();
        };

        CustomService.prototype.createNaverMap = function (serviceType) {
            var type = "";
            var tempURLs = [];

            if (typeof serviceType == "string" && serviceType != null) {
                type = serviceType.toLowerCase();
            }

            if (type == "satellite" || type == "s") {
                type = "SATELLITE";
                tempURLs = [
                    "http://onetile1.map.naver.net/get/40/0/1/${z}/${x}/${y}/bl_st_bg",
                    "http://onetile2.map.naver.net/get/40/0/1/${z}/${x}/${y}/bl_st_bg",
                    "http://onetile3.map.naver.net/get/40/0/1/${z}/${x}/${y}/bl_st_bg",
                    "http://onetile4.map.naver.net/get/40/0/1/${z}/${x}/${y}/bl_st_bg"
                ];
            } else if (type == "hybrid" || type == "h") {
                type = "HYBRID";
                tempURLs = [
                    "http://onetile1.map.naver.net/get/40/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
                    "http://onetile2.map.naver.net/get/40/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
                    "http://onetile3.map.naver.net/get/40/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an",
                    "http://onetile4.map.naver.net/get/40/0/0/${z}/${x}/${y}/empty/ol_st_rd/ol_st_an"
                ];
            } else {
                type = "";
                tempURLs = [
                    "http://onetile1.map.naver.net/get/40/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
                    "http://onetile2.map.naver.net/get/40/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
                    "http://onetile3.map.naver.net/get/40/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an",
                    "http://onetile4.map.naver.net/get/40/0/0/${z}/${x}/${y}/bl_vc_bg/ol_vc_an"
                ];
            }

            type = type != "" ? "." + type : type;
            var tempClass = OpenLayers.Class(OpenLayers.Layer.XYZ, {
                name: "NaverMAP" + type,
                url: tempURLs,
                resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
                /*attribution: '',*/
                sphericalMercator: false,
                transitionEffect: "resize",
                buffer: 1,
                numZoomLevels: 14,
                minResolution: 0.5,
                maxResolution: 2048,
                units: "m",
                projection: new OpenLayers.Projection("EPSG:5179"),
                displayOutsideMaxExtent: false,
                maxExtent: new OpenLayers.Bounds(90112, 1192896, 1990673, 2761664),
                initialize: function (name, options) {
                    if (!options) {
                        options = { resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25] };
                    } else if (!options.resolutions) {
                        options.resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
                    }
                    var newArgs = [name, null, options];

                    //OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
                    var temp = OpenLayers.Layer.XYZ;
                    temp.prototype.initialize.apply(this, newArgs);
                },
                clone: function (obj) {
                    if (obj == null) {
                        //obj = new OpenLayers.Layer.Naver(this.name, this.getOptions());
                        obj = new tempClass(this.name, this.getOptions());
                    }
                    obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
                    return obj;
                },
                getXYZ: function (bounds) {
                    var res = this.getServerResolution();
                    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                    var y = Math.round((bounds.bottom - this.maxExtent.bottom) / (res * this.tileSize.h));
                    var z = this.getServerZoom() + 1;

                    if (this.wrapDateLine) {
                        var limit = Math.pow(2, z);
                        x = ((x % limit) + limit) % limit;
                    }
                    return { 'x': x, 'y': y, 'z': z };
                },
                CLASS_NAME: "Naver" + type
            });

            return new tempClass();
        };

        CustomService.prototype.createGoogleMap = function (serviceType, autoVisible) {
            var tempAutoVisible = (typeof autoVisible == "boolean") ? autoVisible : true;

            if (typeof serviceType == "string" && serviceType != null) {
                if (serviceType == "physical" || serviceType == "p") {
                    return new OpenLayers.Layer.Google("Google Physical", { type: google.maps.MapTypeId.TERRAIN, visibility: tempAutoVisible });
                } else if (serviceType == "hybrid" || serviceType == "h") {
                    return new OpenLayers.Layer.Google("Google Hybrid", { type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22, visibility: tempAutoVisible });
                } else if (serviceType == "satellite" || serviceType == "s") {
                    return new OpenLayers.Layer.Google("Google Satellite", { type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22, visibility: tempAutoVisible });
                }
            }

            return new OpenLayers.Layer.Google("Google Streets", { numZoomLevels: 20, visibility: tempAutoVisible });
        };

        CustomService.prototype.createVWorldMap = function (serviceType) {
            var type = "";
            var tempURLs = [];

            var vworldUrl = 'http://map.vworld.kr';
            var vworldBaseMapUrl = 'http://xdworld.vworld.kr:8080/2d';
            var vworldVers = { Base: '201310', Hybrid: '201310', Satellite: '201301' };
            var vworldUrls = { base: vworldBaseMapUrl + "/Base/" + vworldVers.Base + "/", hybrid: vworldBaseMapUrl + "/Hybrid/" + vworldVers.Hybrid + "/", raster: vworldBaseMapUrl + "/Satellite/" + vworldVers.Satellite + "/" };
            var vworldUrlsExt = { blankimage: vworldUrl + "/images/maps/no_service.gif" };

            var resolutions = [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887, 1.1943285667419434, 0.5971642833709717, 0.29858214168548586, 0.14929107084274293];

            //var maxExt = new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
            var mBounds = new OpenLayers.Bounds(112.5, 29.53522956294847, 135, 45.089);
            var displayProj = "EPSG:4326";
            var originalProj = "EPSG:900913";

            if (typeof serviceType == "string" && serviceType != null) {
                type = serviceType.toLowerCase();
            }

            if (type == "satellite" || type == "s") {
                type = "SATELLITE";
                tempURLs = [
                    vworldUrls.raster + "${z}/${x}/${y}.jpeg"
                ];
            } else if (type == "hybrid" || type == "h") {
                type = "HYBRID";
                tempURLs = [
                    vworldUrls.hybrid + "${z}/${x}/${y}.png"
                ];
            } else {
                type = "";
                tempURLs = [
                    vworldUrls.base + "${z}/${x}/${y}.png"
                ];
            }

            type = type != "" ? "." + type : type;
            var tempClass = OpenLayers.Class(OpenLayers.Layer.XYZ, {
                name: "VMAP" + type,
                url: tempURLs,
                sphericalMercator: true,
                wrapDateLine: true,
                transitionEffect: "resize",
                buffer: 0,
                numZoomLevels: 21,
                units: "m",
                displayOutsideMaxExtent: false,
                tileOrigin: null,
                //maxExtent: maxExt,
                resolutions: resolutions,
                minResolution: 0.14929107084274293,
                maxResolution: 156543.0339,
                projection: new OpenLayers.Projection(originalProj),
                displayProjection: new OpenLayers.Projection(displayProj),
                // custom property
                serverMaxlevel: 18,
                mapBounds: mBounds.transform(new OpenLayers.Projection(displayProj), new OpenLayers.Projection(originalProj)),
                tempGetURL: OpenLayers.Layer.XYZ.prototype.getURL,
                initialize: function (name, options) {
                    var newArgs = [name, null, options];

                    //OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
                    var temp = OpenLayers.Layer.XYZ;
                    temp.prototype.initialize.apply(this, newArgs);
                },
                clone: function (obj) {
                    if (obj == null) {
                        obj = new tempClass(this.name, this.getOptions());
                    }
                    obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
                    return obj;
                },
                getURL: function (bounds) {
                    var xyz = this.getXYZ(bounds);
                    if (xyz.x == 0 && xyz.y == 0 && xyz.z == 0) {
                        return vworldUrlsExt.blankimage;
                    } else {
                        return this.tempGetURL(bounds);
                    }
                },
                getXYZ: function (bounds) {
                    //var res = this.map.getResolution();
                    var res = this.getServerResolution();
                    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
                    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));

                    //var z = this.map.getZoom();
                    var z = this.getServerZoom();
                    var limit = Math.pow(2, z);
                    if (y < 0 || y >= limit) {
                        //return vworldUrlsExt.blankimage;
                        return { 'x': 0, 'y': 0, 'z': 0 };
                    } else {
                        x = ((x % limit) + limit) % limit;
                        if (this.mapBounds.intersectsBounds(bounds)) {
                            if (z >= 6 && z <= this.serverMaxlevel) {
                                return { 'x': x, 'y': y, 'z': z };
                            } else if (z > this.serverMaxlevel) {
                                var n = z - this.serverMaxlevel;
                                var z2 = z - n;
                                var nsize = 256 * Math.pow(2, n);
                                var x = Math.round((bounds.left - this.maxExtent.left) / (res * nsize));
                                var y = Math.round((this.maxExtent.top - bounds.top) / (res * nsize));
                                x = ((x % limit) + limit) % limit;
                                return { 'x': x, 'y': y, 'z': z2 };
                            } else {
                                //return vworldUrlsExt.blankimage;
                                return { 'x': 0, 'y': 0, 'z': 0 };
                            }
                        } else {
                            //return vworldUrlsExt.blankimage;
                            return { 'x': 0, 'y': 0, 'z': 0 };
                        }
                    }
                },
                CLASS_NAME: "VWorld" + type
            });

            return new tempClass();
        };

        CustomService.prototype.initService = function (serverInfo) {
            var _this = this;
            this.capability = null;

            //
            var provider = serverInfo.provider.toLowerCase();
            var serviceType = serverInfo.serviceType.toLowerCase();

            if (provider == "google" || provider == "g") {
                this.serviceLayer = this.createGoogleMap(serviceType, serverInfo.autoVisible);
            } else if (provider == "naver" || provider == "n") {
                this.serviceLayer = this.createNaverMap(serviceType);
            } else if (provider == "daum" || provider == "d") {
                this.serviceLayer = this.createDaumMap(serviceType);
            } else if (provider == "vworld" || provider == "v") {
                this.serviceLayer = this.createVWorldMap(serviceType);
            } else {
                this.serviceLayer = new OpenLayers.Layer.OSM();
            }

            //
            var title = name = provider + " " + serviceType;
            this.rootLayer = new GeoNURIS.GroupLayer(this.serverInfo, name, title, [], true);
            this.rootLayer.getVisibility = function () {
                return _this.getVisibility();
            };
            this.rootLayer.setVisibility = function (isVisible) {
                return _this.setVisibility(isVisible);
            };
            this.rootLayer.setZIndex = function (zIndex) {
                console.log("rootLayer setZIndex is not supported. service setZIndex use.");
            };
        };

        /*
        Function: getZIndex
        
        서비스 레이어의 인덱스를 반환한다.
        
        Returns:
        
        zIndex: number      // 서비스 레이어에 정의된 인덱스 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 CustomService 이름이 'custom_service' 라고 가정한다.
        >var svcName = 'custom_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >var idx = svc.getZIndex();
        >console.log('index value : ' + idx);
        */
        CustomService.prototype.getZIndex = function () {
            return this.serviceLayer.getZIndex();
        };

        /*
        Function: setZIndex
        
        서비스 레이어의 인덱스를 설정한다.
        
        Parameters:
        
        zIndex: number      // 정의하고자 하는 인덱스 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 CustomService 이름이 'custom_service' 라고 가정한다.
        >var svcName = 'custom_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// 인덱스 설정
        >svc.setZIndex(1000);
        
        */
        CustomService.prototype.setZIndex = function (zIndex) {
            this.serviceLayer.setZIndex(zIndex);
        };

        /*
        Function: getVisibility
        
        서비스레이어의 Visibility 값을 반환한다.
        
        Returns:
        
        visible: boolean        // Visibility 값을 boolean으로 반환
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 CustomService 이름이 'custom_service' 라고 가정한다.
        >var svcName = 'custom_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >var isVisible = svc.getVisibility();
        >console.log('isVisible : ' + isVisible);
        */
        CustomService.prototype.getVisibility = function () {
            return this.serviceLayer.getVisibility();
        };

        /*
        Function: setVisibility
        
        서비스레이어의 Visibility 값을 설정한다.
        
        Parameters:
        
        isVisible: boolean          // 서비스레이어에 정의할 Visibility 값
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 사용할 CustomService 이름이 'custom_service' 라고 가정한다.
        >var svcName = 'custom_service';
        >
        >var svc = gmap.toc.getService(svcName);
        >
        >// case #1. visible 활성(=true)으로 설정
        >svc.setVisibility(true);
        >
        >// case #2. visible 비활성(=false)으로 설정
        >svc.setVisibility(false);
        */
        CustomService.prototype.setVisibility = function (isVisible) {
            this.serviceLayer.setVisibility(isVisible);
        };
        return CustomService;
    })(GeoNURIS.Service);
    GeoNURIS.CustomService = CustomService;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=CustomService.js.map
;
define("CustomService", function(){});

/// <reference path="Map.ts" />
/// <reference path="ServerInfo.ts" />
/// <reference path="Service.ts" />
/// <reference path="OpenLayers.d.ts" />

var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.TOC
    
    GeoNURIS.TOC 클래스.
    */
    var TOC = (function () {
        /*
        Constructor: TOC
        
        생성자.
        
        Parameters:
        
        map: GeoNURIS.MAP                       // GeoNURIS.MAP 인스턴스
        serverInfos?: GeoNURIS.ServerInfo[]     // GeoNURIS.ServerInfo 배열
        
        */
        function TOC(map, serverInfos) {
            this.map = map;
            this.services = [];

            if (typeof serverInfos != "undefined") {
                this.setServerInfos(serverInfos);
            }
        }
        /*
        Function: getServices
        
        MAP에 등록된 {GeoNURIS.Service} 를 반환한다.
        
        Returns:
        
        services: GeoNURIS.Service[]        // GeoNURIS.Serveice 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 서비스들을 가져온다.
        >var services = gmap.toc.getServices();
        >
        >// 가져온 서비스들을 순환하면서 URI를 출력한다.
        >for(var key in services) {
        >   var service = services[key];
        >   console.log(service.getURI());
        >}
        */
        TOC.prototype.getServices = function () {
            return this.services;
        };

        /*
        Function: getServiceIDs
        
        모든 서비스 아이디를 반환한다.
        
        Returns:
        
        ids: string[]       // 아이디 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 아이디를 가져온다.
        >var ids = gmap.toc.getServiceIDs();
        >
        >// 아이디를 출력한다.
        >for(var key in ids) {
        >   console.log(ids[key]);
        >}
        */
        TOC.prototype.getServiceIDs = function () {
            return _.pluck(this.services, "id");
        };

        /*
        Function: getService
        
        아이디를 기준으로 서비스를 반환한다.
        
        Parameters:
        
        id: string                  // 서비스를 가져올 아이디
        
        Returns:
        
        service: GeoNURIS.Service   // GeoNURIS.Service
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 가져올 서비스의 id를 'target_service'이라고 가정
        >var svcId = 'target_service'
        >
        >var service = gmap.toc.getService(svcId);
        >console.log(service.getURI());
        
        */
        TOC.prototype.getService = function (id) {
            return _.findWhere(this.services, { id: id });
        };

        /*
        Function: getServiceGDXNames
        
        모든 Service의 GDX이름을 반환한다.
        
        Returns:
        
        gdxNames: string[]      // GDX이름 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >var gdxNames = gmap.toc.getServiceGDXNames();
        >for(var key in gdxNames) {
        >   console.log(gdxNames[key]);
        >}
        */
        TOC.prototype.getServiceGDXNames = function () {
            return _.map(this.services, function (obj) {
                return obj.getGDXName();
            });
        };

        /*
        Function: getServiceforGDXName
        
        GDX이름을 기준으로 {GeoNURIS.Service}를 반환한다.
        
        Parameters:
        
        gdxName: string                 // GDX이름, GDX이름중 확장자를 제외하며 대소문자를 구분한다.
        
        Returns:
        
        service: GeoNURIS.Service[]     // GeoNURIS.Service 객체 배열
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 반환하려는 서비스의 GDX이름이 'target_gdx'라고 가정한다.
        >var gdxName = 'target_gdx';
        >
        >// 서비스를 가져온다.
        >var service = gmap.toc.getServiceforGDXName(gdxName)[0];
        >console.log(service.getURI());
        */
        TOC.prototype.getServiceforGDXName = function (gdxName) {
            return _.filter(this.services, function (obj) {
                return obj.getGDXName() == gdxName;
            });
        };

        /*
        Function: addServerInfo
        
        {GeoNURIS.ServerInfo}를 MAP에 서비스로 추가하기 위한 함수
        
        Parameters:
        
        serverInfo: GeoNURIS.ServerInfo     // GeoNURIS.ServerInfo
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// GeoNURIS.ServerInfo 생성
        >var sInfo = new GeoNURIS.ServerInfo(...생략);
        >
        >// ServerInfo 추가
        >gmap.toc.addServerInfo(sInfo);
        */
        TOC.prototype.addServerInfo = function (serverInfo) {
            // 기존에 있던 serverInfo와 비교한다.
            // 비교에 사용될 값은 getURI("wms") 결과 값으로 한다.
            if (!_.contains(_.map(this.services, function (obj) {
                return obj.getURI("wms");
            }), serverInfo.getURI("wms"))) {
                var self = this;
                var service;

                if (serverInfo instanceof GeoNURIS.CustomServerInfo) {
                    var customServerInfo = serverInfo;
                    var provider = customServerInfo.provider.toLowerCase();

                    // 구글 서버정보를 등록하는거라면,
                    if ((provider == "google" || provider == "g") && (typeof google == "undefined" || typeof google.maps.MapTypeId == "undefined")) {
                        // 구글 관련 라이브러리가 로드되지 않았다면,
                        // 로드 후, 등록!
                        UTIL.loadJavascripts(['http://maps.google.com/maps/api/js?v=3&sensor=false', 'http://maps.gstatic.com/intl/ko_kr/mapfiles/api-3/14/15/main.js'], function () {
                            // 로드가 완료되면 서비스를 만들어 등록한다.
                            // 이부분은 비동기로 처리되므로 반드시 addService를 여기서 실행하도록 해야 한다.
                            service = new GeoNURIS.CustomService(serverInfo);

                            self.services.push(service);
                            self.map.addService(service);
                        });
                    } else {
                        // 구글 관련 라이브러리가 로드되어 있거나, 구글 서버정보가 아닐 경우
                        // 서비스 등록!!
                        service = new GeoNURIS.CustomService(serverInfo);
                        this.services.push(service);
                        this.map.addService(service);
                    }
                } else if (serverInfo instanceof GeoNURIS.ServerInfo) {
                    // CustomServerInfo 가 아닐 경우
                    // 서비스 등록!!
                    service = new GeoNURIS.Service(serverInfo);
                    this.services.push(service);
                    this.map.addService(service);
                }
            }
            //console.log("");
        };

        /*
        Function: addServerInfos
        
        {GeoNURIS.ServerInfo[]}을 MAP에 서비스로 추가하기 위한 함수
        
        Parameters:
        
        serverInfos: GeoNURIS.ServerInfo[]     // GeoNURIS.ServerInfo[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >var serverInfos = [];
        >
        >serverInfos.push(new GeoNURIS.ServerInfo(..., a.xml, ...생략));
        >serverInfos.push(new GeoNURIS.ServerInfo(..., b.xml, ...생략));
        >
        >// ServerInfo 추가
        >gmap.toc.addServerInfos(serverInfos);
        */
        TOC.prototype.addServerInfos = function (serverInfos) {
            var oldServerInfoList = _.map(this.services, function (obj) {
                return obj.getURI("wms");
            });
            var newServerInfoList = _.filter(serverInfos, function (obj) {
                return _.contains(oldServerInfoList, obj.getURI("wms")) == false;
            });

            for (var i = 0; i < newServerInfoList.length; i++) {
                this.addServerInfo(newServerInfoList[i]);

                if (newServerInfoList[i] instanceof GeoNURIS.CustomServerInfo) {
                    var customServerInfo = newServerInfoList[i];
                    var provider = customServerInfo.provider.toLowerCase();

                    // 만약 지금 등록한 서버정보가 구글이라면,
                    // 구글 관련 라이브러리가 등록되지 않았다면, (그것은 아직 구글서비스가 등록되기 전이라는 뜻)
                    if ((provider == "google" || provider == "g") && (typeof google == "undefined" || typeof google.maps.MapTypeId == "undefined")) {
                        // 구글 관련 라이브러리가 등록될 때까지 잠시 대기하도록 setInterval을 호출한다.
                        var self = this;
                        var check = setInterval(function () {
                            if (typeof google != "undefined" && google.maps != "undefined" && google.maps.MapTypeId != "undefined") {
                                clearInterval(check);
                                for (var j = (i + 1); j < newServerInfoList.length; j++) {
                                    self.addServerInfo(newServerInfoList[j]);
                                }
                            } else {
                                console.log('wating..');
                            }
                        }, 1000);

                        break;
                    }
                }
            }
        };

        /*
        Function: setServerInfos
        
        TOC(또는 MAP)에 등록된 {GeoNURIS.ServerInfo}를 초기화(remove)하고 파라메터로 입력받은 {GeoNURIS.ServerInfo} 배열로 재정의 한다.
        add가 기존의 정보에 추가하는 것이라면 set은 기존 정보를 초기화하고 새로 구성한다.
        
        Parameters:
        
        serverInfos: GeoNURIS.ServerInfo[]     // GeoNURIS.ServerInfo[]
        
        Example:
        
        >// GeoNURIS.MAP 객체
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >var serverInfos = [];
        >
        >serverInfos.push(new GeoNURIS.ServerInfo(..., a.xml, ...생략));
        >serverInfos.push(new GeoNURIS.ServerInfo(..., b.xml, ...생략));
        >
        >// ServerInfo 재정의
        >gmap.toc.setServerInfos(serverInfos);
        */
        TOC.prototype.setServerInfos = function (serverInfos) {
            while (this.services.length > 0) {
                this.map.removeService(this.services.pop());
            }
            this.addServerInfos(serverInfos);
        };
        return TOC;
    })();
    GeoNURIS.TOC = TOC;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=TOC.js.map
;
define("TOC", function(){});

/// <reference path="OpenLayers.d.ts" />
//# sourceMappingURL=Style.js.map
;
define("Style", function(){});

/// <reference path="../Map.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    (function (CONTROL_TYPE) {
        CONTROL_TYPE[CONTROL_TYPE["HANDLER"] = 0] = "HANDLER";
        CONTROL_TYPE[CONTROL_TYPE["EVENT"] = 1] = "EVENT";
        CONTROL_TYPE[CONTROL_TYPE["TOOL"] = 2] = "TOOL";
        CONTROL_TYPE[CONTROL_TYPE["DISPLAY"] = 3] = "DISPLAY";
    })(GeoNURIS.CONTROL_TYPE || (GeoNURIS.CONTROL_TYPE = {}));
    var CONTROL_TYPE = GeoNURIS.CONTROL_TYPE;

    /*
    Class: GeoNURIS.Control.BaseControl
    
    GeoNURIS.Control.BaseControl 클래스.
    GeoNURIS.Control의 베이스 컨트롤, 대부분의 컨트롤이 BaseControl를 상속받아 구현된다.
    */
    var BaseControl = (function () {
        /*
        Constructor: BaseControl
        
        생성자.
        
        Parameters:
        
        >   control: GeoNURIS.Control,      // GeoNURIS.MAP 초기화시 생성된 GeoNURIS.Control 객체로 현재 Control 클래스 객체의 부모 객체
        >   map: GeoNURIS.Map,              // GeoNURIS.MAP 객체로 최상의(?) 부모객체
        >   type: number[],                 // 현재 컨트롤의 종류, HANDLER(0) / EVENT(1) / TOOL(2) / DISPLAY(3)
        >   name?: string                   // 컨트롤 이름
        */
        function BaseControl(control, map, type, name) {
            this.control = control;
            this.map = map;
            this.type = type;
            this.name = name;
        }
        /*
        Function: activate
        
        컨트롤 활성화 함수, BaseControl에서는 구현되지 않으며 BaseControl을 상송받은 하위 클래스에서 상속한다.
        */
        BaseControl.prototype.activate = function (options) {
            console.log("not defined");
        };

        /*
        Function: deactivate
        
        컨트롤 비활성화 함수, BaseControl에서는 구현되지 않으며 BaseControl을 상송받은 하위 클래스에서 상속한다.
        */
        BaseControl.prototype.deactivate = function () {
            console.log("not defined");
        };
        return BaseControl;
    })();
    GeoNURIS.BaseControl = BaseControl;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=BaseControl.js.map
;
define("BaseControl", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.Mouse
    
    GeoNURIS.Control.Mouse 클래스.
    */
    var Mouse = (function (_super) {
        __extends(Mouse, _super);
        /*
        Constructor: Mouse
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function Mouse(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */], "mouse");
            this.trigger = [];

            this.CLICK = new Mouse.Click(control, map, this.trigger);
            this.HOVER = new Mouse.Hover(control, map, this.trigger);
        }
        Mouse.prototype.activate = function () {
            console.log("mouse activate undefined");
        };

        Mouse.prototype.deactivate = function () {
            console.log("mouse deactivate undefined");
        };
        return Mouse;
    })(GeoNURIS.BaseControl);
    GeoNURIS.Mouse = Mouse;

    (function (Mouse) {
        /*
        Class: GeoNURIS.Control.Mouse.Click
        
        GeoNURIS.Control.Mouse.Click 클래스.
        */
        var Click = (function (_super) {
            __extends(Click, _super);
            /*
            Constructor: Click
            
            생성자.
            
            Parameters:
            
            > control: GeoNURIS.Control,
            > map: GeoNURIS.MAP
            > trigger?: GeoNURIS.ITrigger
            */
            function Click(control, map, trigger) {
                _super.call(this, control, map, [], "mouse click");
                this.me = [];
                this.trigger = trigger;
            }
            Click.prototype.convertID = function (id) {
                return "mouse_click_" + UTIL.trim(id.toLowerCase());
            };

            /*
            Function: activate
            
            Click 컨트롤을 MAP 에 적용한다.
            
            Parameters:
            
            id: string          - Click 컨트롤 아이디, 아이디를 통해 복수의 컨트롤 등록(활성)이 가능하다.
            trigger: function   - Click 컨트롤 이벤트가 발생할 때 호출될 콜백 함수.
            delay?: number      - Click 컨트롤 이벤트로 인한 콜백함수 호출 지연 시간. 생략가능.
            
            Example:
            
            >var gmap = new GeoNURIS.Map("map", ...);
            >
            >gmap.controls.MOUSE.CLICK.activate('testId', function(evt){ console.log(evt); }, 300);
            */
            Click.prototype.activate = function (id, trigger, delay) {
                console.log("mouse click activate");

                for (var ti in this.trigger) {
                    this.trigger[ti].func({ state: "activate", id: id });
                }

                this.deactivate(id);

                var tempTarget = _.findWhere(this.me, { id: this.convertID(id) });
                if (typeof tempTarget == "undefined") {
                    tempTarget = new OpenLayers.Control({ id: this.convertID(id) });
                    this.me.push(tempTarget);
                }

                //
                tempTarget.handler = new OpenLayers.Handler.Click(tempTarget, { click: trigger }, { single: true, pixelTolerance: null });
                if (typeof delay == "number") {
                    tempTarget.handler.delay = delay;
                } else {
                    tempTarget.handler.delay = 0;
                }

                //
                if (this.map.getMapforOpenLayers().getControl(this.convertID(id)) == null) {
                    this.map.getMapforOpenLayers().addControl(tempTarget);
                }

                //
                tempTarget.activate();
            };

            /*
            *   id: string | boolean
            */
            /*
            Function: deactivate
            
            Click 컨트롤을 MAP 에서 해제한다.
            
            Parameters:
            
            id?: string | boolean    - 제거하려는 컨트롤의 ID 또는 boolean 값. boolean값 true를 정의할 경우 전체 컨트로를 해제한다.
            
            Example:
            >// map 생성.
            >var gmap = new GeoNURIS.Map("map", { ...생략 });
            >
            >// case #1. ID로 컨트롤 해제
            >gmap.controls.MOUSE.CLICK.deactivate('testId');
            >
            >// case #2. 등록된 전체 Click 컨트롤 해제
            >gmap.controls.MOUSE.CLICK.deactivate(true);
            */
            Click.prototype.deactivate = function (id) {
                for (var ti in this.trigger) {
                    this.trigger[ti].func({ state: "deactivate", id: id });
                }

                if (typeof this.me != "undefined" && this.me != null) {
                    if (typeof id == "string" && id != null) {
                        var tempTarget = _.findWhere(this.me, { id: this.convertID(id) });
                        if (typeof tempTarget != "undefined" && tempTarget != null) {
                            if (tempTarget.active) {
                                tempTarget.deactivate();
                                tempTarget.destroy();
                            }

                            this.map.getMapforOpenLayers().removeControl(tempTarget);
                            this.me = _.difference(this.me, [tempTarget]);
                            console.log("control removed :: " + tempTarget.CLASS_NAME);
                        }
                    } else if (typeof id == "boolean" && id) {
                        for (var i in this.me) {
                            this.me[i].deactivate();
                            this.me[i].destroy();
                            this.map.getMapforOpenLayers().removeControl(this.me[i]);
                        }

                        //
                        this.me = [];
                    }
                }
            };
            return Click;
        })(GeoNURIS.BaseControl);
        Mouse.Click = Click;

        /*
        Class: GeoNURIS.Control.Mouse.Hover
        
        GeoNURIS.Control.Mouse.Hover 클래스.
        */
        var Hover = (function (_super) {
            __extends(Hover, _super);
            /*
            Constructor: Hover
            
            생성자.
            
            Parameters:
            
            > control: GeoNURIS.Control,
            > map: GeoNURIS.MAP
            > trigger?: GeoNURIS.ITrigger
            */
            function Hover(control, map, trigger) {
                _super.call(this, control, map);
                this.name = "mouse hover";
            }
            Hover.prototype.convertID = function (id) {
                return "mouse_hover_" + id;
            };

            /*
            Function: activate
            
            Hover 컨트롤을 MAP 에 적용한다.
            
            Parameters:
            
            id: string          - Hover 컨트롤 아이디, 아이디를 통해 복수의 컨트롤 등록(활성)이 가능하다.
            pause: function     - Hover 컨트롤 이벤트중 'pause' 이벤트가 발생할 때 호출될 콜백 함수.
            delay: number       - Hover 컨트롤 이벤트로 인한 콜백함수 호출 지연 시간.
            move: function      - Hover 컨트롤 이벤트중 'move' 이벤트가 발생할 때 호출될 콜백 함수.
            
            Example:
            
            >var gmap = new GeoNURIS.Map("map", ...);
            >
            >gmap.controls.MOUSE.HOVER.activate('testId', function(evt){ console.log('pause : ' + evt); }, 300, function(evt){ console.log('move : ' + evt); });
            */
            Hover.prototype.activate = function (id, pause, delay, move) {
                console.log("mouse hover activate");

                for (var ti in this.trigger) {
                    this.trigger[ti].func({ state: "activate", id: id });
                }

                this.deactivate(id);

                var tempTarget = _.findWhere(this.me, { id: this.convertID(id) });
                if (typeof tempTarget == "undefined") {
                    tempTarget = new OpenLayers.Control({ id: this.convertID(id) });
                    this.me.push(tempTarget);
                }

                //
                tempTarget.handler = new OpenLayers.Handler.Hover(tempTarget, { pause: pause, move: move }, {});
                if (typeof delay == "number") {
                    tempTarget.handler.delay = delay;
                } else {
                    tempTarget.handler.delay = 200;
                }

                //
                if (this.map.getMapforOpenLayers().getControl(this.convertID(id)) == null) {
                    this.map.getMapforOpenLayers().addControl(tempTarget);
                }

                //
                tempTarget.activate();
            };
            return Hover;
        })(Click);
        Mouse.Hover = Hover;
    })(GeoNURIS.Mouse || (GeoNURIS.Mouse = {}));
    var Mouse = GeoNURIS.Mouse;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Mouse.js.map
;
define("Mouse", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.Navigation
    
    GeoNURIS.Control.Navigation 클래스.
    */
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        /*
        Constructor: Navigation
        
        생성자.
        
        Parameters:
        
        >   control: GeoNURIS.Control,
        >   map: GeoNURIS.MAP
        */
        function Navigation(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */], "navigation");
            this.me = new OpenLayers.Control.Navigation({ autoActivate: false });
        }
        /*
        Function: activate
        
        네비게이션 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        >options? : {
        >    all? : boolean;                        // all - 전체 옵션에 대한 활성/비활성 설정. 다른 옵션보다 우선한다.
        >    isZoomBox? : boolean;                  // isZoomBox - 줌 옵션 활성/비활설 설정.
        >    isZoomWhell? : boolean;                // isZoomWhell - 마우스 휠에 따른 줌 옵션 활성/비활설 설정.
        >    isNotBeforeActivate? : boolean;        // isNotBeforeActivate - 개발자 전용.
        >}
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// case #1. 기본 설정으로 컨트롤을 적용한다.
        >gmap.controls.NAVIGATION.activate();
        >
        >// case #2. 모든 옵션을 활성화하여 컨트롤을 적용한다.
        >gmap.controls.NAVIGATION.activate({ all : true });
        >
        >// case #3. 줌박스, 휠기반 줌 기능을 활성화하여 컨트롤을 적용한다.
        >gmap.controls.NAVIGATION.activate({ isZoomBox : true, isZoomWhell : true });
        
        */
        Navigation.prototype.activate = function (options) {
            console.log("navigation activate");

            // -----------------------------------------------------isNotBeforeActivate SS
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                if (typeof options.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = options.isNotBeforeActivate;
                }
            }

            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);
                this.map.getMapforOpenLayers().addControl(this.me);
            }

            this.me.disableZoomBox();
            this.me.disableZoomWheel();

            if (typeof options != "undefined" && options != null) {
                if (options.all) {
                    this.me.enableZoomBox();
                    this.me.enableZoomWheel();
                } else {
                    if (options.isZoomBox) {
                        this.me.enableZoomBox();
                    }

                    if (options.isZoomWheel) {
                        this.me.enableZoomWheel();
                    }
                }
            }

            this.me.activate();
            this.control.TOOLBAR.setActivateButton("navigation");
        };

        /*
        Function: deactivate
        
        네비게이션 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.NAVIGATION.deactivate();
        
        */
        Navigation.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me.active) {
                    this.me.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return Navigation;
    })(GeoNURIS.BaseControl);
    GeoNURIS.Navigation = Navigation;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Navigation.js.map
;
define("Navigation", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.ZoomBox
    
    GeoNURIS.Control.ZoomBox 클래스.
    */
    var ZoomBox = (function (_super) {
        __extends(ZoomBox, _super);
        /*
        Constructor: ZoomBox
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function ZoomBox(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */], "zoombox");
            this.me = {};
            this.me._in = new OpenLayers.Control.ZoomBox({ autoActivate: false });
            this.me._out = new OpenLayers.Control.ZoomBox({ autoActivate: false, out: true });
        }
        /*
        Function: activate
        
        ZoomBox 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >options?: {
        >   isOut?: boolean        // 줌아웃 모드 여부, 기본 값은 false이며 생략가능하다.
        >}
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1. 줌인 모드로 기능을 활성화한다.
        >gmap.controls.ZoomBox.activate({ isOut: false });
        >
        >// case #2. 줌아웃 모드로 기능을 활성화 한다.
        >gmap.controls.ZoomBox.activate({ isOut: true });
        >
        */
        ZoomBox.prototype.activate = function (options) {
            console.log("zoomBox activate");

            var tempIsNotBeforeActivate = false;
            var tempIsOUT = false;
            if (typeof options != "undefined" && options != null) {
                if (typeof options.isOut == "boolean") {
                    var tempIsOUT = options.isOut;
                }

                if (typeof options.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = options.isNotBeforeActivate;
                }
            }

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            //
            this.deactivate();

            if (tempIsOUT) {
                this.map.getMapforOpenLayers().addControl(this.me._out);
                this.me._out.activate();
            } else {
                this.map.getMapforOpenLayers().addControl(this.me._in);
                this.me._in.activate();
            }

            this.control.TOOLBAR.setActivateButton(tempIsOUT ? "zoomout" : "zoomin");
        };

        /*
        Function: deactivate
        
        ZoomBox 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.PanZoomBar.deactivate();
        
        */
        ZoomBox.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me._in.active) {
                    this.me._in.deactivate();
                }
                if (this.me._out.active) {
                    this.me._out.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me._in.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me._in.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return ZoomBox;
    })(GeoNURIS.BaseControl);
    GeoNURIS.ZoomBox = ZoomBox;

    var ZoomBoxIn = (function (_super) {
        __extends(ZoomBoxIn, _super);
        function ZoomBoxIn() {
            _super.apply(this, arguments);
        }
        ZoomBoxIn.prototype.activate = function (isNotBeforeActivate) {
            _super.prototype.activate.call(this, { isOut: false, isNotBeforeActivate: isNotBeforeActivate });
        };
        return ZoomBoxIn;
    })(ZoomBox);
    GeoNURIS.ZoomBoxIn = ZoomBoxIn;

    var ZoomBoxOut = (function (_super) {
        __extends(ZoomBoxOut, _super);
        function ZoomBoxOut() {
            _super.apply(this, arguments);
        }
        ZoomBoxOut.prototype.activate = function (isNotBeforeActivate) {
            _super.prototype.activate.call(this, { isOut: true, isNotBeforeActivate: isNotBeforeActivate });
        };
        return ZoomBoxOut;
    })(ZoomBox);
    GeoNURIS.ZoomBoxOut = ZoomBoxOut;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=ZoomBox.js.map
;
define("ZoomBox", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.NavigationHistory
    
    GeoNURIS.Control.NavigationHistory 클래스.
    */
    var NavigationHistory = (function (_super) {
        __extends(NavigationHistory, _super);
        /*
        Constructor: NavigationHistory
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function NavigationHistory(control, map) {
            _super.call(this, control, map, [1 /* EVENT */], "navigationhistory");
            this.me = new OpenLayers.Control.NavigationHistory({ autoActivate: true });

            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);
                this.map.getMapforOpenLayers().addControl(this.me);
            }
        }
        /*
        Function: activate
        
        네비게이션히스토리 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        isNext?: boolean        // activate 으로 Map에 설정된 Extent를 이전으로 되돌린다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1.
        >gmap.controls.NAVIGATIONHISTORY.activate(false);
        >
        >// case #2.
        >gmap.controls.NAVIGATIONHISTORY.activate(true);
        >
        
        */
        NavigationHistory.prototype.activate = function (isNext) {
            console.log("navigationhistory activate");

            if (isNext) {
                this.me.next.trigger();
            } else {
                this.me.previous.trigger();
            }
        };

        /*
        Function: deactivate
        
        네비게이션 히스토리 컨트롤에서는 사용되지 않으며 구현되어있지 않다.
        */
        NavigationHistory.prototype.deactivate = function () {
            console.log("not supported");
        };
        return NavigationHistory;
    })(GeoNURIS.BaseControl);
    GeoNURIS.NavigationHistory = NavigationHistory;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=NavigationHistory.js.map
;
define("NavigationHistory", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.MousePosition
    
    GeoNURIS.Control.MousePosition 클래스.
    */
    var MousePosition = (function (_super) {
        __extends(MousePosition, _super);
        /*
        Constructor: MousePosition
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function MousePosition(control, map) {
            _super.call(this, control, map, [2 /* TOOL */, 3 /* DISPLAY */], "mouseposition");
            this.me = new OpenLayers.Control.MousePosition({ autoActivate: false });
        }
        /*
        Function: activate
        
        MousePosition 컨트롤을 MAP 에 적용한다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.MOUSEPOSITION.activate();
        */
        MousePosition.prototype.activate = function () {
            console.log("mouseposition activate");

            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);
                this.me.destroy();
                this.me = new OpenLayers.Control.MousePosition({ autoActivate: true });
                this.map.getMapforOpenLayers().addControl(this.me);
            }

            this.me.activate();
        };

        /*
        Function: deactivate
        
        MousePosition 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.MOUSEPOSITION.deactivate();
        
        */
        MousePosition.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me.active) {
                    this.me.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return MousePosition;
    })(GeoNURIS.BaseControl);
    GeoNURIS.MousePosition = MousePosition;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=MousePosition.js.map
;
define("MousePosition", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.ScaleLine
    
    GeoNURIS.Control.ScaleLine 클래스.
    */
    var ScaleLine = (function (_super) {
        __extends(ScaleLine, _super);
        /*
        Constructor: ScaleLine
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function ScaleLine(control, map) {
            _super.call(this, control, map, [2 /* TOOL */, 3 /* DISPLAY */], "scaleline");
            this.me = new OpenLayers.Control.ScaleLine({ autoActivate: false });
        }
        /*
        Function: activate
        
        ScaleLine 컨트롤을 MAP 에 적용한다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.SCALELINE.activate();
        */
        ScaleLine.prototype.activate = function () {
            console.log("scaleline activate");

            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);
                this.me = new OpenLayers.Control.ScaleLine({ autoActivate: true });
                this.map.getMapforOpenLayers().addControl(this.me);
            }

            this.me.activate();
        };

        /*
        Function: deactivate
        
        ScaleLine 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.SCALELINE.deactivate();
        
        */
        ScaleLine.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me.active) {
                    this.me.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return ScaleLine;
    })(GeoNURIS.BaseControl);
    GeoNURIS.ScaleLine = ScaleLine;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=ScaleLine.js.map
;
define("ScaleLine", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.PanZoomBar
    
    GeoNURIS.Control.PanZoomBar 클래스.
    */
    var PanZoomBar = (function (_super) {
        __extends(PanZoomBar, _super);
        /*
        Constructor: PanZoomBar
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function PanZoomBar(control, map) {
            _super.call(this, control, map, [2 /* TOOL */, 3 /* DISPLAY */], "panzoombar");
            this.me = new OpenLayers.Control.PanZoomBar();
        }
        /*
        Function: activate
        
        PanZoomBar 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >options?: {
        >   noSkin?: boolean        // 해당 값은 생량 가능하며, 기본 값은 false이다. 값을 true로 설정할 경우 OpenLayers 기본 테마로 기능 제공
        >}
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1. 미리 구현된 사용자 정의 스킨으로 해당 기능을 제공
        >gmap.controls.PANZOOMBAR.activate({ noSkin: false });
        >
        >// case #2. OpenLayers 기본 설정 스킨으로 해당 기능을 제공
        >gmap.controls.PANZOOMBAR.activate({ noSkin: true });
        >
        */
        PanZoomBar.prototype.activate = function (options) {
            console.log("panzoombar activate");

            var tempCustom = null;
            var tempNoSkin = false;
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.custom != "undefined" && opts.custom != null) {
                    tempCustom = opts.custom;
                }
                if (typeof opts.noSkin == "boolean" && opts.noSkin) {
                    tempNoSkin = opts.noSkin;
                }
            }

            //
            this.deactivate();

            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);

                this.me = new OpenLayers.Control.PanZoomBar({ zoomWorldIcon: true });

                //
                if (tempCustom instanceof OpenLayers.Control.PanZoomBar) {
                    this.me = tempCustom;
                }

                this.map.getMapforOpenLayers().addControl(this.me);

                //
                var buttons = ['pandown', 'panup', 'panleft', 'panright', 'zoomworld', 'zoomin', 'zoomout'];
                if (tempCustom == null && !tempNoSkin) {
                    for (var key in buttons) {
                        var targetStr = buttons[key];
                        var targetImgSrc = buttons[key] + '.png';

                        var div = _.chain(this.me.buttons).find(function (obj) {
                            return obj.id.toLowerCase().indexOf(targetStr) >= 0 ? true : false;
                        }).value();
                        var img = div.children[0];

                        //
                        div.style.width = '23px';
                        div.style.height = '20px';

                        //
                        img.src = OpenLayers.Util.getImageLocation(targetImgSrc);
                        img.style.width = '23px';
                        img.style.height = '20px';

                        if (targetStr == 'zoomin') {
                            div.style.top = (parseInt(div.style.top.replace('px', '')) - 2) + 'px';
                        } else if (targetStr == 'panleft') {
                            img.style.right = '4px';
                        } else if (targetStr == 'panright') {
                            img.style.left = '4px';
                        } else if (targetStr == 'pandown') {
                            img.style.top = '4px';
                        } else if (targetStr == 'panup') {
                            img.style.bottom = '4px';
                        }
                    }
                }

                //
                var zoombarDiv = this.me.zoombarDiv;
                zoombarDiv.style.backgroundImage = 'url(' + OpenLayers.Util.getImageLocation('zbar.png') + ')';
                zoombarDiv.style.width = '23px';

                //
                var sliderDiv = this.me.slider;
                sliderDiv.style.marginLeft = '4px';

                //
                var sliderImg = sliderDiv.children[0];
                sliderImg.src = OpenLayers.Util.getImageLocation('zb_btn.png');
                sliderImg.style.width = '22px';
                sliderImg.style.height = '11px';

                //
                this.me.div.style.backgroundImage = 'url(' + OpenLayers.Util.getImageLocation('bg.png') + ')';
                this.me.div.style.backgroundRepeat = 'no-repeat no-repeat';
                this.me.div.style.backgroundPosition = '7px 5px';
                this.me.div.style.width = '81px';
                this.me.div.style.height = '305px';
                this.me.div.style.removeProperty('left');
                this.me.div.style.right = '0px';
                this.me.div.style.top = '50px';
            }

            this.me.activate();
        };

        /*
        Function: deactivate
        
        PanZoomBar 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.PANZOOMBAR.deactivate();
        
        */
        PanZoomBar.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me.active) {
                    this.me.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return PanZoomBar;
    })(GeoNURIS.BaseControl);
    GeoNURIS.PanZoomBar = PanZoomBar;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=PanZoomBar.js.map
;
define("PanZoomBar", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.NavToolbar
    
    GeoNURIS.Control.NavToolbar 클래스.
    */
    var NavToolbar = (function (_super) {
        __extends(NavToolbar, _super);
        /*
        Constructor: NavToolbar
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function NavToolbar(control, map) {
            _super.call(this, control, map, [2 /* TOOL */, 3 /* DISPLAY */, 0 /* HANDLER */], "navtoolbar");
            this.me = new OpenLayers.Control.NavToolbar();
        }
        /*
        Function: activate
        
        NavToolbar 컨트롤을 MAP 에 적용한다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.NAVTOOLBAR.activate();
        */
        NavToolbar.prototype.activate = function (isNotBeforeActivate) {
            console.log("navtoolbar activate");

            // -----------------------------------------------------isNotBeforeActivate SS
            var tempIsNotBeforeActivate = false;
            if (typeof isNotBeforeActivate == "boolean") {
                tempIsNotBeforeActivate = isNotBeforeActivate;
            }

            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            //
            var tempControl = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
            if (tempControl == null || tempControl.length == 0) {
                console.log("control added :: " + this.me.CLASS_NAME);
                this.me = new OpenLayers.Control.NavToolbar({ autoActivate: true });
                this.map.getMapforOpenLayers().addControl(this.me);
            }

            this.me.activate();
        };

        /*
        Function: deactivate
        
        NavToolbar 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.NAVTOOLBAR.deactivate();
        
        */
        NavToolbar.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                if (this.me.active) {
                    this.me.deactivate();
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
            }
        };
        return NavToolbar;
    })(GeoNURIS.BaseControl);
    GeoNURIS.NavToolbar = NavToolbar;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=NavToolbar.js.map
;
define("NavToolbar", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
/// <reference path="../Style.ts" />
/// <reference path="../../UTIL/UTIL.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.Measure
    
    GeoNURIS.Control.Measure 클래스.
    */
    var Measure = (function (_super) {
        __extends(Measure, _super);
        /*
        Constructor: Measure
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function Measure(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */, 3 /* DISPLAY */], "measure");
            this.isMove = false;
            this.me = {};
            this.defaultStyleRule = null;
            this.displayPrefix = "measure";

            this.displayMeasurePopups = [];

            var pointStyle = {};
            pointStyle.pointRadius = 4;
            pointStyle.graphicName = "square";
            pointStyle.fillColor = "red";
            pointStyle.fillOpacity = 0.5;
            pointStyle.strokeWidth = 1;
            pointStyle.strokeOpacity = 0.7;
            pointStyle.strokeColor = "red";

            var lineStyle = {};
            lineStyle.strokeWidth = 3;
            lineStyle.strokeOpacity = 0.7;
            lineStyle.strokeColor = "red";

            //lineStyle.strokeDashstyle = "dash";
            var polygonStyle = {};
            polygonStyle.strokeWidth = 3;
            polygonStyle.strokeOpacity = 0.7;
            polygonStyle.strokeColor = "blue";
            polygonStyle.fillColor = "blue";
            polygonStyle.fillOpacity = 0.3;
            polygonStyle.pointRadius = 4;

            var boxStyle = {};
            boxStyle.strokeWidth = 3;
            boxStyle.strokeOpacity = 0.7;
            boxStyle.strokeColor = "blue";
            boxStyle.fillColor = "blue";
            boxStyle.fillOpacity = 0.3;

            this.defaultStyleRule = new OpenLayers.Rule({
                symbolizer: {
                    "Point": pointStyle,
                    "Line": lineStyle,
                    "Polygon": polygonStyle,
                    "Box": boxStyle
                }
            });
            var style = new OpenLayers.Style();
            style.addRules([this.defaultStyleRule]);

            this.styleMap = new OpenLayers.StyleMap({ "default": style });

            var defaultOptions = {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        styleMap: this.styleMap,
                        renderers: OpenLayers.Layer.Vector.prototype.renderers
                    },
                    sides: 4,
                    irregular: true
                }
            };

            var regularOptions = {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        styleMap: this.styleMap,
                        renderers: OpenLayers.Layer.Vector.prototype.renderers
                    },
                    sides: 50
                }
            };

            //
            this.me._line = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, defaultOptions);
            this.me._polygon = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, defaultOptions);
            this.me._regular = new OpenLayers.Control.Measure(OpenLayers.Handler.RegularPolygon, regularOptions);
            this.me._box = new OpenLayers.Control.Measure(OpenLayers.Handler.RegularPolygon, defaultOptions);

            for (var i in this.me) {
                var target = this.me[i];
                target.geodesic = true;
                target.events.on({
                    "measure": function (e) {
                        this.measureEnd(e);
                    },
                    "measurepartial": function (e) {
                        this.measureIng(e);
                    },
                    scope: this
                });
            }
        }
        /*
        Function: activate
        
        측량 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >options?: {
        >   type?: string;              // line, polygon, regular, box
        >   isMove?: boolean;           // 패닝기능 활성 여부, 기본 값은 false 이다.
        >   persist?: boolean;          // 측량을 위해 설정한 영역이 유지될 것인지 여부, 기본 값은 true이다.
        >   fncEnd?: Function;          // 측량 종료 후 결과를 호출할 함수.
        >   fncIng?: Function;          // 측량시 마다 호출되는 함수.
        >   geodesic?: boolean;         // 측지측정대신 평면의 통계값 사용여부, 기본 값은 true이다. 타일기반의 이미지맵의 경우 통계값을 이용해야 함.
        >   visibleResult?: boolean;    // 기본값은 false이다.
        >   styleRule?: {               // 측량 기준 영역(또는 거리) 사용자 지정 스타일.
        >       line?: any;
        >       box?: any;
        >       polygon?: any;
        >       point?: any;
        >   }
        >}
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1. 사용자 임의영역(Polygon)지정으로 면적 측량
        >gmap.controls.MEASURE.activate({ type: "polygon", fncEnd: function(e){ console.log(e.measure + " " + e.units); } });
        >
        >// case #2. 반경지정으로 면적 측량
        >gmap.controls.MEASURE.activate({ type: "regular", fncEnd: function(e){ console.log(e.measure + " " + e.units); } });
        >
        >// case #3. box지정으로 면적 측량
        >gmap.controls.MEASURE.activate({ type: "box", fncEnd: function(e){ console.log(e.measure + " " + e.units); } });
        >
        >// case #4. 거리(line)지정으로 측량
        >gmap.controls.MEASURE.activate({ type: "line", fncEnd: function(e){ console.log(e.measure + " " + e.units); } });
        >
        >// case #5. 측량결과 화면에 표시
        >gmap.controls.MEASURE.activate({ type: "line", visibleResult: true});
        */
        Measure.prototype.activate = function (options) {
            var _this = this;
            console.log("measure activate");

            this.optionMeasureEnd = function (evt) {
            };
            this.optionMeasureIng = function (evt) {
            };

            var pStyle = this.defaultStyleRule.symbolizer["Point"];
            pStyle.strokeColor = "red";
            pStyle.fillColor = "red";

            var mapName = this.map.getMapforOpenLayers().baseLayer.name.toLowerCase();

            var tempVisibleResult = false;
            var targetType = this.me._line;
            var tempIsNotBeforeActivate = false;
            var tempIsMove = false;
            var tempGeodesic = (mapName == "daummap" || mapName == "navermap") ? false : true;
            var tempPersist = true;
            var tempStyleRule = null;
            if (typeof options != "undefined" && options != null) {
                if (typeof options.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = options.isNotBeforeActivate;
                }
                if (typeof options.isMove == "boolean") {
                    tempIsMove = options.isMove;
                }
                if (typeof options.geodesic == "boolean") {
                    tempGeodesic = options.geodesic;
                }
                if (typeof options.visibleResult == "boolean") {
                    tempVisibleResult = options.visibleResult;
                }
                if (typeof options.persist == "boolean") {
                    tempPersist = options.persist;
                }
                if (typeof options.type == "string") {
                    var tempType = UTIL.trim(options.type.toLowerCase());
                    if (tempType == "line" || tempType == "l") {
                        targetType = this.me._line;
                    } else if (tempType == "polygon" || tempType == "p") {
                        targetType = this.me._polygon;
                    } else if (tempType == "regular" || tempType == "r") {
                        targetType = this.me._regular;
                    } else if (tempType == "box" || tempType == "b") {
                        targetType = this.me._box;
                    }

                    //
                    if (tempType != "line" && tempType != "l") {
                        pStyle.strokeColor = "blue";
                        pStyle.fillColor = "blue";
                    }
                }
                if (typeof options.fncEnd == "function") {
                    this.optionMeasureEnd = function (evt) {
                        options.fncEnd(evt);
                    };
                }
                if (typeof options.fncIng == "function") {
                    this.optionMeasureIng = function (evt) {
                        options.fncIng(evt);
                    };
                }
                if (typeof options.styleRule != "undefined" && options.styleRule != null) {
                    var styleRule = options.styleRule;

                    var symbolizer = {};
                    if (typeof styleRule.box != "undefined" && styleRule.box != null) {
                        symbolizer["Box"] = styleRule.box;
                    }
                    if (typeof styleRule.point != "undefined" && styleRule.point != null) {
                        symbolizer["Point"] = styleRule.point;
                    }
                    if (typeof styleRule.polygon != "undefined" && styleRule.polygon != null) {
                        symbolizer["Polygon"] = styleRule.polygon;
                    }
                    if (typeof styleRule.line != "undefined" && styleRule.line != null) {
                        symbolizer["Line"] = styleRule.line;
                    }

                    tempStyleRule = new OpenLayers.Rule({
                        symbolizer: symbolizer
                    });
                }
            }

            this.measureEnd = function (evt) {
                console.log("measureEnd : " + evt.measure + " " + evt.units);
                _this.optionMeasureEnd(evt);

                if (tempVisibleResult) {
                    // by sorilove
                    // 기본 geometry중 기준으로 사용할 값을 추출한다.
                    var g = evt.geometry.components[evt.geometry.components.length - 1];

                    // 만약 측량 방법이 polygon,box,regular(=geometry type이 linearring)일 경우
                    if (evt.geometry.componentTypes[0].toLowerCase().lastIndexOf("linearring") >= 0) {
                        // 추출한 geomerty에서 다시 geomerty를 추출한다.
                        g = g.components[g.components.length - 2];
                        //} else if (evt.geometry.componentTypes[0].toLowerCase().lastIndexOf("point") >= 0) {
                    }

                    //
                    var strongColor = "#1833e5";
                    var append = "<sup>2</sup>";
                    var style = null;
                    var defaultSymbolizer = _this.defaultStyleRule.clone().symbolizer;
                    if (targetType.id == _this.me._line.id) {
                        style = defaultSymbolizer.Line;
                        append = "";
                        strongColor = "#f11413";
                    } else if (targetType.id == _this.me._box.id) {
                        style = defaultSymbolizer.Box;
                    } else {
                        style = defaultSymbolizer.Polygon;
                    }

                    //
                    var lonlat = new OpenLayers.LonLat(g.x, g.y);
                    var size = new OpenLayers.Size(120, 22);
                    var content = "<div style='position:absolute; white-space:nowrap; margin:0px; font-size:11px; border:1px solid #585c6c; padding:0 5px; line-height:21px; letter-spacing:0px; box-shadow:0 0 1px rgba(0,0,0,0.5); background:#fff'><strong style='color:" + strongColor + ";'>" + evt.measure.toFixed(1) + "</strong> " + evt.units + append + "</div>";
                    var isClose = true;
                    var closeCallback = function () {
                        console.log('close');

                        // display된 popup 초기화(제거)
                        if (_this.displayMeasurePopups != null) {
                            for (var i in _this.displayMeasurePopups) {
                                _this.map.getMapforOpenLayers().removePopup(_this.displayMeasurePopups[i]);
                            }
                        }

                        // display된 geometry 를 초기화(제거)
                        var drawLayer = _this.control.DRAWFEATURE.getDrawLayer();
                        _this.control.DRAWFEATURE.removeFeature(drawLayer.getFeaturesByAttribute(_this.displayPrefix, true));
                    };

                    //
                    var popup = new OpenLayers.Popup(_.uniqueId("measure"), lonlat, size, content, isClose, closeCallback);
                    popup.setBackgroundColor("transparent");
                    popup.contentDiv.style.left = "15px";
                    popup.closeDiv.style.right = "";
                    _this.displayMeasurePopups.push(popup);
                    _this.map.getMapforOpenLayers().addPopup(popup, false);

                    //
                    var attributes = {};
                    attributes[_this.displayPrefix] = true;
                    _this.control.DRAWFEATURE.drawFeature(evt.geometry, null, style, attributes);

                    //
                    _this.deactivate();
                }
            };
            this.measureIng = function (evt) {
                console.log("measureIng : " + evt.measure + " " + evt.units);
                _this.optionMeasureIng(evt);

                if (tempVisibleResult) {
                    // by sorilove
                    // geometry type이 point인 경우 측량방법이 line이며,
                    // geometry type이 linearring일 경우 측량방법이 polygon이다.
                    // 측량방법이 box와 regular일 경우엔 measureIng 함수를 호출하지 않는다.
                    // 기본 geometry중 기준으로 사용할 값을 추출한다.
                    var g = evt.geometry.components[evt.geometry.components.length - 1];

                    // geometry type이 point(=line)일 경우에만 지정한 거리의 값을 계속해서 표시해야 하므로 다음과 같이 popup을 생성하여 추가한다.
                    if (evt.geometry.componentTypes[0].toLowerCase().lastIndexOf("point") >= 0 && evt.geometry.components.length > 2) {
                        var lonlat = new OpenLayers.LonLat(g.x, g.y);
                        var size = new OpenLayers.Size(120, 18);
                        var content = "<div style='position:absolute; white-space:nowrap; margin:0px; font-size:11px; border:1px solid #585c6c; padding:0 5px; line-height:21px; letter-spacing:0px; box-shadow:0 0 1px rgba(0,0,0,0.5); background:#fff'><strong style='color:#f11413;'>" + evt.measure.toFixed(1) + "</strong> " + evt.units + "</div>";
                        var isClose = false;
                        var closeCallback = function () {
                        };

                        //
                        var popup = new OpenLayers.Popup(_.uniqueId("measure"), lonlat, size, content, isClose, closeCallback);
                        popup.setBackgroundColor("transparent");
                        _this.displayMeasurePopups.push(popup);
                        _this.map.getMapforOpenLayers().addPopup(popup, false);
                    }
                }
            };

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            //
            this.deactivate();

            //
            if (tempIsMove && (targetType.id == this.me._line.id || targetType.id == this.me._polygon.id)) {
                this.control.NAVIGATION.activate({ isNotBeforeActivate: true, isZoomWheel: true });
                this.isMove = true;
            } else {
                this.isMove = false;
            }

            for (var i in this.me) {
                var targetItem = this.me[i];
                targetItem.handler["persist"] = tempPersist;
                targetItem.geodesic = tempGeodesic;

                if (tempStyleRule != null) {
                    targetItem.handlerOptions["layerOptions"].styleMap.styles.default.rules = [tempStyleRule];
                } else {
                    targetItem.handlerOptions["layerOptions"].styleMap.styles.default.rules = [this.defaultStyleRule];
                }
            }

            // display된 popup 초기화(제거)
            if (this.displayMeasurePopups != null) {
                for (var i in this.displayMeasurePopups) {
                    this.map.getMapforOpenLayers().removePopup(this.displayMeasurePopups[i]);
                }
            }

            // display된 geometry 를 초기화(제거)
            var drawLayer = this.control.DRAWFEATURE.getDrawLayer();
            this.control.DRAWFEATURE.removeFeature(drawLayer.getFeaturesByAttribute(this.displayPrefix, true));

            //
            this.map.getMapforOpenLayers().addControl(targetType);
            targetType.activate();

            this.control.TOOLBAR.setActivateButton(targetType.handler.id.replace(/OpenLayers_Handler_/gi, '').replace(/_[0-9]+$/gi, '').toLowerCase());
        };

        /*
        Function: deactivate
        
        측량 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.MEASURE.deactivate();
        
        */
        Measure.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                for (var i in this.me) {
                    var target = this.me[i];
                    if (target.active) {
                        target.deactivate();
                    }
                }

                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me._line.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me._line.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }

                if (this.isMove) {
                    this.control.NAVIGATION.deactivate();
                    this.isMove = false;
                }
            }
        };

        Measure.prototype.measureEnd = function (evt) {
            //console.log(evt);
        };
        Measure.prototype.measureIng = function (evt) {
            //console.log(evt);
        };

        Measure.prototype.optionMeasureEnd = function (evt) {
            //console.log(evt);
        };
        Measure.prototype.optionMeasureIng = function (evt) {
            //console.log(evt);
        };
        return Measure;
    })(GeoNURIS.BaseControl);
    GeoNURIS.Measure = Measure;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Measure.js.map
;
define("Measure", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.GetFeature
    
    GeoNURIS.Control.GetFeature 클래스.
    */
    var GetFeature = (function (_super) {
        __extends(GetFeature, _super);
        /*
        Constructor: GetFeature
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function GetFeature(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */, 3 /* DISPLAY */, 1 /* EVENT */], "getfeature");
            this.isHighLight = false;
            this.clickTolerance = 18;
            this.me = new OpenLayers.Control.GetFeature({
                clickTolerance: this.clickTolerance,
                toggle: false,
                multiple: false,
                hover: false,
                toggleKey: "ctrlKey",
                multipleKey: "shiftKey"
            });
            this.me.events.on({
                "featureunselected": function (e) {
                    this.featureUnselected(e);
                },
                "featuresselected": function (e) {
                    this.featuresSelected(e);
                },
                scope: this
            });

            this.highLightLayer = new OpenLayers.Layer.Vector("highLightLayer", {
                displayInLayerSwitcher: false,
                isBaseLayer: false
            });
        }
        /*
        Function: activate
        
        GetFeature 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >   layer: GeoNURIS.BaseLayer,          // get할 대상 Layer, {GeoNURIS.BaseLayer}
        >   options: {
        >       addFilter: string,              // get할 때, 조건으로 사용할 속성 조건으로 {OpenLayers.Format.CQL}을 지원한다.
        >       geom: OpenLayers.Geometry,      // get할 때, 조건으로 사용할 Geometry 이며 해당 값을 설정할 경우 selectType은 강제로 method가 된다.
        >       fids: number[],                 // get할 때, 조건으로 사용할 fids 이며 해당 값을 설정할 경우 selectType은 강제로 method가 된다.
        >       selectType: string,             // get하는 방법으로 method / click / box / polygon / regular 를 지원한다.
        >       fsSelected: Function,           // 선택된 Featrue 가 있을 때, 호출 될 콜백 함수.
        >       fUnselected: Function,          // 선택된 Feature 가 해제될 때, 호출될 콜백 함수.
        >       clickTolerance: number,         // 마우스 이벤트를 통해 선택할(get) Feature의 범위를 지정할 때, 허용오차 범위
        >       highLight : boolean,            // 선택된(get) Feature 를 MAP에 하이라이트 처리할 것인지 여부
        >       max : number,                   // 선택할(get) 수 있는 Feature 의 최대 갯수.
        >   }
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 서비스 추출, 서비스 ID를 'testSVC'로 가정
        >   var targetSVC = gmap.toc.getService('testSVC');
        >
        >   // 레이어 추출, 레이어 ID를 'testLayer'로 가정
        >   var targetLayer = targetSVC.getLayer('testLayer');
        >
        >   // case #1. 마우스 이벤트에 의한 컨트롤 활성
        >   gmap.controls.GETFEATURE.activate(
        >       targetLayer,
        >       {
        >           selectType: 'box',
        >           highLight: true,
        >           fsSelected: function(res) { console.log(res); }
        >       }
        >   );
        >
        >   // case #2. 조건(fids)에 의한 컨트롤 활성
        >   var targetFIDS = [6865, 7438];
        >   gmap.controls.GETFEATURE.activate(
        >       targetLayer,
        >       {
        >           fids: targetFIDS,
        >           highLight: true,
        >           fsSelected: function(res) { console.log(res); }
        >       }
        >   );
        >
        >   // case #3. 조건(addFilter)에 의한 컨트롤 활성
        >   gmap.controls.GETFEATURE.activate(
        >       targetLayer,
        >       {
        >           selectType: 'box',                      // method를 지정할 경우 마우스 이벤트 없이 해당하는 Feature를 바로 get한다.
        >           addFilter: "BLDG_NUM = '00009691'",
        >           highLight: true,
        >           fsSelected: function(res) { console.log(res); }
        >       }
        >   );
        >
        >   // case #4. 조건(Geometry)에 의한 컨트롤 활성
        >
        >   // GeoJson을 이용한 Feature 생성
        >   var gJson = {
        >       "type": "Feature",
        >       "properties": {
        >       },
        >       "geometry": {
        >           "type": "Polygon",
        >           "coordinates": [
        >               [
        >                   [
        >                       622077.35241719,
        >                       4193171.0103122
        >                   ],
        >                   [
        >                       622076.35241719,
        >                       4192828.0103122
        >                   ],
        >                   [
        >                       622572.35241719,
        >                       4192823.0103122
        >                   ],
        >                   [
        >                       622570.35241719,
        >                       4193178.0103122
        >                   ],
        >                   [
        >                       622077.35241719,
        >                       4193171.0103122
        >                   ]
        >               ]
        >           ]
        >       },
        >       "crs": {
        >           "type": "name",
        >           "properties": {
        >               "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        >           }
        >       }
        >   };
        >
        >   var geojson = new OpenLayers.Format.GeoJSON({});
        >   var feature = geojson.read(gJson)[0];
        >
        >   // 컨트롤 활성
        >   gmap.controls.GETFEATURE.activate(
        >       targetLayer,
        >       {
        >           geom: feature.geometry,
        >           highLight: true,
        >           fsSelected: function(res) { console.log(res); }
        >       }
        >   );
        
        
        */
        GetFeature.prototype.activate = function (layer, options) {
            console.log("getfeature activate");

            var tempGeom = null;
            var tempFids = null;
            var tempAddFilter = null;
            var tempSelectType = "click";
            var tempMaxFeatures = null;
            var tempClickTolerance = this.clickTolerance;

            this.isHighLight = false;
            this.runFeaturesSelected = function (e) {
            };
            this.runFeatureUnselected = function (e) {
            };

            //
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                if (typeof options.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = options.isNotBeforeActivate;
                }

                if (typeof options.selectType == "string") {
                    tempSelectType = UTIL.trim(options.selectType.toLowerCase());
                }

                if (typeof options.highLight == "boolean") {
                    this.isHighLight = options.highLight;

                    if (this.isHighLight) {
                        if (this.map.getMapforOpenLayers().getLayer(this.highLightLayer.id) == null) {
                            this.map.getMapforOpenLayers().addLayer(this.highLightLayer);
                            this.highLightLayer.setZIndex(3000);
                        }
                    }
                }

                if (typeof options.addFilter == "string") {
                    tempAddFilter = options.addFilter;
                    if (tempAddFilter == "") {
                        tempAddFilter = null;
                    }
                }

                if (typeof options.fids == "object") {
                    tempFids = options.fids;
                    if (tempFids != null && tempFids.length == 0) {
                        tempFids = null;
                    }
                }

                if (typeof options.geom == "object") {
                    tempGeom = options.geom;
                }

                if (typeof options.fsSelected == "function") {
                    this.runFeaturesSelected = function (e) {
                        options.fsSelected(e);
                    };
                }
                if (typeof options.fUnselected == "function") {
                    this.runFeatureUnselected = function (e) {
                        options.fUnselected(e);
                    };
                }

                if (typeof options.max == "number") {
                    tempMaxFeatures = options.max;
                }

                if (typeof options.clickTolerance == "number") {
                    tempClickTolerance = options.clickTolerance;
                }
            }

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];

                    if (target instanceof GetFeature) {
                        if (this.map.getMapforOpenLayers().getControl(target.me.id)) {
                            console.log("pass");
                            continue;
                        }
                    }

                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            if (typeof layer != "undefined" && layer instanceof GeoNURIS.GroupLayer == false) {
                var wfsProtocol = layer.getWFSProtocol();
                this.me.protocol = wfsProtocol;

                //
                var tempControl = this.map.getMapforOpenLayers().getControl(this.me.id);
                if (tempControl == null) {
                    console.log("control added :: " + this.me.CLASS_NAME);
                    this.map.getMapforOpenLayers().addControl(this.me);
                }

                //
                this.me.activate();
                this.me.clickTolerance = tempClickTolerance;

                //
                if (tempSelectType != "click" || tempFids != null || tempGeom != null) {
                    var mine = this;
                    this.me.protocol = null;
                    if (this.me.handlers.hasOwnProperty("click")) {
                        this.me.handlers["click"].deactivate();
                    }
                    this.me.modifiers = {
                        multiple: false,
                        toggle: false
                    };

                    if (tempSelectType == "method" || tempSelectType == "m" || tempFids != null || tempGeom != null) {
                        var filter = null;
                        if (tempGeom != null) {
                            var geomIntersectFilter = [];
                            geomIntersectFilter.push(new OpenLayers.Filter.Spatial({
                                type: OpenLayers.Filter.Spatial.INTERSECTS,
                                value: tempGeom,
                                property: "SHAPE"
                            }));

                            //
                            filter = geomIntersectFilter[0];
                            if (tempAddFilter != null) {
                                geomIntersectFilter.push(new OpenLayers.Format.CQL().read(tempAddFilter));
                                filter = new OpenLayers.Filter.Logical({
                                    type: OpenLayers.Filter.Logical.AND,
                                    filters: geomIntersectFilter
                                });
                            }
                        } else if (tempFids != null) {
                            filter = new OpenLayers.Filter.FeatureId({ fids: tempFids });
                        } else if (tempAddFilter != null) {
                            filter = new OpenLayers.Format.CQL().read(tempAddFilter);
                        }

                        wfsProtocol.read({
                            filter: filter,
                            maxFeatures: tempMaxFeatures,
                            callback: function (response) {
                                if (response.features != null) {
                                    mine.me.select(response.features);
                                }
                                mine.deactivate();
                            }
                        });
                    } else {
                        this.control.MEASURE.activate({
                            type: tempSelectType, isNotBeforeActivate: true, persist: false, fncEnd: function (evt) {
                                var defaultFilter = new OpenLayers.Filter.Spatial({
                                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                                    value: evt.geometry,
                                    property: "SHAPE"
                                });

                                var filter = defaultFilter;
                                if (tempAddFilter != null) {
                                    filter = new OpenLayers.Filter.Logical({
                                        type: OpenLayers.Filter.Logical.AND,
                                        filters: [
                                            filter,
                                            new OpenLayers.Format.CQL().read(tempAddFilter)
                                        ]
                                    });
                                }

                                wfsProtocol.read({
                                    filter: filter,
                                    maxFeatures: tempMaxFeatures,
                                    callback: function (response) {
                                        if (response.features != null) {
                                            mine.me.select(response.features);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    //
                } else if (tempSelectType == "click") {
                    if (this.me.handlers.hasOwnProperty("click")) {
                        this.me.handlers["click"].activate();
                    }
                }

                console.log("ok");
            }
        };

        //
        /*
        Function: clearHighLight
        
        하이라이트된 Feature를 해제한다.
        
        Example:
        >   // map 생성.
        >   var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >   // 하이라이트 해제
        >   gmap.controls.GETFEATURE.clearHighLight();
        */
        GetFeature.prototype.clearHighLight = function () {
            if (typeof this.highLightLayer != "undefined") {
                if (typeof this.me != "undefined") {
                    this.me.unselectAll();
                }
                //this.highLightLayer.removeAllFeatures();
            }
        };

        /*
        Function: deactivate
        
        GetFeature 컨트롤을 MAP 에서 해제한다.
        
        Parameters:
        
        isHighLightRemove: boolean - GetFeature 컨트롤 해제시 하이라이트된 Feature들도 해제할 것인지 여부, 생략 가능하며 기본값은 false
        
        Example:
        >   // map 생성.
        >   var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >   // case #1. 컨트롤 해제.
        >   gmap.controls.GETFEATURE.deactivate();
        >
        >   // case #2. 컨트롤 해제, 하이라이트된 Feature도 해제한다.
        >   gmap.controls.GETFEATURE.deactivate(true);
        
        */
        GetFeature.prototype.deactivate = function (isHighLightRemove) {
            if (typeof this.me != "undefined" && this.me != null) {
                //
                if (isHighLightRemove) {
                    this.me.unselectAll();
                    this.highLightLayer.removeAllFeatures();
                    if (this.map.getMapforOpenLayers().getLayer(this.highLightLayer.id) != null) {
                        this.map.getMapforOpenLayers().removeLayer(this.highLightLayer);
                    }
                }

                if (this.me.active) {
                    this.me.deactivate();
                    this.control.MEASURE.deactivate();
                }

                //
                var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me.CLASS_NAME);
                if (tempControls != null || tempControls.length > 0) {
                    console.log("control removed :: " + this.me.CLASS_NAME);
                    for (var i in tempControls) {
                        this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                    }
                }
                //
            }
        };

        //
        GetFeature.prototype.featureUnselected = function (e) {
            if (this.isHighLight) {
                this.highLightLayer.removeFeatures(e.feature);
                //console.log("highLight off");
            }
            this.runFeatureUnselected(e);
        };
        GetFeature.prototype.runFeatureUnselected = function (e) {
            //console.log("featureUnselected");
        };

        GetFeature.prototype.featuresSelected = function (e) {
            if (this.isHighLight) {
                this.highLightLayer.addFeatures(e.features);
                //console.log("highLight on");
            }
            this.runFeaturesSelected(e);
        };
        GetFeature.prototype.runFeaturesSelected = function (e) {
            //console.log("featuresSelected");
        };
        return GetFeature;
    })(GeoNURIS.BaseControl);
    GeoNURIS.GetFeature = GetFeature;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=GetFeature.js.map
;
define("GetFeature", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.DrawFeature
    
    GeoNURIS.Control.DrawFeature 클래스.
    */
    var DrawFeature = (function (_super) {
        __extends(DrawFeature, _super);
        /*
        Constructor: DrawFeature
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function DrawFeature(control, map) {
            var _this = this;
            _super.call(this, control, map, [0 /* HANDLER */], "draw feature");
            this.me = {};

            this.drawLayer = new OpenLayers.Layer.Vector("draw layer", { renderers: OpenLayers.Layer.Vector.prototype.renderers });
            this.drawLayer.events.on({
                "featureadded": function (obj) {
                    _this.featureadded(obj);
                },
                "featuremodified": function (obj) {
                    _this.featuremodified(obj);
                },
                "vertexmodified": function (obj) {
                    _this.vertexmodified(obj);
                }
            });
            if (this.map.getMapforOpenLayers().getLayer(this.drawLayer.id) == null) {
                this.map.getMapforOpenLayers().addLayer(this.drawLayer);
                this.drawLayer.setZIndex(4900);
            }

            this.me._point = new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Point);
            this.me._line = new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Path);
            this.me._box = new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.RegularPolygon, { handlerOptions: { sides: 4 } });
            this.me._polygon = new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Polygon);
            this.me._regular = new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.RegularPolygon, { handlerOptions: { sides: 50 } });
            this.me._modify = new OpenLayers.Control.ModifyFeature(this.drawLayer);
        }
        DrawFeature.prototype.featureadded = function (obj) {
        };
        DrawFeature.prototype.featuremodified = function (obj) {
        };
        DrawFeature.prototype.vertexmodified = function (obj) {
        };

        /*
        Function: getDrawLayer
        
        Draw레이어를 반환한다.
        
        Returns:
        
        layer: OpenLayers.Layer.Vector - Draw 레이어
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   var layer = gmap.controls.DrawFeature.getDrawLayer();
        >   console.log(layer.id);
        */
        DrawFeature.prototype.getDrawLayer = function () {
            return this.drawLayer;
        };

        /*
        Function: activate
        
        DrawFeature 컨트롤을 MAP 에 적용한다.
        적용시 파라메터의 mode에 따라 add / modify 가 가능하다.
        
        Parameters:
        
        >   mode?: string,                          // 활성모드로 add 와 modify 를 지원한다.
        >   type?: string,                          // mode의 값이 add 일 경우 [ line / box / polygon / regular ] 를 지원한다.
        >                                           // mode의 값이 modify 일 경우 [ vertices / transform ] 를 지원한다.
        >   callback?: Function,                    // add 가 완료될 때, 호출될 콜백 함수
        >   options?: {
        >       vertexmodified: Function,           // mode가 modify이고, type이 vertices일 때 점편집 때마다 호출될 콜백 함수.
        >       isMove?: boolean,                   // 편집(modify) 또는 생성(add)중 마우스 패닝 가능 여부
        >       style?: GeoNURIS.Vector.Style       // 생성되는 Feature의 스타일
        >   }
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 폴리곤 생성
        >   gmap.controls.DRAWFEATURE.activate('add', 'polygon', function(res) { console.log(res); }, { isMove: true });
        >
        >   // 마우스를 이용해 폴리곤 생성... 생략
        >
        >   // 폴리곤 점편집
        >   gmap.controls.DRAWFEATURE.activate('modify', 'vertices', null, { isMove: true });
        >
        >   // 폴리곤 크기 변경 및 회전
        >   gmap.controls.DRAWFEATURE.activate('modify', 'transform', null, { isMove: true });
        
        */
        DrawFeature.prototype.activate = function (mode, type, callback, options) {
            console.log("draw feature activate");

            var tempMode = "add";
            var tempType = "line";
            var tempCallBack = null;
            var tempVertexModified = null;

            if (typeof type == "string" && type != null) {
                tempType = UTIL.trim(type.toLowerCase());
            }
            if (typeof mode == "string" && mode != null) {
                tempMode = UTIL.trim(mode.toLowerCase());

                if (tempMode == "modify" || tempMode == "m") {
                    if (!(tempType == "vertices" || tempType == "v") && !(tempType == "transform" || tempType == "t")) {
                        tempType = "vertices";
                    }
                }
            }
            if (typeof callback == "function" && callback != null) {
                tempCallBack = callback;
            }

            //
            var tempStyle = null;
            var tempIsMove = false;
            var tempLayerID = null;
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = opts.isNotBeforeActivate;
                }
                if (typeof opts.layerid == "string" && opts.layerid != null) {
                    tempLayerID = opts.layerid;
                }
                if (typeof opts.vertexmodified == "function" && opts.vertexmodified != null) {
                    tempVertexModified = opts.vertexmodified;
                }
                if (typeof opts.isMove == "boolean") {
                    tempIsMove = opts.isMove;
                }
                if (typeof opts.style != "undefined" && opts.style != null) {
                    tempStyle = opts.style;
                }
            }

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            // ================================================
            this.featureadded = function (obj) {
            };
            this.featuremodified = function (obj) {
            };
            this.vertexmodified = function (obj) {
            };

            if (tempMode == "add" || tempMode == "a") {
                var targetType = null;
                if (tempType == "point") {
                    targetType = this.me._point;
                } else if (tempType == "line" || tempType == "l") {
                    targetType = this.me._line;
                } else if (tempType == "box" || tempType == "b") {
                    targetType = this.me._box;
                } else if (tempType == "polygon" || tempType == "p") {
                    targetType = this.me._polygon;
                } else if (tempType == "regular" || tempType == "r") {
                    targetType = this.me._regular;
                }

                if (targetType != null) {
                    if (tempIsMove) {
                        this.control.NAVIGATION.activate({ all: true, isNotBeforeActivate: true });
                    }

                    //
                    if (tempCallBack != null) {
                        this.featureadded = function (obj) {
                            //console.log(obj);
                            tempCallBack(obj);
                        };
                    }

                    //
                    this.map.getMapforOpenLayers().addControl(targetType);
                    targetType.handler["irregular"] = true;
                    targetType.activate();

                    if (tempStyle != null) {
                        this.drawLayer.style = tempStyle;
                    } else {
                        this.drawLayer.style = null;
                    }
                }
            } else if (tempMode == "modify" || tempMode == "m") {
                if (tempType == "vertices" || tempType == "v") {
                    this.me._modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
                    this.me._modify.createVertices = true;
                } else if (tempType == "transform" || tempType == "t") {
                    this.me._modify.createVertices = false;

                    //
                    this.me._modify.mode = OpenLayers.Control.ModifyFeature.RESIZE;
                    this.me._modify.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
                    this.me._modify.mode |= OpenLayers.Control.ModifyFeature.DRAG;
                    //this.me._modify.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
                }

                if (tempIsMove) {
                    this.control.NAVIGATION.activate({ all: true, isNotBeforeActivate: true });
                }

                //
                if (tempCallBack != null) {
                    this.featuremodified = function (obj) {
                        //console.log(obj);
                        tempCallBack(obj);
                    };
                }
                if (tempVertexModified != null) {
                    this.vertexmodified = function (obj) {
                        //console.log(obj);
                        tempVertexModified(obj);
                    };
                }

                //
                this.map.getMapforOpenLayers().addControl(this.me._modify);
                this.me._modify.activate();
            }
        };

        /*
        Function: deactivate
        
        DrawFeature 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.DRAWFEATURE.deactivate();
        
        */
        DrawFeature.prototype.deactivate = function () {
            for (var i in this.me) {
                var target = this.me[i];
                if (target.active) {
                    target.deactivate();

                    //
                    this.control.NAVIGATION.deactivate();
                }
            }

            //
            var tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me._line.CLASS_NAME);
            if (tempControls != null || tempControls.length > 0) {
                console.log("control removed :: " + this.me._line.CLASS_NAME);
                for (var i in tempControls) {
                    this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                }
            }

            //
            tempControls = this.map.getMapforOpenLayers().getControlsByClass(this.me._modify.CLASS_NAME);
            if (tempControls != null || tempControls.length > 0) {
                console.log("control removed :: " + this.me._modify.CLASS_NAME);
                for (var i in tempControls) {
                    this.map.getMapforOpenLayers().removeControl(tempControls[i]);
                }
            }
            //
        };

        //
        /*
        Function: drawFeature
        
        Draw 레이어에 지정된 데이터를 기반으로 Feature 를 생성하는 함수
        
        Parameters:
        
        data: any - Draw 레이어에 생성할 Feature 데이터로 GeoJson 또는 {OpenLayers.Geometry}
        callback: Function - Feature 생성 후 호출될 콜백 함수.
        style: GeoNURIS.Vector.Style - 생성할 Feature의 스타일
        attributes: Object - 생성할 Feature 에 설정할 속성
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   var gJson = {
        >       'type': 'FeatureCollection',
        >       'features': [
        >           {
        >               'type': 'Feature',
        >               'properties': {
        >               },
        >               'geometry': {
        >                   'type': 'Polygon',
        >                   'coordinates': [
        >                       [
        >                           [ 14167266.033721, 4519690.0730181 ],
        >                           [ 14103670.426196, 4325234.2730876 ],
        >                           [ 14289565.27896, 4353363.0994927 ],
        >                           [ 14167266.033721, 4519690.0730181 ]
        >                       ]
        >                   ]
        >               }
        >           }
        >       ]
        >   }
        >
        >   gmap.controls.DRAWFEATURE.drawFeature(gJson, function(res) { console.log(res); }, { fillColor: "blue", strokeColor: "red" }, { property:'value' });
        
        */
        DrawFeature.prototype.drawFeature = function (data, callback, style, attributes) {
            var features = null;
            if (typeof data == "object" && data != null && data instanceof OpenLayers.Geometry) {
                features = new OpenLayers.Feature.Vector(data, attributes);
            } else if (typeof data == "object" && data != null) {
                var geojson = new OpenLayers.Format.GeoJSON({});
                features = geojson.read(data);
            }

            if (features != null) {
                if (typeof style != "undefined" && style != null) {
                    this.drawLayer.style = style;
                } else {
                    this.drawLayer.style = null;
                }
                this.drawLayer.addFeatures(features);

                if (typeof callback == "function" && callback != null) {
                    callback(features);
                }
            }
        };

        /*
        Function: getGeoJson
        
        현재 Draw 레이어에 추가된 Feature 를 GeoJson으로 반환한다.
        
        Returns:
        
        geojson: string - Draw 레이어에 추가된 Feature 의 geojson
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가);
        >
        >   var gJson = gmap.controls.DRAWFEATURE.getGeoJson();
        >   console.log(gJson);
        
        */
        DrawFeature.prototype.getGeoJson = function () {
            var geojson = new OpenLayers.Format.GeoJSON({});
            var str = geojson.write(this.drawLayer.features, true);
            return str;
        };

        /*
        Function: convertFeatureToGeojson
        
        Feature({OpenLayers.Feature.Vector})를 GeoJson으로 변환하는 함수
        
        Parameters:
        
        feature: OpenLayers.Feature.Vector - GeoJson으로 변환할 Feature
        
        Returns:
        
        gJson: string - 변환된 GeoJson 값.
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가);   // 추가한 Feature의 아이디가 'test'라고 가정한다.
        >
        >   // Feature 반환
        >   var targetFeature = gmap.controls.DRAWFEATURE.getFeature('test');
        >
        >   var gJson = gmap.controls.DRAWFEATURE.convertFeatureToGeojson(targetFeature);
        >   console.log(gJson);
        */
        DrawFeature.prototype.convertFeatureToGeojson = function (feature) {
            var result = "";
            if (typeof feature != "undefined" && feature != null) {
                var geojson = new OpenLayers.Format.GeoJSON({});
                result = geojson.write(feature, true);
            }
            return result;
        };

        /*
        
        Function: getFeatureIDs
        
        Draw레이어에 등록된 모든 Feature의 아이디를 반환하는 함수
        
        Returns:
        
        ids: string[] - 반환된 Features의 아이디 (문자열)배열
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가);   // 추가한 Feature의 아이디가 'test'라고 가정한다.
        >
        >   // 아이디 반환
        >   var ids = gmap.controls.DRAWFEATURE.getFeatureIDs();
        >
        >   for(var key in ids) {
        >       console.log(ids[key]);
        >   }
        
        */
        DrawFeature.prototype.getFeatureIDs = function () {
            return _.pluck(this.drawLayer.features, "id");
        };

        /*
        Function: getFeature
        
        임의 아이디를 기준으로 Draw레이어에 등록된 Feature를 반환하는 함수
        
        Parameters:
        
        id: string - 반환할 Feature의 아이디
        
        Returns:
        
        features: OpenLayers.Feature.Vector - OpenLayers.Feature.Vector 객체
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가);   // 추가한 Feature의 아이디가 'test'라고 가정한다.
        >
        >   var targetFeature = gmap.controls.DRAWFEATURE.getFeature('test');
        >   console.log(targetFeature.id);
        */
        DrawFeature.prototype.getFeature = function (id) {
            if (typeof id == "string" && id != null) {
                return this.drawLayer.getFeatureById(id);
            }

            return null;
        };

        /*
        Function: getFeatures
        
        속성을 기준으로 Draw레이어에 등록된 Feature를 반환하는 함수
        
        Parameters:
        
        >   options: {
        >       attribute?: {
        >           name: string,       // 속성 이름
        >           value: any          // 속성 값
        >       }
        >   }
        
        Returns:
        
        features: OpenLayers.Feature.Vector[] - OpenLayers.Feature.Vector 객체 배열
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가, { property:'value' });
        >
        >   // Feateure 반환
        >   var targetFeatures = gmap.controls.DRAWFEATURE.getFeatures({ attribute: { name: 'property', value: 'value' } });
        >
        >   for(var key in targetFeatures) {
        >       var item = targetFeatures[key];
        >       console.log(item.id);
        >   }
        
        */
        DrawFeature.prototype.getFeatures = function (options) {
            if (typeof options == "object" && options != null) {
                var resultFeatures = this.drawLayer.features;
                var opt = options;
                if (typeof opt.attribute == "object" && opt.attribute != null) {
                    var attr = opt.attribute;
                    if (typeof attr.name == "string" && attr.name != null && typeof attr.value != "undefined" && attr.value != null) {
                        resultFeatures = this.drawLayer.getFeaturesByAttribute(attr.name, attr.value);
                    }
                }

                //
                return resultFeatures;
            }

            return this.drawLayer.features;
        };

        /*
        Function: removeAllFeature
        
        Draw레이어에 등록된 모든 Feature를 제거한다.
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가);
        >
        >   // Feature 제거
        >   gmap.controls.DRAWFEATURE.removeAllFeature();
        */
        DrawFeature.prototype.removeAllFeature = function () {
            this.drawLayer.removeAllFeatures();
        };

        /*
        Function: removeFeature
        
        Draw레이어에 등록된 임의 Feature를 제거한다.
        
        Parameters:
        
        feature: string | OpenLayers.Feature.Vector | OpenLayers.Feature.Vector[] - 제거하고자 하는 Feature의 아이디(string) 또는 Feature(OpenLayers.Feature.Vector)와 Feature배열(OpenLayers.Feature.Vector[])
        
        Example:
        
        >	// GeoNURIS.MAP 객체
        >	var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // Feature 추가
        >   gmap.controls.DRAWFEATURE.drawFeature(... Feature 추가, { property:'value' });  // 추가한 Feature의 아이디가 'test'라고 가정한다.
        >
        >   // case #1. 아이디를 기준으로 Feature제거
        >   gmap.controls.DRAWFEATURE.removeFeature('test');
        >
        >   // case #2. Feature를 기준으로 제거
        >   var targetFeature = gmap.controls.DRAWFEATURE.getFeature('test');
        >   gmap.controls.DRAWFEATURE.removeFeature(targetFeature);
        >
        >   // case #3. Feature배열을 기준으로 제거
        >   var targetFeatures = gmap.controls.DRAWFEATURE.getFeatures({ attribute: { name: 'property', value: 'value' } });
        >   gmap.controls.DRAWFEATURE.removeFeature(targetFeatures);
        
        */
        DrawFeature.prototype.removeFeature = function (feature) {
            if (typeof feature == "string") {
                this.drawLayer.removeFeatures([this.getFeature(feature)]);
            } else if (typeof feature == "object" && feature != null) {
                if (Array.isArray(feature)) {
                    this.drawLayer.removeFeatures(feature);
                } else if (feature instanceof OpenLayers.Feature.Vector) {
                    this.drawLayer.removeFeatures([feature]);
                }
            }
        };
        return DrawFeature;
    })(GeoNURIS.BaseControl);
    GeoNURIS.DrawFeature = DrawFeature;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=DrawFeature.js.map
;
define("DrawFeature", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.SelectFeature
    
    GeoNURIS.Control.SelectFeature 클래스.
    GeoNURIS.Control.DrawFeature 에 의해 그려진 Feature를 선택하는 컨트롤.
    */
    var SelectFeature = (function (_super) {
        __extends(SelectFeature, _super);
        /*
        Constructor: SelectFeature
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function SelectFeature(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */], "select feature");
            this.defaultId = "default";
            this.me = [];
            //
            //UTIL.loadStylesheet("/js/Resource/css/default.css");
        }
        SelectFeature.prototype.convertID = function (id) {
            return "select_feature_" + UTIL.trim(id.toLowerCase());
        };

        /*
        Function: activate
        
        SelectFeature 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >   callback?: Function,        // Feature선택 후 호출될 콜백 함수.
        >   options?: {
        >       box?: boolean;          // 선택모드를 Box로 할 것인지 여부, 생략가능하며 기본값은 false이다.
        >       remove?: boolean;       // 선택된 Feature를 해제할 것인지 여부, 생략가능하며 기본값은 false이다.
        >   },
        >   layer?: any,                // 맵에 등록된 별도의 OpenLayers.Layer.Vector이 있을 경우 지정할 수 있다. 보통은 생략.
        >   id?: string                 // SelectFeature 컨트롤을 지정한 아이디로 활성화 하여 복수의 컨트롤 활성이 가능하다. 생략 가능.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1. 미리 구현된 사용자 정의 스킨으로 해당 기능을 제공
        >gmap.controls.PANZOOMBAR.activate({ noSkin: false });
        >
        >// case #2. OpenLayers 기본 설정 스킨으로 해당 기능을 제공
        >gmap.controls.PANZOOMBAR.activate({ noSkin: true });
        >
        */
        SelectFeature.prototype.activate = function (callback, options, layer, id) {
            console.log("select feature activate");

            var tempCallBack = function (feature) {
                console.log(feature);
            };
            var tempLayer = this.control.DRAWFEATURE.getDrawLayer();
            var tempID = this.defaultId;

            if (typeof layer != "undefined" && layer != null) {
                tempLayer = layer;
            }
            if (typeof id == "string") {
                tempID = id;
            }
            if (typeof callback == "function" && callback != null) {
                tempCallBack = function (feature) {
                    callback(feature);
                };
            }

            //
            var tempBox = false;
            var tempRemove = false;
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = opts.isNotBeforeActivate;
                }
                if (typeof opts.box == "boolean") {
                    tempBox = opts.box;
                }
                if (typeof opts.remove == "boolean") {
                    tempRemove = opts.remove;
                }
            }

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            var tempTarget = _.findWhere(this.me, { id: this.convertID(tempID) });
            if (typeof tempTarget == "undefined") {
                tempTarget = new OpenLayers.Control.SelectFeature(tempLayer, {
                    id: this.convertID(tempID),
                    onSelect: tempCallBack,
                    clickout: true,
                    toggle: false,
                    multiple: false,
                    hover: false,
                    toggleKey: "ctrlKey",
                    multipleKey: "shiftKey",
                    box: tempBox,
                    scope: tempTarget
                });
                tempTarget.events.on({
                    "boxselectionend": function (obj) {
                        if (tempRemove) {
                            if (typeof obj != "undefined" && obj != null) {
                                if (typeof obj.layers != "undefined" && obj.layers != null) {
                                    var layers = obj.layers;
                                    if (Array.isArray(layers)) {
                                        for (var i in layers) {
                                            var layer = layers[i];
                                            if (typeof layer.selectedFeatures != "undefined" && layer.selectedFeatures != null) {
                                                var selectedFeatures = layer.selectedFeatures;
                                                layer.removeFeatures(selectedFeatures);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //
                    }
                });

                this.me.push(tempTarget);
            } else {
                tempTarget.onSelect = function (feature) {
                    tempCallBack(feature);
                };

                //
                tempTarget.box = tempBox;

                tempTarget.deactivate();
                tempTarget.activate();
            }

            //
            if (this.map.getMapforOpenLayers().getControl(this.convertID(tempID)) == null) {
                this.map.getMapforOpenLayers().addControl(tempTarget);
            }

            //
            this.control.NAVIGATION.activate({ all: true, isNotBeforeActivate: true });
            tempTarget.activate();
        };

        /*
        Function: deactivate
        
        SelectFeature 컨트롤을 MAP 에서 해제한다.
        
        Parameters:
        
        id?: string     // 해제할 컨트롤 아이디, 생략 가능하며 생략할 경우 모든 아이디의 컨트롤이 해제된다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// case #1. 임의 아이디('testID')로 등록된 컨트롤 해제.
        >gmap.controls.SELECTFEATURE.deactivate('testID');
        >
        >// case #2. 모든 아이디의 컨트롤 해제.
        >gmap.controls.SELECTFEATURE.deactivate();
        
        */
        SelectFeature.prototype.deactivate = function (id) {
            if (typeof this.me != "undefined" && this.me != null) {
                if (typeof id == "string" && id != null) {
                    //
                    var tempTarget = _.findWhere(this.me, { id: this.convertID(id) });
                    if (typeof tempTarget != "undefined" && tempTarget != null) {
                        if (tempTarget.active) {
                            this.control.NAVIGATION.deactivate();
                            tempTarget.deactivate();
                        }

                        this.map.getMapforOpenLayers().removeControl(tempTarget);
                        this.me = _.difference(this.me, [tempTarget]);
                        console.log("control removed :: " + tempTarget.CLASS_NAME);
                    }
                } else {
                    var isNotActive = true;
                    for (var i in this.me) {
                        this.me[i].deactivate();
                        this.map.getMapforOpenLayers().removeControl(this.me[i]);

                        if (isNotActive) {
                            isNotActive = false;
                            this.control.NAVIGATION.deactivate();
                        }
                    }

                    //
                    this.me = [];
                }
                //
            }
            //
        };
        return SelectFeature;
    })(GeoNURIS.BaseControl);
    GeoNURIS.SelectFeature = SelectFeature;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=SelectFeature.js.map
;
define("SelectFeature", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.WMSGetFeatureInfo
    
    GeoNURIS.Control.WMSGetFeatureInfo 클래스.
    */
    var WMSGetFeatureInfo = (function (_super) {
        __extends(WMSGetFeatureInfo, _super);
        /*
        Constructor: WMSGetFeatureInfo
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function WMSGetFeatureInfo(control, map) {
            _super.call(this, control, map, [0 /* HANDLER */], "wmsgetfeatureinfo");
            this.class_name = OpenLayers.Control.WMSGetFeatureInfo.prototype.CLASS_NAME;
            this.defaultId = "default";
            this.toc = null;

            if (map instanceof GeoNURIS.Map) {
                this.toc = map.toc;
            }

            this.me = [];
        }
        WMSGetFeatureInfo.prototype.convertID = function (id) {
            return "wmsget_feature_info_" + UTIL.trim(id.toLowerCase());
        };

        /*
        method type 검색기능 구현해야 함.
        :: control.WMSGETFEATUREINFO.me[0].getInfoForClick({ xy: { x: e.clientX, y: e.clientY } });
        */
        /*
        *   services?: GeoNURIS.Service[],          // wmsgetinfo를 수행하려는 서비스
        *
        *   options?: {
        *       isNotBeforeActivate?: boolean;
        *       max?: number;
        *       callBack?: function;
        *       layers?: OpenLayers.Layer.WMS[]
        *   },
        *
        *   id?: string                             // 컨트롤을 등록할 아이디.
        */
        /*
        Function: activate
        
        WMSGetFeatureInfo 컨트롤을 MAP 에 적용한다.
        
        Parameters:
        
        >   services?: GeoNURIS.Service[],          // 정보를 가져올 GeoNURIS.Service 배열, 생략할 경우 options의 layers에 OpenLayers.Layer.WMS[] 를 정의해 주어야 한다.
        >                                           // 만약 options의 layers에 값이 설정되어 있을 경우 이 설정은 무시된다.
        >   options?: {
        >       max?: number,                       // 가져올 정보의 최대 갯수
        >       callBack?: function,                // 정보를 가져온 다음 호출될 콜백 함수
        >       layers?: OpenLayers.Layer.WMS[]     // 정보를 가져올 WMS레이어 배열, 생략할 경우 기본 파라메터인 services에 값이 있어야 한다.
        >   },
        >   id?: string                             // WMSGetFeatureInfo컨트롤을 등록할 ID. 생략 가능하며 생략할 경우 기본값이 설정된다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >// case #1. GeoNURIS.Service 를 기준으로 컨트롤 활성
        >gmap.controls.WMSGETFEATUREINFO.activate(gmap.toc.getServices(), { max: 10, callBack: function(res) { console.log(res); } }, 'id1');
        >
        >// case #2. 임의 OpenLayers.Layer.WMS를 기준으로 컨트롤 활성
        >
        >var svcName1 = 'target_service_1';
        >var svcName2 = 'target_service_2';
        >
        >// 서비스 추출
        >var svc1 = gmap.toc.getService(svcName1);
        >var svc2 = gmap.toc.getService(svcName2);
        >
        >// wms레이어 구성
        >var wmsLayers[] = [svc1.getServiceLayer(), svc2.getServiceLayer()];
        >
        >// 컨트롤 활성
        >gmap.controls.WMSGETFEATUREINFO.activate(null, { max: 10, callBack: function(res) { console.log(res); }, layers:wmsLayers }, 'id2');
        
        */
        WMSGetFeatureInfo.prototype.activate = function (services, options, id) {
            console.log("wmsgetfeatureinfo activate");

            var tempLayers = [];
            var tempID = this.defaultId;
            if (typeof services != "undefined" && services != null && Array.isArray(services)) {
                for (var i in services) {
                    var temp = services[i];
                    if (temp instanceof GeoNURIS.Service) {
                        var wmsLayer = temp.getServiceLayer();
                        wmsLayer = wmsLayer.clone();
                        wmsLayer.params.LAYERS = _.pluck(temp.getAllLayers(), "name");
                        tempLayers.push(wmsLayer);
                    }
                }
            }
            if (typeof id == "string") {
                tempID = id;
            }

            var tempMaxFeatures = 50;
            var tempCallBack = null;
            var tempAutoActivate = true;
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.autoActivate == "boolean") {
                    tempAutoActivate = opts.autoActivate;
                }
                if (typeof opts.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = opts.isNotBeforeActivate;
                }
                if (typeof opts.callBack == "function") {
                    tempCallBack = opts.callBack;
                }
                if (typeof opts.max == "number") {
                    tempMaxFeatures = opts.max;
                }
                if (typeof opts.layers != "undefined" && opts.layers != null && Array.isArray(opts.layers)) {
                    tempLayers = opts.layers;
                }
            }

            // -----------------------------------------------------isNotBeforeActivate SS
            if (!tempIsNotBeforeActivate) {
                var types = [0 /* HANDLER */];
                var deactivateTargetControls = this.control.getControlsbyType(types);
                for (var i in deactivateTargetControls) {
                    var target = deactivateTargetControls[i];
                    target.deactivate();
                    console.log(target.name + " deactivated");
                }
            }

            // -----------------------------------------------------isNotBeforeActivate EE
            //
            var tempTarget = _.findWhere(this.me, { id: this.convertID(tempID) });
            if (tempTarget != null) {
                this.deactivate(tempID);
            }

            var tempToc = this.toc;

            //
            tempTarget = new OpenLayers.Control.WMSGetFeatureInfo({
                id: this.convertID(tempID),
                //layers: _.pluck(this.toc.getServices(), "wmsLayer"),
                layers: tempLayers,
                maxFeatures: tempMaxFeatures,
                eventListeners: {
                    getfeatureinfo: function (event) {
                        if (typeof tempCallBack == "function" && tempCallBack != null) {
                            var result = [];
                            var resultObj = {};
                            if (event != null) {
                                if (event.hasOwnProperty("features")) {
                                    var features = event["features"];
                                    for (var i in features) {
                                        var item = features[i];

                                        var url = null;
                                        if (item.hasOwnProperty("url")) {
                                            url = item["url"];

                                            var service = null;
                                            var svcs = _.filter(tempToc.getServices(), function (obj) {
                                                return obj.getURI("wms") == url;
                                            });
                                            if (svcs != null && svcs.length > 0) {
                                                service = svcs[0];
                                            }

                                            if (service != null) {
                                                var fs = null;
                                                if (item.hasOwnProperty("features")) {
                                                    fs = item["features"];

                                                    for (var j in fs) {
                                                        var feature = fs[j];
                                                        if (feature.hasOwnProperty("gml")) {
                                                            var gml = feature["gml"];
                                                            if (gml.hasOwnProperty("featureType")) {
                                                                var l = service.getLayerforName(gml["featureType"]);
                                                                if (l != null && l.length > 0) {
                                                                    feature.layer = l[0];
                                                                    feature.service = service;

                                                                    result.push(feature);
                                                                }
                                                            }
                                                        }
                                                    }

                                                    //
                                                    resultObj[service.getURI("wms")] = fs;
                                                }
                                            }
                                            //
                                        }
                                        //
                                    }
                                }
                                //console.log(result);
                            }
                            tempCallBack({ features: result, object: resultObj });
                        }
                        //
                    }
                },
                //
                autoActivate: false,
                output: 'object',
                infoFormat: 'text/xml',
                drillDown: true,
                handlerOptions: {
                    "click": { pixelTolerance: null }
                },
                vendorParams: {
                    radius: 5
                },
                formatOptions: {
                    "read_wfs:FeatureCollection": function (root) {
                        //console.log("custom");
                        var data = root.parentNode;
                        var gf = new OpenLayers.Format.GML();
                        gf.originalParseFeature = gf.parseFeature;
                        gf.parseFeature = function (node) {
                            //console.log("custom");
                            var feature = gf.originalParseFeature(node);

                            //
                            feature.gml.featureType = node.firstElementChild.localName;
                            feature.gml.featureNS = node.firstElementChild.namespaceURI;

                            feature.fid = parseInt(node.firstElementChild.getAttribute("gml:id"));

                            //node.firstElementChild.localName;
                            return feature;
                        };

                        return gf.read(data);
                    }
                }
            });

            this.me.push(tempTarget);

            //
            if (this.map.getMapforOpenLayers().getControl(this.convertID(tempID)) == null) {
                this.map.getMapforOpenLayers().addControl(tempTarget);
            }

            //
            if (tempAutoActivate) {
                tempTarget.activate();
            }
        };

        /*
        Function: deactivate
        
        GeoNURIS.Control.WMSGetFeatureInfo 컨트롤을 MAP 에서 해제한다.
        
        Parameters:
        
        id?: string | boolean       - 해제하고자 하는 컨트롤 아이디, 생략시 defaultID의 컨트롤을 해제한다. boolean값 true를 설정하면 모든 아이디의 컨트롤이 해제된다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// case #1. defaultID 컨트롤 해제.
        >gmap.controls.WMSGETFEATUREINFO.deactivate();
        >
        >// case #2. 특정 아이디('testID') 컨트롤 해제.
        >gmap.controls.WMSGETFEATUREINFO.deactivate('testID');
        >
        >// case #3. 모든 아이디 컨트롤 해제.
        >gmap.controls.WMSGETFEATUREINFO.deactivate(true);
        
        */
        WMSGetFeatureInfo.prototype.deactivate = function (id) {
            if (typeof this.me != "undefined" && this.me != null) {
                if (typeof id == "string" && id != null) {
                    //
                    var tempTarget = _.findWhere(this.me, { id: this.convertID(id) });
                    if (typeof tempTarget != "undefined" && tempTarget != null) {
                        this.map.getMapforOpenLayers().removeControl(tempTarget);
                        this.me = _.difference(this.me, [tempTarget]);
                        tempTarget.deactivate();
                        tempTarget.destroy();

                        console.log("control removed :: " + tempTarget.CLASS_NAME);
                    }
                } else {
                    if (typeof id == "undefined") {
                        var tempTarget = _.findWhere(this.me, { id: this.convertID(this.defaultId) });
                        if (typeof tempTarget != "undefined" && tempTarget != null) {
                            this.map.getMapforOpenLayers().removeControl(tempTarget);
                            this.me = _.difference(this.me, [tempTarget]);
                            tempTarget.deactivate();
                            tempTarget.destroy();

                            console.log("control removed :: " + tempTarget.CLASS_NAME);
                        }
                    } else if (typeof id == "boolean" && id) {
                        for (var i in this.me) {
                            this.me[i].deactivate();
                            this.map.getMapforOpenLayers().removeControl(this.me[i]);
                            this.me[i].destroy();
                        }

                        //
                        this.me = [];
                    }
                    //
                }
                //
            }
            //
        };
        return WMSGetFeatureInfo;
    })(GeoNURIS.BaseControl);
    GeoNURIS.WMSGetFeatureInfo = WMSGetFeatureInfo;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=WMSGetFeatureInfo.js.map
;
define("WMSGetFeatureInfo", function(){});

/// <reference path="BaseControl.ts" />
/// <reference path="../OpenLayers.d.ts" />
/// <reference path="../jquery.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.Marker
    
    GeoNURIS.Control.Marker 클래스.
    */
    var Marker = (function (_super) {
        __extends(Marker, _super);
        /*
        Constructor: Marker
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function Marker(control, map) {
            var _this = this;
            _super.call(this, control, map, [0 /* HANDLER */, 1 /* EVENT */], "marker");
            this.mouseEventId = "marker_mouse_event";
            this.dragEventId = "marker_drag_event";
            this.isSearchMode = false;
            this.markerGroup = null;
            this.scope_all = "scope-all";
            this.defaultMarkerId = "default";

            this.markerLayer = new OpenLayers.Layer.Vector("markerLayer", {
                rendererOptions: { yOrdering: true },
                renderers: OpenLayers.Layer.Vector.prototype.renderers,
                isBaseLayer: false,
                eventListeners: {
                    featureclick: function (e) {
                        //console.log(e.object.name + " says: " + e.feature.id + " clicked.");
                        //return false;
                        var feature = e.feature;
                        if (feature.hasOwnProperty("OnClick")) {
                            if (typeof feature.OnClick == "function" && feature.OnClick != null) {
                                feature.OnClick(e);
                            }
                        }

                        if (feature.popup != null) {
                            var object = e.object;
                            if (!_.contains(object.map.popups, feature.popup)) {
                                var map = object.map;

                                feature.popup.lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);

                                if (typeof feature.style != "undefined" && feature.style != null) {
                                    var tempStyle = feature.style;

                                    if (typeof tempStyle.graphicXOffset == "number" || typeof tempStyle.graphicYOffset == "number") {
                                        var oriLonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                                        var oriPx = map.getPixelFromLonLat(oriLonlat);

                                        if (typeof tempStyle.graphicXOffset == "number") {
                                            oriPx.x = oriPx.x + (tempStyle.graphicXOffset / 2);
                                        }

                                        if (typeof tempStyle.graphicYOffset == "number") {
                                            oriPx.y = oriPx.y + (tempStyle.graphicYOffset / 2);
                                        }

                                        feature.popup.lonlat = map.getLonLatFromPixel(oriPx);
                                    }
                                }

                                map.addPopup(feature.popup);
                            }
                        }
                    },
                    nofeatureclick: function (e) {
                        //console.log(e.object.name + " says: No feature clicked.");
                    }
                }
            });
            this.markerLayer["originalCalculateInRange"] = this.markerLayer.calculateInRange;
            this.markerLayer.calculateInRange = function () {
                if (_this.map) {
                    var resolution = _this.map.getMapforOpenLayers().getResolution();

                    for (var i in _this.markerGroup) {
                        var item = _this.markerGroup[i];

                        //
                        var inRange = true;
                        if (!item.alwaysInRange) {
                            inRange = ((resolution >= item.resolution.min) && (resolution <= item.resolution.max));
                        }

                        for (var j in item.items) {
                            var marker = item.items[j];

                            var isProcess = true;
                            if (marker.style.hasOwnProperty("isVisible")) {
                                isProcess = marker.style["isVisible"];
                            }

                            if (isProcess) {
                                marker.style["display"] = inRange ? "visible" : "none";
                            }
                        }
                    }
                }
                return true;
            };

            if (this.map.getMapforOpenLayers().getLayer(this.markerLayer.id) == null) {
                this.map.getMapforOpenLayers().addLayer(this.markerLayer);
                this.markerLayer.setZIndex(5000);
            }

            this.markerGroup = [];
            this.markerGroup.push({
                alwaysInRange: true,
                id: this.defaultMarkerId,
                items: [],
                resolution: {
                    min: this.markerLayer.minResolution,
                    max: this.map.getMapforOpenLayers().getMaxResolution()
                }
            });
        }
        /*
        Function: enableDrag
        
        마커의 드래그 활성여부를 제어하는 함수.
        
        Parameters:
        
        isDrag: boolean - 마커 드래그 활성 여부.
        markerGroupId?: string - 드래그 활성여부를 지정할 그룹아이디.
        
        Example:
        
        >   var gmap = new GeoNURIS.Map("map", ...);
        >
        >   // case #1. 임의 아이디를 기준으로 하는 마커그룹의 드래그를 활성화
        >   gmap.controls.MARKER.enableDrag(true, 'testID');
        >
        >   // case #2. 모든 아이디를 대상으로 하는 마커의 드래그 활성화
        >   gmap.controls.MARKER.enableDrag(true, 'scope-all');
        
        */
        Marker.prototype.enableDrag = function (isDrag, markerGroupId) {
            var targetControl = this.map.getMapforOpenLayers().getControl(this.dragEventId);
            if (isDrag) {
                this.control.MOUSE.CLICK.deactivate(this.mouseEventId);
                if (this.isSearchMode) {
                    this.isSearchMode = false;
                    this.control.MEASURE.deactivate();
                }

                if (typeof targetControl == "undefined" || targetControl == null) {
                    targetControl = new OpenLayers.Control.DragFeature(this.markerLayer, {
                        id: this.dragEventId,
                        onComplete: function (feature, pixel) {
                            var bounds = feature.geometry.getBounds();
                            var answer = "bottom: " + bounds.bottom + "\n";
                            answer += "left: " + bounds.left + "\n";
                            answer += "right: " + bounds.right + "\n";
                            answer += "top: " + bounds.top + "\n";

                            if (feature.popup != null) {
                                var ll = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
                                if (typeof feature.popup.lonlat == "object" && feature.popup.lonlat != null) {
                                    if (typeof feature.popup.lonlat.lon == "number" && typeof feature.popup.lonlat.lat == "number") {
                                        feature.popup.lonlat.lon = ll.lon;
                                        feature.popup.lonlat.lat = ll.lat;

                                        feature.popup.updatePosition();
                                    }
                                }
                            }

                            console.log({ tag: "onComplete", f: feature, p: pixel });
                        }
                    });

                    //
                    this.map.getMapforOpenLayers().addControl(targetControl);
                }

                //
                //
                var targetMarkers = null;
                if (typeof markerGroupId == "string") {
                    var markerInfo = this.getMarkerGroup(markerGroupId);
                    if (markerInfo != null) {
                        targetMarkers = markerInfo.items;
                    }
                }

                targetControl.onStart = function (feature, pixel) {
                    //console.log({ tag: "onStart", f: feature, p: pixel });
                    if (targetMarkers != null) {
                        if (!_.contains(targetMarkers, feature)) {
                            targetControl.cancel();
                        }
                    }
                };

                targetControl.activate();
            } else {
                if (typeof targetControl != "undefined" && targetControl != null) {
                    targetControl.deactivate();
                    this.map.getMapforOpenLayers().removeControl(targetControl);
                }
            }
        };

        /*
        Function: activate
        
        Marker 컨트롤을 MAP 에 적용한다.
        적용시 파라메터의 mode에 따라 add / drag / search 가 가능하다.
        
        Parameters:
        
        >   mode: string,                       // mode의 값에 따라 options의 적용 값이 달라진다. mode는 add / drag / search
        >
        >   // case #1. mode 값이 search일 경우.
        >   options?: {
        >       type: string,                   // search 방법으로 box / polygon / regular 를 지원한다.
        >       searchCompleted?: Function,     // search 완료 후, 호출될 콜백함수. 검색결과를 반환한다.
        >       attribute?: {
        >           name: string,               // search 시 조건으로 사용할 속성이름
        >           value: any                  // search 시 조건으로 사용할 속성값
        >       },
        >       markerGroupId?: string          // search 에 적용될 그룹ID, scope-all 일 경우 전체 marker를 대상으로 한다.
        >   }
        >
        >   // case #2. mode 값이 drag일 경우.
        >   options?: {
        >       enable: boolean,                // drag 활성여부
        >       markerGroupId?: string          // drag 에 적용될 그룹ID, scope-all 일 경우 전체 marker를 대상으로 한다.
        >   }
        >
        >   // case #3. mode 값이 add일 경우.
        >   options?: {
        >       click?: Function,                       // add를 위해 마우스 이벤트(click)가 발생할 때, 호출될 콜백 함수.
        >       added?: Function,                       // 마커 add후 호출될 콜백 함수.
        >       right?: Function,                       // 추가할 마커에 마우스 이벤트(right button click)시 호출될 콜백 함수.
        >       attributes?: Object,                    // 마커에 부여할 속성
        >       icon?: string,                          // 마커 아이콘(이미지)
        >       icon?: {                                // 마커 심볼 아이콘
        >           fillColor : "#ffcc66",
        >           strokeColor: "#ff9933",
        >           strokeWidth: 2
        >       }
        >       pointRadius?: number,                   // 마커 크기
        >       offSet?: {                              // 마커 등록시 마우스 클릭 포인트로 부터의 offset
        >           x?: number,
        >           y?: number
        >       },
        >       label?: {                               // 마커 라벨
        >           text?: string,
        >           size?: number,
        >           offSet?: {
        >               x?: number,
        >               y?: number
        >           },
        >           font?: {
        >               weight?: string,
        >               color?: string,
        >               outline?: {
        >                   color?: string,
        >                   width?: number
        >               }
        >           }
        >       },
        >       popup?: {                               // 마커 팝업
        >           content: any,                       // 팝업 내용
        >           type?: string,                      // 팝업 종류로 popup / anchored / framedcloud 를 지원한다.
        >           options?: {
        >               isClose?: boolean,              // 팝업 close 지원 여부
        >               closeCallback?: Function,       // 팝업 close 시 호출될 콜백 함수
        >               size?: {                        // 팝업 크기
        >                   width: number,
        >                   height: number
        >               }
        >           }
        >       },
        >       markerGroupId?: string                  // 추가될 마커에 적용될 그룹ID
        >   }
        
        Example:
        
        >   var gmap = new GeoNURIS.Map("map", ...);
        >
        >   // case #1. (이미지)마커(+라벨+팝업) 등록하기
        >   gmap.controls.MARKER.activate(
        >       'add',
        >       {
        >           icon:'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png',
        >           pointRadius:20,
        >           offSet:{y:-20},
        >           label:{
        >               text:'라벨',
        >               size:13,
        >               offSet:{y:50},
        >               font:{
        >                   weight:'bold',
        >                   outline:{
        >   	                color:'white',
        >   	                width:5
        >                   }
        >               }
        >           },
        >           popup:{
        >               content:'팝업',
        >               type:'framedcloud',
        >               options:{isClose:true}
        >           },
        >           markerGroupId: 'testImageMarker'
        >       }
        >   );
        >
        >   // case #2. (심볼)마커(+속성) 등록하기
        >   gmap.controls.MARKER.activate(
        >       'add',
        >       {
        >           icon:{
        >               fillColor:'#ffcc66',
        >               strokeColor:'#ff9933',
        >               strokeWidth:2
        >           },
        >           attributes: {
        >               property1:'value1'
        >           },
        >           pointRadius:20,
        >           markerGroupId: 'testSymbolMarker'
        >       }
        >   );
        >
        >   // case #3. 마커 드래그 활성하기
        >   gmap.controls.MARKER.activate(
        >       'drag',
        >       {
        >           enable:true,
        >           markerGroupId: 'testSymbolMarker'   // 'scope-all'일 경우 모든 마커를 대상으로 한다.
        >       }
        >   );
        >
        >   // case #4. 마커 검색하기
        >   gmap.controls.MARKER.activate(
        >       'search',
        >       {
        >           type:'box',
        >           searchCompleted:function(evt) { console.log(evt); },
        >           markerGroupId:'testSymbolMarker'   // 'scope-all'일 경우 모든 마커를 대상으로 한다.
        >       }
        >   );
        >
        >   // case #5. 마커 속성조건으로 검색하기
        >   gmap.controls.MARKER.activate(
        >       'search',
        >       {
        >           type:'box',
        >           searchCompleted:function(evt) { console.log(evt); },
        >           attribute: {
        >               name:'property1',
        >               value:'value1'
        >           },
        >           markerGroupId:'testSymbolMarker'   // 'scope-all'일 경우 모든 마커를 대상으로 한다.
        >       }
        >   );
        
        */
        Marker.prototype.activate = function (mode, options) {
            var _this = this;
            console.log("marker activate");

            var tempMode = null;
            if (typeof mode == "string") {
                tempMode = UTIL.trim(mode.toLowerCase());
            }

            //
            var tempType = "box";
            var tempSearchCompleted = null;
            var tempAttribute = null;

            //
            var tempEnabelDrag = false;

            //
            var tempOnClick = null;
            var tempOnAdded = null;
            var tempOnRight = null;
            var tempAttributes = null;
            var tempPopup = null;
            var tempPointRadius = 20;
            var tempIcon = "/js/Resource/Img/marker_blue.png";
            var tempOptions = {};

            var tempMarkerGroupId = this.defaultMarkerId;
            var tempIsNotBeforeActivate = false;
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.markerGroupId == "string") {
                    tempMarkerGroupId = opts.markerGroupId;
                }
                if (typeof opts.isNotBeforeActivate == "boolean") {
                    tempIsNotBeforeActivate = opts.isNotBeforeActivate;
                }
                if (typeof opts.type == "string") {
                    tempType = opts.type;
                }
                if (typeof opts.searchCompleted == "function" && opts.searchCompleted != null) {
                    tempSearchCompleted = opts.searchCompleted;
                }
                if (typeof opts.attribute == "object" && opts.attribute != null) {
                    var attr = opts.attribute;
                    if (typeof attr.name == "string" && attr.name != null && typeof attr.value != "undefined" && attr.value != null) {
                        tempAttribute = attr;
                    }
                }
                if (typeof opts.enable == "boolean") {
                    tempEnabelDrag = opts.enable;
                }
                if (typeof opts.click == "function" && opts.click != null) {
                    tempOnClick = opts.click;
                }
                if (typeof opts.added == "function" && opts.added != null) {
                    tempOnAdded = opts.added;
                }
                if (typeof opts.right == "function" && opts.right != null) {
                    tempOnRight = opts.right;
                }
                if (typeof opts.attributes == "object" && opts.attributes != null) {
                    tempAttributes = opts.attributes;
                }
                if (typeof opts.popup == "object" && opts.popup != null) {
                    tempPopup = opts.popup;
                }
                if (typeof opts.icon != "undefined") {
                    tempIcon = opts.icon;
                }
                if (typeof opts.pointRadius == "number") {
                    tempPointRadius = opts.pointRadius;
                }
                if (typeof opts.offSet == "object" && opts.offSet != null) {
                    tempOptions["offSet"] = opts.offSet;
                }
                if (typeof opts.label == "object" && opts.label != null) {
                    tempOptions["label"] = opts.label;
                }
            }

            // ========================================
            if (tempMode != null) {
                if (tempMode == "search" || tempMode == "s") {
                    this.control.MOUSE.CLICK.deactivate(this.mouseEventId);
                    this.enableDrag(false);

                    //
                    this.isSearchMode = true;

                    //
                    var targetMarkers = null;
                    if (UTIL.trim(tempMarkerGroupId.toLowerCase()) != this.scope_all) {
                        var markerInfo = this.getMarkerGroup(tempMarkerGroupId);
                        if (typeof markerInfo != "undefined" && markerInfo != null) {
                            targetMarkers = markerInfo.items;
                        }
                    }

                    //
                    var tempFncEnd = function (evt) {
                        //evt.geometry.intersects(geom)
                        var layer = _this.markerLayer;
                        var sourceFeatures = layer.features;
                        if (tempAttribute != null) {
                            sourceFeatures = layer.getFeaturesByAttribute(tempAttribute.name, tempAttribute.value);
                        }

                        if (targetMarkers != null) {
                            sourceFeatures = _.intersection(sourceFeatures, targetMarkers);
                        }

                        var resultFeatures = [];
                        for (var i in sourceFeatures) {
                            var srcFeature = sourceFeatures[i];
                            var srcGeom = srcFeature.geometry;
                            if (typeof srcGeom["intersects"] == "function") {
                                if (srcGeom["intersects"](evt.geometry)) {
                                    resultFeatures.push(srcFeature);
                                }
                            }
                        }

                        //
                        //console.log(resultFeatures);
                        if (tempSearchCompleted != null) {
                            tempSearchCompleted(resultFeatures);
                        }
                    };

                    //
                    this.control.MEASURE.activate({
                        type: tempType, isNotBeforeActivate: true, persist: false,
                        fncEnd: tempFncEnd
                    });
                } else if (tempMode == "drag" || tempMode == "d") {
                    if (UTIL.trim(tempMarkerGroupId.toLowerCase()) == this.scope_all) {
                        tempMarkerGroupId = null;
                    }

                    this.enableDrag(tempEnabelDrag, tempMarkerGroupId);
                } else if (tempMode == "add" || tempMode == "a") {
                    //var tempStyle = this.createStyle(tempIcon, tempPointRadius, tempOptions);
                    // -----------------------------------------------------isNotBeforeActivate SS
                    if (!tempIsNotBeforeActivate) {
                        var types = [0 /* HANDLER */];
                        var deactivateTargetControls = this.control.getControlsbyType(types);
                        for (var i in deactivateTargetControls) {
                            var target = deactivateTargetControls[i];
                            target.deactivate();
                            console.log(target.name + " deactivated");
                        }
                    }

                    // -----------------------------------------------------isNotBeforeActivate EE
                    //
                    this.enableDrag(false);
                    if (this.isSearchMode) {
                        this.isSearchMode = false;
                        this.control.MEASURE.deactivate();
                    }

                    //
                    var mine = this;
                    var map = this.map.getMapforOpenLayers();

                    //var tempPopup = mine.createPopup("hi", "f", "pp", { isClose: true, closeCallback: function (e) { console.log("close!!"); } });
                    //var style = this.createStyle("https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png", 20);
                    //
                    this.control.MOUSE.CLICK.activate(this.mouseEventId, function (e) {
                        var lonlat = map.getLonLatFromPixel(e.xy);
                        var tempStyle = mine.createStyle(tempIcon, tempPointRadius, tempOptions);
                        mine.addMarker(lonlat.lon, lonlat.lat, tempStyle, {
                            popup: tempPopup,
                            attributes: tempAttributes,
                            click: tempOnClick,
                            added: tempOnAdded,
                            right: tempOnRight,
                            markerGroupId: tempMarkerGroupId
                        });
                    });
                }
                //
            }
            //
        };

        /*
        Function: getMarkerGroupIDs
        
        마커그룹의 아이디를 반환하는 함수
        
        Returns:
        
        groupIds: string[] - 마커그룹의 아이디(문자열) 배열
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커그룹의 아이디를 가져온다.
        >   var ids = gmap.controls.MARKER.getMarkerGroupIDs();
        >
        >   // 마커그룹의 아이디를 출력한다.
        >   for(var key in ids) {
        >       console.log(ids[key]);
        >   }
        
        */
        Marker.prototype.getMarkerGroupIDs = function () {
            return _.pluck(this.markerGroup, "id");
        };

        /*
        Function: getMarkerGroup
        
        임의 아이디에 해당하는 마커그룹을 반환하는 함수.
        
        Parameters:
        
        id: string - 반환할 마커그룹 아이디.
        
        Returns:
        
        >   MarkerGroup : {
        >       id: string;                                 // 마커그룹 아이디
        >       items: OpenLayers.Feature.Vector[];         // 마커그룹에 소속된 마커객체 배열(OpenLayers.Feature.Vector[])
        >       alwaysInRange: boolean;                     // 지정된 범위와 상관없이 무조건 표시할 것인지 여부
        >       resolution: { min: number; max: number };   // 마커그룹의 해상도
        >   }
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   var markerGroup = gmap.controls.MARKER.getMarkerGroup('testGroup');
        >
        >   console.log(markerGroup.id);
        */
        Marker.prototype.getMarkerGroup = function (id) {
            var markerGroup = _.findWhere(this.markerGroup, { id: UTIL.trim(id.toLowerCase()) });
            if (typeof markerGroup == "undefined") {
                markerGroup = null;
            }

            return markerGroup;
        };

        /*
        Function: setAlwaysInRange
        
        임의 아이디를 기준으로 하는 마커그룹의 alwaysInRange를 지정하는 함수
        
        Parameters:
        
        alwaysInRange: boolean - 설정 값.
        markerGroupId: string - 설정 값을 적용할 마커그룹 아이디.
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   // 마커 설정
        >   gmap.controls.MARKER.setAlwaysInRange(true, 'testGroup');
        
        */
        Marker.prototype.setAlwaysInRange = function (alwaysInRange, markerGroupId) {
            var tempId = this.defaultMarkerId;
            if (typeof markerGroupId == "string") {
                tempId = markerGroupId;
            }

            var markerGroup = this.getMarkerGroup(tempId);
            if (markerGroup != null) {
                markerGroup.alwaysInRange = alwaysInRange;
            }

            this.markerLayer.redraw();
        };

        /*
        Function: setResolution
        
        임의 아이디를 기준으로 하는 마커그룹의 해상도를 지정하는 함수
        
        Parameters:
        
        max: max - 최대 해상도 값.
        min: max - 최소 해상도 값.
        markerGroupId: string - 설정 값을 적용할 마커그룹 아이디.
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   // 마커 설정
        >   gmap.controls.MARKER.setResolution(128, 16, 'testGroup');
        
        */
        Marker.prototype.setResolution = function (max, min, markerGroupId) {
            var tempId = this.defaultMarkerId;
            if (typeof markerGroupId == "string") {
                tempId = markerGroupId;
            }

            var markerGroup = this.getMarkerGroup(tempId);
            if (markerGroup != null) {
                if (typeof min == "number" && min != null) {
                    markerGroup.resolution.min = min;
                }
                if (typeof max == "number" && max != null) {
                    markerGroup.resolution.max = max;
                }
            }

            this.markerLayer.redraw();
        };

        /*
        Function: removeAllMarker
        
        임의 아이디 또는 전체 마커를 제거하는 함수
        
        Parameters:
        
        markerGroupId: string - 설정 값을 적용할 마커그룹 아이디, 전체 마커를 제거할 경우 'scope-all'을 설정한다.
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   // case #1. 임의 마커그룹 아이디에 해당하는 마커 제거
        >   gmap.controls.MARKER.removeAllMarker('testGroup');
        >
        >   // case #2. 모든 마커 제거
        >   gmap.controls.MARKER.removeAllMarker('scope-all');
        
        */
        Marker.prototype.removeAllMarker = function (markerGroupId) {
            var tempId = this.defaultMarkerId;
            if (typeof markerGroupId == "string") {
                tempId = markerGroupId;
            }

            // 모든 마커를 제거할 경우
            if (UTIL.trim(tempId.toLowerCase()) == this.scope_all) {
                this.removeMarker(this.getMarkers());
            } else {
                // 마커를 제거하되, 선택된 GroupID에 해당하는 마커만 지울 경우
                // 지정된 GroupID에 해당하는 마커그룹을 추출한다.
                var markerGroup = this.getMarkerGroup(tempId);

                // 추출한 마커 그룹이 존재한다면,
                if (markerGroup != null) {
                    // 제거!
                    this.removeMarker(markerGroup.items);
                }
            }
        };

        /*
        Function: removeMarker
        
        마커 아이디 또는 마커, 마커배열을 기준으로 맵에 등록된 마커를 제거한다.
        
        Parameters:
        
        marker: string | OpenLayers.Feature.Vector | OpenLayers.Feature.Vector[] - 마커 아이디(string), 객체(OpenLayers.Feature.Vector), 객체배열(OpenLayers.Feature.Vector[])
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록);  // 등록한 마커의 아이디가 'test'라고 가정한다.
        >
        >   // 마커 제거
        >   gmap.controls.MARKER.removeMarker('test');
        
        */
        Marker.prototype.removeMarker = function (marker) {
            var removeTargetFeature = [];

            // target이 string일 경우, 즉 Marker의 ID일 경우
            if (typeof marker == "string") {
                // 해당 마커를 찾아 temp에 저장하고,
                var temp = this.getMarker(marker);

                // removeTargetFeature 배열에 넣는다.
                removeTargetFeature.push(temp);

                // markerLayer에서 해당 마커를 제거한다.
                this.markerLayer.removeFeatures([temp]);
            } else if (typeof marker == "object" && marker != null) {
                // target이 배열일 경우
                if (Array.isArray(marker)) {
                    // removeTargetFeature 배열에 정의한다.
                    removeTargetFeature = marker;

                    // markerLayer에서 해당 마커를 제거한다.
                    this.markerLayer.removeFeatures(marker);
                } else if (marker instanceof OpenLayers.Feature.Vector) {
                    // target 이 OpenLayers.Feature.Vector일 경우
                    // removeTargetFeature 배열에 넣는다.
                    removeTargetFeature.push(marker);

                    // markerLayer에서 해당 마커를 제거한다.
                    this.markerLayer.removeFeatures([marker]);
                }
            }

            var removeMarkerGroup = [];

            for (var i in this.markerGroup) {
                var markerGroup = this.markerGroup[i];
                markerGroup.items = _.difference(markerGroup.items, removeTargetFeature);
                if (markerGroup.items.length == 0) {
                    removeMarkerGroup.push(markerGroup);
                }
            }

            for (var j in removeTargetFeature) {
                var popup = removeTargetFeature[j].popup;
                if (typeof popup != "undefined" && popup != null) {
                    this.map.getMapforOpenLayers().removePopup(popup);
                }
            }

            this.markerGroup = _.difference(this.markerGroup, removeMarkerGroup);
        };

        /*
        Function: getMarkerIDs
        
        임의 아이디를 기준으로 하는 마커그룹에 속한 마커의 아이디를 반환하는 함수
        
        Parameters:
        
        markerGroupId: string - 반환할 마커아이디를 포함하고 있는 그룹마커 아이디.
        
        Returns:
        
        markerIDs: string[] - 마커아이디 배열
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   var ids = gmap.controls.MARKER.getMarkerIDs('testGroup');
        >
        >   for(var key in ids) {
        >       console.log(ids[key]);
        >   }
        */
        Marker.prototype.getMarkerIDs = function (markerGroupId) {
            var tempId = this.scope_all;
            if (typeof markerGroupId == "string") {
                tempId = markerGroupId;
            }

            if (UTIL.trim(tempId.toLowerCase()) == this.scope_all) {
                return _.pluck(this.markerLayer.features, "id");
            } else {
                var markerGroup = this.getMarkerGroup(tempId);
                if (markerGroup != null) {
                    return _.pluck(markerGroup.items, "id");
                }
            }
        };

        /*
        Function: getMarker
        
        임의 아이디를 기준으로 하는 마커를 반환하는 함수
        
        Parameters:
        
        id: string - 반환할 마커의 아이디
        
        Returns:
        
        marker: OpenLayers.Feature.Vector - 마커객체
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록);  // 등록한 마커의 아이디가 'test'라고 가정한다.
        >
        >   // 아이디를 이용해 마커를 반환받는다.
        >   var marker = gmap.controls.MARKER.getMarker('test');
        >   console.log(marker.id);
        
        */
        Marker.prototype.getMarker = function (id) {
            if (typeof id == "string" && id != null) {
                return this.markerLayer.getFeatureById(id);
            }

            return null;
        };

        /*
        Function: getMarkerbyAttribute
        
        속성을 기준으로 마커를 반환하는 함수
        
        Parameters:
        
        attrName: string - 속성 이름
        attrValue: any - 속성 값
        markerGroupId: string - 마커그룹 아이디, 생략가능.
        
        Returns:
        
        markers: OpenLayers.Feature.Vector[] - 마커객체 배열
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 임의 좌표를 정의한다.
        >   var px = new OpenLayers.Pixel(595,317);
        >   var templl = gmap.map.getLonLatFromPixel(px);
        >
        >   // 마커를 추가한다.
        >   gmap.controls.MARKER.addMarker(
        >       templl.lon, templl.lat,
        >       gmap.controls.MARKER.createStyle('https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png', 20),
        >       {
        >           attributes: { tempid: 'id1' },
        >           markerGroupId: 'testMarker'
        >       }
        >   );
        >
        >   // 속성을 이용해 마커를 반환받는다.
        >   var markers = gmap.controls.MARKER.getMarkerbyAttribute('tempid', 'id1', 'testMarker');
        >
        >   // 반환받은 마커를 확인한다.
        >   for(var key in markers) {
        >       var item = markers[key];
        >       console.log(item.id);
        >   }
        
        */
        Marker.prototype.getMarkerbyAttribute = function (attrName, attrValue, markerGroupId) {
            var resultFeatures = this.markerLayer.getFeaturesByAttribute(attrName, attrValue);

            if (typeof markerGroupId == "string" && markerGroupId != null) {
                var markerGroup = this.getMarkerGroup(markerGroupId);
                if (markerGroup != null) {
                    resultFeatures = _.intersection(resultFeatures, markerGroup.items);
                }
            }

            return resultFeatures;
        };

        /*
        Function: setMarkerVisiblebyGroup
        
        임의 마커그룹아이디를 기준으로 마커표시 여부를 일괄적용하는 함수
        
        Parameters:
        
        isVisible: boolean - 마커표시 여부.
        markerGroupId: string - 값을 적용하려는 마커그룹 아이디.
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록, { markerGroupId: 'testGroup' });
        >
        >   // case #1. 마커표시를 비활성화 한다.
        >   gmap.controls.MARKER.setMarkerVisiblebyGroup('testGroup', false);
        >
        >   // case #2. 마커표시를 활성화 한다.
        >   gmap.controls.MARKER.setMarkerVisiblebyGroup('testGroup', true);
        
        */
        Marker.prototype.setMarkerVisiblebyGroup = function (isVisible, markerGroupId) {
            var tempMarkerGroupId = this.defaultMarkerId;
            if (typeof markerGroupId == "string" && markerGroupId != null) {
                tempMarkerGroupId = markerGroupId;
            }

            var markerGroup = this.getMarkerGroup(tempMarkerGroupId);
            if (markerGroup != null) {
                this.setMarkerVisible(markerGroup.items, isVisible);
            }
        };

        /*
        Function: setMarkerVisible
        
        마커 아이디 또는 마커, 마커배열을 기준으로 표시여부를 적용할 함수
        
        Parameters:
        
        marker: string | string[] | OpenLayers.Feature.Vector | OpenLayers.Feature.Vector[] - 마커 아이디(string), 마커 아이디 배열(string[]), 객체(OpenLayers.Feature.Vector), 객체배열(OpenLayers.Feature.Vector[])
        isVisible: boolean - 마커표시 여부.
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 마커 등록
        >   gmap.controls.MARKER.addMarker(... 마커 등록);  // 등록한 마커 아이디가 'test' 라고 가정한다.
        >
        >   // case #1. 마커표시를 비활성화 한다.
        >   gmap.controls.MARKER.setMarkerVisible('test', false);
        >
        >   // case #2. 마커표시를 활성화 한다.
        >   gmap.controls.MARKER.setMarkerVisible('test', true);
        */
        Marker.prototype.setMarkerVisible = function (marker, isVisible) {
            if (typeof marker != "undefined" && marker != null && typeof isVisible == "boolean" && isVisible != null) {
                if (Array.isArray(marker)) {
                    for (var i in marker) {
                        var item = marker[i];
                        if (typeof item == "string") {
                            this.getMarker(item).style["display"] = isVisible ? "visible" : "none";
                            this.getMarker(item).style["isVisible"] = isVisible;
                        } else {
                            item.style["display"] = isVisible ? "visible" : "none";
                            item.style["isVisible"] = isVisible;
                        }
                    }
                } else {
                    if (typeof marker == "string") {
                        this.getMarker(marker).style["display"] = isVisible ? "visible" : "none";
                        this.getMarker(marker).style["isVisible"] = isVisible;
                    } else {
                        marker.style["display"] = isVisible ? "visible" : "none";
                        marker.style["isVisible"] = isVisible;
                    }
                }

                //
                // resolution에 따라 보지이 말아야 할 녀석들은 안보이게..
                if (isVisible) {
                    var resolution = this.map.getMapforOpenLayers().getResolution();
                    for (var i in this.markerGroup) {
                        var markerGroup = this.markerGroup[i];

                        //
                        if (!markerGroup.alwaysInRange) {
                            var inRange = ((resolution >= markerGroup.resolution.min) && (resolution <= markerGroup.resolution.max));
                            if (!inRange) {
                                for (var j in markerGroup.items) {
                                    var marker = markerGroup.items[j];
                                    marker.style["display"] = "none";
                                }
                            }
                        }
                    }
                }

                this.markerLayer.redraw();
            }
        };

        /*
        Function: getMarkers
        
        속성 및 Geometry 등의 조건등을 이용하여 마커를 반환하는 함수
        
        Parameters:
        
        >   options {
        >       attribute?: {                           // 속성 조건
        >           name: string,                       // 속성 이름
        >           value: any,                         // 속성 값
        >       },
        >       geom?: OpenLayers.Geometry.Geometry,    // Geometry 조건
        >       markerGroupId?: string                  // 마커그룹 아이디
        >   }
        
        Returns:
        
        markers: OpenLayers.Feature.Vector[] - 마커객체 배열
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 임의 좌표를 정의한다.
        >   var px = new OpenLayers.Pixel(595,317);
        >   var templl = gmap.map.getLonLatFromPixel(px);
        >
        >   // 마커를 추가한다.
        >   gmap.controls.MARKER.addMarker(
        >       templl.lon, templl.lat,
        >       gmap.controls.MARKER.createStyle('https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png', 20),
        >       {
        >           attributes: { tempid: 'id1' },
        >           markerGroupId: 'testMarker'
        >       }
        >   );
        >
        >   // 속성정보를 이용해 마커를 반환받는다.
        >   var markers = gmap.controls.MARKER.getMarkers({
        >       attribute: {
        >           name: 'tempid',
        >           value : 'id1'
        >       }
        >   });
        >
        >   // 반환받은 마커를 확인한다.
        >   for(var key in markers) {
        >       var item = markers[key];
        >       console.log(item.id);
        >   }
        */
        Marker.prototype.getMarkers = function (options) {
            var targetGeom = null;
            if (typeof options == "object" && options != null) {
                var resultFeatures = this.markerLayer.features;
                var opts = options;
                if (typeof opts.attribute == "object" && opts.attribute != null) {
                    var attr = opts.attribute;
                    if (typeof attr.name == "string" && attr.name != null && typeof attr.value != "undefined" && attr.value != null) {
                        resultFeatures = this.markerLayer.getFeaturesByAttribute(attr.name, attr.value);
                    }
                }

                if (typeof opts.markerGroupId == "string" && opts.markerGroupId != null) {
                    var markerGroupId = opts.markerGroupId;
                    if (markerGroupId != this.scope_all) {
                        var markerGroup = this.getMarkerGroup(markerGroupId);
                        if (markerGroup != null) {
                            resultFeatures = _.intersection(resultFeatures, markerGroup.items);
                        }
                    }
                }

                if (typeof opts.geom != "undefined" && opts.geom != null) {
                    targetGeom = opts.geom;
                    var tempFeatures = [];
                    for (var i in resultFeatures) {
                        var srcFeature = resultFeatures[i];
                        var srcGeom = srcFeature.geometry;

                        if (typeof srcGeom["intersects"] == "function") {
                            if (srcGeom["intersects"](targetGeom)) {
                                tempFeatures.push(srcFeature);
                            }
                        }
                    }
                    return tempFeatures;
                }

                //
                return resultFeatures;
            }

            return this.markerLayer.features;
        };

        /*
        Function: addMarker
        
        마커를 등록하는 함수.
        
        Parameters:
        
        >   lon: number,                                // 마커위치 lon 값.
        >   lat: number,                                // 마커위치 lat 값.
        >   style: GeoNURIS.Vector.Style,               // 마커 스타일
        >   options?: {                                 // 마커 추가 옵션
        >       popup?: {                               // 팝업 옵션
        >           content: any,                       // 팝업 내용
        >           type?: string,                      // 팝업 종류로 popup / anchored / framedcloud 를 지원한다.
        >           options?: {                         // 팝업 추가 옵션
        >               isClose?: boolean,              // 팝업 종료기능 지원
        >               closeCallback?: Function,       // 팝업 종료시 호출될 콜백 함수
        >               lonlat?: {                      // 팝업 위치
        >                   lon: number,
        >                   lat: number
        >               },
        >               size?: {                        // 팝업 크기
        >                   width: number,
        >                   height: number
        >               }
        >           }
        >       },
        >       attributes?: Object,                    // 마커 속성
        >       click?: Function,                       // 마커에 대한 마우스 클릭(click) 이벤트 발생시 호출될 콜백 함수
        >       added?: Function,                       // 마커가 맵에 추가 되었을 때, 호출될 콜백 함수
        >       right?: Function,                       // 마커에 대한 마우스 우클릭(right) 이벤트 발생시 호출될 콜백 함수
        >       markerGroupId?: string                  // 마커가 소속될 그룹 아이디
        >   }
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 임의 좌표를 정의한다.
        >   var px = new OpenLayers.Pixel(595,317);
        >   var templl = gmap.map.getLonLatFromPixel(px);
        >
        >   // 마커를 추가한다.
        >   gmap.controls.MARKER.addMarker(
        >       templl.lon,
        >       templl.lat,
        >       gmap.controls.MARKER.createStyle('https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png', 20),
        >       {
        >           popup: {
        >               content: '팝업',
        >               type: 'framedcloud',
        >               options: {
        >                   isClose: true
        >               }
        >           },
        >           click: function(evt) { console.log(evt); },
        >           markerGroupId: 'testMarker'
        >       }
        >   );
        
        */
        Marker.prototype.addMarker = function (lon, lat, style, options) {
            var tempAttributes = null;
            var tempOnClick = null;
            var tempOnAdded = null;
            var tempOnRight = null;
            var tempPopup = null;
            var tempId = this.defaultMarkerId;
            if (typeof options == "object" && options != null) {
                var opts = options;
                if (typeof opts.markerGroupId == "string" && opts.markerGroupId != null) {
                    tempId = opts.markerGroupId;
                }
                if (typeof opts.popup == "object" && opts.popup != null) {
                    var popup = opts.popup;
                    if (typeof popup.content != "undefined" && popup.content != null) {
                        var type = popup.type;
                        var content = null;
                        var id = null;
                        var popupOpt = null;

                        if (typeof popup.content != "undefined" && popup.content != null) {
                            content = popup.content;
                        }
                        if (typeof popup.id == "string" && popup.id != null) {
                            id = popup.id;
                        }
                        if (typeof popup.options == "object" && popup.options != null) {
                            popupOpt = popup.options;
                        }

                        tempPopup = this.createPopup(content, type, id, popupOpt);
                    }
                }
                if (typeof opts.attributes == "object" && opts.attributes != null) {
                    tempAttributes = opts.attributes;
                }
                if (typeof opts.click == "function" && opts.click != null) {
                    tempOnClick = opts.click;
                }
                if (typeof opts.added == "function" && opts.added != null) {
                    tempOnAdded = opts.added;
                }
                if (typeof opts.right == "function" && opts.right != null) {
                    tempOnRight = opts.right;
                }
            }

            //
            var markerFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat), tempAttributes, style);
            markerFeature["OnClick"] = tempOnClick;

            // --------------------------------------- custom method SS
            markerFeature['setLabel'] = function (label) {
                if (typeof label == 'string') {
                    markerFeature.style['label'] = label;
                } else if (typeof label == 'object' && label != null) {
                    var lb = label;
                    if (typeof lb.text == 'string') {
                        markerFeature.style['label'] = lb.text;
                    }
                    if (typeof lb.x == 'number') {
                        markerFeature.style['labelXOffset'] = lb.x;
                    }
                    if (typeof lb.y == 'number') {
                        markerFeature.style['labelYOffset'] = lb.y;
                    }
                }

                markerFeature.layer.redraw();
            };

            markerFeature['setIcon'] = function (uri) {
                if (typeof uri == 'string') {
                    markerFeature.style['externalGraphic'] = uri;
                } else if (typeof uri == 'object' && uri != null) {
                    var symbol = uri;
                    var isChange = false;
                    if (typeof symbol.fillColor == 'string') {
                        markerFeature.style['fillColor'] = symbol.fillColor;
                        isChange = true;
                    }
                    if (typeof symbol.strokeColor == 'string') {
                        markerFeature.style['strokeColor'] = symbol.strokeColor;
                        isChange = true;
                    }
                    if (typeof symbol.strokeWidth == 'number') {
                        markerFeature.style['strokeWidth'] = symbol.strokeWidth;
                        isChange = true;
                    }

                    //
                    if (isChange) {
                        markerFeature.style['externalGraphic'] = '';
                    }
                }

                markerFeature.layer.redraw();
            };

            markerFeature['setPointRadius'] = function (size) {
                markerFeature.style['pointRadius'] = size;
                markerFeature.layer.redraw();
            };

            // --------------------------------------- custom method EE
            if (tempPopup != null) {
                markerFeature.popup = tempPopup;
            }

            //
            var markerInfo = this.getMarkerGroup(tempId);
            if (markerInfo == null) {
                markerInfo = {
                    alwaysInRange: true,
                    id: UTIL.trim(tempId.toLowerCase()),
                    items: [],
                    resolution: {
                        min: this.markerLayer.minResolution,
                        max: this.map.getMapforOpenLayers().getMaxResolution()
                    }
                };

                this.markerGroup.push(markerInfo);
            }
            markerInfo.items.push(markerFeature);

            //
            this.markerLayer.addFeatures(markerFeature);

            // 여기까지 와야 실제 DIV가 생김
            // 컨텍스트 메뉴를 넣자.
            if (typeof tempOnRight == "function" && tempOnRight != null) {
                // 해당 element에 직접 on을 하면 element가 변동(예를 들어 hide와 같은 상황)될 때 이벤트가 해제되거나 동적인 처리에 문제가 발생한다.
                // 때문에 document에 이벤트를 걸되 selector(즉 이벤트가 적용될 element)에 반영되도록 다음과 같이 설정한다.
                $(document).on("contextmenu", "#" + markerFeature.geometry.id, function (e) {
                    //e.preventDefault();
                    e["feature"] = markerFeature;
                    return tempOnRight(e);
                    //return false;
                });
                // 아래 방법은 동적인 변화에 문제가 발생할 수 있다.
                /*$("#" + markerFeature.geometry.id).on('contextmenu', function (e) {
                //e.preventDefault();
                
                e["feature"] = markerFeature;
                return tempOnRight(e);
                
                //return false;
                });*/
            }

            //
            if (tempOnAdded != null) {
                tempOnAdded(markerFeature);
            }
        };

        ///*
        //    Function: createPopup
        //
        //        OpenLayers.Popup 을 new 하여 반환한다.
        //
        //    Parameters:
        //
        //        >   content: any,                       // 팝업 내용
        //        >   type?: string,                      // 팝업 종류로 popup / anchored / framedcloud 를 지원한다.
        //        >   id?: string,                        // 팝업에 지정할 아이디, 생략 가능하다.
        //        >   options?: {                         // 추가 옵션
        //        >       lonlat?: {                      // 팝업 위치
        //        >           lon: number;
        //        >           lat: number;
        //        >       };
        //        >       size?: {                        // 팝업 크기
        //        >           width: number;
        //        >           height: number;
        //        >       };
        //        >       isClose?: boolean;              // 팝업 종료 기능 지원 여부
        //        >       closeCallback?: Function;       // 팝업 종료시 호출할 콜백 함수
        //        >   }
        //
        //    Returns:
        //
        //        popup: OpenLayers.Popup - 팝업객체
        //
        //    Example:
        //
        //        >   // GeoNURIS.MAP 객체
        //        >   var gmap = new GeoNURIS.Map("map", { ... });
        //*/
        Marker.prototype.createPopup = function (content, type, id, options) {
            var tempId = "popup";
            var tempType = "popup";
            var tempLonlat = null;
            var tempSize = null;
            var tempContent = null;
            var tempIsClose = false;
            var tempCloseCallBack = null;

            if (typeof content != "undefined") {
                tempContent = content;
            }
            if (typeof type == "string" && type != null) {
                tempType = UTIL.trim(type.toLowerCase());
            }
            if (typeof id == "string" && id != null) {
                tempId = UTIL.trim(id);
            }

            if (typeof options == "object" && options != null) {
                var opt = options;
                if (typeof opt.isClose == "boolean" && opt.isClose) {
                    tempIsClose = opt.isClose;
                }
                if (typeof opt.closeCallback == "function" && opt.closeCallback != null && tempIsClose) {
                    tempCloseCallBack = function (e) {
                        opt.closeCallback(e);
                        this.map.removePopup(this);
                    };
                } else if (typeof opt.closeCallback == "undefined" && tempIsClose) {
                    tempCloseCallBack = function (e) {
                        this.map.removePopup(this);
                    };
                }
                if (typeof opt.lonlat == "object" && opt.lonlat != null) {
                    var lonlat = opt.lonlat;
                    if (typeof lonlat.lon == "number" && typeof lonlat.lat == "number") {
                        tempLonlat = new OpenLayers.LonLat(lonlat.lon, lonlat.lat);
                    }
                }
                if (typeof opt.size == "object" && opt.size != null) {
                    var size = opt.size;
                    if (typeof size.width == "number" && typeof size.height == "number") {
                        tempSize = new OpenLayers.Size(size.width, size.height);
                    }
                }
            }

            var popup = null;
            if (tempType == "popup" || tempType == "p") {
                popup = new OpenLayers.Popup(_.uniqueId(tempId), tempLonlat, tempSize, tempContent, tempIsClose, tempCloseCallBack);
            } else if (tempType == "anchored" || tempType == "a") {
                popup = new OpenLayers.Popup.Anchored(_.uniqueId(tempId), tempLonlat, tempSize, tempContent, null, tempIsClose, tempCloseCallBack);
            } else if (tempType == "framedcloud" || tempType == "f") {
                popup = new OpenLayers.Popup.FramedCloud(_.uniqueId(tempId), tempLonlat, tempSize, tempContent, null, tempIsClose, tempCloseCallBack);
            }

            return popup;
        };

        /*
        Function: createStyle
        
        마커에 사용될 스타일을 new 하여 반환하는 함수
        
        Parameters:
        
        >   icon: any                                       // 이미지 마커의 경우 이미지의 URI
        >   icon: {                                         // 심볼 마커의 경우 심볼 설정 값.
        >       fillColor?: string,
        >       strokeColor: string,
        >       strokeWidth: number
        >   }
        >   pointRadius?: number,                           // 마커 크기(반경)
        >   options?: {
        >       label?: {                                   // 라벨 옵션
        >           text?: string,                          // 라벨 텍스트
        >           size?: number,                          // 라벨 사이즈
        >           offSet?: { x?: number, y?: number },    // 마커위치로 부터 라벨 offset
        >           font?: {                                // 라벨 폰트 옵션
        >               weight?: string,
        >               color?: string,
        >               outline?: {
        >                   color?: string,
        >                   width?: number
        >               }
        >           }
        >       },
        >       offSet?: { x?: number, y?: number }         // 마커의 offset
        >   }
        
        Returns:
        
        style: GeoNURIS.Vector.Style - 마커 스타일 객체
        
        Example:
        
        >   // GeoNURIS.MAP 객체
        >   var gmap = new GeoNURIS.Map("map", { ... });
        >
        >   // 임의 좌표를 정의한다.
        >   var px = new OpenLayers.Pixel(595,317);
        >   var templl = gmap.map.getLonLatFromPixel(px);
        >
        >   // 스타일을 생성한다.
        >   var style = gmap.controls.MARKER.createStyle(
        >       'https://cdn2.iconfinder.com/data/icons/snipicons/500/map-marker-128.png',
        >       20,
        >       {
        >           label: {
        >               text: '라벨',
        >               size: 12,
        >               offset: { y: -40 },
        >               font: {
        >                   weight: 'bold',
        >                   color: '#ff66cc',
        >                   outline: {
        >                       color: '#66cc88',
        >                       width: 2
        >                   }
        >               }
        >           }
        >       }
        >   );
        >
        >   // 마커를 추가한다.
        >   gmap.controls.MARKER.addMarker(templl.lon, templl.lat, style, { markerGroupId: 'testMarker' });
        
        */
        Marker.prototype.createStyle = function (icon, pointRadius, options) {
            var style = {};
            style.graphicZIndex = 11;
            style.pointRadius = 10;

            if (typeof pointRadius == "number") {
                style.pointRadius = pointRadius;
            }

            //
            if (typeof options == "object" && options != null) {
                var opt = options;
                if (typeof opt.label == "object" && opt.label != null) {
                    var label = opt.label;
                    if (typeof label.text == "string") {
                        style.label = label.text;
                    }
                    if (typeof label.size == "number") {
                        style.fontSize = label.size;
                    }
                    if (typeof label.offSet == "object" && label.offSet != null) {
                        var offSet = label.offSet;
                        if (typeof offSet.x == "number") {
                            style.labelXOffset = offSet.x;
                        }
                        if (typeof offSet.y == "number") {
                            style.labelYOffset = offSet.y;
                        }
                    }

                    if (typeof label.font == "object" && label.font != null) {
                        var font = label.font;
                        if (typeof font.weight == "string") {
                            style.fontWeight = font.weight;
                        }
                        if (typeof font.color == "string") {
                            style.fontColor = font.color;
                        }

                        if (typeof font.outline == "object" && font.outline != null) {
                            var outline = font.outline;
                            if (typeof outline.color == "string") {
                                style.labelOutlineColor = outline.color;
                            }
                            if (typeof outline.width == "number") {
                                style.labelOutlineWidth = outline.width;
                            }
                        }
                    }
                }

                //
                if (typeof opt.offSet == "object" && opt.offSet != null) {
                    var offSet = opt.offSet;
                    if (typeof offSet.x == "number") {
                        style.graphicXOffset = (style.pointRadius * -1) + offSet.x;
                    }
                    if (typeof offSet.y == "number") {
                        style.graphicYOffset = (style.pointRadius * -1) + offSet.y;
                    }
                }
            }

            if (typeof icon == "string") {
                style.externalGraphic = icon;
            } else if (typeof icon == "object") {
                if (typeof icon.fillColor == "string") {
                    style.fillColor = icon.fillColor;

                    if (typeof icon.strokeColor == "string") {
                        style.strokeColor = icon.strokeColor;
                    }
                    if (typeof icon.strokeWidth == "number") {
                        style.strokeWidth = icon.strokeWidth;
                    }
                }
            }

            //
            return style;
        };

        /*
        Function: deactivate
        
        Marker 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.MARKER.deactivate();
        
        */
        Marker.prototype.deactivate = function () {
            this.control.MOUSE.CLICK.deactivate(this.mouseEventId);
            this.enableDrag(false);

            if (this.isSearchMode) {
                this.isSearchMode = false;
                this.control.MEASURE.deactivate();
            }
        };
        return Marker;
    })(GeoNURIS.BaseControl);
    GeoNURIS.Marker = Marker;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Marker.js.map
;
define("Marker", function(){});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control.Toolbar
    
    GeoNURIS.Control.Toolbar 클래스.
    */
    var Toolbar = (function (_super) {
        __extends(Toolbar, _super);
        /*
        Constructor: Toolbar
        
        생성자.
        
        Parameters:
        
        > control: GeoNURIS.Control,
        > map: GeoNURIS.MAP
        */
        function Toolbar(control, map) {
            _super.call(this, control, map, [2 /* TOOL */], "toolbar");

            //
            var css = ".olControlPanel { margin-top:6px; padding-right:8px; right:0px; display:table; background-color:rgba(44,47,52,.7); }";
            css = css + " " + ".olControlNoSelect { }";
            css = css + " " + ".olButton { height:38px; padding:0px; margin:0px; border:hidden; display:table-cell; vertical-align:middle; }";
            UTIL.appendStyle(css);

            //
            var oMap = this.map.getMapforOpenLayers();
            var controls = this.control;
            var toolbarSelf = this;

            //
            this.toggleBtn = new OpenLayers.Control.Button({
                displayClass: "ToolbarToggle", imgSrc: '/js/resource/Img/close.png', trigger: function () {
                    for (var idx in toolbarSelf.subControls) {
                        var item = toolbarSelf.subControls[idx];
                        var pDiv = item.panel_div;
                        if (item.displayClass.toLowerCase() == 'toolbartoggle') {
                            var img = pDiv.children[0];
                            if (img.src.lastIndexOf('close.png') >= 0) {
                                img.src = '/js/resource/Img/open.png';
                            } else {
                                img.src = '/js/resource/Img/close.png';
                            }
                        } else {
                            pDiv.style.display = pDiv.style.display == '' ? 'none' : '';
                        }
                    }
                }
            });
            this.subControls = [
                this.toggleBtn,
                new OpenLayers.Control.Button({
                    displayClass: "FullExtent", imgSrc: '/js/resource/Img/full_extent.png', trigger: function () {
                        //console.log('FullExtent');
                        oMap.zoomToMaxExtent();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "FixedZoomIn", imgSrc: '/js/resource/Img/fixed_zoom_in.png', trigger: function () {
                        //console.log('FixedZoomIn');
                        oMap.zoomIn();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "FixedZoomOut", imgSrc: '/js/resource/Img/fixed_zoom_out.png', trigger: function () {
                        //console.log('FixedZoomOut');
                        oMap.zoomOut();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "ZoomIn", imgSrc: '/js/resource/Img/zoom_in.png', trigger: function () {
                        //console.log('ZoomIn');
                        controls.ZOOMBOX_IN.activate();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "ZoomOut", imgSrc: '/js/resource/Img/zoom_out.png', trigger: function () {
                        //console.log('ZoomOut');
                        controls.ZOOMBOX_OUT.activate();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "Pan", imgSrc: '/js/resource/Img/pan.png', trigger: function () {
                        //console.log('Pan');
                        controls.NAVIGATION.activate({ all: true });
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "PrevExtent", imgSrc: '/js/resource/Img/prev_extent.png', trigger: function () {
                        //console.log('PrevExtent');
                        controls.NAVIGATIONHISTORY.activate();
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "NextExtent", imgSrc: '/js/resource/Img/next_extent.png', trigger: function () {
                        //console.log('NextExtent');
                        controls.NAVIGATIONHISTORY.activate(true);
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "Length", imgSrc: '/js/resource/Img/length.png', trigger: function () {
                        //console.log('Length');
                        controls.MEASURE.activate({ type: 'l', visibleResult: true });
                    }
                }),
                new OpenLayers.Control.Button({
                    displayClass: "Area", imgSrc: '/js/resource/Img/area.png', trigger: function () {
                        //console.log('Area');
                        controls.MEASURE.activate({ type: 'p', visibleResult: true });
                    }
                })
            ];
        }
        /*
        Function: toggleToolbar
        
        Toolbar 컨트롤의 상태를 토글한다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.TOOLBAR.activate();
        >
        >gmap.controls.TOOLBAR.toggleToolbar();
        */
        Toolbar.prototype.toggleToolbar = function () {
            if (typeof this.toggleBtn != "undefined" && this.toggleBtn != null) {
                this.toggleBtn.trigger();
            }
        };

        /*
        Function: setActivateButton
        
        Toolbar 컨트롤의 기능버튼중 지정된 이름의 기능을 활성화한다.
        
        Parameters:
        
        >options?: {
        >   buttonName?: string        // 활성화할 툴바내 기능이름, FullExtent / FixedZoomIn / FixedZoomOut / ZoomIn / ZoomOut / Pan / PrevExtent / NextExtent / Length / Area
        >}
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.TOOLBAR.activate();
        >
        >// 패닝기능 활성
        >gmap.controls.TOOLBAR.setActivateButton('pan');
        
        */
        Toolbar.prototype.setActivateButton = function (buttonName) {
            //console.log("!!!!!!!!!! : " + buttonName);
            if (typeof this.subControls != "undefined" && this.subControls != null) {
                for (var key in this.subControls) {
                    var button = this.subControls[key];
                    var buttonDpCls = button.displayClass.toLowerCase();
                    if (button.hasOwnProperty('panel_div')) {
                        var panel = button['panel_div'];
                        var img = panel.children[0];

                        //
                        if (button.hasOwnProperty('imgSrc')) {
                            var imgSrc = button['imgSrc'];

                            if ((buttonName.toLowerCase() == "zoomin" && buttonDpCls == "zoomin") || (buttonName.toLowerCase() == "zoomout" && buttonDpCls == "zoomout") || (buttonName.toLowerCase() == "navigation" && buttonDpCls == "pan")) {
                                img.src = imgSrc.replace(".png", "_cl.png");
                            } else {
                                img.src = imgSrc;
                            }
                        }
                    }
                }
            }
        };

        /*
        Function: activate
        
        Toolbar 컨트롤을 MAP 에 적용한다.
        
        Example:
        
        >var gmap = new GeoNURIS.Map("map", ...);
        >
        >gmap.controls.TOOLBAR.activate();
        */
        Toolbar.prototype.activate = function (options) {
            console.log("toolBar activate");

            //var tempIsNotBeforeActivate = false;
            //if (typeof options != "undefined" && options != null) {
            //    if (typeof options.isNotBeforeActivate == "boolean") {
            //        tempIsNotBeforeActivate = options.isNotBeforeActivate;
            //    }
            //}
            //
            //// -----------------------------------------------------isNotBeforeActivate SS
            //if (!tempIsNotBeforeActivate) {
            //    var types: number[] = [CONTROL_TYPE.TOOL];
            //    var deactivateTargetControls: IBaseControl[] = this.control.getControlsbyType(types);
            //    for (var i in deactivateTargetControls) {
            //        var target: IBaseControl = deactivateTargetControls[i];
            //        target.deactivate();
            //        console.log(target.name + " deactivated");
            //    }
            //}
            //// -----------------------------------------------------isNotBeforeActivate EE
            //
            this.deactivate();

            //
            this.me = new OpenLayers.Control.Panel({
                defaultControl: null,
                createControlMarkup: function (control) {
                    var output = document.createElement('button');
                    var img = document.createElement('img');
                    img.src = control.imgSrc;
                    output.appendChild(img);

                    if (control.displayClass.toLowerCase() != "toolbartoggle") {
                        output.style.paddingLeft = "8px";
                        output.style.backgroundColor = "transparent";
                    } else {
                        output.style.borderRight = "1px solid #2c2f34";

                        var browser = UTIL.getBrowserInfo();
                        if (browser.firefox) {
                            img.style.marginTop = "-1px";
                            img.style.marginLeft = "-5px";
                            img.style.marginRight = "-3px";
                        }
                    }

                    return output;
                }
            });

            this.me.addControls(this.subControls);

            //
            this.map.getMapforOpenLayers().addControl(this.me);
            this.me.activate();
        };

        /*
        Function: deactivate
        
        Toolbar 컨트롤을 MAP 에서 해제한다.
        
        Example:
        >// map 생성.
        >var gmap = new GeoNURIS.Map("map", { ...생략 });
        >
        >// 컨트롤 해제.
        >gmap.controls.TOOLBAR.deactivate();
        
        */
        Toolbar.prototype.deactivate = function () {
            if (typeof this.me != "undefined" && this.me != null) {
                var oMap = this.map.getMapforOpenLayers();
                for (var key in this.me.controls) {
                    var item = this.me.controls[key];
                    oMap.removeControl(item);
                }

                this.map.getMapforOpenLayers().removeControl(this.me);
                this.me.deactivate();
            }
        };
        return Toolbar;
    })(GeoNURIS.BaseControl);
    GeoNURIS.Toolbar = Toolbar;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Toolbar.js.map
;
define("Toolbar", function(){});

/// <reference path="Controls/Navigation.ts" />
/// <reference path="Controls/ZoomBox.ts" />
/// <reference path="Controls/NavigationHistory.ts" />
/// <reference path="Controls/MousePosition.ts" />
/// <reference path="Controls/ScaleLine.ts" />
/// <reference path="Controls/PanZoomBar.ts" />
/// <reference path="Controls/NavToolbar.ts" />
/// <reference path="Controls/Measure.ts" />
/// <reference path="Controls/GetFeature.ts" />
/// <reference path="Controls/DrawFeature.ts" />
/// <reference path="Controls/SelectFeature.ts" />
/// <reference path="Controls/Marker.ts" />
/// <reference path="Controls/Mouse.ts" />
/// <reference path="Controls/WMSGetFeatureInfo.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Control
    
    GeoNURIS.Control 클래스.
    */
    var Control = (function () {
        /*
        Property: NAVIGATION
        {GeoNURIS.Control.NAVIGATION} 네비게이션 컨트롤
        
        Property: ZOOMBOX
        {GeoNURIS.Control.ZOOMBOX} 줌박스 컨트롤
        
        Property: ZOOMBOX_IN
        {GeoNURIS.Control.ZOOMBOX_IN} 줌IN 컨트롤
        
        Property: ZOOMBOX_OUT
        {GeoNURIS.Control.ZOOMBOX_OUT} 줌OUT 컨트롤
        
        Property: NAVIGATIONHISTORY
        {GeoNURIS.Control.NAVIGATIONHISTORY} 네비게이션 히스토리 컨트롤
        
        Property: MOUSEPOSITION
        {GeoNURIS.Control.MOUSEPOSITION} 마우스POSITION 컨트롤
        
        Property: SCALELINE
        {GeoNURIS.Control.SCALELINE} 축척 컨트롤
        
        Property: PANZOOMBAR
        {GeoNURIS.Control.PANZOOMBAR} 팬줌바 컨트롤
        
        Property: NAVTOOLBAR
        {GeoNURIS.Control.NAVTOOLBAR} 네비게이션툴바 컨트롤
        
        Property: MEASURE
        {GeoNURIS.Control.MEASURE} 측량 컨트롤
        
        Property: GETFEATURE
        {GeoNURIS.Control.GETFEATURE} GETFEATURE 컨트롤
        
        Property: DRAWFEATURE
        {GeoNURIS.Control.DRAWFEATURE} DRAWFEATURE 컨트롤
        
        Property: WMSGETFEATUREINFO
        {GeoNURIS.Control.WMSGETFEATUREINFO} WMSGETFEATUREINFO 컨트롤
        
        Property: SELECTFEATURE
        {GeoNURIS.Control.SELECTFEATURE} SELECTFEATURE 컨트롤
        
        Property: MARKER
        {GeoNURIS.Control.MARKER} 마커 컨트롤
        
        Property: MOUSE
        {GeoNURIS.Control.MOUSE} 마우스 컨트롤
        
        Property: TOOLBAR
        {GeoNURIS.Control.TOOLBAR} 툴바 컨트롤
        */
        /*
        Constructor: Control
        
        생성자.
        
        Parameters:
        
        map: GeoNURIS.MAP
        */
        function Control(map) {
            this.NAVIGATION = new GeoNURIS.Navigation(this, map);
            this.ZOOMBOX = new GeoNURIS.ZoomBox(this, map);
            this.ZOOMBOX_IN = new GeoNURIS.ZoomBox(this, map);
            this.ZOOMBOX_OUT = new GeoNURIS.ZoomBoxOut(this, map);
            this.NAVIGATIONHISTORY = new GeoNURIS.NavigationHistory(this, map);
            this.MOUSEPOSITION = new GeoNURIS.MousePosition(this, map);
            this.SCALELINE = new GeoNURIS.ScaleLine(this, map);
            this.PANZOOMBAR = new GeoNURIS.PanZoomBar(this, map);
            this.NAVTOOLBAR = new GeoNURIS.NavToolbar(this, map);
            this.MEASURE = new GeoNURIS.Measure(this, map);
            this.GETFEATURE = new GeoNURIS.GetFeature(this, map);
            this.DRAWFEATURE = new GeoNURIS.DrawFeature(this, map);
            this.WMSGETFEATUREINFO = new GeoNURIS.WMSGetFeatureInfo(this, map);
            this.SELECTFEATURE = new GeoNURIS.SelectFeature(this, map);
            this.MARKER = new GeoNURIS.Marker(this, map);
            this.MOUSE = new GeoNURIS.Mouse(this, map);
            this.TOOLBAR = new GeoNURIS.Toolbar(this, map);

            //
            this.DRAWFEATURE.activate("a", "l");
            this.DRAWFEATURE.deactivate();
        }
        Control.prototype.getControlsbyType = function (filter, isOR) {
            //return _.chain(this).filter(function (obj) { return obj instanceof BaseControl; }).value();
            var base = _.chain(this).filter(function (obj) {
                return obj instanceof GeoNURIS.BaseControl;
            });
            if (typeof filter != "undefined" && filter != null) {
                base = base.filter(function (obj) {
                    if (isOR) {
                        return _.difference(obj.type, filter).length < obj.type.length;
                    } else {
                        // AND
                        return _.difference(filter, obj.type).length == 0;
                    }
                });
            }
            return base.value();
        };
        return Control;
    })();
    GeoNURIS.Control = Control;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Control.js.map
;
define("Control", function(){});

/// <reference path="../Util/Util.ts" />
/// <reference path="TOC.ts" />
/// <reference path="ServerInfo.ts" />
/// <reference path="Control.ts" />
/// <reference path="../Util/contextMenu.d.ts" />
var GeoNURIS;
(function (GeoNURIS) {
    /*
    Class: GeoNURIS.Map
    
    GeoNURIS.MAP 클래스.
    */
    var Map = (function () {
        /*
        Constructor: Map
        
        생성자.
        
        Parameters:
        
        >mapDiv: string,
        >options?: {                                                // 추가옵션
        >   proxyHost?: string,                                     // 프록시
        >   serverInfos: ServerInfo[],                              // 맵에 추가할 ServerInfo, 배열
        >   enableToolbar?: boolean,                                // 맵생성시 툴바사용여부, 기본값은 true
        >   mapOptions?: { ...OpenLayers.Map 의 Properties }        // OpenLayers.Map에 정의할 옵션
        >}
        */
        function Map(mapDiv, options) {
            var mapOptions = {
                units: "m",
                controls: [],
                allOverlays: true
            };

            // options에 mapOptions가 있을 경우 이를 반영한다.
            if (typeof options != "undefined" && options != null) {
                var opts = options;
                if (typeof opts.mapOptions == "object" && opts.mapOptions != null) {
                    for (var key in opts.mapOptions) {
                        if (key != 'controls') {
                            mapOptions[key] = opts.mapOptions[key];
                        }
                    }
                }
            }

            // OpenLayers를 이용하여 MAP 객체를 생성한다.
            this.map = new OpenLayers.Map(mapDiv, mapOptions);
            this.map.Z_INDEX_BASE.Popup = 10000;

            // TOC객체를 생성한다.
            this.toc = new GeoNURIS.TOC(this);

            // 옵션이 있을 경우.
            var tempEnableToolbar = true;
            if (typeof options != "undefined" && options != null) {
                var opts = options;

                // 옵션중에 프록시 옵션이 있다면,
                if (typeof opts.proxyHost == "string" && opts.proxyHost != null) {
                    // 프록시 설정을 한다.
                    OpenLayers.ProxyHost = opts.proxyHost;
                }

                // 옵션중 ServerInfo가 있다면 이를 포함하는 TOC객체를 새로 만든다.
                if (typeof opts.serverInfos != "undefined" && opts.serverInfos != null) {
                    this.toc = new GeoNURIS.TOC(this, opts.serverInfos);
                }

                if (typeof opts.enableToolbar == "boolean" && !opts.enableToolbar) {
                    tempEnableToolbar = options.enableToolbar;
                }
            }

            // 베이스맵이 존재한다면!
            if (this.map.baseLayer != null) {
                this.map.zoomToMaxExtent();
            }

            /*
            //
            UTIL.loadStylesheet("/js/UTIL/context.standalone.css", function () {
            contextMenu.init({ compress: true, clickExtend: "#" + this.map.div.firstElementChild.id });
            });
            */
            //
            this.controls = new GeoNURIS.Control(this);

            //
            if (tempEnableToolbar) {
                this.controls.TOOLBAR.activate();
                this.controls.TOOLBAR.toggleToolbar();
                //this.controls.PANZOOMBAR.activate();
            }
        }
        /*
        Function: addService
        서비스 등록 함수
        
        Parameters:
        
        service : GeoNURIS.Service - GeoNURIS.Service를 상속받는 객체
        
        Example:
        
        >// 추가할 GeoNURIS.Service 를 생성하기 위해 GeoNURIS.ServerInfo를 생성한다.
        >var sInfo = new GeoNURIS.ServerInfo('127.0.0.1',8080,...);
        >
        >// GeoNURIS.Service를 생성한다.
        >var sErv = new GeoNURIS.Service(sInfo);
        >
        >// GeoNURIS.MAP에 Service를 추가한다.
        >var gmap = new GeoNURIS.Map("map", { ... });
        >gmap.addService(sErv);
        
        */
        Map.prototype.addService = function (service) {
            if (!service.serverInfo.autoVisible) {
                service.getServiceLayer().setVisibility(false);
            }

            this.map.addLayer(service.getServiceLayer());

            // 등록한 서비스가 CustomService 라면,
            if (service instanceof GeoNURIS.CustomService) {
                // 베이스맵이 없거나, 등록된 맵서비스가 1개 이하일 경우
                if (this.map.baseLayer == null || this.toc.getServices().length <= 1) {
                    // 현재 등록한 CustomService를 베이스 맵으로 설정한다.
                    this.map.setBaseLayer(service.getServiceLayer());
                }

                if (this.map.baseLayer.name.toLowerCase().indexOf("vmap") >= 0) {
                    //this.map["tempZoomToMaxExtent"] = this.map.zoomToMaxExtent;
                    var oMap = this.map;
                    this.map["tempZoomToMaxExtent"] = this.map.zoomToMaxExtent;
                    this.map.zoomToMaxExtent = function (options) {
                        if (oMap.baseLayer.name.toLowerCase().indexOf("vmap") >= 0) {
                            oMap.zoomToExtent(new OpenLayers.Bounds(13342969.120808, 3620179.1242833, 15023360.750396, 5076763.1350829), true);
                        } else {
                            oMap["tempZoomToMaxExtent"]();
                        }
                    };
                }

                this.map.zoomToMaxExtent();
            }

            service.getServiceLayer().redraw();
        };

        /*
        Function: removeService
        서비스 해제 함수
        
        Parameters:
        
        service : GeoNURIS.Service - GeoNURIS.Service를 상속받는 객체
        
        Example:
        
        >// GeoNURIS 맵객체 선언.
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// 제거할 Service 추출
        >var removeService = gmap.toc.getservices()[0];
        >
        >// 서비스 제거
        >gmap.map.removeService(removeService);
        
        */
        Map.prototype.removeService = function (service) {
            this.map.removeLayer(service.getServiceLayer());
        };

        /*
        Function: getMapforOpenLayers
        {OpenLayers.Map} 객체를 반환하는 함수
        
        Returns:
        
        map : OpenLayers.Map - OpenLayers.Map 객체
        
        Example:
        
        >// GeoNURIS 맵객체 선언.
        >var gmap = new GeoNURIS.Map("map", { ... });
        >
        >// GeoNURIS 맵객체에서 OpenLayers.MAP 객체를 추출한다.
        >var omap = gmap.map.getMapforOpenLayers();
        
        */
        Map.prototype.getMapforOpenLayers = function () {
            return this.map;
        };
        return Map;
    })();
    GeoNURIS.Map = Map;
})(GeoNURIS || (GeoNURIS = {}));
//# sourceMappingURL=Map.js.map
;
define("GeoNURIS", ["underscore","OpenLayers","jQuery","UTIL","contextMenu","ServerInfo","CustomServerInfo","BaseLayer","Layer","GroupLayer","Service","CustomService","TOC","Style","BaseControl","Mouse","Navigation","ZoomBox","NavigationHistory","MousePosition","ScaleLine","PanZoomBar","NavToolbar","Measure","GetFeature","DrawFeature","SelectFeature","WMSGetFeatureInfo","Marker","Mouse","Toolbar","Control"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.geonuris;
    };
}(this)));

requirejs.config({
    baseUrl: "/js"
    , paths: {
        //underscore: "underscore/underscore-min"
        //, OpenLayers: "OpenLayers/OpenLayers"
        //, jQuery: "jQuery/jquery-1.10.2.min"

        underscore: "underscore/underscore"
        , OpenLayers: "OpenLayers/OpenLayers.debug"
        , jQuery: "jQuery/jquery-1.10.2"

        , UTIL: "UTIL/UTIL"

        , contextMenu: "UTIL/contextMenu"       // jquery dep

        , GeoNURIS: "GeoNURIS/Map"
        , ServerInfo: "GeoNURIS/ServerInfo"
        , CustomServerInfo: "GeoNURIS/CustomServerInfo"
        , TOC: "GeoNURIS/TOC"
        , Service: "GeoNURIS/Service"
        , CustomService: "GeoNURIS/CustomService"
        , BaseLayer: "GeoNURIS/BaseLayer"
        , Layer: "GeoNURIS/Layer"
        , GroupLayer: "GeoNURIS/GroupLayer"
        , Style: "GeoNURIS/Style"
        , Control: "GeoNURIS/Control"
        , BaseControl: "GeoNURIS/Controls/BaseControl"
        , Navigation: "GeoNURIS/Controls/Navigation"
        , ZoomBox: "GeoNURIS/Controls/ZoomBox"
        , NavigationHistory: "GeoNURIS/Controls/NavigationHistory"
        , MousePosition: "GeoNURIS/Controls/MousePosition"
        , ScaleLine: "GeoNURIS/Controls/ScaleLine"
        , PanZoomBar: "GeoNURIS/Controls/PanZoomBar"
        , NavToolbar: "GeoNURIS/Controls/NavToolbar"
        , Measure: "GeoNURIS/Controls/Measure"
        , GetFeature: "GeoNURIS/Controls/GetFeature"
        , DrawFeature: "GeoNURIS/Controls/DrawFeature"
        , WMSGetFeatureInfo: "GeoNURIS/Controls/WMSGetFeatureInfo"
        , SelectFeature: "GeoNURIS/Controls/SelectFeature"
        , Marker: "GeoNURIS/Controls/Marker"
        , Mouse: "GeoNURIS/Controls/Mouse"
        , Toolbar: "GeoNURIS/Controls/Toolbar"
    }
    , shim: {
        "GeoNURIS": {
            // GeoNURIS가 로드되기 전에 underscore, OpenLayers, ... 가 먼저 로드 되어야 한다.
            deps: ["underscore", "OpenLayers", "jQuery"
                , "UTIL", "contextMenu", "ServerInfo", "CustomServerInfo", "BaseLayer" ,"Layer" ,"GroupLayer", "Service", "CustomService", "TOC"
                , "Style"
                , "BaseControl", "Mouse", "Navigation", "ZoomBox", "NavigationHistory"
                , "MousePosition", "ScaleLine"
                , "PanZoomBar", "NavToolbar"
                , "Measure", "GetFeature", "DrawFeature", "SelectFeature", "WMSGetFeatureInfo", "Marker", "Mouse", "Toolbar"
                , "Control"]
            , exports: "geonuris"
        }
    }
});

requirejs(["GeoNURIS"], function (geonuris) {
    console.log("script loaded");

    if (typeof ginit == "function") {
        // init call
        //ginit();

        var body = document.getElementsByTagName("body")[0];
        body.addEventListener("load", ginit(), false);
    }

});
define("main", function(){});
