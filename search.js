<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<link rel="stylesheet" href="/resources/demos/style.css">
<script src="/SiteAssets/script/jquery-1.12.4.js"></script>
<script src="/SiteAssets/script/jquery-ui.js"></script>
<script type="text/javascript">

$(document).ready(function(){
	$( "#sfield" ).change( function() {
	var selectValue = document.getElementById("sfield").value;
		if(selectValue == "Created"){
			$( "#tbSearch" ).datepicker($.datepicker.regional[ "ru" ]);
			//console.log(selectValue + " дата");
		}
		else{
			$( "#tbSearch" ).datepicker( "destroy" );
		}
	} );
});

function keyCode(event) {
    var x = event.keyCode;
    if (x == 13) {
        RedirectUrl();
    }
}

 function RedirectUrl() {
     var valueSearch = document.getElementById("tbSearch").value;
     var selectValue = document.getElementById("sfield").value;
     var url = "";
	 


     if (valueSearch != "") {
         if (selectValue == "Created") {
             url = "FilterField1=" + selectValue + "&FilterValue1=" + valueSearch;
             window.location.href = "AllItems.aspx?" + url;
         } else {
             url = "FilterName=" + selectValue + "&FilterMultiValue=*" + valueSearch + "*";
             window.location.href = "AllItems.aspx?" + url;
         }
     } else {
         return false;
     }
 }

 function ClearUrl() {
     window.location.href = "AllItems.aspx";
 }
</script>
Выбрать столбец: <select id="sfield">
<option selected value="q2uu" >№ заявки</option>
<option value="hpvr">Подзаявка</option>
<option value="Created">Дата создания</option>
</select>
&nbsp;
Поиск: <input type="text" id="tbSearch" onkeydown="keyCode(event)" />
<input type="button" id="btnSearch" value="Поиск"  onclick="return RedirectUrl();" />
<input type="button" id="btnClear" value="Очистить" onclick="return ClearUrl();" />
