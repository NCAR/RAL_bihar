var ral = ral || {};
ral.timeSeries = ral.timeSeries || {};
ral.timeSeries.jqplot = ral.timeSeries.jqplot || {};

/**
 * The JQPlotDataSource provides four main components to a JQPlotTimeSeries: <ul>
 *   <li>The data itself as an array of time,value pairs</li>
 *   <li>The name or unique ID (allows updates to overwrite old time series)</li>
 *   <li>The label for the data that is visible to the user</li>
 *   <li>The color for the line</li></ul>
 *
 * @param {object} options
 * @param {string} options.yaxisLabel (required) The y-axis label for the plot
 * @param {string} options.yaxis      (optional) Which y axis to plot against "left" or "right". Default is left.
 * @param {number} options.location   (optional) The location of the data point, to be used in the plot title
 * @param {number} options.latitude   (optional) The latitude of the data point, to be used in the plot title
 * @param {number} options.longitude  (optional) The longitude of the data point, to be used in the plot title
 * @param {string} options.linePattern (optional) Type of line to draw Default is solid
 * @param {object} options.markerOptions  (optional) The point style options to pass to JQPlot. Default is 'X' size 7
 * @param {boolean} options.showLine  (optional) Show a line connecting the datapoints. Default is true
 *
 * @constructor
 * @extends ral.timeSeries.TimeSeriesDataSource
 * @memberof ral.timeSeries.jqplot
 */
ral.timeSeries.jqplot.JQPlotDataSource = function( options )
{
  /* get the required parameters */
  this.yaxisLabel = options.yaxisLabel;
  this.linePattern = "solid";
  this.markerOptions = { size: 7, style:"x" };
  this.yaxis = "yaxis";
  this.showLine = true;

  /* get the optional parameters if they are specified */
  if( "location" in options )  this.location  = options.location;
  if( "latitude" in options )  this.latitude  = options.latitude;
  if( "longitude" in options )  this.longitude  = options.longitude;
  if( "renderer" in options ) this.renderer = options.renderer;
  if( "linePattern" in options) this.linePattern = options.linePattern;
  if( "markerOptions" in options ) this.markerOptions = options.markerOptions;
  if( "showLine" in options ) this.showLine = options.showLine;
  if( "yaxis" in options && options.yaxis === "right" ) this.yaxis = "y2axis";

  ral.timeSeries.TimeSeriesDataSource.call( this, options );

};

/**
 * Extend from TimeSeriesPlot
 */
ral.timeSeries.jqplot.JQPlotDataSource.prototype = Object.create( ral.timeSeries.TimeSeriesDataSource.prototype );

/**
 * Get the yAxis this datasource plots against (left or right),
 * along with the axis label
 */
ral.timeSeries.jqplot.JQPlotDataSource.prototype.getYAxis = function()
{
  return { axis: this.yaxis, label: this.yaxisLabel };
};

/**
 * Get the series options, which is an object with the label, color, and other rendering attributes
 *
 * @return {object} With .label, .color, and other attributes
 */
ral.timeSeries.jqplot.JQPlotDataSource.prototype.getSeriesOptions = function()
{
  var options = { dataUrl: this.dataUrl, label: this.label, color: this.color, yaxisLabel:
    this.yaxisLabel, yaxis: this.yaxis, showLine: this.showLine, linePattern: this.linePattern,
    markerOptions: this.markerOptions, lineWidth: this.lineWidth };
  if( typeof( this.renderer ) !== "undefined" ) {
    options.fill = true;
  }
  return options;
};
