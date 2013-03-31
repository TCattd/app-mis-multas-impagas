//DOM ready
$(document).ready(function() {
	//Ajustemos el menu del header
	windowresize();

	//Holo content
	$(".contentinicio").fadeIn('slow');

	//Todos los links #, que fluyan como el agua... my friend, be like void, it stays in the cup...
	$('a[href="#"]').attr('href', 'javascript:void(0);');

	//HOME/Consulta
	tappable('.menubuscar', function(){
		//window.location = 'index.html';
		var thisbutton = '.menubuscar';
		showme = $(thisbutton).attr('rel');
		$(".content").hide();
		$('#'+showme).show();
		$("html, body").animate({ scrollTop: 0 }, "fast");
	    $('.active').removeClass("active");
	    $('.activeboton').removeClass("activeboton");
   		$(thisbutton).addClass("active");

		kmn_limpiarresultados();

		return false;
	});

	//Ayuda
	tappable('.menuayuda', function(){
		//window.location = 'ayuda.html';
		var thisbutton = '.menuayuda';
		showme = $(thisbutton).attr('rel');
		$(".content").hide();
		$('#'+showme).show();
		$("html, body").animate({ scrollTop: 0 }, "fast");
	    $('.active').removeClass("active");
	    $('.activeboton').removeClass("activeboton");
   		$(thisbutton).addClass("active");

		return false;
	});

	//Acerca de
	tappable('.menuacercade', function(){
		//window.location = 'acercade.html';
		var thisbutton = '.menuacercade';
		showme = $(thisbutton).attr('rel');
		$(".content").hide();
		$('#'+showme).show();
		$("html, body").animate({ scrollTop: 0 }, "fast");
	    $('.active').removeClass("active");
	    $('.activeboton').removeClass("activeboton");
   		$(thisbutton).addClass("activeboton");

		return false;
	});

	//Consulta patente
	tappable('#kmn_consultapatente', function(){
		kmn_consulta();
		return false;
	});

	//Limpiar busqueda
	tappable('#buscar_limpiar', function(){
		kmn_limpiarresultados();

		return false;
	});

	//Link Killtro
	tappable('#link_killtrocom', function(){
    	if(is_mobile) {
			window.plugins.childBrowser.showWebPage("http://www.killtro.com");
    	}
    	if(!is_mobile) {
			window.open("http://www.killtro.com");
		}
		return false;
	});

	//Link CC
	tappable('#link_cc, #link_ccimg', function(){
    	if(is_mobile) {
			window.plugins.childBrowser.showWebPage("http://www.gnu.org/licenses/gpl-3.0.html");
    	}
    	if(!is_mobile) {
			window.open("http://www.gnu.org/licenses/gpl-3.0.html");
		}
		return false;
	});

	//Link Footer Arriba
	tappable('#footer_arriba', function(){
		$('html, body').animate({scrollTop: '0'}, 500);
		return false;
	});

});

$(window).resize(function() {
	//La ventana cambio de tamaño, reajustemos el menu
	windowresize();
});

//Con esto calculamos y ajustamos el ancho del menu del header
function windowresize() {
	menu_width = $(document).width();
	menu_itemwidth = Math.floor(((menu_width)/2)-1);
	if(in_os == 'chrome') {
		//Fckn scrollbars de las apps en Chrome
		menu_itemwidth = menu_itemwidth-8;
	}
	$(".menuitem").css('width', menu_itemwidth+'px');
}

//Mensaje, tiene o no multas
multaalert = '';
function kmn_finconsultaalerta(multaalert) {
	if (multaalert == 'true') {
		if(is_mobile) {
			navigator.notification.alert("El vehiculo registra al menos una multa impaga o encargo por robo.", nullfunc, "Lo sentimos", "Hmmm Okey");
		} else {
			jAlert('El vehiculo registra al menos una multa impaga o encargo por robo.', 'Lo sentimos');
		}
	}
	if (multaalert == 'false') {
		if(is_mobile) {
			navigator.notification.alert("El vehiculo no registra multas impagas ni encargo por robo.", nullfunc, "Felicitaciones", "Excelente");
		} else {
			jAlert('El vehiculo no registra multas impagas ni encargo por robo.', 'Felicitaciones');
		}
	}
	//Marcamos con Analytics
    gaPlugin.trackPage( successHandler, successHandler, "/index.html/#!/consulta");
}

