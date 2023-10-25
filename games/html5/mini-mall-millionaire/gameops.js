var $hxClasses = {};

var DateTools = function() { };
$hxClasses["DateTools"] = DateTools;
DateTools.__name__ = ["DateTools"];
DateTools.__format_get = function(d,e) {
	switch(e) {
	case "%":
		return "%";
	case "C":
		return StringTools.lpad(Std.string(Std["int"](d.getFullYear() / 100)),"0",2);
	case "d":
		return StringTools.lpad(Std.string(d.getDate()),"0",2);
	case "D":
		return DateTools.__format(d,"%m/%d/%y");
	case "e":
		return Std.string(d.getDate());
	case "H":case "k":
		return StringTools.lpad(Std.string(d.getHours()),e == "H"?"0":" ",2);
	case "I":case "l":
		var hour = d.getHours() % 12;
		return StringTools.lpad(Std.string(hour == 0?12:hour),e == "I"?"0":" ",2);
	case "m":
		return StringTools.lpad(Std.string(d.getMonth() + 1),"0",2);
	case "M":
		return StringTools.lpad(Std.string(d.getMinutes()),"0",2);
	case "n":
		return "\n";
	case "p":
		if(d.getHours() > 11) return "PM"; else return "AM";
		break;
	case "r":
		return DateTools.__format(d,"%I:%M:%S %p");
	case "R":
		return DateTools.__format(d,"%H:%M");
	case "s":
		return Std.string(Std["int"](d.getTime() / 1000));
	case "S":
		return StringTools.lpad(Std.string(d.getSeconds()),"0",2);
	case "t":
		return "\t";
	case "T":
		return DateTools.__format(d,"%H:%M:%S");
	case "u":
		var t = d.getDay();
		if(t == 0) return "7"; else if(t == null) return "null"; else return "" + t;
		break;
	case "w":
		return Std.string(d.getDay());
	case "y":
		return StringTools.lpad(Std.string(d.getFullYear() % 100),"0",2);
	case "Y":
		return Std.string(d.getFullYear());
	default:
		throw "Date.format %" + e + "- not implemented yet.";
	}
};
DateTools.__format = function(d,f) {
	var r = new StringBuf();
	var p = 0;
	while(true) {
		var np = f.indexOf("%",p);
		if(np < 0) break;
		r.addSub(f,p,np - p);
		r.add(DateTools.__format_get(d,HxOverrides.substr(f,np + 1,1)));
		p = np + 2;
	}
	r.addSub(f,p,f.length - p);
	return r.b;
};
DateTools.format = function(d,f) {
	return DateTools.__format(d,f);
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var com = {};
com.funtomic = {};
com.funtomic.GameOpsStatus = $hxClasses["com.funtomic.GameOpsStatus"] = { __ename__ : ["com","funtomic","GameOpsStatus"], __constructs__ : ["UNINITIALIZED","INITIALIZING","INITIALIZED","QUITTING"] };
com.funtomic.GameOpsStatus.UNINITIALIZED = ["UNINITIALIZED",0];
com.funtomic.GameOpsStatus.UNINITIALIZED.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.INITIALIZING = ["INITIALIZING",1];
com.funtomic.GameOpsStatus.INITIALIZING.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.INITIALIZED = ["INITIALIZED",2];
com.funtomic.GameOpsStatus.INITIALIZED.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOpsStatus.QUITTING = ["QUITTING",3];
com.funtomic.GameOpsStatus.QUITTING.__enum__ = com.funtomic.GameOpsStatus;
com.funtomic.GameOps = function() { };
$hxClasses["com.funtomic.GameOps"] = com.funtomic.GameOps;
com.funtomic.GameOps.__name__ = ["com","funtomic","GameOps"];
com.funtomic.GameOps.init = function(pDomain,pGameVersion,pDefaultConfig,pGameState,callback) {
	console.log('Initialized called : gameops api');
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.UNINITIALIZED) return;
	com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.INITIALIZING;
	com.funtomic.GameOps.domain = pDomain;
	com.funtomic.GameOps.gameVersion = pGameVersion;
	com.funtomic.GameOpsStorage.init();
	com.funtomic.GameOps.readLocalStorage();
	com.funtomic.GameOps.readGameStateLocalStorage();
	com.funtomic.GameOps.url = window.location.href;
	com.funtomic.GameOps.startTimer("session");
	com.funtomic.GameOps.platform = "web";
	com.funtomic.GameOps.isNative = false;
	com.funtomic.GameOps.sessionId = com.funtomic.GameOps.generateRandomString(20);
	if(com.funtomic.GameOps.localStorage.installDate == null) {
		com.funtomic.GameOps.localStorage.installDate = Math.round(new Date().getTime() / 1000);
		com.funtomic.GameOps.firstSession = true;
		com.funtomic.GameOps.reportEvent("first_run");
	}
	com.funtomic.GameOps.elapsedGameTime = com.funtomic.GameOps.storageGet("FuntomicGameOps-ElapsedGameTime",0);
	if(com.funtomic.GameOps.localStorage.elapsedGameTime != null) {
		com.funtomic.GameOps.elapsedGameTime = com.funtomic.GameOps.localStorage.elapsedGameTime;
		Reflect.deleteField(com.funtomic.GameOps.localStorage,"elapsedGameTime");
	}
	if(com.funtomic.GameOps.localStorage.originalVersion == null) com.funtomic.GameOps.localStorage.originalVersion = com.funtomic.GameOps.gameVersion;
	com.funtomic.GameOps.elapsedPlayTimeAtInit = com.funtomic.GameOps.elapsedGameTime;
	com.funtomic.GameOps.userID = com.funtomic.GameOps.localStorage.userID;
	var html5ApiUserId = com.funtomic.GameOps.HTML5API_getUserId();
	if(html5ApiUserId != null) com.funtomic.GameOps.userID = html5ApiUserId;
	com.funtomic.GameOps.levelsWon = 0;
	if(com.funtomic.GameOps.localStorage.config == null || com.funtomic.GameOps.localStorage.configForVersion != null && com.funtomic.GameOps.localStorage.configForVersion != com.funtomic.GameOps.gameVersion) com.funtomic.GameOps.localStorage.config = pDefaultConfig;
	com.funtomic.GameOps.gameConfig = com.funtomic.GameOps.localStorage.config;
	if(com.funtomic.GameOps.localStorage.isSynced == null) com.funtomic.GameOps.localStorage.isSynced = false;
	if(com.funtomic.GameOps.localStorage.experimentId != null) com.funtomic.GameOps.experimentId = com.funtomic.GameOps.localStorage.experimentId;
	if(com.funtomic.GameOps.localStorage.alternativeId != null) com.funtomic.GameOps.alternativeId = com.funtomic.GameOps.localStorage.alternativeId;
	var lastSessionEndEvent = com.funtomic.GameOps.storageGet("FuntomicGameOps-SessionEndEvent",null);
	if(lastSessionEndEvent != null) {
		com.funtomic.GameOps.reportEvents([lastSessionEndEvent]);
		com.funtomic.GameOps.storageRemove("FuntomicGameOps-SessionEndEvent");
	}
	var prefix = null;
	if(Reflect.field(window.document,"hidden") != null) prefix = ""; else if(Reflect.field(window.document,"webkitHidden")) prefix = "webkit";
	var onVisibilityChanged = function(_) {
		com.funtomic.GameOps.isHidden = Reflect.field(window.document,prefix == ""?"hidden":prefix + "Hidden");
		if(com.funtomic.GameOps.isHidden) com.funtomic.GameOps.sessionEnd();
		com.funtomic.GameOps.pauseTimers(com.funtomic.GameOps.isHidden);
	};
	var onPageTransitionChange = function(event) {
		com.funtomic.GameOps.isHidden = event.type == "pagehide";
		if(com.funtomic.GameOps.isHidden) com.funtomic.GameOps.sessionEnd();
		com.funtomic.GameOps.pauseTimers(com.funtomic.GameOps.isHidden);
	};
	if(prefix != null) window.document.addEventListener(prefix + "visibilitychange",onVisibilityChanged,false); else {
		window.addEventListener("pageshow",onPageTransitionChange,false);
		window.addEventListener("pagehide",onPageTransitionChange,false);
	}
	var sessionEndTimer = new haxe.Timer(5000);
	sessionEndTimer.run = function() {
		com.funtomic.GameOps.sessionEnd();
	};
	com.funtomic.GameOps.reportEvent("session_start");
	com.funtomic.GameOps.gameStateGameOpsData.elapsed_game_time = com.funtomic.GameOps.elapsedGameTime;
	com.funtomic.GameOps.gameStateGameOpsData.install_date = com.funtomic.GameOps.localStorage.installDate;
	com.funtomic.GameOps.writeLocalStorage();
	com.funtomic.GameOps.writeGameStateLocalStorage();
	pGameState.game_ops_data = com.funtomic.GameOps.gameStateGameOpsData;
	com.funtomic.GameOps.loadGameConfig(pGameState,callback);
};
com.funtomic.GameOps.loadGameConfig = function(gameState,callback) {
	com.funtomic.GameOpsLogger.verbose(["Fetching game config for: ",com.funtomic.GameOps.domain]);
	var request = new haxe.Http(null);
	request.url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiConfigLocation;
	request.setParameter("domain",com.funtomic.GameOps.domain);
	request.setParameter("game_state",JSON.stringify(gameState));
	request.setParameter("game_ops_version",com.funtomic.GameOps.gameOpsVersion);
	request.setParameter("game_version",com.funtomic.GameOps.gameVersion);
	request.setParameter("platform_name",com.funtomic.GameOps.platform);
	if(com.funtomic.GameOps.userID != null) request.setParameter("user_id",com.funtomic.GameOps.userID);
	if(com.funtomic.GameOps.experimentId != null) request.setParameter("experiment_id",com.funtomic.GameOps.experimentId);
	if(com.funtomic.GameOps.alternativeId != null) request.setParameter("alternative_id",com.funtomic.GameOps.alternativeId);
	if(com.funtomic.GameOps.localStorage.userEmail != null) request.setParameter("user_email",com.funtomic.GameOps.localStorage.userEmail);
	if(com.funtomic.GameOps.localStorage.configMd5 != null) request.setParameter("config_md5",com.funtomic.GameOps.localStorage.configMd5);
	request.onData = function(data) {
		com.funtomic.GameOps.onConfigLoadSuccess(data);
		if(callback != null) callback(true);
		com.funtomic.GameOps.afterInit();
	};
	request.onStatus = com.funtomic.GameOps.onConfigLoadReturned;
	request.onError = function(msg) {
		com.funtomic.GameOps.IOErrorHandler(msg);
		com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.UNINITIALIZED;
		if(callback != null) callback(false);
		com.funtomic.GameOps.afterInit();
	};
	request.request(true);
};
com.funtomic.GameOps.onConfigLoadReturned = function(status) {
	switch(status) {
	case 500:
		com.funtomic.GameOps.onConfigLoadFailure();
		break;
	case 0:
		com.funtomic.GameOps.onConfigLoadTimeout();
		break;
	}
};
com.funtomic.GameOps.onConfigLoadTimeout = function() {
	com.funtomic.GameOpsLogger.error(["Timeout while fetching game config from server"]);
};
com.funtomic.GameOps.onConfigLoadFailure = function() {
	com.funtomic.GameOpsLogger.error(["Error loading config"]);
};
com.funtomic.GameOps.IOErrorHandler = function(msg) {
	com.funtomic.GameOpsLogger.error(["Error caught ",msg]);
};
com.funtomic.GameOps.onConfigLoadSuccess = function(resultString) {
	var result = JSON.parse(resultString);
	com.funtomic.GameOpsLogger.verbose(["Config successfuly loaded",resultString]);
	if(result != null) {
		if(result.user_id != null) {
			com.funtomic.GameOps.userID = result.user_id;
			com.funtomic.GameOps.localStorage.userID = result.user_id;
		}
		if(result.is_debug_mode) com.funtomic.GameOps.isDebugMode = result.is_debug_mode;
		if(result.install_date) com.funtomic.GameOps.localStorage.installDate = result.install_date;
		com.funtomic.GameOps.experimentId = result.experiment_id;
		com.funtomic.GameOps.localStorage.experimentId = com.funtomic.GameOps.experimentId;
		com.funtomic.GameOps.alternativeId = result.alternative_id;
		com.funtomic.GameOps.localStorage.alternativeId = com.funtomic.GameOps.alternativeId;
		if(result.config != null) com.funtomic.GameOps.localStorage.config = result.config;
		com.funtomic.GameOps.gameConfig = com.funtomic.GameOps.localStorage.config;
		com.funtomic.GameOps.localStorage.configMd5 = result.config_md5;
		com.funtomic.GameOps.localStorage.configForVersion = com.funtomic.GameOps.gameVersion;
		com.funtomic.GameOps.localStorage.googlePublicKey = result.google_public_key;
		com.funtomic.GameOps.localStorage.appstoreId = result.appstore_id;
		com.funtomic.GameOps.writeLocalStorage();
		com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.INITIALIZED;
		com.funtomic.GameOps.reportUnsentEvents();
	}
};
com.funtomic.GameOps.afterInit = function() {
	if(com.funtomic.GameOps.alternativeId != null) com.funtomic.GameOps.HTML5API_setAlternativeId();
	var HTML5API_params = { game_ops_version : com.funtomic.GameOps.gameOpsVersion, game_version : com.funtomic.GameOps.gameVersion, game_session_id : com.funtomic.GameOps.sessionId, game_user_id : com.funtomic.GameOps.userID};
	if(com.funtomic.GameOps.experimentId != null) HTML5API_params.game_experiment_id = com.funtomic.GameOps.experimentId;
	if(com.funtomic.GameOps.alternativeId != null) HTML5API_params.game_alternative_id = com.funtomic.GameOps.alternativeId;
	com.funtomic.GameOps.HTML5API_reportCustomEvent("game_ops_data",HTML5API_params);
	com.funtomic.GameOpsLogger.debug(["Executing " + com.funtomic.GameOps.deferredReportEvents.length + " deferred event report calls"]);
	var _g = 0;
	var _g1 = com.funtomic.GameOps.deferredReportEvents;
	while(_g < _g1.length) {
		var repotEventFunc = _g1[_g];
		++_g;
		repotEventFunc();
	}
	com.funtomic.GameOps.deferredReportEvents = new Array();
};
com.funtomic.GameOps.getConfig = function() {
	return com.funtomic.GameOps.gameConfig;
};
com.funtomic.GameOps.getEventsStaticParams = function(events) {
	var data = { domain : com.funtomic.GameOps.domain, uuid : com.funtomic.GameOps.userID, platform : com.funtomic.GameOps.platform, is_native : com.funtomic.GameOps.isNative, is_synced : com.funtomic.GameOps.localStorage.isSynced, install_date : com.funtomic.GameOps.localStorage.installDate, original_version : com.funtomic.GameOps.localStorage.originalVersion, partial_data : com.funtomic.GameOps.localStorage.partialData, is_in_kizi_app : com.funtomic.GameOps.isInKiziApp(), events : events};
	if(com.funtomic.GameOps.localStorage.isConverted != null) data.is_converted = com.funtomic.GameOps.localStorage.isConverted;
	if(com.funtomic.GameOps.mediaSource != null) data.media_source = com.funtomic.GameOps.mediaSource;
	if(com.funtomic.GameOps.campaignName != null) data.campaign_name = com.funtomic.GameOps.campaignName;
	return data;
};
com.funtomic.GameOps.reportEvents = function(events) {
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) {
		com.funtomic.GameOps.queueEvents(events);
		return;
	}
	var data = com.funtomic.GameOps.getEventsStaticParams(events);
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiEventsLocation;
	var request = new haxe.Http(url);
	request.addParameter("data",JSON.stringify(data));
	com.funtomic.GameOpsLogger.verbose(["Posting event to:",url]);
	request.onData = com.funtomic.GameOps.eventReportSucceeded;
	request.onStatus = function(status) {
		com.funtomic.GameOps.onEventReportReturned(status,events);
	};
	request.onError = com.funtomic.GameOps.IOErrorHandler;
	request.request(true);
	com.funtomic.GameOps.sessionEnd();
};
com.funtomic.GameOps.onEventReportReturned = function(status,events) {
	switch(status) {
	case 500:
		com.funtomic.GameOps.eventReportFailed();
		break;
	case 0:
		com.funtomic.GameOps.eventReportTimeout(events);
		break;
	}
};
com.funtomic.GameOps.eventReportTimeout = function(events) {
	com.funtomic.GameOpsLogger.error(["Report event timeout"]);
	com.funtomic.GameOps.queueEvents(events);
};
com.funtomic.GameOps.eventReportFailed = function() {
	com.funtomic.GameOpsLogger.error(["Report event failed"]);
	com.funtomic.GameOps.localStorage.unsentEvents = new Array();
	com.funtomic.GameOps.writeLocalStorage();
};
com.funtomic.GameOps.eventReportSucceeded = function(data) {
	com.funtomic.GameOpsLogger.verbose(["Event Posted " + data]);
	com.funtomic.GameOps.reportUnsentEvents();
};
com.funtomic.GameOps.reportEvent = function(eventType,params) {
	console.log('reportEvent called : gameops api');
	if(com.funtomic.GameOps.isEventsTraceOnly) {
		haxe.Log.trace(eventType,{ fileName : "GameOps.hx", lineNumber : 509, className : "com.funtomic.GameOps", methodName : "reportEvent", customParams : [params]});
		return;
	}
	var _g = com.funtomic.GameOps.status;
	switch(_g[1]) {
	case 1:
		com.funtomic.GameOps.deferredReportEvents.push(function() {
			com.funtomic.GameOps.reportEvent(eventType,params);
		});
		break;
	default:
		var event = com.funtomic.GameOps.prepareEventObject(eventType,params);
		com.funtomic.GameOps.reportEvents([event]);
	}
};
com.funtomic.GameOps.prepareEventObject = function(eventType,params) {
	var date = DateTools.format(new Date(),"%Y-%m-%d %H:%M:%S");
	var tmpDate = Std.string(new Date());
	var timezone;
	var pos = tmpDate.indexOf("+");
	timezone = HxOverrides.substr(tmpDate,pos,5);
	date += timezone;
	var event = { event_type : eventType, date : date};
	if(com.funtomic.GameOps.experimentId != null) event.experiment_id = com.funtomic.GameOps.experimentId;
	if(com.funtomic.GameOps.alternativeId != null) event.alternative_id = com.funtomic.GameOps.alternativeId;
	event.elapsed_play_time = Math.round(com.funtomic.GameOps.elapsedPlayTimeAtInit + com.funtomic.GameOps.sampleTimer("session") / 1000);
	event.session_id = com.funtomic.GameOps.sessionId;
	event.game_ops_version = com.funtomic.GameOps.gameOpsVersion;
	event.game_version = com.funtomic.GameOps.gameVersion;
	if(com.funtomic.GameOps.url != null) event.url = com.funtomic.GameOps.url;
	if(com.funtomic.GameOps.firstSession) event.first_session = true;
	if(com.funtomic.GameOps.fbId != null) event.fb_id = com.funtomic.GameOps.fbId;
	event = com.funtomic.GameOps.extendObject(event,params);
	return event;
};
com.funtomic.GameOps.queueEvents = function(events) {
	com.funtomic.GameOpsLogger.verbose(["Queuing events:" + JSON.stringify(events)]);
	if(com.funtomic.GameOps.localStorage.unsentEvents == null) com.funtomic.GameOps.localStorage.unsentEvents = new Array();
	var _g = 0;
	while(_g < events.length) {
		var event = events[_g];
		++_g;
		com.funtomic.GameOps.localStorage.unsentEvents.push(event);
	}
	if(com.funtomic.GameOps.localStorage.unsentEvents.length > com.funtomic.GameOps.MAX_SAVED_UNSENT_EVENTS) {
		com.funtomic.GameOps.localStorage.unsentEvents = new Array();
		com.funtomic.GameOps.localStorage.partialData = true;
	}
	com.funtomic.GameOps.writeLocalStorage();
	com.funtomic.GameOpsLogger.verbose(["There are now " + Std.string(com.funtomic.GameOps.localStorage.unsentEvents.length) + " unsent events."]);
};
com.funtomic.GameOps.reportUnsentEvents = function() {
	if(com.funtomic.GameOps.localStorage.unsentEvents != null && com.funtomic.GameOps.localStorage.unsentEvents.length > 0) {
		com.funtomic.GameOpsLogger.verbose(["reporting unsent events",com.funtomic.GameOps.localStorage.unsentEvents.length]);
		com.funtomic.GameOps.reportEvents(com.funtomic.GameOps.localStorage.unsentEvents);
		com.funtomic.GameOps.localStorage.unsentEvents = new Array();
		com.funtomic.GameOps.writeLocalStorage();
	}
};
com.funtomic.GameOps.levelStarted = function(levelNumber,extraParams) {
	console.log('Level started : gameops.api');
	com.funtomic.GameOps.startTimer("level_" + levelNumber);
	com.funtomic.GameOps.levelsNumbers.push(levelNumber);
	if(com.funtomic.GameOps.gameStateGameOpsData.progress == null) com.funtomic.GameOps.gameStateGameOpsData.progress = { };
	if(com.funtomic.GameOps.gameStateGameOpsData.progress.top_level == null || com.funtomic.GameOps.gameStateGameOpsData.progress.top_level < levelNumber) {
		com.funtomic.GameOps.gameStateGameOpsData.progress.top_level = levelNumber;
		com.funtomic.GameOps.writeGameStateLocalStorage();
	}
	var data = { level : levelNumber};
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	com.funtomic.GameOps.reportEvent("level_started",data);
};
com.funtomic.GameOps.levelEnded = function(levelNumber,won,extraParams) {
	console.log('Level ended : gameops.api');
	var levelDuration = com.funtomic.GameOps.stopTimer("level_" + levelNumber);
	if(levelDuration == -1) {
		com.funtomic.GameOpsLogger.error(["levelEnded was called without a matching startLevel!"]);
		return;
	}
	if(won) com.funtomic.GameOps.levelsWon++;
	var data = { level : levelNumber, level_duration : Math.round(levelDuration / 1000), won : won == null?"null":"" + won};
	if(com.funtomic.GameOps.movesDuration.length > 0) {
		data.moves_duration = com.funtomic.GameOps.movesDuration.join(",");
		com.funtomic.GameOps.movesDuration = new Array();
	}
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	com.funtomic.GameOps.reportEvent("level_ended",data);
	if(won && levelNumber == com.funtomic.GameOps.lastLevelNumber) com.funtomic.GameOps.reportEvent("game_completion");
};
com.funtomic.GameOps.sessionEnd = function(sendInNextPlay,extraParams) {
	if(sendInNextPlay == null) sendInNextPlay = true;
	var sessionDuration = com.funtomic.GameOps.sampleTimer("session");
	if(sessionDuration == -1) {
		com.funtomic.GameOpsLogger.error(["sessionEnd was called without a matching sessionStart!"]);
		return;
	}
	var lnu = new Array();
	var _g = 0;
	var _g1 = com.funtomic.GameOps.levelsNumbers;
	while(_g < _g1.length) {
		var lvlNum = _g1[_g];
		++_g;
		if(HxOverrides.indexOf(lnu,lvlNum,0) == -1) lnu.push(lvlNum);
	}
	var data = { session_duration : Math.round(sessionDuration / 1000), levels_numbers : lnu.toString(), won_percent : 0, levels_count : com.funtomic.GameOps.levelsNumbers.length, levels_won : com.funtomic.GameOps.levelsWon, sent_by : "application"};
	if(extraParams != null) data = com.funtomic.GameOps.extendObject(extraParams,data);
	if(data.levels_count > 0) data.won_percent = com.funtomic.GameOps.levelsWon / com.funtomic.GameOps.levelsNumbers.length * 100;
	com.funtomic.GameOps.updateTotalElapsedTime(sessionDuration / 1000);
	var event = com.funtomic.GameOps.prepareEventObject("session_end",data);
	if(sendInNextPlay) {
		com.funtomic.GameOpsLogger.verbose(["writing session end event to local storage"]);
		com.funtomic.GameOps.storageSet("FuntomicGameOps-SessionEndEvent",event);
	} else com.funtomic.GameOps.reportEvents([event]);
};
com.funtomic.GameOps.setLastLevelNumber = function(pLastLevelNumber) {
	com.funtomic.GameOps.lastLevelNumber = pLastLevelNumber;
};
com.funtomic.GameOps.updateTotalElapsedTime = function(sessionDuration) {
	com.funtomic.GameOps.storageSet("FuntomicGameOps-ElapsedGameTime",com.funtomic.GameOps.elapsedPlayTimeAtInit + sessionDuration);
};
com.funtomic.GameOps.startTimer = function(key) {
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' started."]);
	Reflect.setField(com.funtomic.GameOps.timers,key,[com.funtomic.GameOps.getTimestamp(),0.0]);
};
com.funtomic.GameOps.sampleTimer = function(key,remove) {
	if(remove == null) remove = false;
	if(Reflect.field(com.funtomic.GameOps.timers,key) == null) return -1;
	var elapsed = Reflect.field(com.funtomic.GameOps.timers,key)[1];
	if(Reflect.field(com.funtomic.GameOps.timers,key)[0] != 0) elapsed += com.funtomic.GameOps.getTimestamp() - Reflect.field(com.funtomic.GameOps.timers,key)[0];
	if(remove) Reflect.deleteField(com.funtomic.GameOps.timers,key);
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' sampled. Current elapsed time is " + elapsed]);
	return elapsed;
};
com.funtomic.GameOps.stopTimer = function(key) {
	com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' stopped"]);
	return com.funtomic.GameOps.sampleTimer(key,true);
};
com.funtomic.GameOps.pauseTimers = function(state) {
	if(state == null) state = true;
	var _g = 0;
	var _g1 = Reflect.fields(com.funtomic.GameOps.timers);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		if(state) {
			if(Reflect.field(com.funtomic.GameOps.timers,key)[0] != 0) {
				Reflect.field(com.funtomic.GameOps.timers,key)[1] += com.funtomic.GameOps.getTimestamp() - Reflect.field(com.funtomic.GameOps.timers,key)[0];
				Reflect.field(com.funtomic.GameOps.timers,key)[0] = 0;
				com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' paused at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " ms"]);
			} else com.funtomic.GameOpsLogger.verbose(["NOTE: Timer '" + key + "' attempt to pause at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " **but was already paused**"]);
		} else if(Reflect.field(com.funtomic.GameOps.timers,key)[0] == 0) {
			Reflect.field(com.funtomic.GameOps.timers,key)[0] = com.funtomic.GameOps.getTimestamp();
			com.funtomic.GameOpsLogger.verbose(["Timer '" + key + "' unpaused at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " ms"]);
		} else com.funtomic.GameOpsLogger.verbose(["NOTE: Timer '" + key + "' attempt to unpause at " + Reflect.field(com.funtomic.GameOps.timers,key)[1] + " **but was already unpaused**"]);
	}
};
com.funtomic.GameOps.saveGameState = function(gameState,key,callback,usesNum,expiryDays) {
	if(expiryDays == null) expiryDays = 7;
	if(usesNum == null) usesNum = 1;
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) return;
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiTokensLocation;
	com.funtomic.GameOpsLogger.verbose(["Getting a token:",url]);
	var request = new haxe.Http(url);
	request.addParameter("domain",com.funtomic.GameOps.domain);
	request.addParameter("game_state",JSON.stringify(gameState));
	request.addParameter("user_id",Std.string(com.funtomic.GameOps.userID));
	request.addParameter("expiry_days",expiryDays == null?"null":"" + expiryDays);
	if(key != null) request.addParameter("key",key); else if(com.funtomic.GameOps.fbId != null) request.addParameter("key",com.funtomic.GameOps.fbId); else request.addParameter("uses_num",usesNum == null?"null":"" + usesNum);
	request.onData = function(resultString) {
		var result = JSON.parse(resultString);
		if(result != null) {
			if(result.error_msg != null) com.funtomic.GameOpsLogger.error(["Error caught:",result.error_msg]); else {
				com.funtomic.GameOpsLogger.verbose(["Saved game state under key:",result.token]);
				if(callback != null) callback(result.token);
			}
		}
	};
	request.onError = com.funtomic.GameOps.IOErrorHandler;
	request.request(true);
};
com.funtomic.GameOps.loadGameState = function(key,callback) {
	if(com.funtomic.GameOps.status != com.funtomic.GameOpsStatus.INITIALIZED) {
		if(callback != null) callback(false,null);
		return;
	}
	if(key == null) {
		if(com.funtomic.GameOps.fbId == null) {
			com.funtomic.GameOpsLogger.error(["Calling loadGameState() without a key is only possible after calling successfully logging in to FB via FBLogin()"]);
			if(callback != null) callback(false,null);
			return;
		}
		key = com.funtomic.GameOps.fbId;
	}
	var url = com.funtomic.GameOps.apiURLPrefix + com.funtomic.GameOps.apiTokensLocation + key;
	com.funtomic.GameOpsLogger.verbose(["Fetching game state for key:",key]);
	var request = new haxe.Http(url + "?domain=" + com.funtomic.GameOps.domain);
	request.onData = function(resultString) {
		var result = JSON.parse(resultString);
		if(result != null && result.game_state != null) {
			com.funtomic.GameOpsLogger.verbose(["Fetched game state:",result.game_state]);
			com.funtomic.GameOps.localStorage.isSynced = true;
			com.funtomic.GameOps.writeLocalStorage();
			com.funtomic.GameOps.reportEvent("load_game_state",{ previous_uuid : result.user_id});
			if(callback != null) callback(true,JSON.parse(result.game_state));
		} else if(callback != null) callback(false,null);
	};
	request.onError = function(msg) {
		com.funtomic.GameOps.IOErrorHandler(msg);
		callback(false,null);
	};
	request.request(false);
};
com.funtomic.GameOps.getTimestamp = function() {
	return new Date().getTime();
};
com.funtomic.GameOps.extendObject = function(obj1,obj2) {
	var _g = 0;
	var _g1 = Reflect.fields(obj2);
	while(_g < _g1.length) {
		var k = _g1[_g];
		++_g;
		var value = Reflect.field(obj2,k);
		var key;
		if(k == null) key = "null"; else key = "" + k;
		obj1[key] = value;
	}
	return obj1;
};
com.funtomic.GameOps.generateRandomString = function(strlen) {
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var num_chars = chars.length - 1;
	var randomChar = "";
	var _g = 0;
	while(_g < strlen) {
		var i = _g++;
		randomChar += chars.charAt(Math.floor(Math.random() * num_chars));
	}
	return randomChar;
};
com.funtomic.GameOps.storageSet = function(key,value) {
	return com.funtomic.GameOpsStorage.set(com.funtomic.GameOps.domain + key,value);
};
com.funtomic.GameOps.storageGet = function(key,defaultValue) {
	return com.funtomic.GameOpsStorage.get(com.funtomic.GameOps.domain + key,defaultValue);
};
com.funtomic.GameOps.storageRemove = function(key) {
	com.funtomic.GameOpsStorage.remove(com.funtomic.GameOps.domain + key);
};
com.funtomic.GameOps.writeLocalStorage = function() {
	com.funtomic.GameOps.storageSet("FuntomicGameOps",com.funtomic.GameOps.localStorage);
};
com.funtomic.GameOps.writeGameStateLocalStorage = function() {
	com.funtomic.GameOps.storageSet("FuntomicGameOps-GameState",com.funtomic.GameOps.gameStateGameOpsData);
};
com.funtomic.GameOps.readLocalStorage = function() {
	com.funtomic.GameOps.localStorage = com.funtomic.GameOps.storageGet("FuntomicGameOps",{ });
};
com.funtomic.GameOps.readGameStateLocalStorage = function() {
	com.funtomic.GameOps.gameStateGameOpsData = com.funtomic.GameOps.storageGet("FuntomicGameOps-GameState",{ });
};
com.funtomic.GameOps.setFlag = function(name) {
	if(Reflect.field(com.funtomic.GameOps.flags,name) == true) {
		com.funtomic.GameOpsLogger.debug([name + " is already running."]);
		return false;
	} else {
		com.funtomic.GameOps.flags[name] = true;
		return true;
	}
};
com.funtomic.GameOps.unsetFlag = function(name) {
	Reflect.deleteField(com.funtomic.GameOps.flags,name);
};
com.funtomic.GameOps.callHTML5APIFunction = function(functionName,params) {
	var HTML5API = Reflect.field(window,"HTML5API");
	if(HTML5API == null) return null;
	var fn = Reflect.field(HTML5API,functionName);
	if(fn == null) return null;
	var returned;
	if((params instanceof Array) && params.__enum__ == null) returned = fn.apply(HTML5API,params); else returned = fn.apply(HTML5API,[params]);
	com.funtomic.GameOps.reportEvent("html5api_called",{ function_name : functionName, function_returned : returned, params : JSON.stringify(params)});
	return returned;
};
com.funtomic.GameOps.isInKiziApp = function() {
	return Reflect.field(window,"jsinterface") != null;
};
com.funtomic.GameOps.HTML5API_levelStarted = function(params) {
	console.log("HTML5API level started : gameops api ");
	com.funtomic.GameOps.callHTML5APIFunction("levelStarted",params);
};
com.funtomic.GameOps.HTML5API_levelEnded = function(params) {
	console.log("HTML5API Level ended : gameops api ");
	com.funtomic.GameOps.callHTML5APIFunction("levelEnded",params);
};
com.funtomic.GameOps.HTML5API_preloaderStarted = function(params) {
	console.log("Preloader started called : gameops api ");
	com.funtomic.GameOps.callHTML5APIFunction("preloaderStarted",params);
};
com.funtomic.GameOps.HTML5API_preloaderEnded = function(params) {
	console.log("Preloader ended called : gameops api ");
	com.funtomic.GameOps.callHTML5APIFunction("preloaderEnded",params);
};
com.funtomic.GameOps.HTML5API_showStartButton = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("showStartButton");
};
com.funtomic.GameOps.HTML5API_isAdPlaying = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("isAdPlaying");
};
com.funtomic.GameOps.HTML5API_onAdStart = function(callback) {
	com.funtomic.GameOps.callHTML5APIFunction("onAdStart",callback);
};
com.funtomic.GameOps.HTML5API_onAdComplete = function(callback) {
	com.funtomic.GameOps.callHTML5APIFunction("onAdComplete",callback);
};
com.funtomic.GameOps.HTML5API_isMidrollPending = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("isMidrollPending");
};
com.funtomic.GameOps.HTML5API_displayMidroll = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("displayMidroll");
};
com.funtomic.GameOps.HTML5API_setWidgetState = function(params) {
	com.funtomic.GameOps.callHTML5APIFunction("setWidgetState",params);
};
com.funtomic.GameOps.HTML5API_sendLocalNotification = function(delaySconds,iconUrl,title,text,bigContentTitle,bigContentText,gameExtras) {
	return com.funtomic.GameOps.callHTML5APIFunction("sendLocalNotification",[delaySconds,iconUrl,title,text,bigContentTitle,bigContentText,gameExtras]);
};
com.funtomic.GameOps.HTML5API_cancelLocalNotification = function(id) {
	com.funtomic.GameOps.callHTML5APIFunction("cancelLocalNotification",id);
};
com.funtomic.GameOps.HTML5API_isIncentivizedVideoAvailable = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("isIncentivizedVideoAvailable");
};
com.funtomic.GameOps.HTML5API_showIncentivizedVideo = function(callback) {
	com.funtomic.GameOps.callHTML5APIFunction("showIncentivizedVideo",function(isFullyWatched) {
		com.funtomic.GameOps.reportEvent("HTML5API_IncentivizedVideoWatched",{ is_fully_watched : isFullyWatched});
		callback(isFullyWatched);
	});
};
com.funtomic.GameOps.HTML5API_fixTouchBug = function() {
	com.funtomic.GameOps.callHTML5APIFunction("fixTouchBug");
};
com.funtomic.GameOps.HTML5API_reportCustomEvent = function(eventType,params) {
	if(params == null) params = { };
	params.custom_event_name = eventType;
	com.funtomic.GameOps.callHTML5APIFunction("reportCustomEvent",params);
};
com.funtomic.GameOps.HTML5API_getUserId = function() {
	return com.funtomic.GameOps.callHTML5APIFunction("getUserId");
};
com.funtomic.GameOps.HTML5API_setAlternativeId = function() {
	com.funtomic.GameOps.callHTML5APIFunction("setAlternativeId",com.funtomic.GameOps.alternativeId);
};
com.funtomic.GameOpsLogger = function() { };
$hxClasses["com.funtomic.GameOpsLogger"] = com.funtomic.GameOpsLogger;
com.funtomic.GameOpsLogger.__name__ = ["com","funtomic","GameOpsLogger"];
com.funtomic.GameOpsLogger.verbose = function(params) {
	com.funtomic.GameOpsLogger.log(2,params.join(" "));
};
com.funtomic.GameOpsLogger.debug = function(params) {
	com.funtomic.GameOpsLogger.log(1,params.join(" "));
};
com.funtomic.GameOpsLogger.error = function(params) {
	haxe.Log.trace("------------------------------------------------------------",{ fileName : "GameOpsLogger.hx", lineNumber : 18, className : "com.funtomic.GameOpsLogger", methodName : "error"});
	com.funtomic.GameOpsLogger.log(0,"ERROR - " + params.join(" "));
	haxe.Log.trace("------------------------------------------------------------",{ fileName : "GameOpsLogger.hx", lineNumber : 20, className : "com.funtomic.GameOpsLogger", methodName : "error"});
};
com.funtomic.GameOpsLogger.log = function(logLevel,message) {
	if(logLevel <= com.funtomic.GameOpsLogger.logLevel) {
		var now = new Date();
		var datetimeString = now.getDay() + "." + now.getMonth() + "." + now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		haxe.Log.trace(datetimeString + " - Funtomic Tools Log: " + message,{ fileName : "GameOpsLogger.hx", lineNumber : 30, className : "com.funtomic.GameOpsLogger", methodName : "log"});
	}
};
com.funtomic.GameOpsStorage = function() { };
$hxClasses["com.funtomic.GameOpsStorage"] = com.funtomic.GameOpsStorage;
com.funtomic.GameOpsStorage.__name__ = ["com","funtomic","GameOpsStorage"];
com.funtomic.GameOpsStorage.init = function() {
	if(Type.resolveClass("flambe.System") != null) com.funtomic.GameOpsStorage._prefix = "flambe:";
	com.funtomic.GameOpsStorage._storage = window.localStorage;
	com.funtomic.GameOpsStorage._isInitialized = true;
};
com.funtomic.GameOpsStorage.validateInitialized = function() {
	if(!com.funtomic.GameOpsStorage._isInitialized) throw "GameOpsStorage Is Not Initialized!";
};
com.funtomic.GameOpsStorage.reportErrorEvent = function(extraParams) {
	if(com.funtomic.GameOpsStorage._isErrorEventsSent > 3) return;
	com.funtomic.GameOpsStorage._isErrorEventsSent += 1;
	com.funtomic.GameOps.reportEvent("local_storage_error",extraParams);
};
com.funtomic.GameOpsStorage.get_supported = function() {
	return true;
};
com.funtomic.GameOpsStorage.set = function(key,value) {
	com.funtomic.GameOpsStorage.validateInitialized();
	var encoded;
	try {
		var serializer = new haxe.Serializer();
		serializer.useCache = true;
		serializer.useEnumIndex = false;
		serializer.serialize(value);
		encoded = serializer.toString();
	} catch( error ) {
		console.warn("Storage serialization failed:",error);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "Storage serialization failed: " + Std.string(error)});
		return false;
	}
	try {
		com.funtomic.GameOpsStorage._storage.setItem(com.funtomic.GameOpsStorage._prefix + key,encoded);
	} catch( error1 ) {
		console.warn("localStorage.setItem failed:",error1.message);
		var locaStorageSize = -2;
		var isStorageRedirected = Reflect.field(window,"isStorageRedirected") == true;
		try {
			locaStorageSize = JSON.stringify(window.parent.localStorage).length / 1024;
		} catch( error2 ) {
			locaStorageSize = -1;
		}
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.setItem failed: " + Std.string(error1.message), local_storage_size : locaStorageSize, is_storage_redirected : isStorageRedirected});
		com.funtomic.GameOpsStorage.clear();
		return false;
	}
	return true;
};
com.funtomic.GameOpsStorage.get = function(key,defaultValue) {
	com.funtomic.GameOpsStorage.validateInitialized();
	var encoded = null;
	try {
		encoded = com.funtomic.GameOpsStorage._storage.getItem(com.funtomic.GameOpsStorage._prefix + key);
	} catch( error ) {
		console.warn("localStorage.getItem failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.getItem failed: " + Std.string(error.message)});
	}
	if(encoded != null) try {
		return haxe.Unserializer.run(encoded);
	} catch( error1 ) {
		console.warn("Storage unserialization failed:",error1);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "Storage unserialization failed: " + Std.string(error1)});
	}
	return defaultValue;
};
com.funtomic.GameOpsStorage.remove = function(key) {
	com.funtomic.GameOpsStorage.validateInitialized();
	try {
		com.funtomic.GameOpsStorage._storage.removeItem(com.funtomic.GameOpsStorage._prefix + key);
	} catch( error ) {
		console.warn("localStorage.removeItem failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.removeItem failed: " + Std.string(error.message)});
	}
};
com.funtomic.GameOpsStorage.clear = function() {
	com.funtomic.GameOpsStorage.validateInitialized();
	try {
		com.funtomic.GameOpsStorage._storage.clear();
	} catch( error ) {
		console.warn("localStorage.clear failed:",error.message);
		com.funtomic.GameOpsStorage.reportErrorEvent({ error_message : "localStorage.clear failed: " + Std.string(error.message)});
	}
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.prototype = {
	setParameter: function(param,value) {
		this.params = Lambda.filter(this.params,function(p) {
			return p.param != param;
		});
		this.params.push({ param : param, value : value});
		return this;
	}
	,addParameter: function(param,value) {
		this.params.push({ param : param, value : value});
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe.Http
};
haxe.Log = function() { };
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(Math.isNaN(v2)) this.buf.b += "k"; else if(!Math.isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var $it0 = v3.iterator();
					while( $it0.hasNext() ) {
						var i1 = $it0.next();
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(HxOverrides.dateStr(d));
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it1 = v4.keys();
					while( $it1.hasNext() ) {
						var k = $it1.next();
						this.serializeString(k);
						this.serialize(v4.get(k));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it2 = v5.keys();
					while( $it2.hasNext() ) {
						var k1 = $it2.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.get(k1));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it3 = v6.keys();
					while( $it3.hasNext() ) {
						var k2 = $it3.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(this.useCache && this.serializeRef(v)) return;
				this.buf.b += "o";
				this.serializeFields(v);
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw "Cannot serialize function";
				break;
			default:
				throw "Cannot serialize " + Std.string(v);
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.prototype = {
	run: function() {
	}
	,__class__: haxe.Timer
};
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.buf.charCodeAt(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe.Unserializer
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Browser = function() { };
$hxClasses["js.Browser"] = js.Browser;
js.Browser.__name__ = ["js","Browser"];
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
com.funtomic.GameOps.isEventsTraceOnly = false;
com.funtomic.GameOps.apiURLPrefix = "";
com.funtomic.GameOps.gameOpsVersion = "0.7.1";
com.funtomic.GameOps.apiEventsLocation = "v2/events/";
com.funtomic.GameOps.apiTokensLocation = "v1/game_data/";
com.funtomic.GameOps.apiConfigLocation = "v1/config/";
com.funtomic.GameOps.apiSetUserEmailLocation = "v1/user_email_set/";
com.funtomic.GameOps.status = com.funtomic.GameOpsStatus.UNINITIALIZED;
com.funtomic.GameOps.MAX_SAVED_UNSENT_EVENTS = 1000;
com.funtomic.GameOps.localStorage = { };
com.funtomic.GameOps.gameStateGameOpsData = { };
com.funtomic.GameOps.gameOpsNEListeners = { };
com.funtomic.GameOps.flags = { };
com.funtomic.GameOps.productsInfoCache = { };
com.funtomic.GameOps.firstSession = false;
com.funtomic.GameOps.isDebugMode = false;
com.funtomic.GameOps.levelsNumbers = new Array();
com.funtomic.GameOps.deferredReportEvents = new Array();
com.funtomic.GameOps.movesDuration = new Array();
com.funtomic.GameOps.timers = { };
com.funtomic.GameOpsLogger.logLevel = 0;
com.funtomic.GameOpsStorage._prefix = "";
com.funtomic.GameOpsStorage._isErrorEventsSent = 0;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
