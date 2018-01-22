    var itemId = GetUrlKeyValue("param", false, location.href);

    console.log(itemId);
    var listTitle = "тест";
	var timerFunc = function(){
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
        getStatus();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = 'Вы не являетесь владельцем этой заявки';
        console.log('Не совпадает');
    }

}

// Узнаем статус заявки

function getStatus() {

    var status = listItem.get_item('status');

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
        ApproveOwnerStatus();
    } else {
        dispNone();
        document.getElementById("success").innerHTML = "Что-то пошло не так";
    }

}
	
	//Согласована ли владельцем

    function ApproveOwnerStatus() {

       var approveOwner = listItem.get_item('ToApproveOwner');
		if(approveOwner == "Да"){
			dispNone();
			document.getElementById("success").innerHTML = "Заявка уже согласована и не может быть отклонена";			 
			console.log(approveOwner);
			setTimeout(timerFunc,timerS);
		}else if(approveOwner == "Нет"){
			dispNone();
			document.getElementById("success").innerHTML = "Заявка уже согласована и не может быть отклонена";			 
			console.log(approveOwner);
			setTimeout(timerFunc,timerS);			
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
	

//Задаем согласование владельца Нет
   
function updateListItem(commentDenied) {

    var clientContext = new SP.ClientContext();
    var targetList = clientContext.get_web().get_lists().getByTitle(listTitle);

    this.oListItem = targetList.getItemById(itemId);

    oListItem.set_item('status', 'Отклонена');
    oListItem.set_item('flagAddNewComment', 'Нет');
    oListItem.set_item('ToApproveOwner', 'Нет');
	oListItem.set_item('CommentOwner', commentDenied);
    oListItem.update();

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {


    console.log('Отклонена');
    document.getElementById("textComment").style.display = "none";
	dispNone();
    document.getElementById("success").innerHTML = "Отклонена";
   setTimeout(timerFunc,timerS);
}

function onQueryFailed(sender, args) {

	document.getElementById("textComment").style.display = "none";
	dispNone();
	document.getElementById("success").innerHTML = "Поле ИД не найдено";
    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}



  
