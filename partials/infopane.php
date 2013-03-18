<style>
    #tab_nav{
        overflow: auto; 
        border-bottom:2px solid black;
    }
    
    #content{
        padding:5px;
        width:95%;
    }
    
    
    
    .nav_button{
          padding:5px;
          float:left;
          border:1px solid black;
          background-color: #ECE7F2;
    }

    .nav_button:hover{
        background-color: #034E7B;
        color:#fff;
    }

    .selected{
        background-color: #74A9CF;
    }
</style>



<div id='tab_nav'>
    <div id='census_tab' class='nav_button selected'>Zone Select</div> 
    <div id='census_tab' class='nav_button'>Census</div> 
    <div id='transit_tab' class='nav_button'>Transit</div>
    <div id='graphing_tab' class='nav_button'>Graphing</div>
</div>

<div id="content">
</div>