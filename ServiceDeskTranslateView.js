$(document).ready(function() {


    function checkLang() {
        var langEN = $('#m-master-language-1033').hasClass('selected');
        var langRU = $('#m-master-language-1049').hasClass('selected');

        if (langEN) {
            translate();
            console.log('1');
        } else if (langRU) {
            return;
        } else {
            setTimeout(checkLang, 100);
            return;
        }
    }


    function translate() {
		
		var trArr = ['a','span','td'];

        $.each(words, function(key, value) {

		for(var k = 0; k < trArr.length; k++){
			var search =  $('table').find(trArr[k]);
			for (var i = 0; i < search.length; i++) {

                if (search[i].innerHTML != "" && search[i].innerHTML == key) {
                    search[i].innerHTML = value;
                }
            }
		}

        });

    }


    checkLang();

});