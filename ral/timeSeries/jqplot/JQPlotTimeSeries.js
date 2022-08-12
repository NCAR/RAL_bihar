var ral = ral || {};
ral.timeSeries = ral.timeSeries || {};
ral.timeSeries.jqplot = ral.timeSeries.jqplot || {};

/**
 * Ann instantiation of a TimeSeriesPlot using the JQPlot library.
 *
 * @param {object}  options
 * @param {string}  options.title (required) The title to display
 * @param {string}  options.dateFormat (required) The format of the datestring for the x axis
 * @param {number}  options.ticks (optional) Number of tick marks to display
 * @param {number}  options.tickInterval (required) Interval between tick marks
 * @param {string}  options.legendPosition (optional) The legend position 'inside' or 'outside'. Defaults to inside.
 * @param {boolean} options.useUtc (optional) If true, will coerce JQPlot into displaying UTC time labels
 * @param {boolean} options.drawNowLine (optional) If true, draw a line on the display showing the currently selected time
 * @paran {string}  options.nowLineColor (optional) If drawing the 'now' line, use this color (default is red)
 * @paran {number}  options.nowLineWidth (optional) If drawing the 'now' line, use this line width (default is 1)
 * @param {Array}   options.yRange (optional) the fixed y range to use. [minValue, maxValue]. If omitted, uses autoscaling
 *
 * @constructor
 * @extends ral.timeSeries.TimeSeriesPlot
 * @memberof ral.timeSeries.jqplot
 * @requires module:jquery-ui.jqplot
 */
ral.timeSeries.jqplot.JQPlotTimeSeries = function( options )
{
  /* set the required parameters */
  this.title        = options.title;
  this.dateFormat   = options.dateFormat;
  this.ticks        = options.ticks;
  this.tickInterval = options.tickInterval;
  this.legendPosition = "inside";
  this.useUtc = false;
  this.drawNowLine = false;
  this.nowLineColor = "FF0000";
  this.nowLineWidth = 1;
  this.plotOptions = options; // catch-all for any plot options

  if ( typeof options.legendPosition !== "undefined" ) { this.legendPosition = options.legendPosition; }
  if ( typeof options.useUtc !== "undefined" ) { this.useUtc = options.useUtc; }
  if ( typeof options.drawNowLine !== "undefined" ) { this.drawNowLine = options.drawNowLine; }
  if ( typeof options.nowLineColor !== "undefined" ) { this.nowLineColor = options.nowLineColor; }
  if ( typeof options.nowLineWidth !== "undefined" ) { this.nowLineWidth = options.nowLineWidth; }

  /* set the optional parameters if they were given */
  if( "yRange" in options ) this.yRange = options.yRange;

  ral.timeSeries.TimeSeriesPlot.call( this, options );

  /* initialize the view */
  this.initView( true );
};
//TODO: (see seriesDefaults section on http://www.jqplot.com/docs/files/jqPlotOptions-txt.html)

/**
 * Extend from TimeSeriesPlot
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype = Object.create( ral.timeSeries.TimeSeriesPlot.prototype );

/**
 * Clears the plot and displays the 'blank message' in the target element
 *
 * @param {boolean} showBlankMessage Flag to add the "no data" message - true to display the message
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype.initView = function( showBlankMessage )
{
  // clear the plot
  jQuery( "#" + this.target )
    .addClass( "TimeSeriesPlot" )
    .empty();

  // clear the data download links element (if it exists)
  if( typeof( this.dataDownloadLinkTarget ) !== "undefined" )
  {
    jQuery( "#" + this.dataDownloadLinkTarget).empty();
  }

  if( showBlankMessage )
  {
    this.drawBlankMessage( false );
  }
};

/**
 * Listen to the TimeSelector for a frame change.
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype.frameChanged = function( time ) {
  this.current = time;
  this.draw();
};

/**
 * Remove everything from the plot div and delete all attached data sources
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype.clearPlot = function()
{
  this.sourceList = [];
  this.initView( false );
};

/**
 * Get the y axis labels from the data sources. This assumes there will be only one axis label
 * for each axis (left or right). TODO add support for more than two Y axes
 * @returns {{yAxisLabel: string, y2AxisLabel: string}}
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype.getYAxisLabels = function()
{
    var yAxisLabel = "";
    var y2AxisLabel = "";

    for( var i = 0; i < this.sourceList.length; i++ )
    {
        // get y axis label(s) from series objects
        var yAxis = this.sourceList[i].getYAxis();
        if (yAxis.axis === "y2axis" ) {
            y2AxisLabel = yAxis.label;
        }
        else { yAxisLabel = yAxis.label; }
    }

    return { yAxisLabel: yAxisLabel, y2AxisLabel: y2AxisLabel };
};

/**
 * Draw the plot, including all data sources that have data
 * @override
 *
 */
