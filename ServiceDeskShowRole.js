  
var listItemInfo = [];
var listItemId = [];
function retrieveListItems() {

    var clientContext = new SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle('Тест');
        
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' + 
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query><RowLimit>500</RowLimit></View>');
    this.collListItem = oList.getItems(camlQuery);
        
    clientContext.load(collListItem);
        
    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));        
        
}

function onQuerySucceeded(sender, args) {

    

    var listItemEnumerator = collListItem.getEnumerator();
        
    while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        listItemId.push(oListItem.get_id());
            //'\nTitle: ' + oListItem.get_item('Title');
          listItemInfo.push(oListItem.get_item('About'));
    }	

    console.log(listItemInfo);
    console.log(listItemId);
	subscribe();
}

function onQueryFailed(sender, args) {

    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

 ExecuteOrDelayUntilScriptLoaded(retrieveListItems, "sp.js");


  function subscribe(){
	  var par = $('input[type="checkbox"]').parent();
	  if(par.length > 0){
		  //setTimeout(subscribeLang,50);
			  if(par.hasClass('check')){
				 // console.log('класс есть');
				  setTimeout(subscribe,50);
				 // setTimeout(subscribeLang,50);
			  }
			  else{
				$('input[type="checkbox"]').parent().addClass('check');
				$('input[type="checkbox"]').parent().mouseover(function() {    
					//console.log('2');
					var id = $(this).children().val();
					var parsToInt = parseInt(id);
					var getIndex = listItemId.indexOf(parsToInt);
					//console.log(listItemInfo[getIndex]);
					$('fieldset').find('textarea').val(listItemInfo[getIndex]); 	
					  }) .mouseout(function() {
					$('fieldset').find('textarea').val(''); 	
				  })
				
			  }
		   
	  }
	  else{
		  setTimeout(subscribe,50);
	  }
  }
  

  
  $( ".l-body-content__box" ).change( function() {	 
		subscribe();	  
	});





















