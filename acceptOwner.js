var itemId = GetUrlKeyValue("param", false, location.href);
var addCommentURL = GetUrlKeyValue("flagNewComment", false, location.href);
var listTitle = 'Тест';
console.log(itemId);


var timerFunc = function() {
    window.location = "портал/Lists/ServiceDesk/view2.aspx";

}
var timerS = 1500;
var dispNone = function() {
    document.getElementById("loader").style.display = "none";
}

//Проверка на владельца


var idLookupOwner = "";


function getOwnerField() {

    context = new SP.ClientContext.get_current();
    list = context.get_web().get_lists().getByTitle(listTitle);
    listItem = list.getItemById(itemId);

    context.load(listItem);
    context.executeQueryAsync(

        function() {

            var OwnerName = "Owner";
            var lookupOwner = [];
            lookupOwner = listItem.get_item(OwnerName);

            for (i = 0; i < lookupOwner.length; i++) {
                console.log(lookupOwner[i].get_lookupId()); //print Value
                idLookupOwner += lookupOwner[i].get_lookupId() + ";"; //print Value
            }
            getCurrentUser();

        },
        function(sender, args) {
            console.log(args.get_message());
        }
    );

}

ExecuteOrDelayUntilScriptLoaded(getOwnerField, "sp.js");




//Узнаем ИД текущего пользователя

function getCurrentUser() {
    var userId = _spPageContextInfo.userId;
    console.log(userId);
    if (idLookupOwner.indexOf(userId) != -1) {
        console.log('Владелец и текущий пользователь ==');
        getComment();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = 'Вы не являетесь владельцем этой заявки';
        console.log('Не совпадает');
    }

}


// Добавлен ли комментарий

function getComment() {

    var addNewComment = listItem.get_item('flagAddNewComment');

    if (addNewComment == true && addCommentURL != "false") {

        dispNone();
        document.getElementById("success").innerHTML = "Комментарий добавлен";
        setTimeout(timerFunc, timerS);

    } else {
        console.log('Комментарий не добавлен');
        getStatus();
    }

}
//Конец комментария



// Узнаем статус заявки

function getStatus() {

    status = listItem.get_item('status');

    if (status == "Отклонена") {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка уже отклонена";
        setTimeout(timerFunc, timerS);
    } else if (status == "Закрыта") {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка уже закрыта";
    } else if (status == "Выполнена") {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка уже выполнена";
    } else if (status == "Размножена на подзаявки") {
        dispNone();
        document.getElementById("success").innerHTML = "Заявка уже согласована";
        console.log("разбита на подзаявки");
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
        console.log("Согласована ли руководителем ? = " + approveLead);
		ApproveOwnerStatus();
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
        console.log("Согласована ли владельцем ? = " + approveOwner);
		dispNone();
        document.getElementById("success").innerHTML = "Заявка уже согласована";
    } else {
		//Если заявка не согласована владельцем, то задаем согласование
        updateListItem();

    }

}

//Задать согласование владельца



function updateListItem() {

    var clientContext = new SP.ClientContext();
    var targetList = clientContext.get_web().get_lists().getByTitle(listTitle);

    this.oListItem = targetList.getItemById(itemId);

    oListItem.set_item('flagAddNewComment', 'Нет');
	oListItem.set_item('ToApproveOwner', 'Да');
    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {

	dispNone();
    document.getElementById("success").innerHTML = "Согласовано";
   setTimeout(timerFunc,timerS);
}

function onQueryFailed(sender, args) {

	document.getElementById("loader").style.display="none";
	document.getElementById("success").innerHTML = "Поле ИД не найдено";
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}

