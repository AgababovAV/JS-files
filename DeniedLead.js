var itemId = GetUrlKeyValue("param", false, location.href);
var listTitle = 'Тест';
console.log(itemId);


var timerFunc = function() {
	window.location = "портал/Lists/ServiceDesk/view2.aspx";

}
var timerS = 1500;

//Стиль
var dispNone = function() {
	document.getElementById("loader").style.display = "none";
}


//Проверка на руководителя
function getLeaderField() {
	context = new SP.ClientContext.get_current();
	list = context.get_web().get_lists().getByTitle(listTitle);
	listItem = list.getItemById(itemId);

	context.load(listItem);
	context.executeQueryAsync(

		function() {

			var LeaderName = "Leader";
			var lookupLeader = listItem.get_item(LeaderName);
			console.log(lookupLeader.get_lookupId()); //print Value
			idLookupLeader = lookupLeader.get_lookupId();

			getCurrentUser();

		},
		function(sender, args) {
			console.log(args.get_message());
		}
	);

}

ExecuteOrDelayUntilScriptLoaded(getLeaderField, "sp.js");


//Узнаем ИД текущего пользователя
function getCurrentUser() {
	var userId = _spPageContextInfo.userId;
	console.log(userId);
	if (idLookupLeader == userId) {
		console.log('Руководитель');
		getStatus();
	} else {
		dispNone();
		document.getElementById("success").innerHTML = 'Вы не являетесь руководителем этой заявки';
		setTimeout(timerFunc, timerS);
	}

}


// Узнаем статус заявки	
function getStatus() {

	status = listItem.get_item('status');


	if (status == "Отклонена") {
		dispNone();
		document.getElementById("success").innerHTML = "Отклонена";
	} else if (status == "Закрыта") {
		dispNone();
		document.getElementById("success").innerHTML = "Заявка уже закрыта";
	} else if (status == "Выполнена") {
		dispNone();
		document.getElementById("success").innerHTML = "Заявка уже выполнена";
	} else if (status == "Размножена на подзаявки") {
		dispNone();
		document.getElementById("success").innerHTML = "Заявка уже согласована";
		console.log("Размножена на подзаявки");
	} else if (status != "Размножена на подзаявки") {
		ApproveLeader();
	} else {
		dispNone();
		document.getElementById("success").innerHTML = "Что-то пошло не так";
	}

}


//Согласована ли руководителем
function ApproveLeader() {

	approveLead = listItem.get_item('ToApprove');
	if (approveLead == "Да") {
		dispNone();
		document.getElementById("success").innerHTML = "Заявка уже согласована, и не может быть отклонена";
		setTimeout(timerFunc, timerS);
	} else if(approveLead == "Нет"){
		dispNone();
		document.getElementById("success").innerHTML = "Заявка уже отклонена";
		setTimeout(timerFunc, timerS);
	}else{
		createElem();
	}

}

//Создаем текстовое поле
function createElem() {
    document.getElementById("loader").style.display = "none";
    var textArrea = document.getElementById("textComment");
    var textarea = document.createElement("textarea");
    var paragraf = document.createElement("p");
    var textParagraf = document.createTextNode("Укажите причину отклонения*");
    var button = document.createElement("INPUT");
    paragraf.id = "MinWords";
    button.setAttribute("type", "button");
    button.setAttribute("value", "Отправить");
    button.id = "buttonClick";
    //button.disabled = true;
    textarea.id = "textAreaCommentId";
    textarea.name = "textAreaComment";
    textarea.maxLength = "400";
    textarea.minLength = "1";
    textarea.style.width = "500px";
    textarea.style.height = "150px";
    textarea.cols = "80";
    textarea.rows = "10";
    paragraf.appendChild(textParagraf);
    textArrea.appendChild(paragraf);
    textArrea.appendChild(textarea); //appendChild
    textArrea.appendChild(button);

    button.onclick = function() {

        var textFromTextArea = $("#textAreaCommentId").val();
        console.log(textFromTextArea);
        if (textFromTextArea.length < 1 || textFromTextArea.length > 400) {
            var paragrafErr = document.createElement("p");
            var textParagrafErr = document.createTextNode('Укажите причину отклонения');
            paragrafErr.id = "ErrorMessage";
            paragrafErr.style.color = "red";
            paragrafErr.appendChild(textParagrafErr);
            textArrea.appendChild(paragrafErr);
        } else {
            var paragrafErrDispNone = document.getElementById("ErrorMessage");
            if (paragrafErrDispNone) {
                paragrafErrDispNone.style.display = "none";
            }
            updateListItem(textFromTextArea);
        }


    }

}



//Задаем согласование руководителя Нет
function updateListItem(commentDenied) {

	var clientContext = new SP.ClientContext();
	var targetList = clientContext.get_web().get_lists().getByTitle(listTitle);
	this.oListItem = targetList.getItemById(itemId);

	oListItem.set_item('ToApprove', 'Нет');
    oListItem.set_item('Comment', commentDenied);
    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededUpdate), Function.createDelegate(this, this.onQueryFailedUpdate));
}

function onQuerySucceededUpdate() {

    console.log('Отклонена');
    document.getElementById("textComment").style.display = "none";
    dispNone();
    document.getElementById("success").innerHTML = "Отклонена";
    setTimeout(timerFunc, timerS);
}

function onQueryFailedUpdate(sender, args) {

    document.getElementById("textComment").style.display = "none";
    dispNone();
    document.getElementById("success").innerHTML = "Поле ИД не найдено";
    console.log('Не найдено поле ИД' + 'Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}