//Funcion de consulta de multas
function kmn_consulta() {
	multaalert = 'false';
	var lepatente = $('#lepatente').val();
	$('#kmn_patenteaqui').html('');
	$('#kmn_loaderwaitaqui').html('');

	if(lepatente == '') {
		if(is_mobile) {
			navigator.notification.alert("Disculpa: que patente deseas consultar?", nullfunc, "Error", "Ups");
		} else {
			jAlert('Disculpa: que patente deseas consultar?', 'Error');
		}
	} else {

	if(is_online == true) {

	//RegistroCivil
	$.ajax({
		dataType: "jsonp",
		data: "patente="+lepatente,
		url: "http://apps.killtro.com/apis/mismultasimpagas/getdata.php?method=?",
		timeout: 20000,
		cache: false,
		beforeSend: function() {
  			$('#kmn_loaderwaitaqui').html('<div align="center"><img src="images/loader18.gif" alt="Consultando"></div>');
		},
		success: function(response) {

		},
		complete: function() {

			//Carabineros
			$.ajax({
				dataType: "jsonp",
				data: "patente="+lepatente,
				url: "http://apps.killtro.com/apis/mismultasimpagas/getdata_carabineros.php?method=?",
				timeout: 20000,
				cache: false,
				beforeSend: function() {

				},
				success: function(response) {

				},
				complete: function() {
					//Ahora si, Carabineros, Final
					$('#kmn_loaderwaitaqui').html('');
					kmn_finconsultaalerta(multaalert);
				}
			}); //Carabineros

		}
	}); //RegistroCivil

	} else {
		if(is_mobile) {
			navigator.notification.alert("Debes estar conectado a Internet para buscar en las bases de datos.", nullfunc, "Error", "Ups");
		} else {
			jAlert('Debes estar conectado a Internet para buscar en la base de datos.', 'Error');
		}
	}

	}//fin "lepatente" vacio
}

//Registro Civil, GENERAL tambien
function kmn_impagasp(rc) {
	if(rc.patente == 'FAKE00') {
		$('#kmn_patenteaqui').html("");
		$('#kmn_loaderwaitaqui').html("");
		if(is_mobile) {
			navigator.notification.alert("Disculpa: estas seguro que la patente es valida?", nullfunc, "Error", "Ups");
		} else {
			jAlert('Disculpa: estas seguro que la patente es valida?', 'Error');
		}
		multaalert = 'invalid';
	} else if(rc.impagas == 'true') {
		$('#kmn_patenteaqui').html("<li><strong>Detalle para "+rc.patente+"</strong>:</li><li class='multali'><span class='itemtextleft'>Registro Civil</span><br /> <span class='iconright'>Registra multa impaga <img src='images/icon_nope.png' alt='' /></span><div class='clear'></div></li>");
		multaalert = 'true';
	} else {
		$('#kmn_patenteaqui').html("<li><strong>Detalle para "+rc.patente+"</strong>:</li><li class='multali'><span class='itemtextleft'>Registro Civil</span><br /> <span class='iconright'>Sin multas impagas <img src='images/icon_okidoky.png' alt='' /></span><div class='clear'></div></li>");
		multaalert = 'false';
	}
}

//Carabineros
function kmn_impagasp_carabineros(vs) {
	if(vs.impagas == 'true') {
		$('#kmn_patenteaqui').append("<li class='multali'><span class='itemtextleft'>Carabineros</span><br /> <span class='iconright'>Registra encargo por Robo! <img src='images/icon_nope.png' alt='' /></span><div class='clear'></div></li>");
		multaalert = 'true';
	} else {
		$('#kmn_patenteaqui').append("<li class='multali'><span class='itemtextleft'>Carabineros</span><br /> <span class='iconright'>Sin encargo por robo <img src='images/icon_okidoky.png' alt='' /></span><div class='clear'></div></li>");
	}
}

//Limpiemos el cuadro de resultados
function kmn_limpiarresultados() {
		$('#kmn_patenteaqui').html('');
		$('#kmn_loaderwaitaqui').html('');
		$('#lepatente').val('');
}
