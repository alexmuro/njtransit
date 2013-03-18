<style>
.zone:hover{
    background-color: #efefef;
}

</style>
<script>
$('.zone').on('click',function(){
    $('.selected_zone')
        .css('background-color','#fff')
        .removeClass('selected_zone');
    $(this)
        .css('background-color',$(this).data('color'))
        .addClass('selected_zone');
    setSelector($(this).data('color'),$(this).data('id'));
});


  

function setSelector(color,id)
{
  console.log(map.controls);
  currentlayer = map.getLayersByName(id)[0];
  currentlayer.styleMap = getMultiStyle(color)
  selector = new OpenLayers.Control.SelectFeature([currentlayer],{
              clickout: false, toggle: false,
              multiple: true, hover:false,
              toggleKey: "ctrlKey", // ctrl key removes from selection
              multipleKey: "shiftKey" // shift key adds to selection
  });
  map.addControl(selector);
  selector.activate();
  activelayer=currentlayer;
  currentZone = id;
}
</script>

<h1 id="title">Zone Select</h1>

<button id="uplevel" onclick='upOneLevel()' class='x-btn'>Zoom To Full State</button>

<div id="zone1" class="zone" data-id='0' data-color='#00f' style="padding:15px;">
    <h3 id="title">Large Urban Area - Newark</h1>      
</div>
<div id="zone2" class="zone" data-id='1' data-color='#0f0' style="padding:15px;">
    <h3 id="title"> Small Urban Area – Paterson</h1>      
</div>
<div id="zone3" class="zone" data-id='2' data-color='#f00'style="padding:15px;">
    <h3 id="title">South Jersey Urban Center – Atlantic City</h1>      
</div>
<div id="zone4" class="zone" data-id='3' data-color='#f0f' style="padding:15px;"s>
    <h3 id="title"> Intercity NJ Market – Philadelphia</h1>      
</div>



