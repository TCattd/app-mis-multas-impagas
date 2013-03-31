is_mobile = false;
in_os = 'android';
is_online = false;

//Carguemos la libreria que corresponda segun useragent
var userAgent = navigator.userAgent.toLowerCase();
//Veamos en que OS estamos y cargamos lo necesario
if (userAgent.match(/android/i)) {
	//Android
	is_mobile = true;
	in_os = 'android';
} else if (userAgent.match(/iphone/i) || userAgent.match(/ipod/i) || userAgent.match(/ipad/i)) {
	//iOS
	is_mobile = true;
	in_os = 'ios';
} else if (userAgent.match(/blackberry/i) || userAgent.match(/playbook/i)) {
	//Blackberry
    is_mobile = true;
    in_os = 'blackberry';
} else {
	//Chrome y ChromeOS
	is_mobile = false;
	in_os = 'chrome';
}

//Android, iOS y BlackBerry
if(is_mobile) {

	var gaPlugin;

	function onDeviceReady(){

		//Matamos el splash screen
		navigator.splashscreen.hide();

		if(in_os == 'android') {
		}

		if(in_os == 'ios') {
			var childBrowser = ChildBrowser.install();
			if(childBrowser != null) {
				childBrowser.onLocationChange = function(loc){ root.locChanged(loc); };
				childBrowser.onClose = function(){root.onCloseBrowser()};
				childBrowser.onOpenExternal = function(){root.onOpenExternal();};
			}
		} //device ready

	}//onDeviceReady

	//Para ver si estamos online u offline
	var is_online = false;
	function onlineFunction() {
		is_online = true;
	}
	function offlineFunction() {
		is_online = false;
	}

	//Esperamos el Phonegap ready
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("offline", offlineFunction, false);
	document.addEventListener("online", onlineFunction, false);

	//Marcamos con Analytics
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(successHandler, errorHandler, "UA-238358-49", 10);
    gaPlugin.trackPage( successHandler, successHandler, "/index.html");

}//is_mobile

if(!is_mobile) {
	//Como verifico que tengo conexion en el PC?
	//Sin usar un sucio truco javascript, claro
	is_online = true;
}

//Salir del app
function kmn_exit() {
	navigator.device.exitApp();
}

//Lorem
function nullfunc() {
	return false;
}

//GA
function successHandler() {
	return true;
}
function errorHandler() {
	return false;
}