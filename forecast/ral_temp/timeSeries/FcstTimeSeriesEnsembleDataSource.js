var ral = ral || {};
ral.indiaWBG = ral.indiaWBG || {};
ral.indiaWBG.timeSeries = ral.indiaWBG.timeSeries || {};

/**
 * @param options
 * @param {array}  options.dataFieldRange (optional) The column number of the field containing the date and a (optional) column number of the last field containing a value (defaults to all).
 * @param {boolean} options.dataStartLineNumber   (optional) The line number where the data start (defaults to 3)
 * @constructor
 * @extends ral.timeSeries.jqplot.JQPlotDataSource
 */
ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource = function ( options ) {
    /* call the super constructor and inherit prototype functions */
    ral.timeSeries.jqplot.JQPlotDataSource.call( this, options );

    if( "dataFieldRange" in options ) this.dataFieldRange = options.dataFieldRange;
    if( "dataStartLineNumber" in options ) this.dataStartLineNumber = options.dataStartLineNumber;
    if( "badValue" in options ) this.badValue = options.badValue;
    if( "plot" in options ) this.plot = options.plot;

  /* call the super constructor */
  ral.timeSeries.jqplot.JQPlotDataSource.call( this, options );
};

/**
 * Inherit from the JQPlotDataSource class
 */
ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource.prototype = Object.create( ral.timeSeries.jqplot.JQPlotDataSource.prototype );

/**
 * Get the data URL. Child classes should construct the getData URL string using the supplied start/end times
 * @param {Date} start The start time for the series
 * @param {Date} end The end time for the series
 * @abstract
 * @return {string} The url for the plot data
 */
ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource.prototype.getDataUrl = function( start, end ) {
  return this.dataUrl;
};

/**
 * Parse data returned from the server
 * @override
 *
 * @param {string} rawData The content loaded from the data URL
 * @return {Object} An array of time/value pairs
 */
ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource.prototype.parseData = function( rawData ) {
    var lines = rawData.split( "\n" );
    var data, refDate, milliTimeStep = 86400000;
    var headings = lines[0];

    // put the time and value pairs into an array for each line of the data
    for( var lineNum = this.dataStartLineNumber; lineNum < lines.length; lineNum++ ) {
        if( "" == lines[lineNum] ) continue;
        var fields = lines[lineNum].split( ',' );

        // Trim this line to only include the fields we're interested in
        if( this.dataFieldRange ) {
            fields = fields.slice( this.dataFieldRange[0],
                    this.dataFieldRange.length == 2 ? this.dataFieldRange[1]
                    + 1 : fields.length );
        }

        // Date should always be first
        var datestr = fields[0];

        // The first time around, create the empty data array and initialize the base time
        if( typeof data == 'undefined') {
            data = [fields.length];
            for (var i=0;i<fields.length;i++) {
               data[i] = [];
            }
            // for datasets using a time offset, initialize the reference date from the filename
            if( ! isNaN(datestr) ) {
                var fileTime = this.dataUrl.match( /.*?(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?.*/ );
                refDate = new Date( +fileTime[1], +fileTime[2]-1, +fileTime[3],
                        (fileTime.length > 4 && ! isNaN( fileTime[4] )) ? fileTime[4] : 0,
                        (fileTime.length > 5 && ! isNaN( fileTime[5] )) ? fileTime[5] : 0 );
            }
        }

        // calculate the date
        // Since we don't know anything about the file date, be consistent and assume all dates are in local time
       var date;
        if( isNaN(datestr) ) {
            var dataDate = datestr.match( /.*?(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?.*/ );
            date = new Date(+dataDate[1], +dataDate[2]-1, +dataDate[3],
                    (dataDate.length > 4 && ! isNaN( dataDate[4] )) ? dataDate[4] : 0,
                    (dataDate.length > 5 && ! isNaN( dataDate[5] )) ? dataDate[5] : 0 );
        } else {
            date = new Date( refDate.getTime() + ( (+datestr) * milliTimeStep ) );
        }
        data[0].push( date );

        // Push each value onto the end of its array, nullifying if it is a bad value
        for( var fieldIndex = 1; fieldIndex < fields.length; fieldIndex++ ) {
            var value = (fields[fieldIndex] == this.badValue)? null: parseFloat( fields[fieldIndex] );
            data[fieldIndex].push( [ date, value] );

        }
    }
    if( data.length == 0 ) {
        return;
    }

    // Set the plot's start and end times to match our data
    this.plot.start = data[0][0];
    this.plot.end = data[0][data[0].length-1];

    // Remove the first date-only array, which we don't need to render, and move the observation
    // dataset to the end of the data array, so it will  be drawn last
    data = data.slice( 2, fields.length ).concat( [ data[1] ] );

    // Set the seriesOptions for each ensemble member
    var originalGetSeriesOptionsFunc = Object.getPrototypeOf( Object.getPrototypeOf(this) ).getSeriesOptions;
    this.seriesOptions = [];
    for( var seriesIndex = 1; seriesIndex < data.length; seriesIndex++ ) {
        var ensembleSeriesOptions = originalGetSeriesOptionsFunc.call(this);
        ensembleSeriesOptions.label = "Ensemble " + (seriesIndex)
        ensembleSeriesOptions.name = ensembleSeriesOptions.label;
        ensembleSeriesOptions.markerOptions = {show: false};
        this.seriesOptions.push( ensembleSeriesOptions );
    }
    // Set the seriesOptions for the last series (which is the observation dataset)
    // Do this last, so it gets drawn on top of the others
    var observationSeriesOptions = originalGetSeriesOptionsFunc.call(this);
    observationSeriesOptions.label = "Observations";
    observationSeriesOptions.name = observationSeriesOptions.label;
    observationSeriesOptions.color = "black";
    observationSeriesOptions.markerOptions = { style:"filledCircle", size:7 };
    this.seriesOptions.push( observationSeriesOptions );

    return data;
};

/**
 * Get the series options, which is an object with the label, color, and other rendering attributes
 *
 * @return {object} With .label, .color, and other attributes
 */
ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource.prototype.getSeriesOptions = function() {
    return this.seriesOptions;
};


