<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Avail TDM - Zone Selector</title>
        
        <script src="/map_functions/getCensusVarName.js"></script>
        <script src="/resources/js/jquery-1.9.1.min.js"></script>

        <script>
        var sf1 = ['P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'];
        var acs5 = ['B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E','B08006_001E','B08011_001E','B08012_001E','B08013_001E','B08014_001E','B08015_001E','B08016_001E','B08017_001E','B08018_001E','B08101_001E','B08119_001E','B08121_001E','B08122_001E','B08124_001E','B08126_001E','B08128_001E','B08130_001E','B08132_001E','B08133_001E','B08137_001E','B08141_001E','B08202_001E','B08301_001E','B08302_001E','B19001_001E','B99080_001E','B99081_001E','B08014_003E','B08014_002E','B08014_005E','B08014_006E','B08014_007E','B08141_001E','B08141_001E','B08141_003E','B08141_004E','B08141_005E'];
        xmlfile = '/data/acs_5yr_2011_var.xml';
        console.log('starting');
        console.log(getCensusVariableName(acs5, '/data/acs_5yr_2011_var.xml'));

        // $.each(acs5,function(index,val){
        //     console.log(val+' '+getCensusVariableName([val], '/data/acs_5yr_2011_var.xml'));
        // });
        
        </script>

         
        

    </head>
    <body>
        <div id="desc">
            
            
        </div>
    </body>
</html>
