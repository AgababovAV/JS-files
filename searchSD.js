
$(document).ready(function(){
	
	$( "#sfield" ).change( function() {
	var selectValue = document.getElementById("sfield").value;
		switch(selectValue){
			 case "Created":
				$( "#tbSearch" ).datepicker($.datepicker.regional[ "ru" ]);
				break;
			 case "WhoCreateItem":
			 case "_x0433__x0440__x0443__x043f__x04":
			 case "Leader":
			 case "Owner":
			 case "WhoDoing":
				$( "#tbSearch" ).datepicker( "destroy" );
				$( "#tbSearch" ).autocomplete({
						source: uniqueNames
				});		
				
				break;
		default:
				$( "#tbSearch" ).datepicker( "destroy" );
	
		}
	
	});
	
	var uniqueNames = [];
	
	$.get( "портал/_api/Web/SiteUsers","", function( data,status,xnr) {
	 
	data.value.forEach(function(item, i, name) {
		  uniqueNames.push( data.value[i].Title );
		});
	 
	},'json');
	
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
		 
		 
		 switch(selectValue){
			 case "Created":
			 case "WhoCreateItem":
			 case "_x0433__x0440__x0443__x043f__x04":
			 case "Leader":
			 case "Owner":
			 case "WhoDoing":
				url = "FilterField1=" + selectValue + "&FilterValue1=" + valueSearch;
				window.location.href = "AllItems.aspx?" + url;
				break;
			 default:
				url = "FilterName=" + selectValue + "&FilterMultiValue=*" + valueSearch + "*";
				window.location.href = "AllItems.aspx?" + url;
		 }
		 
		 
     } else {
         return false;
     }
	 	 
 }
 
/*
 //Поиск во всех элементах поле user
function userName() {

        //Берем поле примечание,статус и согласование руководителя
        var userId = _spPageContextInfo.userId;
        var clientContext = SP.ClientContext.get_current();
        var list = clientContext.get_web().get_lists().getByTitle("К списку заявок");
        var caml = new SP.CamlQuery();
        caml.set_viewXml(""); // empty query also works
        var listItemCollection = list.getItems(caml);

        clientContext.load(listItemCollection); // i requested every property

        clientContext.executeQueryAsync(function() {
            var listItemEnumerator = listItemCollection.getEnumerator();
			
			var userArr = [];
            while (listItemEnumerator.moveNext()) {		
                var oListItem = listItemEnumerator.get_current();
				var WhoInf = oListItem.get_item('WhoCreateItem').$4K_1; // кто создал заявку(инициатор)
				//var RecipientInf = oListItem.get_item('_x0433__x0440__x0443__x043f__x04').$4K_1; // фио на кого заявка
				var LeaderInf = oListItem.get_item('Leader').$4K_1; //  фио руководителя
				//console.log(LeaderInf);
				//var OwnerInf = oListItem.get_item('Owner').$4K_1; //  фио владельца
				//var ExtInf = oListItem.get_item('WhoDoing').$4K_1; // фио исполнителя
				
				userArr.push(WhoInf,LeaderInf);
            }
			
			uniqueNames = []; // убираем дубликаты
			$.each(userArr, function(i, el){
				if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
			});

			console.log(uniqueNames);

        }, function(sender, args) {
            window.console && console.log(args.get_message());
        });

}
 
*/

 function ClearUrl() {
     window.location.href = "AllItems.aspx";
 }
 
 
