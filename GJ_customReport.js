function AddReport(textTitle) {
	
	var newsF = $(".m-informer-news__filters").find("a");
	var newsCategory = '';
	
	for(var i = 0; i < newsF.length; i++){
		  console.log(newsF[i].className.indexOf("is-active-item"));
		  
		if(newsF[i].className.indexOf("is-active-item") != -1){
			newsCategory = newsF[i].text;
		} 
		
	}

	var userid= _spPageContextInfo.userId;
    var clientContext = new SP.ClientContext();
    var Gj_CustomReport = clientContext.get_web().get_lists().getByTitle("Тест");

	var itemCreateNews = new SP.ListItemCreationInformation();
    this.Item = Gj_CustomReport.addItem(itemCreateNews);

    Item.set_item('Title', textTitle);
    Item.set_item('Category', newsCategory);
    Item.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.SucceededReport), Function.createDelegate(this, this.FailedReport));
}

function SucceededReport() {
	console.log('Добавлено');

}

function FailedReport(sender, args) {

    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}
