function setUpTangle () {

    var element = document.getElementById("tangle-legend");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.legendDomain = viz.tracts.legend_domain;
            this.zero = (viz.tracts.legend_domain[0]/1000).toFixed(2)*1;
            this.one = (viz.tracts.legend_domain[1]/1000).toFixed(2)*1;
            this.two = (viz.tracts.legend_domain[2]/1000).toFixed(2)*1;
            this.three = (viz.tracts.legend_domain[3]/1000).toFixed(2)*1;
            this.four = (viz.tracts.legend_domain[4]/1000).toFixed(2)*1;
            this.five = (viz.tracts.legend_domain[5]/1000).toFixed(2)*1;
            this.six = (viz.tracts.legend_domain[6]/1000).toFixed(2)*1;
            this.seven = (viz.tracts.legend_domain[7]/1000).toFixed(2)*1;
            this.eight = (viz.tracts.legend_domain[8]/1000).toFixed(2)*1;
            this.nine = (viz.tracts.legend_domain[9]/1000).toFixed(2)*1;
            

        },
        update: function () {
            //
            var inputs = [this.zero,this.one,this.two,this.three,this.four,this.five,this.six,this.seven,this.eight,this.nine];
            var new_domain = [];
            inputs.forEach(function(d){

                if(!isNaN(d)){
                    new_domain.push(d*1000);
                }
            });
           
            viz.tracts.color.domain(new_domain);
            //viz.tracts.updateMap();
        }
    });
}