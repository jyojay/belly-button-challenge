// Using the D3 library to read in samples.json from the URL 
//-----------------------------------------------------------
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(datain) {
    console.log(datain);

    // Extracting names/Subject ids #s
    names = datain.names;
    // Preparing dropdown by appending Subject ids
    names.map(row => d3.select("#selDataset").append("option").text(row));

    // Initializing default plots
    //----------------------------

    // Function for initializing display
    function init() {
        // Extracting data for Subject id 940
        initdata = datain.samples.filter(sample => sample.id === "940")[0];
        console.log(initdata);

        // Data for the charts
        initValue = initdata.sample_values;
        initOtuid= initdata.otu_ids;
        initlabel = initdata.otu_labels;
          
        // Selecting top 10 OTUs for the Subject ID with their sample_values, otu_ids and otu_labels
        top10initValue = initValue.slice(0,10).reverse();
        top10initOtuid= initOtuid.slice(0,10).reverse();
        top10initlabel = initlabel.slice(0,10).reverse();
       
        // Logging to console and checking
        console.log(top10initValue);
		console.log(top10initOtuid);
		console.log(top10initlabel);
        
        // Bar chart
        //-----------

        // Defining data and layout for plot
        var trace1 = {
            x: top10initValue,
            y: top10initOtuid.map(id => `OTU ${id}`),
            text: top10initlabel,
            type: "bar",
            orientation: "h"
        };

        var layout = {
			title: `<b>Top 10 OTUs for Selected Subject ID<b>`,
			xaxis: { title: "Sample Value"},
            width: 400,
			height: 550
		};

        // Plotting Bar graph using Plotly
        var data = [trace1];
        Plotly.newPlot("bar", data, layout);

        // Bubble chart
        //--------------

        // Defining data and layout for plot
        var trace2 = {
            x: initOtuid,
            y: initValue,
            text: initlabel,
            mode: "markers",
            marker: {
                color: initOtuid,
                colorscale: "Earth",
                size: initValue
              }
        };

        var layout2 = {
			title: `<b>Sample Values of all OTU IDs for Selected Test Subject<b>`,
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"},
			height: 550,
            width: 1250,
            showlegend: false
		};

        // Plotting Bubble chart using Plotly
        var data2 = [trace2];
        Plotly.newPlot("bubble", data2, layout2);

        //Demographic Information
        //-------------------------
        var demodata = datain.metadata.filter(sample => sample.id === 940)[0];
        console.log(demodata);
        //Displaying each key-value pair from the metadata JSON object
        Object.entries(demodata).map(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
           
        // Gauge chart
        //--------------     

        // Extracting washing frequency
        var washfreqInit = demodata.wfreq;

        // Data for plotting base of gauge
        var traceGauge = {
            type: 'pie',
            hole: 0.5,
            rotation: 90,
            height: 1000,
            width: 1000,
            values: [ 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            showlegend: false,
            marker: {
              colors: ['rgb(248, 243, 236)','rgb(244, 241, 229)','rgb(233, 230, 202)','rgb(229, 231, 179)','rgb(213, 228, 157)',
              'rgb(183, 204, 146)','rgb(140, 191, 136)','rgb(138, 187, 143)','rgb(133, 180, 138)','white'],
              labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9']
            }
          }
      
          // Determining angle and coordinates for drawing needle
          var degrees = (180/9) * washfreqInit;
          var radius = 0.3;
          var radians = degrees * Math.PI / 180;
          var x = -1 * radius * Math.cos(radians);
          var y = radius * Math.sin(radians);
          
          // Data for plotting needle
          var gaugeLayout = {
            shapes: [{
              type: 'line',
              x0: 0.5,
              y0: 0.5,
              x1: x + 0.5,
              y1: y + 0.5,
              line: {
                color: "#CD5C5C",
                width: 4
              }
            }],
            title: `<b>Belly Button Washing Frequency </b> <br> Scrubs per week`,
          }
      
        var dataGauge = [traceGauge];
        // Plotting Gauge using Plotly
        Plotly.newPlot('gauge', dataGauge, gaugeLayout);

    };
    // Calling function for initially displaying default plots 
    init();

    // Updating plots on change in selection
    //----------------------------------------
    
	// Function for updating data when a dropdown menu item is selected
	function updatePlot() {

		// Using D3 to select the dropdown menu
			var inputElement = d3.select("#selDataset");

		// Assigning the value of the dropdown menu option to a variable
			var inputValue = inputElement.property("value");
			console.log(inputValue);

		// Filtering the dataset based on inputValue ID
			dataset = datain.samples.filter(sample => sample.id === inputValue)[0];
			console.log(dataset);

		// Selecting all sample_values, otu_ids and otu_labels of the selected test ID
			allSampleValues = dataset.sample_values;
			allOtuIds = dataset.otu_ids;
			allOtuLabels = dataset.otu_labels;

		// Selecting the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
		top10Values = allSampleValues.slice(0, 10).reverse();
		top10Ids = allOtuIds.slice(0, 10).reverse();
		top10Labels = allOtuLabels.slice(0, 10).reverse();

		// Updating Bar graph
        //-------------------
		Plotly.restyle("bar", "x", [top10Values]);
		Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle("bar", "text", [top10Labels]);

		// Updating Bubble chart
        //----------------------
		Plotly.restyle('bubble', "x", [allOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allOtuLabels]);
		Plotly.restyle('bubble', "marker.color", [allOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);

		// Updating Demographic info
        //---------------------------
		metainfo = datain.metadata.filter(sample => sample.id == inputValue)[0];

		// Clearing out current contents in the panel
		d3.select("#sample-metadata").html("");

		// Displaying each key-value pair from the metadata JSON object
		Object.entries(metainfo).map(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

		// updating gauge chart
        //---------------------
		var wfreq = metainfo.wfreq;

        // Data for plotting base of gauge
        var traceGauge = {
            type: 'pie',
            hole: 0.5,
            rotation: 90,
            height: 1000,
            width: 1000,
            values: [ 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            showlegend: false,
            marker: {
              colors: ['rgb(248, 243, 236)','rgb(244, 241, 229)','rgb(233, 230, 202)','rgb(229, 231, 179)','rgb(213, 228, 157)',
              'rgb(183, 204, 146)','rgb(140, 191, 136)','rgb(138, 187, 143)','rgb(133, 180, 138)','white'],
              labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9']
            }
        }
  
        // Determining angle and coordinates for drawing needle
        var degrees = (180/9) * wfreq;
        var radius = 0.3;
        var radians = degrees * Math.PI / 180;
        var x = -1 * radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        // Data for plotting needle
        var gaugeLayout = {
            shapes: [{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: x + 0.5,
            y1: y + 0.5,
            line: {
                color: "#CD5C5C",
                width: 4
                }
            }],
            title: `<b>Belly Button Washing Frequency </b> <br> Scrubs per week`,
        }
  
    var dataGauge = [traceGauge];
    // Plotting Gauge using Plotly
    Plotly.newPlot('gauge', dataGauge, gaugeLayout);
	}

    // Calling updatePlot() function when a change takes place to the DOM
	d3.selectAll("#selDataset").on("change", updatePlot);
});


