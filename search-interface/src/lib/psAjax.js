// ajax ripped out of psQuery, slightly modified
var utils = {
	// isFunction: function(fn) {
	// 	return (!!fn && typeMatch(fn, 'function'));
	// },
	// lastArgumentCallback: function(args, invoke) {
	// 	var lastArgument = args[args.length - 1];
    //
	// 	if (utils.isFunction(lastArgument)) {
	// 		if (invoke) {
	// 			lastArgument();
	// 		}
	// 		return lastArgument;
	// 	} else {
	// 		return undefined;
	// 	}
	// },
	extend: function(target) {
		Array.prototype.slice.call(arguments, 1)
			.forEach(function(source) {
				for (var key in source) {
					if (source[key] !== undefined) {
						target[key] = source[key];
					}
				}
			});
		return target;
	}
};

module.exports = function(url, settings) {
	var args = arguments;
	settings = (args.length === 1 ? args[0] : args[1]);

	var emptyFunction = function() {};

	var defaultSettings = {
		url: (args.length === 2 && typeMatch(url, type_string) ? url : '.'),
		cache: true,
		data: {},
		headers: {},
		context: null,
		type: 'GET',
		success: emptyFunction,
		error: emptyFunction,
		complete: emptyFunction
	};

	settings = utils.extend(defaultSettings, settings || {});

	var mimeTypes = {
		'application/json': 'json',
		'text/html': 'html',
		'text/plain': 'text'
	};

	if (!settings.cache) {
		settings.url = settings.url +
			(settings.url.indexOf('?') ? '&' : '?') +
			'noCache=' +
			Math.floor(Math.random() * 9e9);
	}

    if (settings.type == "GET") {
        for (var prop in settings.data) {
            settings.url += (~settings.url.indexOf("?") ? "&" : "?") + prop + "=" + encodeURIComponent(settings.data[prop]);
        }
    }

	var success = function(data, xhr, settings) {
		var status = 'success';
		settings.success(data, settings.context, status, xhr);
		complete(status, xhr, settings);
	};

	var error = function(error, type, xhr, settings) {
		settings.error(settings.context, xhr, type, error);
		complete(type, xhr, settings);
	};

	var complete = function(status, xhr, settings) {
		settings.complete.call(settings.context, xhr, status);
	};

	var xhr = new XMLHttpRequest();

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState === 4) {
			var result, dataType;

			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				var mime = xhr.getResponseHeader('content-type');
				dataType = mimeTypes[mime] || 'text';
				result = xhr.responseText;

				try {
					if (settings.dataType === 'json') {
						result = JSON.parse(result);
					}

					success(result, xhr, settings);
					return;
				} catch (e) {
                    throw e;
				}
			}

			error(null, 'error', xhr, settings);
			return;
		}
	}, false);


	xhr.open(settings.type, settings.url);

	if (settings.type === 'POST') {
		settings.headers = utils.extend(settings.headers, {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-type': 'application/x-www-form-urlencoded'
		});
	}

	for (var key in settings.headers) {
		xhr.setRequestHeader(key, settings.headers[key]);
	}

	xhr.send(settings.data);

	return this;
};
