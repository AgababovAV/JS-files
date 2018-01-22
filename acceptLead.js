 var itemId = GetUrlKeyValue("param", false, location.href);
 var addCommentURL = GetUrlKeyValue("flagNewComment", false, location.href);

 console.log(itemId);
 console.log(addCommentURL);
 var listTitle = "Тест";
 var timerFunc = function() {
     window.location = "портал/Lists/ServiceDesk/view1.aspx";

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
         getComment();
     } else {
         dispNone();
         document.getElementById("success").innerHTML = 'Вы не являетесь руководителем этой заявки';
         setTimeout(timerFunc, timerS);
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
         ApproveLeaderInList();
     } else {
         dispNone();
         document.getElementById("success").innerHTML = "Что-то пошло не так";
     }

 }

 //Согласовано ли руководителем

 function ApproveLeaderInList() {
     var approveLead = listItem.get_item('ToApprove');
     if (approveLead == "Да") {
         console.log("Согласовано руководителем? = " + approveLead);
         dispNone();
         document.getElementById("success").innerHTML = "Заявка уже согласована";
     } else {
         updateListItem();
     }
 }




 //Изменить элемент, задать для согласования руководителя - да
  function updateListItem() {

        var clientContext =new SP.ClientContext();
        var oList = clientContext.get_web().get_lists().getByTitle(listTitle);

        this.oListItem = oList.getItemById(itemId);

        oListItem.set_item('ToApprove', 'Да');

        oListItem.update();

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededUpdate), Function.createDelegate(this, this.onQueryFailedUpdate));
    }

    function onQuerySucceededUpdate() {

		approveLeader = 'Да';
        console.log('Согласовано');
        getAttachment();
    }

    function onQueryFailedUpdate(sender, args) {

        document.getElementById("loader").style.display = "none";
        document.getElementById("success").innerHTML = "Поле ИД не найдено";
        console.log('Не найдено поле ИД' + 'Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }


    // Взять вложения
    var linkAttachment = "";


    function getAttachment() {
        var context = SP.ClientContext.get_current();
        var myListItem = context.get_web().get_lists().getByTitle(listTitle).getItemById(itemId);
        context.load(myListItem);

        context.executeQueryAsync(function() {
			if(myListItem.get_item("LinkAttachment") != null){
				linkAttachment = myListItem.get_item("LinkAttachment").get_description();
				console.log(myListItem.get_item("LinkAttachment").get_url());
				retrieveListItems();
			}
			else{
				console.log("Вложений нет");
				retrieveListItems();
			}                           

        }, function(sender, args) {
            console.log(args.get_message());
        });
    }



 //Взять lookup переменную,в нашем случае id
 var idLookupMultyRole = "";
 var idLookupPOLitst = "";
 var idLookupWho = "";
 var idAuthor = "";

 //Берем параметры столбцов
 function retrieveListItems() {

     var POListName = "_x041f__x041e_";
     var LeaderName = "Leader";
     var MultyRoleName = "MultyRole";
     var WhoName = "_x0433__x0440__x0443__x043f__x04";
     var Author = "Author";

     console.log(listItem.get_item('CommentMain'));
     console.log(listItem.get_item('ToApprove'));
     console.log(listItem.get_item('status'));
     console.log(listItem.get_item('CommentDisplay'));
     //approveLeader = listItem.get_item('ToApprove'); //Поле согласование руководителя
     CommentDisplay = listItem.get_item('CommentDisplay'); //Поле комментарии
     commentMain = listItem.get_item('CommentMain'); //Поле примечание на главной странице
     CommentLead = listItem.get_item('Comment'); //Комментарий от руководителя
     DepInit = listItem.get_item('DepartmentInit');
     DepLead = listItem.get_item('DepartmentLead');
     DepOwner = listItem.get_item('DepartmentOwner');
     PosInit = listItem.get_item('PositionInit');
     PosLead = listItem.get_item('PositionLead');
     PosOwner = listItem.get_item('PositionOwner');


     var lookupPOList = listItem.get_item(POListName);
     console.log(lookupPOList.get_lookupValue() + " - список ПО"); //print Value
     idLookupPOLitst = lookupPOList.get_lookupId();

     var lookupAuthor = listItem.get_item(Author);
     console.log(lookupAuthor.get_lookupValue() + " - Кем создано"); //print Value
     idAuthor = lookupAuthor.get_lookupId();

     var lookupValsWho = listItem.get_item(WhoName); //get multi lookup value (SP.FieldLookupValue[])

     for (var i = 0; i < lookupValsWho.length; i++) {
         console.log(lookupValsWho[i].get_lookupValue() + " - ФИО на кого заявка"); //print Value
         idLookupWho += lookupValsWho[i].get_lookupValue() + ",";

     }

     //Удаляем последний элемент, undefined
     if (idLookupWho.length > 0) {
         idLookupWho = idLookupWho.substring(0, idLookupWho.length - 1);
     }

     var lookupValsMultyRole = listItem.get_item(MultyRoleName); //get multi lookup value (SP.FieldLookupValue[])

     for (var i = 0; i < lookupValsMultyRole.length; i++) {
         console.log(lookupValsMultyRole[i].get_lookupValue()); //print Value           
         idLookupMultyRole += lookupValsMultyRole[i].get_lookupId() + ",";

     }

     //Удаляем последний элемент, undefined
     if (idLookupMultyRole.length > 0) {
         idLookupMultyRole = idLookupMultyRole.substring(0, idLookupMultyRole.length - 1);
     }

     parseTask(linkAttachment);

 }




    function createListItems(listTitle, itemsProperties, OnItemsAdded, OnItemsError) {
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var list = web.get_lists().getByTitle(listTitle);

        var items = [];
        $.each(itemsProperties, function(i, itemProperties) {

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var listItem = list.addItem(itemCreateInfo);
            for (var propName in itemProperties) {
                listItem.set_item(propName, itemProperties[propName])
            }
            listItem.update();
            context.load(listItem);
            items.push(listItem);

        });

        context.executeQueryAsync(
            function() {
                OnItemsAdded(items);
            },
            OnItemsError
        );
    }

    function parseTask(linkAttachment) {

        if (approveLeader == "Да" && status != "Размножена на подзаявки") {

            if (idLookupMultyRole.indexOf(",") >= 0) {

                var arr = idLookupMultyRole.split(",");
                var arrWho = idLookupWho.split(",");

                var users = new Array();
                for (var k = 0; k < arrWho.length; k++) {
                    users.push(SP.FieldUserValue.fromUser(arrWho[k]));
                }

                for (var i = 0; i < arr.length; i++) {

                    var tasksProperties = [{
                        'Title': 'Заявка',
                        'MultyRole': arr[i],
                        '_x041f__x041e_': idLookupPOLitst,
                        'Leader': idLookupLeader, // ФИО руководителя
                        'WhoCreateItem': idAuthor, // из поля "Кем создано" в поле "Кто сделал заявку"
                        '_x0433__x0440__x0443__x043f__x04': users, // ФИО на кого заявка
                        'OnlyRead': true, // Только чтение
                        'flag': true,
                        'ToApprove': approveLeader, // Поле согласование руководителя
                        'CommentMain': commentMain, // Поле примечание на главной
                        'Comment': CommentLead, // Комментарий от руководителя
                        'CommentDisplay': CommentDisplay, // Поле комментарии
                        'ParentElement': itemId + '/' + (i + 1),
                        'LinkAttachment': linkAttachment,
                        'DepartmentInit': DepInit,
                        'DepartmentLead': DepLead,
                        'DepartmentOwner': DepOwner,
                        'PositionInit': PosInit,
                        'PositionLead': PosLead,
                        'PositionOwner': PosOwner
                    }];

                    createListItems(listTitle, tasksProperties,
                        function(items) {


                            document.getElementById("loader").style.display = "none";
                            document.getElementById("success").innerHTML = "Согласовано,не закрывайте страницу";
                            //setTimeout(timerFunc, timerS);
                        },
                        function(sender, args) {
                            console.log('Поле ИД не найдено ' + 'Error occured while creating tasks:' + args.get_message());
                        }
                    )

                };

                updateStatus();

            } else {
                document.getElementById("loader").style.display = "none";
                document.getElementById("success").innerHTML = "Согласовано";
                setTimeout(timerFunc, timerS);
            }


        } else {
            document.getElementById("loader").style.display = "none";
            document.getElementById("success").innerHTML = "Заявка согласована"; //Согласована,если роль одна или заявка размножена
            setTimeout(timerFunc, timerS);
        }

    }

    function updateStatus() {

       var clientContext = new SP.ClientContext();
        var targetList = clientContext.get_web().get_lists().getByTitle(listTitle);

        this.oListItem = targetList.getItemById(itemId);

        oListItem.set_item('status', 'Размножена на подзаявки');
        oListItem.set_item('wtvx', 'Размножена на подзаявки'); //Статус(view)


        oListItem.update();

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceededUdateStatus), Function.createDelegate(this, this.onQueryFailedUdateStatus));
    }ы

    function onQuerySucceededUdateStatus() {

        console.log("Статус заявки изменен на : Размножена на подзаявки");
        setTimeout(timerFunc,timerS);
    }

    function onQueryFailedUdateStatus(sender, args) {

        console.log("Поле ИД не найдено");
        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 