ral.timeSeries.jqplot.JQPlotTimeSeries.prototype.draw = function()
{
  if( this.sourceList.length == 0 )
  {
    this.clearPlot();
    this.drawNodataMessage(true);
    return;
  }

  var data        = [];
  var seriesOpts  = [];

  /* build the series lines from the sources */
  for( var i = 0; i < this.sourceList.length; i++ )
  {
    if ( this.sourceList[i].isDataAvailable() ) {
        var sourceData = this.sourceList[i].getData();
        var sourceSeriesOpts = this.sourceList[i].getSeriesOptions();
        // Handle case where a DataSource generated multiple timeseries traces
        if( Array.isArray( sourceData ) && Array.isArray( sourceSeriesOpts ) ) {
          if( sourceData.length != sourceSeriesOpts.length ) {
              console.log( "JQPlotTimeSeries seriesOptions length (" + sourceSeriesOpts.length +
              ") doesn't match number of data series (" + sourceData.length + ")!");
              return;
          }
          for( var j = 0; j < sourceData.length; j++ ) {
            data.push( sourceData[j] );
            seriesOpts.push( sourceSeriesOpts[j] );
          }
        } else {
            data.push( sourceData );
            seriesOpts.push( sourceSeriesOpts );
        }
    }
  }

  // and exit if there are no datasets
  if( data.length == 0 ) {
      this.clearPlot();
      this.drawNodataMessage(true);
      return;
  }

  // Reorder datasets, if specified
  if( Array.isArray( this.plotOptions.seriesOrder ) ) {
    try {
      reorderedData = [];
      reorderedOpts = [];
      for (var index = 0; index < this.plotOptions.seriesOrder.length; index++) {
        reorderedData[index] = data[this.plotOptions.seriesOrder[index]];
        reorderedOpts[index] = seriesOpts[this.plotOptions.seriesOrder[index]];
      }
      data = reorderedData;
      seriesOpts = reorderedOpts;
    } catch (err) {
      console.log(err.message);
    }
  }

  var ylabels = this.getYAxisLabels();

  var renderOptions = (this.legendPosition === "inside") ? { numberRows: 1 } : { numberColumns: 1 };

  /* add other styling options */
  var axesDefaults   = Object.assign({}, { tickOptions: { fontFamily: "avenir" /* TODO: put in css */ }, autoscale: true },
      ( typeof this.plotOptions.axesDefaults != 'undefined' )? this.plotOptions.axesDefaults : {} );
  var grid           = { background: "#f9f9f9", shadow: false };
  var cursor         = { style: "crosshair", show: true, showTooltip: true, tooltipLocation: "se", tooltipOffset: 6, showVerticalLine: true, showHorizontalLine: true, zoom: true };
  var seriesDefaults = Object.assign({}, { shadow: false, fill: false, lineWidth: 1.5, breakOnNull: true },
      ( typeof this.plotOptions.seriesDefaults != 'undefined' )? this.plotOptions.seriesDefaults : {} );
  var highlighter    = { sizeAdjust: 10, tooltipLocation: 'y', tooltipAxes: 'y', useAxesFormatters: true, tooltipFormatString: "%.2f" };
  var legend         = { renderer: jQuery.jqplot.EnhancedLegendRenderer, show:true, placement: this.legendPosition, rendererOptions: renderOptions, location:'ne' };
  var title          = this.title + ( this.sourceList.length < 1 ? "" : ( typeof( this.sourceList[0].location ) !== "undefined" ? "<br/>" + this.sourceList[0].location : "" ) );

  var start = this.start;
  var end = this.end;
  var current = this.current;

  if ( this.useUtc === true )
  {
      // fool JQPlot into setting these offset dates to what it thinks is localtime, but is actually UTC
      start = new Date( start.getTimezoneOffset() * 60 * 1000 + start.getTime() );
      end = new Date( end.getTimezoneOffset() * 60 * 1000 + end.getTime() );

    if ( typeof current !== "undefined" && current !== null ) {
      current = new Date(current.getTimezoneOffset() * 60 * 1000 + current.getTime());
    }
  }

  // find the min and max y extent of the data so we can draw the 'now line' correctly
  // TODO is there an easier way to access the autoscaled values, or is it just as efficient
  // to pre-calculate the values like this and provide a fixed y range?
  var minY = 9999999;
  var maxY = -9999999;
  if ( typeof this.yRange !== "undefined" ) {
    minY = this.yRange[0];
    maxY = this.yRange[1];
  } else {
    // find the min and max across all series
    for (i = 0; i < data.length; i++ ) {
      for ( j=0; j < data[i].length; j++ )
      {
        if ( data[i][j][1] > maxY ) { maxY = data[i][j][1]; }
        if ( data[i][j][1] < minY ) { minY = data[i][j][1]; }
      }
    }
	if (minY == -9999) {
		minY = 0
	}
    if ( minY == maxY ) { maxY += 1 }
  }

  var axes           = {
                         xaxis: {
                            autoscale: false,
                            renderer    : jQuery.jqplot.DateAxisRenderer,
                            tickOptions : { formatString: this.dateFormat },
                            tickInterval: this.tickInterval,
                            numberTicks: data[0].length, // the number of times
                            // pad: 0,
                            min: start
                            // max: end
                         },
                         yaxis: {
                             label: ylabels.yAxisLabel,
                             labelRenderer: jQuery.jqplot.CanvasAxisLabelRenderer,
                             tickOptions: { angle: 0 }
                             // pad: 0,
                             //min: (typeof this.yRange !== "undefined") ? this.yRange[0] : null,
                             //max: (typeof this.yRange !== "undefined") ? this.yRange[1] : null
                         },
                         y2axis:
                         {
                           label: ylabels.y2AxisLabel,
                           labelRenderer: jQuery.jqplot.CanvasAxisLabelRenderer
                           //pad: 0
                         }
                       };

  // draw a line for 'now' if configured
  if ( this.drawNowLine == true && typeof current !== "undefined" )
  {
    data.push( [
      [ ral.util.getLocalDateString( current, "%Y-%m-%d %H:%M:%S" ), minY - minY ],
      [ ral.util.getLocalDateString( current, "%Y-%m-%d %H:%M:%S" ), maxY * 2.0 ]
    ] );
    var nowlineOpts = { showLabel: false, color: this.nowLineColor, yaxis: this.yaxis, showLine: true,
      lineWidth: this.nowLineWidth, markerOptions: { show: false } };
    seriesOpts.push( nowlineOpts );
  }

 var plotOptions     = Object.assign(
                       { title         : title,
                         axesDefaults  : axesDefaults,
                         axes          : axes,
                         grid          : grid,
                         cursor        : cursor,
                         seriesDefaults: seriesDefaults,
                         series        : seriesOpts,
                         highlighter   : highlighter,
                         legend        : legend
                       },
                       this.plotOptions );

  try {
    if (data.length == 0) data[0] = [[0, 0]];

    this.plot = jQuery.jqplot(this.target, data, plotOptions);

    // replot - hack to make sure time labels are spaced correctly (and not too crowded)
    this.plot.replot({
      resetAxes: ['xaxis'], axes: {
        // xaxis: {renderer: jQuery.jqplot.CategoryAxisRenderer, min: start, max: end},
        xaxis: {min: start, max: end, numberTicks: data[0].length, tickInterval: this.tickInterval}
        //yaxis: {min: minY, max: maxY}
      }
    });

  }
  catch( error )
  {
    console.log( error );
  }

  this.drawDataDownloadLinks();

};