var ral = ral || {};
ral.timeSeries = ral.timeSeries || {};

/**
 * Base class for objects that draw a time series plot into a DOM container. This class contains a list of
 * TimeSeriesDataSources which know how to retrieve and format their data.
 *
 * @constructor
 * @abstract
 *
 * @param {object} options
 * @param {string} options.target (required) The DOM element in which the time series plot will be drawn
 * @param {Date} options.start (required) The start time of the series
 * @param {Date} options.end (required) The end time of the series
 * @param {Date} options.current (optional) The currently selected time
 * @param {string} options.blankMessage (optional) The message to display before any data are loaded
 * @param {string} options.loadingMessage (optional) The message to display while data is loading
 * @param {string} options.nodataMessage (optional) The message to display if no data is available
 * @param {string} options.dataDownloadLinkTarget (optional) The div ID to use for adding links to download plot data
 * @param {string} options.dataLinksHorizontal (optional) If data links are displayed and this is true, they will be
 *                 listed in columns instead of rows
 * @param {Date} options.current (optional) The currently selected time
 *
 * @memberof ral.timeSeries
 * @requires module:jquery
 *
 */
ral.timeSeries.TimeSeriesPlot = function( options )
{
  this.target = options.target;
  this.start = options.start;
  this.end = options.end;

  this.sourceList = [];
  this.isDataLoaded = false;
  this.noData = true;
  this.dataLinksHorizontal = false;
  this.current = null;

  this.blankMessage = "No Data";
  this.nodataMessage = "No Data";
  this.loadingMessage = "Loading...";
  this.dataDownloadLinkTarget = null;

  if( "blankMessage" in options ) this.blankMessage = options.blankMessage;
  if( "loadingMessage" in options ) this.loadingMessage = options.loadingMessage;
  if( "nodataMessage" in options ) this.nodataMessage = options.nodataMessage;
  if( "dataDownloadLinkTarget" in options ) this.dataDownloadLinkTarget = options.dataDownloadLinkTarget;
  if( "dataLinksHorizontal" in options ) this.dataLinksHorizontal = options.dataLinksHorizontal;
  if( "current" in options ) this.current = options.current;
};

/**
 * Draw the plot using data retrieved from each TimeSeriesDataSource.
 * @abstract
 */
ral.timeSeries.TimeSeriesPlot.prototype.draw = function( )
{
  console.log("ral.timeSeries.TimeSeriesPlot.draw() is abstract");
};

/**
 * Draw the blank message into the target element
 * @param {boolean} clear Clear the target element first if true
 */
ral.timeSeries.TimeSeriesPlot.prototype.drawBlankMessage = function( clear ) {
  this.drawMessage(this.blankMessage, "TimeSeriesPlot_blankMessage", clear);
};

/**
 * Draw the loading message into the target element
 * @param {boolean} clear Clear the target element first if true
 */
ral.timeSeries.TimeSeriesPlot.prototype.drawLoadingMessage = function( clear ) {
  this.drawMessage(this.loadingMessage, "TimeSeriesPlot_loadingMessage", clear);
};

/**
 * Draw the no data message into the target element
 * @param {boolean} clear Clear the target element first if true
 */
ral.timeSeries.TimeSeriesPlot.prototype.drawNodataMessage = function( clear ) {
  this.drawMessage(this.nodataMessage, "TimeSeriesPlot_nodataMessage", clear);
};

/**
 * Draw a message into the target element
 * @param {string} message The message to display
 * @param {String} css The css class name to use for message style
 * @param {boolean} clear If true, clear the plot first
 * @protected
 */
ral.timeSeries.TimeSeriesPlot.prototype.drawMessage = function( message, css, clear )
{
  if ( clear === true ) {
    jQuery( "#" + this.target ).empty();
    if ( this.dataDownloadLinkTarget !== null )
    {
      jQuery( "#" + this.dataDownloadLinkTarget ).empty();
    }
  } else {
    var child = jQuery("#" + this.target).children("text");
    child.remove();
  }

  jQuery( "<text/>" )
    .addClass( css )
    .text( message )
    .appendTo( jQuery( "#" + this.target ) );
};

