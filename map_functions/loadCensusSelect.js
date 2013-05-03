function loadCensusSelect(data){
	var acs5 = [];
         var z =0;
         $.each(data, function(index, value) {
            if(index[0] == 'B' && value != 'null'){ 
              acs5[z] = index;
              z++;
            } 
         });
         var acsnames = getCensusVariableName(acs5, '/data/acs_5yr_2011_var.xml');
         
         var sf1 = [];
         var z =0;
         $.each(data, function(index, value) {
            if(index[0] == 'P' && value != 'null'){ 
              sf1[z] = index;
              z++;
            } 
         });
         var sf1names = getCensusVariableName(sf1, '/data/sf1.xml');
         
         $.each(data, function(index, value) {
              if(index[0] == 'B' && value != 'null'){  
                $('#sf1')
                 .append($('<option>', {index :index })
                 .val(index)
                 .text(acsnames[index])); 
               }
               else if(index[0] == 'P'  && value != 'null')
               {
                $('#sf1')
                 .append($('<option>', {index : index})
                 .val(index)
                 .text(sf1names[index])); 
               }
          });
           $("#sf1").on("change",function() {
       
        quant = getLayerAttribute(activelayer,$(this).val());
        activelayer.styleMap = getStyle($(this).val(),$("#color").val(),quant);
        activelayer.redraw();
    });

$("#color").on("change",function() {
        activelayer.styleMap = getStyle($('#sf1').val(),$(this).val(),quant);
        activelayer.redraw();
    });
}