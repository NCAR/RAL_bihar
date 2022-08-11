/**
 * Copyright UCAR (c) 1992 - 2016
 * University Corporation for Atmospheric Research(UCAR)
 * National Center for Atmospheric Research(NCAR)
 * Research Applications Laboratory(RAL)
 * P.O.Box 3000, Boulder, Colorado, 80307-3000, USA
 *
 * The Climate Inspector is subject to the terms of the BSD 3-Clause License: http://choosealicense.com/licenses/bsd-3-clause
 * Third party libraries are each subject to their respective licenses (see documentation for details)
 */
 
/**
 * Initialize the GUI
 */
 
    var graphName;
	var sub;
	var timeDownload
	var zoomRes;
  	var resModel;
	//var domainDir = 'bihar'
	var domainDir = 'biharData'
	var d = 'gbm'
	var dataLoc = "../"
	
	
	subNameVar = 'Subbasin'
	subVar = 'GridID'
	

	
	
	function doSomeThing() {
	
    
		forecastdateT = document.getElementById("Model")
		forecastdatetime = forecastdateT.options[forecastdateT.selectedIndex].value
		mylayer = forecastdatetime.trim()
		activeLayer = dataLoc+domainDir+'/'+mylayer
		//go into draw Forecase
		cwc = 2
    var rainfall = document.getElementById("raingauge").checked
    
		drawForecast(activeLayer,assetLayerGroup, map,rainfall) 	
	
			
	}
	function ClearFields(radio) {
		//alert("in clearFields")
		var dateSelectBox = $('#lead').empty(); // empty the select of times
		var dateSelectBox = $('#Model').empty(); // empty the select of times
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		//var dateSelectBox = $('#Flood').empty(); // empty the select of times
		document.getElementById("aveTime").value= 0
		var boxname = '#aveTime'
		var that = $(boxname).empty()
		if(document.getElementById('forecast').checked) {
			//alert("it is checked")
			that.append("<option value='0'> Please Select an Averaging Period</option>")
			that.append("<option value='year24hour'> 24 Hour </option>")
		    that.append("<option value='year5day'> 5 Day</option>")
			that.append("<option value='monthly'> 1 Month</option>");
		} else {
			//alert("it is checked")
			that.append("<option value='0'> Please Select an Averaging Period</option>")
			that.append("<option value='year24hour'> 24 Hour </option>")
		    that.append("<option value='year5day'> 5 Day</option>")
			
		}
	}
	
	function resetAll() {
		var dateSelectBox = $('#lead').empty(); // empty the select of times
		var dateSelectBox = $('#Model').empty(); // empty the select of times
		var dateSelectBox = $('#dateselect').empty(); // empty the select of times
		//var dateSelectBox = $('#Flood').empty(); // empty the select of times
		document.getElementById("aveTime").value= 0
	}
	
	function showDates(ave) {
	//alert(ave)
	
		if(document.getElementById('forecast').checked) {
			dataT = 'forecast'
			var dateSelectBox = $('#dateselect').empty(); // empty the select of times
			url= dataLoc+domainDir+'/'+ave+'.xml'
			fileName = dataLoc+domainDir+'/'+ave+'.xml'
			
		}else if(document.getElementById('observed').checked) {
			dataT= ' observed'
			var dateSelectBox = $('#dateselect').empty(); // empty the select of times
			url= dataLoc+domainDir+'/sat'+ave+'.xml'
			fileName = dataLoc+domainDir+'/sat'+ave+'.xml'
			
		}
		
		
		boxName = "#dateselect"
		var selectBox = $(boxName); 
		var endday
		$.ajax({
            url: url,
            type: 'GET',
            async: true,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var arrayList = []
			$.get(fileName, function(xml) { // get the courses.xml file
				course_data = xml; // save the data for future use
                            // so we don't have to call the file again
				 var that = $(boxName).empty(); // empty the select of times
				 
				$('date', course_data).each(function() { // find courses in data
            // dynamically create a new option element
            // make its text the value of the "title" attribute in the XML
            // and append it to the courses select
			var m = $(this).find('Forecastdate').text();
			arrayList.push(m)

        });
		
			// note: jQuery's filter params are opposite of javascript's native implementation :(
var unique = $.makeArray($(arrayList).filter(function(i,itm){ 
    // note: 'index', not 'indexOf'
     return i == $.inArray(itm, arrayList)
}));
			//alert(unique.length)
			that.append("<option  value=''>Select a date</option>");
			unique.sort(function(a, b){return a - b});
			for (p=0; p<unique.length;p++) {
			var datep = unique[p]
			var year = initDate = datep.substr(0,4)
			var month = initDate = datep.substr(4,2)
			var day = initDate = datep.substr(6,2)
			var endmonth = month
			var endday = 30
			var endyear = year
			//alert(ave)
			//alert (month)
			
			if (ave == 'year24hour') {
				addin = 1
				endday = parseInt(day) + addin
			}else if (ave == 'year5day')  {
				addin = 5
				endday = parseInt(day) + addin
			//this is for 3 monthly
			}else if (ave == 'monthly3')  {
				//alert("in 3 month")
				addin = 2
				aveTimeFrame = "3 month"
				endmonth = parseInt(month) + addin
				//alert(endmonth)
				if (endmonth > 12 ) {
					endmonth = parseInt(endmonth) - 12
					endyear = parseInt(endyear) + 1
				}
			//
				endday = getEndDay(endmonth,day)
			} else {
				//this if for monthly
				endday = getEndDay(month,day)
				
			}
			if (endday > 31 ) {
				endmonth = parseInt(month) + 1
				endday = endday - 31
			}
						
			that.append("<option  value="+unique[p]+">"+ year + "-" + month + "-" + day+" 00Z to "+ endyear + "-" + endmonth + "-" + endday+" 00Z </option>");
	 }
    }, 'xml'); // specify what format the request will return - XML
 $('#date').change(function() { // bind a trigger to when the
                                      // courses select changes
        }
   );
    }});	
	}
	

		
	//get end date for each month
	function getEndDay(m,day) {
		//alert(m)
		var endday = day
		switch (m) {
					case '01' :
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '02' :
						addin = 27
						endday = parseInt(day) + addin
						break;
					case '03' :
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '04' :
						addin = 29
						endday = parseInt(day) + addin
						break;
					case '05' :
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '06':
						addin = 29
						endday = parseInt(day) + addin
						break;
					case '07' :
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '08' :
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '09' :
						addin = 29
						endday = parseInt(day) + addin
						break;
					case '10':
						addin = 30
						endday = parseInt(day) + addin
						break;
					case '11':
						addin = 29
						endday = parseInt(day) + addin
						break;
					case '12':
						addin = 30
						endday = parseInt(day) + addin
						break;
				}	
			return endday
		
	}
		function loadModelBox(forecastDate) {
	
			aveT = document.getElementById("aveTime")
			ave = aveT.options[aveT.selectedIndex].value
			if (ave == "year24hour") {
						c = "acc24h"
					} else {
						c = "acc5d"
					}
			if(document.getElementById('forecast').checked) {
				
				url= dataLoc+domainDir+'/'+ave+'.xml'
				fileName = dataLoc+domainDir+'/'+ave+'.xml'
				
			}else if(document.getElementById('observed').checked) {
		
				url= dataLoc+domainDir+'/sat'+ave+'.xml'
				fileName = dataLoc+domainDir+'/sat'+ave+'.xml'
				
			}
			
			boxName = "#Model"
			var selectBox = $(boxName); 
			
			$.ajax({
				url: url,
				type: 'GET',
				async: false,
				dataType: 'xml',
				data: {id: 43},
				success: function(xml){
				var course_data; // variable to hold data in once it is loaded
				var arrayList = []
				$.get(fileName, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					 var that = $(boxName).empty(); // empty the select of times
					 that.append("<option  value=''>Select a forecast or observation</option>");
					 
					$('date', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var a = $(this).find('Forecastdate').text();
				var modelName 
			if (a == forecastDate) {
					var m = $(this).find('model').text();
					var f = $(this).find('file').text();
					//alert(m)
					if (m == 'multimodel') {
						modelName = 'Multi Model'
					} else if (m == 'ecmf') {
						modelName = 'European (ECMWF)'
					} else if (m == 'cwao') {
						modelName = 'Canadian'
					} else if (m == 'kwbc') {
						modelName = 'US (NCEP)'
					}else if (m == 'egrr'){
						modelName = 'UK (UKMET)'
					} else if (m == 'babj') {
						modelName = 'China (CMA)'
					} else if (m == 'sbsj') {
						modelName = 'Brazil (CPTEC)'
					}else if (m == 'rjtd'){
						modelName = 'Japan (JMA)'
					} else if (m == 'lfpw') {
						modelName = 'France (MeteoFrance)'
					}else if (m == 'CFSv2'){
						modelName = 'CFSv2'
					}else if (m == 'CMC1'){
						modelName = 'CMC1'
					}else if (m == 'CMC2'){
						modelName = 'CMC2'
					}else if (m == 'cfsv2'){
						modelName = 'cfsv2'
					}else if (m == 'NASA'){
						modelName = 'NASA'
					}else if (m == 'GFDL'){
						modelName = 'GFDL'
					}else if (m == 'GFDLFLOR'){
						modelName = 'GFDLFLOR'
					}else if (m == 'NCARCESM'){
						modelName = 'NCARCESM'
					}else if (m == 'NCARCCSM4'){
						modelName = 'NCARCCSM4'
          }else if (m == 'GFDLFLOR2'){
						modelName = 'GFDLFLOR2'
					}else if (m == 'GFDLFLOR1'){
						modelName = 'GFDLFLOR1'
					}else if (m == 'CCSM4'){
						modelName = 'CCSM4'
					}else if (m == 'merge'){
						modelName = 'Merged Satellite'
					}else if (m == 'trmm'){
						modelName = 'TRMM (NASA)'
					}else if (m == 'jaxa'){
						modelName = 'GSMAP (JAXA)'
					} else {
          
						modelName = 'Satellite'
					}
					that.append("<option  value="+f+">"+ modelName+" </option>");
					
				}
			});
				// note: jQuery's filter params are opposite of javascript's native implementation :(

		}, 'xml'); // specify what format the request will return - XML
	 $('#date').change(function() { // bind a trigger to when the
										  // courses select changes
			} );
		}});
		

	}
	function findBestDate(timeSel,url,avePeriod,model,fileName) {
		
		$.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var value = []
			var year = []
			var leadTime = []
			var str = 10
			
			//alert("here")
			$.get(fileName, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					$('date', course_data).each(function() { // find courses in data

				var fd = $(this).find('Forecastdate').text();
				var m = $(this).find('model').text();
				var ave = $(this).find('avePeriod').text();

				if (m == model) {
					if (fd == timeSel)  {
						ave = ave.trim()
						if(ave == avePeriod) {
							
									var a = $(this).find('file').text();
									value.push(a);
									var b =$(this).find('init').text()
									year.push(b)
									var c = $(this).find('forecastDay').text()
									leadTime.push(c) 
									c = c.trim()
									
									//get the closest to 0
									if (c.length == 2) {
									timeslice = c.charAt(1)
									} else {
									timeslice = c.charAt(4)
									}
									if (parseInt(timeslice) < parseInt(str)) {
										str = c
										mylayer = a
										
										}
									}
						}	
						
					}
				//}
				
				
			});
			
		
		mylayer = mylayer.trim()
		firstName = mylayer.split(".")[0]
		
		
		activeLayer = dataLoc+domainDir+'/'+mylayer
		document.getElementById('myInput').value = firstName	
		drawForecast(activeLayer,assetLayerGroup, map) 				

		}, 'xml'); // specify what format the request will return - XML
		} //function xml
		});	
		
		
	}
	
	function setSelectBoxes(timeSel,url,boxName,fileName,aveT, model) {
	var selectBox = $('#date'); 
		$.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'xml',
            data: {id: 43},
            success: function(xml){
			var course_data; // variable to hold data in once it is loaded
			var value = []
			var year = []
			var leadTime = []

			$.get(fileName, function(xml) { // get the courses.xml file
					course_data = xml; // save the data for future use
								// so we don't have to call the file again
					 var that = $(boxName).empty(); // empty the select of times
					 that.append("<option  value=''>Select a date</option>");
					$('date', course_data).each(function() { // find courses in data
				// dynamically create a new option element
				// make its text the value of the "title" attribute in the XML
				// and append it to the courses select
				var fd = $(this).find('Forecastdate').text();
				var m = $(this).find('model').text();
				var ave = $(this).find('avePeriod').text();
				
				if (m == model) {
					if (fd == timeSel)  {
						
							var a = $(this).find('file').text();
							value.push(a);
							var b =$(this).find('init').text()
							year.push(b)
							var c = $(this).find('forecastDay').text()
							leadTime.push(c)   
					}
				}
			});
			for (o=0;o<value.length;o++) {
				value2 = value[o]
				
				that.append("<option  value="+value2+">"+ year[o] +" " + leadTime[o] +"</option>");
			}
		}, 'xml'); // specify what format the request will return - XML
	 $('#date').change(function() { // bind a trigger to when the
						});
	
		} //function xml
		});	
	}
	
	function setAccumulation(m) {
		
		aveT = document.getElementById("aveTime")
		ave = aveT.options[aveT.selectedIndex].value
		forecastdateT = document.getElementById("dateselect")
		forecastdatetime = forecastdateT.options[forecastdateT.selectedIndex].value
		
		
		var dateSelectBox = $('#lead').empty(); // empty the select of times
		url= dataLoc+domainDir+'/'+ave+'.xml'
		fileName = dataLoc+domainDir+'/'+ave+'.xml'
		boxName = "#lead"
		setSelectBoxes(forecastdatetime,url,boxName,fileName,ave,m)
		}	
	
	function changeiFrame(loc) {
		document.getElementById('frame').src = loc;
	}
	
		
		