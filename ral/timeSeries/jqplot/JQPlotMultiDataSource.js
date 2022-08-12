var ral = ral || {};
ral.timeSeries = ral.timeSeries || {};
ral.timeSeries.jqplot = ral.timeSeries.jqplot || {};
/**
 * @param options
 * @param {array}  options.dataFieldRange (optional) The column number of the field containing the date and a (optional) column number of the last field containing a value (defaults to all).
 * @param {boolean} options.dataStartLineNumber   (optional) The line number where the data start (defaults to 3)
 * @param {object} options.seriesOptions   (optional) The seriesOptions to apply to the series. Overrides the defaults.
 * @constructor
 * @extends ral.timeSeries.jqplot.JQPlotDataSource
 */
ral.timeSeries.jqplot.JQPlotMultiDataSource = function ( options ) {
    /* call the super constructor and inherit prototype functions */
    ral.timeSeries.jqplot.JQPlotDataSource.call( this, options );

    if( "dataFieldRange" in options ) this.dataFieldRange = options.dataFieldRange;
    if( "dataStartLineNumber" in options ) this.dataStartLineNumber = options.dataStartLineNumber;
    if( "badValue" in options ) this.badValue = options.badValue;
    if( "plot" in options ) this.plot = options.plot;
    if( "seriesOptions" in options ) this.baseSeriesOptions = options.seriesOptions;
};

/**
 * Inherit from the JQPlotDataSource class
 */
ral.timeSeries.jqplot.JQPlotMultiDataSource.prototype = Object.create( ral.timeSeries.jqplot.JQPlotDataSource.prototype );

/**
 * Parse data returned from the server
 * @override
 *
 * @param {string} rawData The content loaded from the data URL
 * @return {Object} An array of time/value pairs
 */
ral.timeSeries.jqplot.JQPlotMultiDataSource.prototype.parseData = function( rawData ) {

          // Build up the data arrays by parsing the incoming raw data
          var outputData = []; // outputArray is [fields][times][time,val]
          // Iterate over each time's values
          var data = rawData.split( "\n" );
          var numFields = 0;
          for( var lineNum = 0; lineNum < data.length; lineNum++ ) {
              if ("" == data[lineNum]) continue;
              // Split the line into fields
              var fields = data[lineNum].split(',');
              numFields = fields.length;
              var dateParts = fields[0].split('-');
			  if (dateParts.length < 2) {
				  var date = new Date()
				  date.setDate(date.getDate() + lineNum + 1);
			  } else {
			
                 var date = new Date( "20"+dateParts[2], dateParts[0]-1, dateParts[1]);
			  }
              for( var fieldNum = 1; fieldNum < numFields; fieldNum++ ) {
                  if( typeof outputData[fieldNum-1] == "undefined" ) {
                      outputData[fieldNum-1] = [];
                      this.plot.start = date;
                  }
                  outputData[fieldNum-1][lineNum] = [ date, (1.0 * fields[fieldNum] ) ];
                  this.plot.end = date;
              }
          }

          // Set the seriesOptions for each data series
          this.seriesOptions = [];
          var superGetSeriesOptions = ral.timeSeries.jqplot.JQPlotDataSource.prototype.getSeriesOptions.call(this);
          for( var seriesIndex = 0; seriesIndex < numFields-1; seriesIndex++ ) {
            this.seriesOptions[seriesIndex] = Object.assign( {}, superGetSeriesOptions,
                ( typeof this.baseSeriesOptions[seriesIndex] == 'undefined' )? {}: this.baseSeriesOptions[seriesIndex] );
          }

          return outputData;
      }

/**
 * Get the series options, which is an object with the label, color, and other rendering attributes
 *
 * @return {object} With .label, .color, and other attributes
 */
ral.timeSeries.jqplot.JQPlotMultiDataSource.prototype.getSeriesOptions = function () {
    return this.seriesOptions;
};