/**
 * Add a data source OR an array of data sources to the plot
 * @param {ral.timeSeries.TimeSeriesDataSource} dataSource The data object or array of data objects to add
 */
ral.timeSeries.TimeSeriesPlot.prototype.addDataSource = function( dataSource )
{
  if ( Array.isArray(dataSource) ) {
    for (var i=0;i<dataSource.length;i++)
    {
      this.sourceList.push( dataSource[i] );
    }
  } else {
    this.sourceList.push( dataSource );
  }
};

/**
 * Remove a data source from this plot
 * @param {String} dataSource The name/id of the data source to remove
 */
ral.timeSeries.TimeSeriesPlot.prototype.removeDataSource = function( dataSource )
{
  for( var i = 0; i < this.sourceList.length; i++ )
  {
    if( this.sourceList[i].getName() === dataSource )
    {
      this.sourceList.splice( i, 1 );
      return;
    }
  }
};

/**
 * Check to see if data has been loaded for all data sources attached to this plot
 * @returns {boolean} True if data is loaded
 */
ral.timeSeries.TimeSeriesPlot.prototype.isAllDataLoaded = function()
{
  if (this.sourceList.length == 0) { return false; }
  var numLoaded = 0;
  for (var i = 0; i < this.sourceList.length; i++) {
    if (this.sourceList[i].isDataLoaded() === true) {
      numLoaded++;
    }
  }

  return ( this.sourceList.length === numLoaded );
};

/**
 * Check to see if any of the data sources contain one or more datapoints
 * @returns {boolean} True if there is data available
 */
ral.timeSeries.TimeSeriesPlot.prototype.isDataAvailable = function()
{
  var numAvailable = 0;
  for (var i = 0; i < this.sourceList.length; i++) {
    if (this.sourceList[i].isDataAvailable() === true) {
      numAvailable++;
    }
  }

  return ( numAvailable > 0 );
};

/**
 * Listen to the TimeSelector for a change in start/end times. If the time sequence has changed,
 * this function tells all contained data sources to retrieve their data from the server and notify
 * the TimeSeriesPlot when the data is loaded.
 *
 * @param {ral.time.TimeSequenceModel} timeModel Contains start and end times
 */
ral.timeSeries.TimeSeriesPlot.prototype.sequenceChanged = function( timeModel )
{
  if ( timeModel != null ) {
    this.start = timeModel.getFirstFrame();
    this.end = timeModel.getLastFrame();
  }

  for (var i = 0; i < this.sourceList.length; i++) {
    this.sourceList[i].retrieveData( this.start, this.end, function() { this.dataLoaded(); }.bind(this) );
  }
};

/**
 * Callback when data from a data source has loaded
 * @protected
 */
ral.timeSeries.TimeSeriesPlot.prototype.dataLoaded = function()
{
  // wait for all datasources to get a server response
  if ( ! ( this.isAllDataLoaded() ) )
  {
    return;
  }

  // redraw the plot
  this.draw();
};

/**
 * Draw download links in the target element, if set
 * @protected
 */
ral.timeSeries.TimeSeriesPlot.prototype.drawDataDownloadLinks = function()
{
  if ( this.dataDownloadLinkTarget == null ) { return; }

  jQuery( "#" + this.dataDownloadLinkTarget).empty();
  var separator = ( this.dataLinksHorizontal === true ) ? "<b> </b>" : "<br/>";

  for( var i = 0; i < this.sourceList.length; i++ )
  {
    if( typeof( this.sourceList[i].dataLinks ) !== "undefined" && this.sourceList[i].isDataAvailable() === true )
    {
      for( var j = 0; j < this.sourceList[i].dataLinks.length; j++ )
      {
        jQuery( "<a>" )
            .html( this.sourceList[i].dataLinks[j][0] )
            .attr( "href", this.sourceList[i].dataLinks[j][1] )
            .addClass( "PlotDownloadLink" )
            .css( "color", this.sourceList[i].color )
            .appendTo( "#" + this.dataDownloadLinkTarget );
        jQuery( "<i> </i>" ).appendTo( "#" + this.dataDownloadLinkTarget );
      }

      jQuery( separator ).appendTo( "#" + this.dataDownloadLinkTarget );
    }
  }
};




