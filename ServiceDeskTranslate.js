
	var tempClass;
	
		function subscribeLang (){
			var langEN = $('#m-master-language-1033').hasClass('selected');	
			var langRU = $('#m-master-language-1049').hasClass('selected');	 
			var endTr = $('select').parent().hasClass('endTranslate');			
			
			if(langEN && !endTr){
				$('.die')[0].innerHTML = '<a href="портал/Lists/ServiceDesk/view.aspx">To the list of applications</a>';					
				translate();
				tempClass = $('select').parent().addClass('endTranslate');
				console.log('1');					
			}
		}

		
	function translate (){
		var words = {
			'Тест' : 'test',
			'Назад' : 'Back',
			'Необходимо заполнить поля, помеченные *' : 'Fields marked with * are required',
			'Описание ролей' : 'About role',
			'На согласовании' : 'On agreement',
			'Инициатор заявки' : 'Initiator of the application',
			'Подразделение:' : 'Subdivision',
			'Подразделение' : 'Subdivision',
			'Должность' : 'Position',
			'Должность:' : 'Position',
			'Владелец ресурса' : 'Resource owner',
			'Отправить вопрос/комментарий' : 'Send comment',
			'Отклонить' : 'Reject',
			'Согласовать' : 'To approve',
			'Заявку выполнил:' : 'Executor',
			'Да' : 'Yes',
			'Нет' : 'No',
			'Согласование владельца:' : 'Accept Ownner',
			'Согласование руководителя:' : 'Accept Leader',
			//'К списку заявок' : 'To the list of applications',
			'Система управления доступом к информационным ресурсам' : 'System of access control to information resources ',
			'Закрыто:' : 'Cansel:',
			'Создано:' : 'Create:',
			'Описание' : 'About ',
			'(наведите курсор на название роли)' : '(Cursor)',
			'Вложения:' : 'Attachment',
			'Комментарий заявителя/Обоснование доступа' : 'Comment',
			'Информационный ресурс/роль' : 'Role',
			'Новая' : 'New',
			'Готово': 'Done',
			'Отмена': 'Cancel',
			'Заявка на меня' : 'Application for me',
			'Помощь' : 'Help',
			'Отправить на согласование' : 'Send for agreement',
			'Система' : 'System',
			'Руководитель' : 'Leader',
			'Получатель доступа' : 'Recipient of access'
				
		};

		$.each( words, function( key, value ) {
			//var translateText = $('input[value="'+ key + '"]');
			//	translateText.attr("value",value);
			
			var allInput = $('.l-body-content__box').find('input');
				for(var k = 0; k < allInput.length; k++){
					var tempInput = allInput[k].value
					if(tempInput != '' && tempInput == key){
						allInput[k].value = value;
					
					}
				}
				

			var spanText = $('.l-body-content__box').find('span');
				for (var i = 0; i < spanText.length; i++){
					
					if(spanText[i].innerHTML  != "" && spanText[i].innerHTML  == key ){
						//console.log(spanText[i].innerHTML  + " = " + key);
						spanText[i].innerHTML  = value;
						
						
					}
				}
				
		});
		
		
	}
		
		setInterval( subscribeLang, 400);
		

		
		