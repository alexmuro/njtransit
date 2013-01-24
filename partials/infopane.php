<div id="text">
    <button id="uplevel" onclick='upOneLevel()' class='x-btn'>Go Up One Level</button>
    <h1 id="title">Info Tab</h1>
    <div id="infopane">
        data:  <span id="data" class='display'></span><br>
        <span id="countydata" class='display'></span>
    </div>
    <h1 id="title">Census</h1>
    <div id="censusControl">
        <div style='padding:10px;'>
            <b>Select a variable to display</b><br>
            Summary File 1 Variables:<br>
            <select id="sf1" style='border-color:red;'>
             <option selected></option>
             <option value="0" >Total Population</option>
             <option value="1">White Population</option>
             <option value="2">Black Population</option>
             <option value="3">Asian Population</option>
             <option value="4">Hispanic Population</option>
             <option value="5">Male Population</option>
             <option value="6">Female Population</option>
             <option value="7">Total Households</option>
             
            </select>
            American Community Survey Variables:<br>
            <select id="acs">
            <option value="0"></option>
             <option value="0"> Population Sample </option>
             <option value="1"> Housing Units Sample</option>
             <option value="2">Population in Poverty</option>
             <option value="3">HH with 0 Vehicles</option>
             <option value="4">HH with 1 Vehicles</option>
             <option value="5">Median Household Income</option>
             <option value="6">Transportation: Public Transit</option>
             <option value="7">Transportation: Bus or Trolley</option>
             <option value="8">Transportation: Subway</option>
            </select>
        </div>       
    </div>
</div>