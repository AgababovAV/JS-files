var arrayOfImageObjects = new Array();
var currentImageIndex = 0;
 
function GetImagesAndRotate() {
    var url = "портал/_api/web/lists/getbytitle('Обучение фото')/items?$expand=File"
     
    $.ajax({
        url: url,
        type: "GET",
        headers: { 
            "X-HTTP-Method":"MERGE",
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),             
        },
        success: function(data){
            var result = data.d.results;
			console.log(result);
            for(i=0;i<result.length;i++){
                var image = result[i];
                var imageObject = { };
                imageObject.Name = image.File.Name;
                imageObject.Url = image.File.ServerRelativeUrl;
                imageObject.Width = image.File.ImageWidth;
                imageObject.Height = image.File.ImageHeight;                    
                arrayOfImageObjects.push(imageObject);
				
            }               
            setTimeout(NextImage,5000);
        },
        error: function(){
            alert("request failed");
        }
    });
}
 
function NextImage(){       
    if(currentImageIndex < arrayOfImageObjects.length) {
        jQuery('#imageRotator').attr('src',arrayOfImageObjects[currentImageIndex].Url);
        currentImageIndex++;
		
    }
    else
        currentImageIndex = 0;      
    setTimeout(NextImage,5000);
}

$(document).ready(function(){
    GetImagesAndRotate();
});