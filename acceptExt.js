var itemId = GetUrlKeyValue("param", false, location.href);
var listTitle = 'Тест';
console.log(itemId);

var timerFunc = function() {
    window.location = "портал/Lists/ServiceDesk/view3.aspx";

}
var timerS = 1500;
var dispNone = function() {
    document.getElementById("loader").style.display = "none";
}

//Проверка на исполнителя
var idlookupExt = "";

function getExtField() {

    context = new SP.ClientContext.get_current();
    list = context.get_web().get_lists().getByTitle(listTitle);
    listItem = list.getItemById(itemId);

		context.load(listItem);
        context.executeQueryAsync(

            function() {
			
                var ExtName = "WhoDoing";
                var lookupExt = [];
                lookupExt = listItem.get_item(ExtName);
				
				for(i = 0; i < lookupExt.length; i ++){
					//console.log(lookupExt); //print Value
					console.log(lookupExt[i].get_lookupId()); //print Value
					idlookupExt += lookupExt[i].get_lookupId() + ";"; //print Value
				}
				getCurrentUser();

            },
            function(sender, args) {
                console.log(args.get_message());
            }
        );


}

ExecuteOrDelayUntilScriptLoaded(getExtField, "sp.js");

//Узнаем ИД текущего пользователя
function getCurrentUser() {
    var userId = _spPageContextInfo.userId;
    console.log(userId);
    if (idlookupExt.indexOf(userId) != -1) {
        console.log('Исполнитель и текущий пользователь ==');
        getStatus();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = 'Вы не можете закрыть эту заявку';
        console.log('Не совпадает');
    }

}


//Статус заявки
function getStatus() {

    status = listItem.get_item('status');

    if (status == "Отклонена") {
        dispNone();
        document.getElementById("success").innerHTML = "Отклонена";
    } else if (status == "Закрыта") {
        dispNone();
        document.getElementById("success").innerHTML = "Закрыта";
    } else if (status == "Выполнена") {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка уже закрыта";
    } else if (status == "Размножена на подзаявки") {
        dispNone();
        document.getElementById("success").innerHTML = "Статус заявки : размножена на подзаявки";
    } else if (status != "Размножена на подзаявки") {
        ApproveLeader();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = "Что-то пошло не так";
    }

}


//Согласована ли руководителем
function ApproveLeader() {

    var approveLead = listItem.get_item('ToApprove');
    if (approveLead == "Да") {
        ApproveOwnerStatus();
        console.log("Согласовано руководителем? = " + approveLead);
    } else {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка еще не согласована руководителем";
        setTimeout(timerFunc, timerS);
    }

}


//Согласована ли владельцем
function ApproveOwnerStatus() {

    var approveOwner = listItem.get_item('ToApproveOwner');
    if (approveOwner == "Да") {
        console.log("Согласовано владельцем? = " + approveOwner);
        updateListItem();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка еще не согласована владельцем";
    }

}

//Задать для поля статус - выполнена


function updateListItem() {

   var clientContext = new SP.ClientContext();
    var targetList = clientContext.get_web().get_lists().getByTitle(listTitle);

    this.oListItem = targetList.getItemById(itemId);

    oListItem.set_item('status', 'Выполнена');
    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

dispNone();
   document.getElementById("success").innerHTML = "Заявка закрыта";
   setTimeout(timerFunc,timerS);
}

function onQueryFailed(sender, args) {

dispNone();
	document.getElementById("success").innerHTML = "Поле ИД не найдено";
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}