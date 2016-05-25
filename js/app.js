(function() {
  // Define our constructor
  this.Graph = function() { 
    var max =  250;
    
    // Define option defaults
    var defaults = {
      className: 'graph',
      colors : ["#F00", "#0F0"],
      title: "Graph Demo",
      filter: true,
      filterBy: "last30days",
      display_data: [],
      graph_data: [
        ['10/01/2014', 10, 100],
        ['15/01/2014', 50, 200],
        ['20/01/2014', 340, 100],
        ['25/01/2014', 110, 300]      
      ]
    }
    // Create options by extending defaults with the passed in arugments
    this.options = extendDefaults(defaults, arguments[0]);    
    this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    filterData.apply(this);
  }

  // Function to set graph display data according to filter selected 
  function setDisplayData(value){
    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear(); 
    var date, likeCount, viewCount,monthName,graphDate ;
    var display_data=[];

    if(value == 365){
      for(var i=0; i<this.months.length; i++){
        likeCount = 0 ;
        viewCount = 0 ;
        if(currentMonth<0){
          currentYear = currentYear - 1;
          currentMonth = currentMonth +12;
        }  
        date = new Date(parseInt(currentYear), parseInt(currentMonth), 1);
        monthName= this.months[parseInt(currentMonth)] + " " + currentYear        

        for (var j = 0; j < this.options.graph_data.length; j++) {  
          graphDate = this.options.graph_data[j][0].split("/")
          if(date.sameMonth(new Date(graphDate[2],graphDate[1]-1,graphDate[0]))) { // Month index start from 0
            likeCount= likeCount+ this.options.graph_data[j][1];
            viewCount= viewCount+ this.options.graph_data[j][2];
          }  
        }
        if(likeCount > 0 || viewCount > 0){
          display_data.push([monthName, likeCount, viewCount])  
        }
        currentMonth = currentMonth-1;               
      } 
    }else{
        for(var i=0; i<value; i++){
          date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
          for (var j = 0; j < this.options.graph_data.length; j++) {  
            graphDate = this.options.graph_data[j][0].split("/")
            if(date.sameDay(new Date(graphDate[2],graphDate[1]-1,graphDate[0]))) { // Month index start from 0
              display_data.push(this.options.graph_data[j])
            }  
          }
          
        }
    }
    this.options.display_data = display_data;

  }

  function filterData(val){    
    if(this.options.filter){      
      //this.options.filterBy = val
      switch (this.options.filterBy) {

        case "last7days":
            setDisplayData.apply(this,[7]);                  
            break;

        case "last15days":
            setDisplayData.apply(this,[15]);
          break;

        case "last30days":
            setDisplayData.apply(this,[30]);        
          break;

        case "last1year":
            setDisplayData.apply(this,[365]);
          break;                    

        default:
          setDisplayData.apply(this,[30]);
      }
    }else {
      this.options.display_data = this.options.graph_data   
    }  
    setMaxValue.call(this);
  }



  // Function to caluclate div height in %
  function getHeight(val) {
    var height = val*100/this.max;
    return height+"%";
  }
// Function to set max nubmer count for graph height
  function setMaxValue(){
    var max =  this.options.display_data[0][1];
    this.max = 250;
    var m;
    for (var i = 0; i < this.options.display_data.length; i++) {  
        m = this.options.display_data[i][1] > this.options.display_data[i][2] ? this.options.display_data[i][1] : this.options.display_data[i][2] ;
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



  function createFilter(){
    var select = document.createElement("select");
    var obj = this;
    select.className += "filter-by";
    select.id = "filter";
    select.options.add( new Option("Filter","") );
    select.options.add( new Option("Last 7 Days","last7days") );
    select.options.add( new Option("Last 15 Day","last15days") );    
    select.options.add( new Option("Last 30 Days","last30days") );    
    select.options.add( new Option("Last One Year","last1year") );   
    select.options[3].selected = true; 
    select.onchange=function(){      
      obj.options.filterBy = select.options[select.selectedIndex].value 
      filterData.apply(obj,[select.options[select.selectedIndex].value]);
      renderGraphHTML.call(obj);
    };
    return select;
  }

  function renderGraphHTML(){
    var body = document.getElementsByClassName(this.options.className)[0];
    var graphSection = body.getElementsByClassName("graph-section")[0]; 
    // creates a <table> element and a <tbody> element
    var tbl     = document.createElement("table");
    tbl.className += "table-bordered";
    tbl.style.width="100%";
    var tblBody = document.createElement("tbody");
       
    // creating row for graph data section   
    var row = document.createElement("tr");   

    for (var i = 0; i < this.options.display_data.length; i++) {  
      var cell = document.createElement("td");                
      cell.style.height = "250px";

      // Create internal table for like and view count
      var internalTbl = document.createElement("table");
      internalTbl.style.height = "100%";
      internalTbl.style.width = "100%";
      internalTbl.style.margin =  "0 auto";

      var internalTblBody = document.createElement("tbody");
      var internalRow = document.createElement("tr");
      
      // First Arugument Setting
      var internalCell = document.createElement("td");  
      internalCell.style.height = "100%";
      internalCell.className += "bar";
      var div = document.createElement("div");   
      div.className += "bar-detail";             
      //div.style.width = "50px";
      div.style.height = getHeight.call(this, [this.options.display_data[i][1]]);          
      div.style.background = this.options.colors[0];
      //div.innerHTML="&nbsp;"
      div.style.color = "white";
      var tooltipDiv = document.createElement("div");    
      tooltipDiv.className += "tooltip";
      tooltipDiv.innerHTML = this.options.graph_data[i][1]+ " Likes ";
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
      //div.style.width = "50px";
      div.style.height = getHeight.call(this, [this.options.display_data[i][2]]);
      div.style.background = this.options.colors[1];
      //div.innerHTML="&nbsp;"
      div.style.color = "white";
      var tooltipDiv = document.createElement("div");    
      tooltipDiv.className += "tooltip";
      tooltipDiv.innerHTML = this.options.display_data[i][2] + " Views";
      // div.innerHTML = "View Count "+this.options.graph_data[i][2];      
      div.title= this.options.display_data[i][2] + " Views";;      
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
    for (var i = 0; i < this.options.display_data.length; i++) {          
      var cell = document.createElement("td");
      var cellText;
      if(this.options.filter && this.options.filterBy == "last1year"){
        cellText = document.createTextNode(this.options.display_data[i][0]);        
      } else{
        var d  = this.options.display_data[i][0].split("/");
        cellText = document.createTextNode(d[0]+" "+this.months[parseInt(d[1]-1)]);        
      } 
      cell.className += "text-center";
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);      
    tbl.appendChild(tblBody);       
    graphSection.innerHTML= '';
    graphSection.appendChild(tbl)
    var legendDiv = document.createElement("div"); 
    legendDiv.className += "graph-legend";
    legendDiv.innerHTML = "<table><tr><td> <div style='display: inline-block;background-color:"+this.options.colors[0]+"'>&nbsp;</div>  Likes  </td><td>  <div style='display: inline-block;background-color:"+this.options.colors[1]+"'>&nbsp;</div>  Views</td></tr></table>";
    graphSection.appendChild(legendDiv);    
  }


  Graph.prototype.render = function() {
    
    //Reset Dom
    var body = document.getElementsByClassName(this.options.className)[0]; 
    body.style.width="1000px";   
    body.innerHTML = "";         
    var titleDiv = document.createElement("div");   
    titleDiv.className += "graph-title";
    titleDiv.innerHTML = this.options.title;
    body.appendChild(titleDiv);         
    if(this.options.filter) {
      titleDiv.appendChild(createFilter.call(this));
    }    
    // appends <table> into <body>
    var mainDiv = document.createElement("div"); 
    mainDiv.className += "graph-section";
    body.appendChild(mainDiv);        
    renderGraphHTML.call(this);
  }

  //  Date Utility function for comparision two date 
  Date.prototype.sameDay = function(d) {
    return this.getFullYear() === d.getFullYear()
      && this.getDate() === d.getDate()
      && this.getMonth() === d.getMonth();
  }

  //  Date Utility function for comparision two date with same month 
  Date.prototype.sameMonth = function(d) {
    return this.getFullYear() === d.getFullYear()
      && this.getMonth() === d.getMonth();
  }
}());

