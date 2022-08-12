var ral = ral || {};
ral.timeSeries = ral.timeSeries || {};

/**
 * A time series data object that retrieves data from a url and notifies the
 * parent TimeSeriesPlot when data has been loaded. Extending classes should implement
 * how the data is retrieved, and how to parse it into a format readable by the TimeSeriesPlot
 * implementation being used.
 *
 * @param {object} options
 * @param {string} options.dataUrl    (required) The URL to access the data (or base URL that can be modified in the getDataUrl function)
 * @param {string} options.name       (required) A unique name or ID.  Used as a key to map to the data provided.
 * @param {string} options.label      (required) A label to show on the time series plot.
 * @param {string} options.color      (required) The color to use for the time series line formatted as an HTML color.
 * @param {string} options.plot       (required) The TimeSeriesPlot containing this data source.
 * @param {array}  options.dataLinks  (optional) An array of string pair arrays - first element in a pair is text to use for the link,
 *                                               second element is the URL to retrieve the data
 * @param {Number} options.lineWidth  (optional) The width of the line used for this trace.
 * @requires module:jquery
 *
 * @constructor
 * @memberof ral.timeSeries
 * @abstract
 */
ral.timeSeries.TimeSeriesDataSource = function( options )
{
  /* get the required parameters */
  this.dataUrl    = options.dataUrl;
  this.name       = options.name;
  this.label      = options.label;
  this.plot       = options.plot;
  this.color      = options.color;

  /* set other initial parameters */
  this.isLoaded = false;
  this.data = null;
  this.dataLinks = [];
  this.lineWidth = 1;

  if( "dataLinks" in options ) this.dataLinks = options.dataLinks;
  if( "lineWidth" in options ) this.lineWidth = options.lineWidth;
};

/**
 * Retrieve time series data for the plot
 * @param {Date} start The start time for the series
 * @param {Date} end The end time for the series
 * @param {function} callback The function to call when data is retrieved
 */
ral.timeSeries.TimeSeriesDataSource.prototype.retrieveData = function ( start, end, callback  )
{
  this.isLoaded = false;
  this.data = null;

  jQuery.get( this.getDataUrl( start, end ), null, function( loadedData ) {
      this.dataLoaded( loadedData, callback );
  }.bind(this), "text")
    .fail( function( jq, status, error ) {
      console.log( "ral.timeSeries.TimeSeriesDataSource - load failed: " + status + " - " + error );
      this.isLoaded = true; // we tried...
      callback( null );
    }.bind(this)
  );
};

/**
 * See if the server responded to our request for data
 * @returns {boolean} True if we have a server response (including an error or a null dataset)
 */
ral.timeSeries.TimeSeriesDataSource.prototype.isDataLoaded = function ( )
{
  return this.isLoaded;
};

/**
 * See if data is available, i.e. not null
 * @returns {boolean} True if loaded data is not null
 */
ral.timeSeries.TimeSeriesDataSource.prototype.isDataAvailable = function ( )
{
  return (!(this.data == null));
};

/**
 * Get the data object retrieved and parsed from the server
 * @return {object} data The data currently stored for this object
 */
ral.timeSeries.TimeSeriesDataSource.prototype.getData = function ( )
{
  return this.data;
};

/**
 * Called when the AJAX call returns with data from the data server. This function parses the
 * returned data into a data object and calls the original callback function
 *
 * @param {string} loadedData The data loaded from the URL
 * @param {function} callback The callback function to call to notify of loaded data
 * @protected
 */
ral.timeSeries.TimeSeriesDataSource.prototype.dataLoaded = function ( loadedData, callback )
{
  this.data = this.parseData( loadedData );
  this.isLoaded = true;

  callback();
};

/**
 * Parse data returned from the data server. Child classes should parse the data from the server response into
 * a format that the TimeSeriesPlot implementation can read. If not overridden, simply returns the given data unchanged.
 * @param {string} data The data to parse
 * @return {object} The parsed data
 * @abstract
 */
ral.timeSeries.TimeSeriesDataSource.prototype.parseData = function( data )
{
  return data;
};

/**
 * Get the data URL. Child classes should construct the getData URL string using the supplied start/end times.
 * If not overridden, this function returns the value of the dataUrl attribute.
 * @param {Date} start The start time for the series
 * @param {Date} end The end time for the series
 * @abstract
 * @return {string} The url for the plot data
 */
ral.timeSeries.TimeSeriesDataSource.prototype.getDataUrl = function( start, end )
{
  return this.dataUrl;
};

/**
 * Get the name or unique ID of this data source
 *
 * @return {string} The name or unique ID of this data source
 */
ral.timeSeries.TimeSeriesDataSource.prototype.getName = function()
{
  return this.name;
};
