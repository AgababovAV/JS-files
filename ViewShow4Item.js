
/*
ExecuteOrDelayUntilScriptLoaded(overrideSurfacePivotCount, 'clienttemplates.js');

function overrideSurfacePivotCount() {
   ClientPivotControl.prototype.SurfacedPivotCount = 4;
};
*/
(function () {     
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides({
      'Templates': {
        'Header': renderHeaderTemplateForDocuments
      }
    }); 

    // enter all views here in the desired display order
    var viewNames = ['Мои заявки', 'На согл. (Руководитель)', 'На согл. (Владелец)' ,'Исполнители', 'Архив исполнителей', 'Архив согл. владельцев', 'Архив согл. руководителя','Все элементы'];

    function renderHeaderTemplateForDocuments(renderCtx, fRenderHeaderColumnNames){
        var viewData = eval(renderCtx.ListSchema.ViewSelectorPivotMenuOptions);
        // update with an integer to specify the number of displayed views
       // ClientPivotControl.prototype.SurfacedPivotCount = viewData.length;   //display ALL available menu options
        ClientPivotControl.prototype.SurfacedPivotCount = 4;   //display ALL available menu options
        //viewData.sort(compareMenuOptions);  //sort menu options in order specified in the array
        renderCtx.ListSchema.ViewSelectorPivotMenuOptions = JSON.stringify(viewData);
        return RenderHeaderTemplate(renderCtx, fRenderHeaderColumnNames); //render Header template
    }

    // function compareMenuOptions(a,b) {
        // if(a.DisplayText != undefined && b.DisplayText != undefined){
               // var x = viewNames.indexOf(a.DisplayText);
               // var y = viewNames.indexOf(b.DisplayText)
              // if (x > y)
                // return 1;
              // if (x < y)
                // return -1;
        // }
      // return 0;
    // }
})(); 
