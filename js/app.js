(function() {
  // Define our constructor
  this.Graph = function() { 
    var max =  250;
    // Define option defaults
    var defaults = {
      className: 'graph',
      colors : ["#F00", "#0F0"],
      title: "Graph Demo",
      graph_data: [
        ['10/01/2014', 10, 100],
        ['15/01/2014', 50, 200],
        ['20/01/2014', 340, 100],
        ['25/01/2014', 110, 300]      
      ]
    }
    // Create options by extending defaults with the passed in arugments
    this.options = extendDefaults(defaults, arguments[0]);    
  }

  // Function to caluclate div height in %
  function getHeight(val) {
    var height = val*100/this.max;
    return height+"%";
  }
// Function to set max nubmer count for graph height
  function setMaxValue(){
    var max =  this.options.graph_data[0][1];
    this.max = 250;
    var m;
    for (var i = 0; i < this.options.graph_data.length; i++) {  
        m = this.options.graph_data[i][1] > this.options.graph_data[i][2] ? this.options.graph_data[i][1] : this.options.graph_data[i][2] ;
        console.log(m)
        max = (max >  m) ? max : m;
    }
    this.max = max + this.max ;
  }  

  // Function to extending defults with the passed arugument
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }  

  Graph.prototype.render = function() {
    setMaxValue.call(this);
    //Reset Dom
    var body = document.getElementsByClassName(this.options.className)[0];    
    body.innerHTML = "";         
    var titleDiv = document.createElement("div");   
    titleDiv.className += "graph-title";
    titleDiv.innerHTML = this.options.title;
    body.appendChild(titleDiv);                 
    // creates a <table> element and a <tbody> element
    var tbl     = document.createElement("table");
    tbl.className += "table-bordered";
    tbl.style.width="100%";
    var tblBody = document.createElement("tbody");
       
    // creating row for graph data section   
    var row = document.createElement("tr");   
    
    for (var i = 0; i < this.options.graph_data.length; i++) {  
          var cell = document.createElement("td");                
          cell.style.height = "250px";

          // Create internal table for like and view count
          var internalTbl = document.createElement("table");
          internalTbl.style.height = "100%";
          internalTbl.style.margin =  "0 auto";
          var internalTblBody = document.createElement("tbody");
          var internalRow = document.createElement("tr");
          
          // First Arugument Setting
          var internalCell = document.createElement("td");  
          internalCell.style.height = "100%";
          internalCell.className += "bar";
          var div = document.createElement("div");   
          div.className += "bar-detail";             
          div.style.width = "50px";
          div.style.height = getHeight.call(this, [this.options.graph_data[i][1]]);          
          div.style.background = this.options.colors[0];
          div.style.color = "white";
          var tooltipDiv = document.createElement("div");    
          tooltipDiv.className += "tooltip";
          tooltipDiv.innerHTML = this.options.graph_data[i][1]+ " Likes";
          // div.innerHTML = "Like Count "+this.options.graph_data[i][1];      
          div.title= this.options.graph_data[i][1]+ " Likes";
          div.appendChild(tooltipDiv);                    
          internalCell.appendChild(div);
          internalRow.appendChild(internalCell);
          internalTblBody.appendChild(internalRow);
          
          // View Count
          var internalCell = document.createElement("td");  
          internalCell.style.height = "100%";
          internalCell.className += "bar";      
          var div = document.createElement("div"); 
          div.className += "bar-detail";             
          div.style.width = "50px";
          div.style.height = getHeight.call(this, [this.options.graph_data[i][2]]);
          div.style.background = this.options.colors[1];
          div.style.color = "white";
          var tooltipDiv = document.createElement("div");    
          tooltipDiv.className += "tooltip";
          tooltipDiv.innerHTML = this.options.graph_data[i][1] + " Views";
          // div.innerHTML = "View Count "+this.options.graph_data[i][2];      
          div.title= this.options.graph_data[i][1] + " Views";;      
          div.appendChild(tooltipDiv);      
          internalCell.appendChild(div);
          internalRow.appendChild(internalCell);
          internalTblBody.appendChild(internalRow);


          internalTbl.appendChild(internalTblBody);
          cell.appendChild(internalTbl);
        
          row.appendChild(cell);
        }
        tblBody.appendChild(row);

        // creating row for graph date section   
        var row = document.createElement("tr");    
        for (var i = 0; i < this.options.graph_data.length; i++) {          
          var cell = document.createElement("td");
          var cellText = document.createTextNode(this.options.graph_data[i][0]);       
          cell.className += "text-center";
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        tblBody.appendChild(row);      
      
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        var mainDiv = document.createElement("div"); 
        mainDiv.className += "graph-section";
        mainDiv.appendChild(tbl);

        var legendDiv = document.createElement("div"); 
        legendDiv.className += "graph-legend";
        legendDiv.innerHTML = "<table><tr><td> <div style='display: inline-block;background-color:"+this.options.colors[0]+"'>&nbsp;</div>  Likes  </td><td>  <div style='display: inline-block;background-color:"+this.options.colors[1]+"'>&nbsp;</div>  Views</td></tr></table>";
        mainDiv.appendChild(legendDiv);



        body.appendChild(mainDiv);        

  }

}());

