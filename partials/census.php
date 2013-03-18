<!--<button id="uplevel" onclick='upOneLevel()' class='x-btn'>Go Up One Level</button>-->
<h1 id="title">Info Tab</h1>
<div id="infopane">

    data:  <span id="data" class='display'></span><br>
    <span id="countydata" class='display'></span>
    <textarea id='selectedFeatures'></textarea>
</div>
<h1 id="title">Census</h1>
<div id="censusControl">
    <div style='padding:10px;'>
        <b>Select a variable to display</b><br>
        <select id="sf1" style='border-color:red;'>
         <option value="99" selected></option>
         <option value="P0010001">Total Population</option>
         
        </select>
    </div>       
</div>
<?php
include "legend.php";
?>
<script>


</script>


zz