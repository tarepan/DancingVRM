instantiate = function(container, url, parameters) {
    function instantiate(container, gameInstance) {
        if (typeof container == 'string' && !(container = document.getElementById(container))) {
            return false;
        }

        container.innerHTML = '';
        container.style.border = container.style.margin = container.style.padding = 0;
        if (getComputedStyle(container).getPropertyValue('position') == 'static') {
            container.style.position = 'relative';
        }
        container.style.width = gameInstance.width || container.style.width;
        container.style.height = gameInstance.height || container.style.height;
        gameInstance.container = container;

        var Module = gameInstance.Module;
        Module.canvas = document.createElement('canvas');
        Module.canvas.style.width = '100%';
        Module.canvas.style.height = '100%';
        Module.canvas.addEventListener('contextmenu', function(e) { e.preventDefault(); }),
            Module.canvas.id = '#canvas';
        container.appendChild(Module.canvas);

        gameInstance.compatibilityCheck(gameInstance, function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', gameInstance.url, true);
            xhr.responseType = 'text';
            xhr.onerror = function() {
                Module.print('Could not download ' + gameInstance.url);
                if (document.URL.indexOf('file:') == 0) {
                    alert('It seems your browser does not support running Unity WebGL content from file:// urls. Please upload it to an http server, or try a different browser.');
                }
            };
            xhr.onload = function() {
                var parameters = JSON.parse(xhr.responseText);
                for (var parameter in parameters) {
                    if (typeof Module[parameter] == 'undefined') {
                        Module[parameter] = parameters[parameter];
                    }
                }

                var graphicsApiMatch = false;
                for (var i = 0; i < Module.graphicsAPI.length; i++) {
                    var api = Module.graphicsAPI[i];
                    if (api == 'WebGL 2.0' && UnityLoader.SystemInfo.hasWebGL == 2) {
                        graphicsApiMatch = true;
                    }
                    else if (api == 'WebGL 1.0' && UnityLoader.SystemInfo.hasWebGL >= 1) {
                        graphicsApiMatch = true;
                    }
                    else {
                        Module.print('Warning: Unsupported graphics API ' + api);
                    }
                }
                if (!graphicsApiMatch) {
                    gameInstance.popup('Your browser does not support any of the required graphics API for this content: ' + Module.graphicsAPI, [{text: 'OK'}]);
                    return;
                }

                container.style.background = Module.backgroundUrl ? 'center/cover url(\'' + Module.resolveBuildUrl(Module.backgroundUrl) + '\')' :
                    Module.backgroundColor ? ' ' + Module.backgroundColor : '';

                // show loading screen as soon as possible
                gameInstance.onProgress(gameInstance, 0.0);

                UnityLoader.loadModule(Module);
            };
            xhr.send();
        }, function() {
            Module.printErr('Instantiation of the \'' + url + '\' terminated due to the failed compatibility check.');
        });

        return true;
    }

    function resolveURL(url) {
        resolveURL.link = resolveURL.link || document.createElement('a');
        resolveURL.link.href = url;
        return resolveURL.link.href;
    }

    var gameInstance = {
        url: url, // arg
        onProgress: UnityLoader.Progress.handler,
        compatibilityCheck: UnityLoader.compatibilityCheck,
        Module: {
            graphicsAPI: ['WebGL 2.0', 'WebGL 1.0'],
            onAbort: function(what) {
                if (what !== undefined) {
                    this.print(what);
                    this.printErr(what);
                    what = JSON.stringify(what);
                } else {
                    what = '';
                }
                throw 'abort(' + what + ') at ' + this.stackTrace();
            },
            preRun: [],
            postRun: [],
            print: function(message) { console.log(message); },
            printErr: function(message) { console.error(message); },
            Jobs: {},
            buildDownloadProgress: {},
            resolveBuildUrl: function(buildUrl) { return buildUrl.match(/(http|https|ftp|file):\/\//) ? buildUrl : url.substring(0, url.lastIndexOf('/') + 1) + buildUrl; },
            streamingAssetsUrl: function() { return resolveURL(this.resolveBuildUrl('../StreamingAssets')); },
            wasmRequest: function(wasmInstantiate, callback) {
                if (this.wasmCache) {
                    this.wasmCache.request = {
                        wasmInstantiate: wasmInstantiate,
                        callback: callback,
                    };
                    this.wasmCache.update();
                } else {
                    wasmInstantiate(this.wasmBinary).then(function(result) { callback(result.instance); });
                }
            },
        },
        SetFullscreen: function() {
            if (gameInstance.Module.SetFullscreen) {
                return gameInstance.Module.SetFullscreen.apply(gameInstance.Module, arguments);
            }
        },
        SendMessage: function() {
            if (gameInstance.Module.SendMessage) {
                return gameInstance.Module.SendMessage.apply(gameInstance.Module, arguments);
            }
        },
    };

    gameInstance.Module.gameInstance = gameInstance;
    gameInstance.popup = function(message, callbacks) { return UnityLoader.Error.popup(gameInstance, message, callbacks); };
    gameInstance.Module.postRun.push(function() {
        gameInstance.onProgress(gameInstance, 1);
    }); // push to postRun array

    for (var parameter in parameters) {
        if (parameter == 'Module') {
            for (var moduleParameter in parameters[parameter]) {
                gameInstance.Module[moduleParameter] = parameters[parameter][moduleParameter];
            }
        } else {
            gameInstance[parameter] = parameters[parameter];
        }
    }

    if (!instantiate(container, gameInstance)) {
        document.addEventListener('DOMContentLoaded', function() { instantiate(container, gameInstance); });
    }

    return gameInstance;

}