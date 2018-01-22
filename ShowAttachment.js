
    var itemId = GetUrlKeyValue("param", false, location.href);
    console.log(itemId);

    var attachmentFiles;
    var linkAttachment = "";

    function getWebProperties() {
        var clientContext =new SP.ClientContext();

        var web = clientContext.get_web();

        var attachmentFolder = web.getFolderByServerRelativeUrl('/Lists/ServiceDesk/Attachments/' + itemId);
        attachmentFiles = attachmentFolder.get_files();
        //console.log( attachmentFiles);
        clientContext.load(attachmentFiles);

        clientContext.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.onFailed));
    }

    function onSuccess(sender, args) {

        var inx = 0;
        while (true) {

            var attch = attachmentFiles.itemAt(inx);
            if (attch) {
                linkAttachment += attachmentFiles.itemAt(inx).get_serverRelativeUrl() + '; ';
                //console.log(linkAttachment);
                //console.log(attachmentFiles.itemAt(inx));
                //console.log(attachmentFiles.itemAt(inx).get_serverRelativeUrl());				
                inx++;
            } else {
                break;
            }
        }

		var docById = document.getElementById("content");
        var arrAttach = linkAttachment.split(';');
        for (var i = 0; i < arrAttach.length - 1; i++) {

            var a = document.createElement('a');
            var linkText = document.createTextNode("Вложение" + [i]);
            a.appendChild(linkText);
            a.title = "Вложение" + [i];
            a.href = "http://portal.gloria-jeans.ru" + arrAttach[i];
            document.body.appendChild(a);
			var nameAttach = arrAttach[i].replace('/Lists/ServiceDesk/Attachments/' +itemId + '/', '');

            //document.getElementById("content").innerHTML += "<p>Вложение <a href='" + arrAttach[i] + "'>" + nameAttach +"</a></p>";
            
			var FileExtension = arrAttach[i].split('.').pop().toLowerCase();;
			console.log(FileExtension);
			
			var docById = document.getElementById("content");
			switch(FileExtension){
				case 'doc':
				case 'docx':
					docById.innerHTML += "<p><img src='" + "/_layouts/15/images/lg_icdoc.png" + "' alt='attach'> <a href='" + arrAttach[i] + "'>" + nameAttach +"</a></p>";
					break;
				case 'xls':
				case 'xlsx':
					docById.innerHTML +=  "<p><img src='" + "/_layouts/15/images/lg_icxls.png" + "' alt='attach'> <a href='" + arrAttach[i] + "'>" + nameAttach +"</a></p>";
					break;
				case 'pdf':
					docById.innerHTML +=  "<p><img src='" + "/_layouts/15/images/lg_icpdf.png" + "' alt='attach'> <a href='" + arrAttach[i] + "'>" + nameAttach +"</a></p>";
					break;
				case 'msg':
					docById.innerHTML +=  "<p><img src='" + "/_layouts/15/images/MSG32.GIF" + "' alt='attach'> <a href='" + arrAttach[i] + "'>" + nameAttach +"</a></p>";
					break;
				default:
					docById.innerHTML += "<img src='" + arrAttach[i] + "' alt='attach'> <a href='" + arrAttach[i] + "'>" + nameAttach +"</a>";
					
			}			
			
			
        }



    }

    function onFailed(sender, args) {
        document.getElementById("content").innerHTML = "Вложений нет";
    }

    ExecuteOrDelayUntilScriptLoaded(getWebProperties, "sp.js");


