var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};

/**
 * Base class for Layer. A Layer is an abstracted type that encapsulates a set
 * of data, including retrieval from a server and visualiation in a container
 * such as a popup window or on an OpenLayers map.
 *
 * @memberof ral.gis.layer
 * @constructor
 * @abstract

 *
 * @param {object} options The options to use to configure the Layer
 * @param {array} options.listeners An array of listeners
 */
ral.gis.layer.Layer = function( options )
{
  this.listeners = options.listeners;
  this._isVisible = false;
  this._status = ral.gis.layer.Layer.STATUS_IDLE;
};


/** Constant for idle status @public */
ral.gis.layer.Layer.STATUS_IDLE = "idle";

/** Constant for loading status @public */
ral.gis.layer.Layer.STATUS_LOADING = "loading";

/** Constant for error status @public */
ral.gis.layer.Layer.STATUS_ERROR = "error";


/**
 * See if the Layer is visible on the screen.
 * @public
 *
 * @return {boolean} True if the Layer is visible
 */
ral.gis.layer.Layer.prototype.isVisible = function( )
{
  return this._isVisible;
};

/**
 * Get the current load status for this Layer
 * @public
 *
 * @return {String} The layer's status
 */
ral.gis.layer.Layer.prototype.getStatus = function()
{
  return this._status;
}

/**
 * Set the Layer visible on the screen
 * @public
 *
 * @param {boolean} isVisible If true, the Layer will be displayed
 */
ral.gis.layer.Layer.prototype.setVisible = function( isVisible )
{
  this._isVisible = isVisible;
};


/**
 * Get the opacity of this layer
 * @public
 */
ral.gis.layer.Layer.prototype.getOpacity = function()
{
  return this.opacity;
};


/**
 * Set the opacity on this layer
 * @public
 */
ral.gis.layer.Layer.prototype.setOpacity = function( opacity )
{
  this.opacity = opacity;
};


/**
 * Update the selected time for this Layer.  Allows this class to listen to ral.time.TimeSequenceModel objects.
 * @public
 * @abstract
 *
 * @param {Date} time The new time to set for this layer
 */
ral.gis.layer.Layer.prototype.frameChanged = function( time )
{
  console.log( "ral.gis.layer.Layer.frameChanged() is abstract." );
};


/**
 * Update the selected time range for this Layer. Allows this class to listen to ral.time.TimeSequenceModel objects.
 * @public
 * @abstract
 *
 * @param {ral.time.TimeSequenceModel} timeSequenceModel
 */
ral.gis.layer.Layer.prototype.sequenceChanged = function( timeSequenceModel )
{
  console.log( "ral.gis.layer.Layer.sequenceChanged() is abstract." );
};


/**
 * Add a listener to the Layer.  Listeners may implement the following functions:
 *   layerTextChanged( text:string ): void
 *   layerStatusChanged( status:string ): void
 * @public
 *
 * @param {object} listener An object to receive events from this object
 */
ral.gis.layer.Layer.prototype.addListener = function( listener )
{
  if( typeof( this.listeners ) === "undefined" ) this.listeners = [];

  this.listeners[ this.listeners.length ] = listener;
};


/**
 * Remove a specific listener from the layer.
 * @public
 *
 * @param {object} listener The listener to remove
 */
ral.gis.layer.Layer.prototype.removeListener = function( listener )
{
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( this.listeners[i] == listener )
    {
      this.listeners.splice( i, 1 );
      return;
    }
  }
};


/**
 * Remove all listeners from the layer.
 * @public
 */
ral.gis.layer.Layer.prototype.removeAllListeners = function()
{
  this.listeners = [];
};


/**
 * This function allows this class to listen to LayerControls
 * @public
 *
 * @param {object} layerControls The LayerControls object sending the event
 */
ral.gis.layer.Layer.prototype.layerVisibilityChanged = function( layerControls )
{
  this.setVisible( layerControls.isVisible() );
};


/**
 * This function allows this class to listen to LayerControls
 * @public
 *
 * @param {object} layerControls The LayerControls object sending the event
 */
ral.gis.layer.Layer.prototype.layerOpacityChanged = function( layerControls )
{
  this.setOpacity( layerControls.getOpacity() );
};


/**
 * Notify listeners that the layer status has changed
 * @protected
 *
 * @param {string} status The status to send to the listeners
 */
ral.gis.layer.Layer.prototype.fireLayerStatusChanged = function( status )
{
  this._status = status;

  if( typeof( this.listeners ) === "undefined" ) return;

  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].layerStatusChanged ) !== "undefined" )
    {
      this.listeners[i].layerStatusChanged( status );
    }
  }
};


/**
 * Notify listeners that the layer text has changed
 * @private
 *
 * @param {string} text The text to send to the listeners
 */
ral.gis.layer.Layer.prototype.fireLayerTextChanged = function( text )
{
  if( typeof( this.listeners ) === "undefined" ) return;

  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].layerTextChanged ) !== "undefined" )
    {
      this.listeners[i].layerTextChanged( text );
    }
  }
};


/**
 * Notify listeners that the layer has been clicked
 *
 * @param {object} clickEvent No specifics in the base class.  Can be defined by classes extending layer that fire the event.
 */
ral.gis.layer.Layer.prototype.fireLayerClicked = function( clickEvent )
{
  if( typeof( this.listeners ) === "undefined" ) return;

  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].layerClicked ) !== "undefined" )
    {
      this.listeners[i].layerClicked( clickEvent );
    }
  }
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.ol3 = ral.gis.layer.ol3 || {};



/**
 * Define a new singleton class
 * @constructor
 * @memberof ral.gis.layer.ol3
 * @public
 * @requires module:ol
 */
ral.gis.layer.ol3.MarkerManager = function()
{
  this.points       = [];
  this.vectorSource = new ol.source.Vector( {} );
  this.vectorLayer  = new ol.layer.Vector( { source: this.vectorSource, visible: true } );

  this.types =
  {
    redPin: "data:image/png;base64,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",
    greenPin: "data:image/png;base64,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",
    bluePin: "data:image/png;base64,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",
    yellowPin: "data:image/png;base64,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"
  };

};


/**
* Get the singleton instance
* @public
*
* @returns {ral.gis.layer.ol3.MarkerManager}
*/
ral.gis.layer.ol3.MarkerManager.getSingleton = function()
{
  if( typeof( ral.gis.layer.ol3.MarkerManager.instance ) === "undefined" )
  {
    ral.gis.layer.ol3.MarkerManager.instance = new ral.gis.layer.ol3.MarkerManager();
  }

  return ral.gis.layer.ol3.MarkerManager.instance;
};


/**
 * Set the map to use
 *
 * @param {ol.map.Map} map The ol3
 */
ral.gis.layer.ol3.MarkerManager.prototype.setMap = function( map )
{
  this.map = map;
  this.map.addLayer( this.vectorLayer );

  /* listen for mouse clicks on the layer */
  this.map.on( "click", this.layerClicked, this );
};


/**
 * Called by OL3 when the layer is clicked, this method will notify all capable listeners
 * @private
 *
 * @param {object} event The object provided by OL3
 */
ral.gis.layer.ol3.MarkerManager.prototype.layerClicked = function( event )
{
  // see if it's one of our stations
  var feature = this.map.forEachFeatureAtPixel( event.pixel, this.ownsFeature, this );
  if( typeof( feature ) !== "undefined" )
  {
    if ( typeof feature['featurename'] !== "undefined" )
    {
      this.removePoint(feature['featurename']);
    }
    if ( typeof feature['deleteCallback'] === "function" )
    {
      feature.deleteCallback( feature );
    }
  }
};

/**
 * Determine if this layer owns the specified feature
 * @private
 *
 * @param {ol.Feature} feature The feature to check
 * @param {ol.Layer} layer The layer that owns the feature
 * @return {ol.Feature|undefined} Return the feature if this layer owns the feature, otherwise return undefined
 */
ral.gis.layer.ol3.MarkerManager.prototype.ownsFeature = function( feature, layer )
{
  if( layer === this.vectorLayer )
  {
    return feature;
  }
};


/**
 * Set a point on the map.  Name must be unique.  If point exists with same name it will be removed.
 * @public
 * @static
 *
 * @param {string} name Unique name for the point feature
 * @param {ol.Feature} feature
 */
ral.gis.layer.ol3.MarkerManager.prototype.setPoint = function( name, feature )
{
  this.removePoint( name );
  feature['featurename'] = name;

  /* add the new feature */
  this.vectorSource.addFeature( feature );
  this.points[ name ] = feature;
};

/**
 * Remove a point on the map
 * @param {string} name Unique name for the point feature
 * @public
 */
ral.gis.layer.ol3.MarkerManager.prototype.removePoint = function( name )
{
  /* remove the feature with this name if it exists */
  if( typeof( this.points[ name ] ) !== "undefined" )
  {
    this.vectorSource.removeFeature( this.points[ name ] );
    delete this.points[ name ];
  }
};


/**
 * Convenience method to help create a marker feature more easily
 * @public
 * @static
 *
 * @param {ol.geom.Geometry} position The point marker
 * @param {string} imgSrc The image source location for the icon
 * @param anchorX Anchor point on the image as a fraction of image width
 * @param anchorY Anchor point on the image as a fraction of image height
 * @param opacity The opacity of the marker
 */
ral.gis.layer.ol3.MarkerManager.prototype.createFeature = function( position, imgSrc, anchorX, anchorY, opacity )
{
  var circle = new ol.style.Circle(
    {
      radius: 100,
      stroke: new ol.style.Stroke( { color: "#ffffff", width: 1 } ),
      fill  : new ol.style.Fill( { color: "#ff0000" } )
    }
  );

  var icon = new ol.style.Icon(
    {
      anchor      : [anchorX, anchorY],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      opacity     : opacity,
      src         : imgSrc
    }
  );

  var iconStyle = [ new ol.style.Style(
    {
      image: icon
    }
  ) ];

  var iconFeature = new ol.Feature(
    {
      geometry: new ol.geom.Point( position )
    }
  );

  iconFeature.setStyle( iconStyle );
  return iconFeature;
};


/**
 * Get a predefined pin icon
 *
 * @param position Geolocation
 * @param opacity Opacity of the pin
 * @returns {ol.Feature}
 */
ral.gis.layer.ol3.MarkerManager.prototype.getRedPin = function( position, opacity )
{
  return this.createFeature(
    position,
    this.types.redPin,
    0.1,
    0.9,
    opacity
  );
};


/**
 * Get a predefined pin icon
 *
 * @param position Geolocation
 * @param opacity Opacity of the pin
 * @returns {ol.Feature}
 */
ral.gis.layer.ol3.MarkerManager.prototype.getBluePin = function( position, opacity )
{
  return this.createFeature(
    position,
    this.types.bluePin,
    0.1,
    0.9,
    opacity
  );
};


/**
 * Get a predefined pin icon
 *
 * @param position Geolocation
 * @param opacity Opacity of the pin
 * @returns {ol.Feature}
 */
ral.gis.layer.ol3.MarkerManager.prototype.getGreenPin = function( position, opacity )
{
  return this.createFeature(
    position,
    this.types.greenPin,
    0.1,
    0.9,
    opacity
  );
};


/**
 * Get a predefined pin icon
 *
 * @param position Geolocation
 * @param opacity Opacity of the pin
 * @returns {ol.Feature}
 */
ral.gis.layer.ol3.MarkerManager.prototype.getYellowPin = function( position, opacity )
{
  return this.createFeature(
    position,
    this.types.yellowPin,
    0.1,
    0.9,
    opacity
  );
};


/**
 * Get a predefined pin icon
 *
 * @param {String} type The name of the pin to get
 * @param position Geolocation
 * @param opacity Opacity of the pin
 * @returns {ol.Feature}
 */
ral.gis.layer.ol3.MarkerManager.prototype.getPin = function( type, position, opacity )
{
  if ( type in this.types )
  {
    return this.createFeature(
        position,
        this.types[type],
        0.1,
        0.9,
        opacity
    )
  }

  console.warn( "Unknown marker type: " + type );
  return null;
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.ol3 = ral.gis.layer.ol3 || {};

/**
 * This class works for static data, but you can override the
 * getDataUrl function to build a URL to the data based on things like zoom, extent, selected time, etc...
 * @constructor
 * @extends ral.gis.layer.Layer
 * @memberof ral.gis.layer.ol3
 * @requires module:ol
 *
 * @param {object} options The options used to configure the OL3GeoJSONLayer
 * @param {string} options.dataUrl (required) The URL to the data
 * @param {function|ol.style.Style|Array<ol.style.Style>} options.style (required) The style used to render the data
 * @param {ol.proj.ProjectionLike} options.dataProjection (optional) The projection of the GeoJSON data
 * @param {ol.proj.ProjectionLike} options.mapProjection (optional) The projection of the OpenLayers map
 * @param {boolean} options.isTopoJSON (optional) If true, will expect data in TopoJSON format
 * @param {boolean} options.refreshOnMapViewChanged (optional) If true, will reload data when the map is zoomed or panned
 */
ral.gis.layer.ol3.OL3GeoJSONLayer = function( options )
{
  ral.gis.layer.Layer.call( this, options );

  /* set the required parameters */
  this.dataUrl  = options.dataUrl;
  this.style    = options.style;
  this.dataProj = options.dataProjection;
  this.mapProj  = options.mapProjection;

  /* set the default values for the optional parameters */
  this.isTopoJSON = false;
  this.refreshOnMapViewChanged = false;

  /* set the values for the optional parameters if provided */
  if( typeof( options.isTopoJSON ) !== "undefined" ) this.isTopoJSON = options.isTopoJSON;
  if( typeof( options.refreshOnMapViewChanged ) !== "undefined" ) this.refreshOnMapViewChanged = options.refreshOnMapViewChanged;

  /* initialize the layer */
  this.init();
};


/**
 * Inherit from the Layer class
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype = Object.create( ral.gis.layer.Layer.prototype );


/**
 * Initialize the layer and source
 * @private
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.init = function()
{
  this.id     = new Date().getTime()+"";
  if( this.isTopoJSON ) {
    this.format = new ol.format.TopoJSON();
  } else {
    this.format = new ol.format.GeoJSON();
  }
  this.source = new ol.source.Vector( { format: this.format, overlaps: false } );
  this.layer  = new ol.layer.Vector( { source: this.source, style: this.style, id: this.id } );
};


/**
 * Set the data url - does NOT trigger a refresh
 * @public
 *
 * @param {string} The data URL
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.setDataUrl = function( dataUrl )
{
  this.dataUrl = dataUrl;
};


/**
 * Set the layer visibility and update the layer on the OL3 map.  This should only be
 * called by a LayerControls object.  That way the LayerControls view and the visibility
 * state can be kept in sync.
 * @protected
 *
 * @param {boolean} visible True for visible, false for hidden
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.setVisible = function( visible )
{
  ral.gis.layer.Layer.prototype.setVisible.call( this, visible );

  this.layer.setVisible( visible );

  // One-time load of TopoJSON data when initially made visible. This is most efficient, assuming the data don't change.
  if( this.isVisible() && this.isTopoJSON ) {
    var features = this.source.getFeatures()
    if( typeof features == 'undefined' || typeof features.length == 'undefined' || features.length == 0 ) {
      this.refreshData();
    }
  }
};


/**
 * Set the layer visibility and update the layer on the OL3 map
 * @public
 *
 * @param {number} opacity Number between 0 (transparent) and 1 (opaque)
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.setOpacity = function( opacity )
{
  ral.gis.layer.Layer.prototype.setOpacity.call( this, opacity );

  this.layer.setOpacity( opacity );
};


/**
 * This function can be overridden to manipulate the URL just before
 * loading.  For example, this method could substitute a time into the URL.
 *
 * @returns {string} The data url
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.getDataUrl = function()
{
  return this.dataUrl;
};


/**
 * Refresh this data layer - reload data and redraw on map
 * @public
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.refreshData = function()
{
  this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_LOADING );

  var url = this.getDataUrl();

  if( url === null ) return;

  // Add a time parameter to the query, if set
  if( typeof this.selectedTime !== 'undefined' ) {
    var delimiter = ( url.indexOf("?") > -1 ) ? "&" : "?";
    url += delimiter + "time=" + this.selectedTime.toISOString();
  }

  // NOTE: Chrome is not adding these encodings to the request headers, but attempting to set them explicitly (below)
  //       produces an error and is ignored. Follow up with JS-Dev group to see if anyone has a workaround...
  //jQuery.ajaxSetup({
  //  headers: { "Accept-Encoding" : "gzip,deflate" } });
  jQuery.get( url, null, this.dataLoadingSuccess.bind( this ), "json" )
    .fail( this.dataLoadingFailed.bind( this ) );
};


/**
 * Call back function for when the data URL has been loaded
 * @private
 *
 * @param {string} data Result from loading the URL
 * @param {string} statusText Loading status
 * @param {object} jqXHR Unused - provided by jQuery.get
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.dataLoadingSuccess = function( data, statusText, jqXHR ) {
  var reader = this.format;
  var features = reader.readFeatures( data, { dataProjection: this.dataProj, featureProjection: this.mapProj } );
  this.source.clear( true );

  // make sure features can be geolocated
  for ( var i = 0; i < features.length; i++ )
  {
    var feature = features[ i ];
    var coord = feature.get( 'geometry' ).getFirstCoordinate();

    var coordOk = true;
    for ( var j = 0; j < coord.length; j++ )
    {
      if ( isNaN( coord[ j ] ) )
      {
        coordOk = false;
        break;
      }
    }

    if ( coordOk )
    {
      this.source.addFeature( feature );
    }

  }

  this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_IDLE );
  this.fireLayerTextChanged( statusText );
};


/**
 * Call back function for when loading the data URL fails
 * @private
 *
 * @param {object} jqXHR Unused - provided by jQuery.get
 * @param {string} statusText Loading status
 * @param {object} errorThrown The error
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.dataLoadingFailed = function( jqXHR, statusText, errorThrown )
{
  this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_ERROR );
  this.fireLayerTextChanged( statusText );
};


/**
 * Add this layer to an OL3 map
 * @public
 *
 * @param {ol.Map} map All this layer to the given map
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.addToMap = function( map )
{
  this.map = map;
  map.addLayer( this.layer );

  this.map.on( "moveend", this.mapViewChanged, this );
};


/**
 * Maybe refresh layer on "view changed" events
 * @private
 *
 * @param {object} event Unused - provided by OL3 "moveend" event
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.mapViewChanged = function( event )
{
  if( this.refreshOnMapViewChanged )
  {
    this.refreshData();
  }
};

/**
 * Update the selected time for this Layer.  Allows this class to listen to TimeSelector objects.
 * @public
 *
 * @param {Date} time The new time to set for this layer
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.frameChanged = function( time )
{
  /* save the currently selected time */
  this.selectedTime = time;

  /* trigger a reload */
  this.refreshData();
};


/**
 * Refresh the data layer
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.refreshLayer = function()
{
  this.refreshData();
};


/**
 * Update the selected time range for this Layer. Allows this class to listen to TimeSelector objects.
 * @public
 *
 * @param {ral.time.TimeSequenceModel} timeSequenceModel The new TimeSequenceModel
 */
ral.gis.layer.ol3.OL3GeoJSONLayer.prototype.sequenceChanged = function( timeSequenceModel )
{
  if( this.selectedTime === "undefined" ) return;

  if( this.selectedTime < timeSequenceModel.getFirstFrame() )
  {
    this.frameChanged( timeSequenceModel.getFirstFrame() );
  }
  else if( this.selectedTime > timeSequenceModel.getLastFrame() )
  {
    this.frameChanged( timeSequenceModel.getLastFrame() );
  }
};

var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.ol3 = ral.gis.layer.ol3 || {};

/**
 * Create a new OpenLayers3 WMS layer
 * @constructor
 * @memberof ral.gis.layer.ol3
 * @extends ral.gis.layer.Layer
 *
 * @param {object} options The options used to configure the OL3WMSLayer
 * @param {string} options.baseUrl (required) The URL to the data on the WMS server
 * @param {string} options.layerName (required) The name of the layer provided by the WMS server
 * @param {string} options.styleName (optional) The name of the style to use for rendering the layer
 * @param {string} options.colorScaleRange (optional) The color scale range "min,max", passed to WMS server
 * @param {string} options.palette (optional) The color palette to use, passed to WMS server.  WMS server chooses default if not provided.
 * @param {string} options.abovemaxcolor (optional) either "extend" the color scale, or "transparent".  Defaults to transparent.
 * @param {string} options.belowmincolor (optional) either "extend" the color scale, or "transparent".  Defaults to transparent.
 * @param {ol.Transform} options.dataTransform (optional) The transform to use to convert map index to data coordinates
 * @param {ol.Transform} options.mapTransform (optional) The transform to use to convert data coordinates to map indices
 * @param {boolean} options.cors (optional) set to true if the tile source should request data as anonymous (Access-Control-Allow-Origin must be set in the server's response header) defaults to false
 */
ral.gis.layer.ol3.OL3WMSLayer = function( options )
{
  ral.gis.layer.Layer.call( this, options );

  /* set the required parameters */
  this.baseUrl   = options.baseUrl;
  this.layerName = options.layerName;

  /* set the default values for optional parameters */
  this.abovemaxcolor = "transparent";
  this.belowmincolor = "transparent";
  this.cors          = false;
  this.styleName     = null;
  this.dataTransform  = ol.proj.getTransform("EPSG:3857", "EPSG:4326");
  this.mapTransform  = ol.proj.getTransform("EPSG:4326", "EPSG:3857");

  /* get the optional parameters */
  this.colorScaleRange = options.colorScaleRange;
  this.palette         = options.palette;
  if( "abovemaxcolor" in options ) this.abovemaxcolor = options.abovemaxcolor;
  if( "belowmincolor" in options ) this.belowmincolor = options.belowmincolor;
  if( "cors" in options ) this.cors = options.cors;
  if( "styleName" in options ) this.styleName = options.styleName;
  if( "dataTransform" in options ) this.dataTransform = options.dataTransform;
  if( "mapTransform" in options ) this.mapTransform = options.mapTransform;

  /* initialize the layer */
  this.init();
};


/**
 * Inherit from the Layer class
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype = Object.create( ral.gis.layer.Layer.prototype );


/**
 * Create the OL3 layer and source
 * @private
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.init = function()
{
  /* define the source params */
  this.sourceParams = {
    LAYERS: this.layerName,
    TILED : true,
    ABOVEMAXCOLOR: this.abovemaxcolor,
    BELOWMINCOLOR: this.belowmincolor
  };

  /* set the optional parameters */
  if( typeof( this.colorScaleRange ) !== "undefined" ) this.sourceParams.COLORSCALERANGE = this.colorScaleRange;
  if( this.styleName !== null) {
    this.sourceParams.STYLES = this.styleName;
  }
  else if( typeof( this.palette ) !== "undefined" ) {
    this.sourceParams.STYLES = "boxfill/"+this.palette;
  } else {
    this.sourceParams.STYLES = "default";
  }

  /* create the source */
  var sourceParams =     {
    url   : this.baseUrl,
    params: this.sourceParams
  };
  if( this.cors === true )
  {
    sourceParams.crossOrigin = "anonymous";
  }
  this.source = new ol.source.TileWMS( sourceParams );

  /* configure this to listen to the loading state on the source */
  this.configureLoadingStateListener();

  /* create the layer */
  this.layer  = new ol.layer.Tile( { source: this.source } );
};


/**
 * Configure this to listen for state changes on the source
 * @private
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.configureLoadingStateListener = function()
{
  /* set the tile loading function, which allows us to listener for loading, idle, and error states */
  /* hopfully OL3 changes how this is done in the future since this method is pretty ugly: */
  /* https://groups.google.com/forum/#!msg/ol3-dev/ScE0A8L6-oc/_107oB8fRu0J */
  this.source.setTileLoadFunction(
    (function() {
      var numLoadingTiles = 0;
      var tileLoadFn = this.source.getTileLoadFunction();
      return function( tile, src ) {
        if (numLoadingTiles === 0) {
            this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_LOADING );
        }
        ++numLoadingTiles;
        var image = tile.getImage();
        image.onload = function() {
          --numLoadingTiles;
          if (numLoadingTiles === 0) {
            this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_IDLE );
          }
        }.bind( this );
        image.onerror = function() {
          --numLoadingTiles;
          if (numLoadingTiles === 0) {
            this.fireLayerStatusChanged( ral.gis.layer.Layer.STATUS_ERROR );
          }
        }.bind( this );
        tileLoadFn(tile, src);
      }.bind( this );
    }.bind( this ))());
};


/**
 * Add this layer to an OL3 map
 * @public
 *
 * @param {ol.Map} map All this layer to the given map
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.addToMap = function( map )
{
  /* save a reference to the map */
  this.map = map;

  /* add this layer to the map */
  map.addLayer( this.layer );

  /* listen for mouse clicks on the layer */
  this.map.on( "click", this.layerClicked, this );
};


/**
 * Called by OL3 when the layer is clicked, this method will notify all capable listeners
 * @private
 *
 * @param {object} event The object provided by OL3
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.layerClicked = function( event )
{
  /* ignore the click if this layer is not visible */
  if( ! this.isVisible() ) return;

  /* transform the click coordinate to lat/lon */
  var lonlat  = this.dataTransform( event.coordinate );

  /* create an event for listeners of this layer */
  var myEvent = {
    variable : this.layerName,
    latitude : lonlat[1],
    longitude: lonlat[0],
    getFeatureInfo: this.getFeatureInfo.bind( this )
  };

  /* notify all layer listeners of the mouse click event */
  this.fireLayerClicked( myEvent );
};

/**
 * Get the feature information from the server for the specified location
 * @param latitude
 * @param longitude
 * @param callback
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.getFeatureInfo = function( latitude, longitude, callback )
{
  var view = this.map.getView();
  var viewResolution = view.getResolution();

  var coordinate = this.mapTransform( [ longitude, latitude ]);
  var url = this.source.getGetFeatureInfoUrl(
      coordinate, viewResolution, view.getProjection(),
      {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});

  if (url)
  {
    jQuery.getJSON( url ).success( function( data ) { callback( data );}.bind( this ) )
        .fail ( function() { callback ( null ) }.bind( this ) );
  }

};


/**
 * Set the layer visibility and update the layer on the OL3 map.  This should only be
 * called by a LayerControls object.  That way the LayerControls view and the visibility
 * state can be kept in sync.
 * @protected
 *
 * @param {boolean} visible True for visible, false for hidden
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.setVisible = function( visible )
{
  ral.gis.layer.Layer.prototype.setVisible.call( this, visible );

  this.layer.setVisible( visible );
};


/**
 * Set the layer visibility and update the layer on the OL3 map
 *
 * @param {number} opacity Number between 0 (transparent) and 1 (opaque)
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.setOpacity = function( opacity )
{
  ral.gis.layer.Layer.prototype.setOpacity.call( this, opacity );

  this.layer.setOpacity( opacity );
};


/**
 * Set the WMS URL
 * @public
 *
 * @param {string} url The WMS URL
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.setUrl = function( url )
{
  this.source.setUrl( url );
};


/**
 * Get the parameters from the TileWMS source object
 * @public
 *
 * @returns {object} ol.source.TileWMS.getParams()
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.getSourceParams = function()
{
  return this.source.getParams();
};


/**
 * Update the parameters in the TileWMS source object
 * @public
 *
 * @param {object} params Passed to ol.source.TileWMS.updateParams(...)
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.updateSourceParams = function( params )
{
  this.source.updateParams( params );
};


/**
 * Update the selected time for this Layer.  Allows this class to listen to TimeSelector objects.
 * @public
 *
 * @param {Date} time The new time to set for this layer
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.frameChanged = function( time )
{
  /* save the currently selected time */
  this.selectedTime = time;

  /* get the source parameters */
  var params = this.getSourceParams();

  /* set the time on the source parameters */
  params.time = time.toISOString();

  /* update the source parameters -- this triggers a reload in OL3 */
  this.updateSourceParams( params );
};


/**
 * Refresh the data layer
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.refreshLayer = function()
{
  this.updateSourceParams( this.getSourceParams() );
};


/**
 * Update the selected time range for this Layer. Allows this class to listen to TimeSelector objects.
 * @public
 *
 * @param {ral.time.TimeSequenceModel} timeSequenceModel The new TimeSequenceModel
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.sequenceChanged = function( timeSequenceModel )
{
  if( this.selectedTime === "undefined" ) return;

  if( this.selectedTime < timeSequenceModel.getFirstFrame() )
  {
    this.frameChanged( timeSequenceModel.getFirstFrame() );
  }
  else if( this.selectedTime > timeSequenceModel.getLastFrame() )
  {
    this.frameChanged( timeSequenceModel.getLastFrame() );
  }
};

/**
 * Changes the color bar settings.
 * @public
 *
 * @param {string} paletteName The paletteName without extension (i.e. precip)
 * @param {number} min The min color scale value.
 * @param {number} max The max color scale value.
 */
ral.gis.layer.ol3.OL3WMSLayer.prototype.changeColorBar = function(paletteName, min, max)
{
  /*console.log("paletteName: " + paletteName);
  console.log("min: " + min);
  console.log("max: " + max);*/

  /* get the source parameters */
  var params = this.getSourceParams();
  var dirty = false;

  //console.log(params);
  if( typeof( min ) !== "undefined" || typeof( max ) !== "undefined") {
    params.colorscalerange = min + "," + max;
    dirty = true;
  }
  if( typeof( paletteName ) !== "undefined" ) {
    params.STYLES = 'boxfill/' + paletteName;
    dirty = true;
  }

  /* update the source parameters -- this triggers a reload in OL3 */
  if( dirty ) {
    this.updateSourceParams( params );
  }
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.control = ral.gis.layer.control || {};

/**
 * The parent class of all LayerControls. This class is abstract and de-coupled from the view.  Implemenenting
 * classes should know how to initialize and update their view components.  Default attributes handled by this
 * class are: visibility, opacity, text information, status information, and color legends.  updateView will be
 * called if any of these properties change, but can be ignored if the implementing class does not show them on
 * the view.
 * @constructor
 * @abstract
 * @memberof ral.gis.layer.control
 *
 * @param {object} options The options to use to configure the LayerControls
 * @param {Layer} options.layer (required) The Layer being controlled by this object
 * @param {string} options.target (optional) The target where the controls will be added (can be set later)
 * @param {string} options.displayName (optional) The name of the product as it appears in the menu
 * @param {string} options.legendUrl (optional) The URL to the legend image
 * @param {string} options.visible (optional) True or false, defaults to false
 * @param {number} options.opacity (optional) Number from 0 (transparent) to 1 (opaque), defaults to 0.8
 * @param {string} options.status (optional) Can be one of: idle, loading, or error - this can be redefined by each view implementation
 * @param {string} options.listeners (optional) Array of objects listening to this object
 */
ral.gis.layer.control.LayerControls = function( options )
{
  /* get required parameters */
  this.layer  = options.layer;

  /* set defaults for optional parameters */
  this.visible           = false;
  this.opacity           = 0.8;
  this.status            = "idle";
  this.listeners         = [];

  /* get the optional parameters if they are available */
  if( typeof( options.target ) !== "undefined" ) this.target = options.target;
  if( typeof( options.displayName ) !== "undefined" ) this.displayName = options.displayName;
  if( typeof( options.legendUrl ) !== "undefined" ) this.legendUrl = options.legendUrl;
  if( typeof( options.visible ) !== "undefined" ) this.visible = options.visible;
  if( typeof( options.opacity ) !== "undefined" ) this.opacity = options.opacity;
  if( typeof( options.listeners ) !== "undefined" ) this.listeners = options.listeners;

  /* make sure the layer's visibility is consistent with the controls */
  this.layer.setVisible( this.visible );

  /* add the layer as a listener to these controls */
  this.addListener( this.layer );

  /* add self as a listener to the data layer */
  this.layer.addListener( this );

  /* set initial values on the layer */
  this.layer.setVisible( this.visible );
  this.layer.setOpacity( this.opacity );

  /* initialize the view ony if a target was supplied with the options */
  if ( typeof( options.target ) !== "undefined" )
  {
    this.initView();
  }
};


/**
 * Initialize the view
 * @private
 * @abstract
 *
 * Initialize the view components in the target div.
 */
ral.gis.layer.control.LayerControls.prototype.initView = function()
{
  log.console( "LayerControls.initView is abstract" );
};


/**
 * Update the view to match the values in the member variables.  Hints can be set to
 * specify which part of the view needs to be updated.  This can save time updating
 * larger view implementations.  Possible values of 'hints' is implementation specific
 * or can be ignored altogether.
 * @protected
 *
 * @param {string} hints Specify which part of the view needs to be updated
 */
ral.gis.layer.control.LayerControls.prototype.updateView = function( hints )
{
  log.console( "ral.gis.layer.control.LayerControls.updateView is abstract")
};


/**
 * Set the visibility, update the view, and fire an event.
 * @public
 *
 * @param {boolean} visible True or false
 */
ral.gis.layer.control.LayerControls.prototype.setVisible = function( visible )
{
  this.visible = visible;
  this.updateView( "visibility" );
  this.fireVisibilityChangedEvent();
};


/**
 * Get the layer's visible status
 * @public
 *
 * @returns {boolean} True if visible, otherwise false
 */
ral.gis.layer.control.LayerControls.prototype.isVisible = function()
{
  return this.visible;
};


/**
 * Send an event to listeners that the visibility changed
 * @private
 */
ral.gis.layer.control.LayerControls.prototype.fireVisibilityChangedEvent = function()
{
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].layerVisibilityChanged ) === "function" )
    {
      this.listeners[i].layerVisibilityChanged( this );
    }
  }
};


/**
 * Set the opacity, update the view, and fire an event.
 * @public
 *
 * @param {number} opacity Number between 0 (transparent) and 1 (opaque)
 */
ral.gis.layer.control.LayerControls.prototype.setOpacity = function( opacity )
{
  this.opacity = opacity;
  this.updateView( "opacity" );
  this.fireOpacityChangedEvent();
};


/**
 * Get the current opacity value
 * @public
 *
 * @returns {number} Opacity value between 0 (transparent) and 1 (opaque)
 */
ral.gis.layer.control.LayerControls.prototype.getOpacity = function()
{
  return this.opacity;
};


/**
 * Get the layer controlled by this Controller
 * @public
 *
 * @returns {ral.gis.layer.Layer} The controller's Layer
 */
ral.gis.layer.control.LayerControls.prototype.getLayer = function()
{
  return this.layer;
};


/**
 * Get the controller's display name
 * @public
 *
 * @returns {string} The display name, if configured
 */
ral.gis.layer.control.LayerControls.prototype.getDisplayName = function()
{
  return this.displayName;
};


/**
 * The opacity changed, notify all of the listeners
 * @private
 */
ral.gis.layer.control.LayerControls.prototype.fireOpacityChangedEvent = function()
{
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].layerOpacityChanged ) === "function" )
    {
      this.listeners[i].layerOpacityChanged( this );
    }
  }
};


/**
 * Set the status and update the view.
 * @public
 *
 * @param {string} status One of the following: idle, loading, or error.
 */
ral.gis.layer.control.LayerControls.prototype.setStatus = function( status )
{
  this.status = status;
  this.updateView( "status" );
};


/**
 * Add a listener to the LayerControls.  Listeners may implement the following functions:
 *   layerVisibilityChanged( layerControls:LayerControls ): void
 *   layerOpacityChanged( layerControls:LayerControls ): void
 * @public
 *
 * @param {object} listener An object to receive events from this object
 */
ral.gis.layer.control.LayerControls.prototype.addListener = function( listener )
{
  this.listeners[ this.listeners.length ] = listener;
};


/**
 * Remove a specific listener from the LayerControls.
 * @public
 *
 * @param {object} listener The listener to remove
 */
ral.gis.layer.control.LayerControls.prototype.removeListener = function( listener )
{
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( this.listeners[i] == listener )
    {
      this.listeners.splice( i, 1 );
      return;
    }
  }
};


/**
 * Remove all listeners from the LayerControls.
 * @public
 */
ral.gis.layer.control.LayerControls.prototype.removeAllListeners = function()
{
  this.listeners = [];
};

/**
 * Set the DOM target of this LayerControls object
 * @public
 * @param {string} target The DOM target where the controls will be added
 */
ral.gis.layer.control.LayerControls.prototype.setTarget = function( target )
{
  this.target = target;
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.control = ral.gis.layer.control || {};

/**
 * This is the default implementation of LayerControls.  It always shows a visibility
 * check box, a display name, and status icon.  It optionally shows text information,
 * an opacity slider, and a color legend.
 * @constructor
 * @extends ral.gis.layer.control.LayerControls
 * @memberof ral.gis.layer.control
 * @requires module:jquery
 *
 * @param {object} options See LayerControls constructor for details
 * @param {string} options.loadingIconUrl (optional) The icon url for the loading status
 * @param {string} options.errorIconUrl (optional) The icon url for the error status
 * @param {string} options.idleIconUrl (optional) The icon url for the idle status
 * @param {boolean} options.showOpacitySlider (optional) True to show the slider on the view or false to hide, defaults to false
 * @param {boolean} options.showTextualInfo (optional) True to show the textual info on the view or false to hide, defaults to false
 * @param {boolean} options.showColorLegend (optional) True to show the color legend on the view or false to hide, defaults to false
 */
ral.gis.layer.control.DefaultLayerControls = function( options )
{
  /* set default values for optional parameters */
  this.loadingIconUrl    = ral.gis.layer.control.DefaultLayerControls.loadingIconUrl;
  this.errorIconUrl      = ral.gis.layer.control.DefaultLayerControls.errorIconUrl;
  this.idleIconUrl       = ral.gis.layer.control.DefaultLayerControls.idleIconUrl;
  this.showOpacitySlider = false;
  this.showTextualInfo   = false;
  this.showColorLegend   = false;
  this.allowConfigColors = false;
  this.paletteOptions    = [];
  this.palette           = options.palette;
  this.minValue          = options.minValue;
  this.maxValue          = options.maxValue;
  this.legendUrlTemplate = options.legendUrlTemplate;
  this.units             = options.units;

  /* set values of optional parameters if provided */
  if( typeof( options.loadingIconUrl ) !== "undefined" ) this.loadingIconUrl = options.loadingIconUrl;
  if( typeof( options.errorIconUrl ) !== "undefined" ) this.errorIconUrl = options.errorIconUrl;
  if( typeof( options.idleIconUrl ) !== "undefined" ) this.idleIconUrl = options.idleIconUrl;
  if( typeof( options.showOpacitySlider ) !== "undefined" ) this.showOpacitySlider = options.showOpacitySlider;
  if( typeof( options.showTextualInfo ) !== "undefined" ) this.showTextualInfo = options.showTextualInfo;
  if( typeof( options.showColorLegend ) !== "undefined" ) this.showColorLegend = options.showColorLegend;
  if( typeof( options.allowConfigColors ) !== "undefined" ) this.allowConfigColors = options.allowConfigColors;
  if( typeof( options.paletteOptions ) !== "undefined" ) this.paletteOptions = options.paletteOptions;

  /* call the super constructor */
  ral.gis.layer.control.LayerControls.call( this, options );

  if ( typeof( this.layer.changeColorBar ) === "function" )
  {
    /* change the color bar on the layer */
    this.layer.changeColorBar( this.palette, this.minValue, this.maxValue );
  }
};


/**
 * Inherit from the LayerControls class
 */
ral.gis.layer.control.DefaultLayerControls.prototype = Object.create( ral.gis.layer.control.LayerControls.prototype );


/**
 * The default loading icon
 */
ral.gis.layer.control.DefaultLayerControls.loadingIconUrl = "data:image/gif;base64,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";


/**
 * The default error icon
 */
ral.gis.layer.control.DefaultLayerControls.errorIconUrl   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAOI2NVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXgSteGGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAB41JREFUSA11VluPldUZftZ32Htmz8jMQFsHxhQE8cakjVYaTavxQhOvTPwTeqHxHzS9MDEeYmJrwoUt1sQGUhOTknhVbJHWMoiDJQWFCiXFGIRh2LNn728fvsNaq8/7fmtvBoIre+31rtN7eN7D+ox3zmPcjIH3HoZzT9qQlqb/nHMThqMrK3T++jE4wcKTT8LEcX0vnJHzck7HwEMZhX2hE7l8SwtzXQ2XdT8IFXrt0EEUp1cw/PI8hhcvYumFF8KRWlERKm3MQyfjv7AXiRXaxxt3GJWBc7rTP3sG7vJFbHl4H+affRbZoUPIvjyrFoJnKHSzjTW321c4j0RH1ZOTyTihx/cIMeF0eY7s039g6t4fww96SGOH1iM/x+qBd2s38MzmNuY94SuyghKRWFMDwzEsjueiitJhvXfiBIyltlMz9U5ZYHb3Tlii0P74iMr01iqY41gRnmN+m+mbFos2AX/VUBTinMEHE0Uob7SRnzmN5tIifFUSgUjXY28xu+8hrL3zO1S9niDj5Y7Ezi0WB/5j3pGq+T1/CktQpkuIkx9shXEWbtBHNRrC9jO49Tamti0gzjaw9uGHNaeA0Pew1WVzezpNAm2TtcNLl9AllNM7dyAf5MCuXWgsbEMiaFz8GsXKMvLuAJ2TX2Dn++9jamlpgpRG0NhMMSIodRPqYJnArZCLbwixwJYtH0dzxyLQ68L+6G7MP/gw5nbdi5nde9B87Ak9l04laM63cP2992oxQYh4WBc28ReTIwl/6aSJrAaCV728po/vnz7to7Ly0XQDPq8Q9zNvpOioH/i/vuZ9PoApGGh79/jRB39Ej3cm8aGhcyt/+t9LHlOluuthDW7ei2LYwcBkp1ZMsrjVuF5G3Xk02zBlUZBUE4zPMoPhgBZYRLBm6r7dZnX/fsPoHlc0kaoy9EqQFQms0iUKpel/8EPv+DKS6ZRpRuvzkruMZkauHY30rPy5jQ0kdkQh9Hc+wszSdu+OHMaNI3V6SVGRpjLGI2VFmlsiKAgbp09x7RqK82fRmJuD6w65T8G2QsRItv2+MlOG62uIZY+ejFDAVEMz+7MH0Xn7t6g6HbVaK1q4obWCsjSd1MFyVYQHy3vHPkEyexd8UVEgLaQ1viScxRAu6wU2HLptolSi4XJEjojYkW8szCI6/xes/umDyTnhXYdFvaRRLWTAX8fBhQsov/kfBbfg+9S6yDV4wEoVFSPC266LQ8n19WtyG6akUOY4tTRx3sfsT36J3luvYXj5skZ9qOMiSpuWTKFEG00f69A7+jemxqzWYzCSMSoACgeZR4xetK9DPcfaLbTAjKpAYko0XeEjIiTpNT24hOsHDqggSGqK1QFRtVitDUHQW/kc/up3iGOmz4BpQqugnQqwVPqSkLdvQGwDI9d31hh8pAm1sQViRwXAWBhlmHlgH/KXX8bGyZM1olJwajWCj2WBL4vNMmSsUBEDyvZZd2mlV0vFYgpkvsbEqHntG/gvPoM78QnRGFAolaIbvC3hbGVijqmnW6heazff79+8Rb0YeJShfqbVDDI2EUwobnz0EYbHjqFxzw6kJXOTacRNWkJLaV1c0RJPBLprqAhbOuwiTmgDHwxRMKJwKuvtiHnOedHLUboUnWNfYcvhw/jhM88oH1GAvGuhxdWrGBw9inRhnlHbpXUUIH1IS+ljM2Q0E3K7sY7sF0/DvPJ7pL/aD2xjXe5vMLAcYpsjdSMy5XnSjYjQ04DWHqDzxuso2swAsZpn+bbVqK/T2lgKA30o8DmmjxYKjqbo03IqYfkqMVcbjz2FLa0ZpPfsRPTQ48Dqf3nPMb4K9kp9TS0VesM7zcW9SD79J1YPHgwerms1BufOofw783aOD7z6lkJprRXhkreSyyMKJnym20N07owycN0NVP8+xS+3Oc1zqW6WkS/+VLqgcEk1GtL66XYMf/0S+l9fULcm4rsO31F9GQinkcg1TBb60BISvr58/irtsh4JVH94E9nKcfgrl2H/s4y0xXe6zyCTylYWxvMrtBpVcJKiLkbJ2EBrC5ptj+vvHsDMq69SmStX/LfPPU/YlpCw3vLLqv4EkvocuqFgzy8NQ/hi0qpc+ztqzo/U5gytCwpLnpeFtxWDy9YudLRIUs/ECSw/GtqDadx36l9I0q1bEd+/F4PDf0a8fRERtY6ZmKKAN6yotNqLMpIyogj3xX+GJzTFRqxseY9RzW0ajYzjxJM1LSrIGis+mi++iJTpquk0Wl9Hd3kZBQtGzqfWEX4rnRaUFCRzT1qeYSufPqxu0sQ9wjTmExoxHSPmuGk2fWwikyRcS1OiyJG9wf3GTAtzjzyKqfl5yQJyY2SLRgV9UjAyC/pExkoEk67YPbv4vFKlaDWbVizejclYO5nHzYanIkYEJhTcbDTQSPh1wjHm2fpVEt9LKeFPupACrQaVCBBhIpjrgoAEogSMdFFUmlosDNkpXRVIZE5hKbtYG1MhqdVamuUcu37saeEmM92o+d38D0KIjConGzXQIlJaeFuVpvUJP2/5lXEnXhNlRRYPBYd5RU7vb/q7E4NN27eTm3lzr56Shyojh1Vdzv8PUC/BQv8/nAYAAAAASUVORK5CYII=";


/**
 * The default idle icon (tranparent)
 */
ral.gis.layer.control.DefaultLayerControls.idleIconUrl = "data:image/gif;base64,R0lGODlhHgAeAIAAAP///////yH+DEdvbGRlblR1cnRsZQAh+QQBCgABACwAAAAAHgAeAAACHIyPqcvtD6OctNqLs968+w+G4kiW5omm6sq2awEAOw==";


/**
 * Initialize the default layer controls
 */
ral.gis.layer.control.DefaultLayerControls.prototype.initView = function()
{
  /* set the CSS class on the target div */
  jQuery( "#" + this.target )
    .addClass( "DefaultLayerControls" );

  /* add a check box to the target div */
  jQuery( "<input/>" )
    .attr( "id", this.target + "_checkBox" )
    .attr( "type", "checkbox" )
    .attr( "checked", this.visible )
    .click( this.checkBoxClicked.bind( this ) )
    .appendTo( "#" + this.target );

  /* add a display name to the target div if we have one */
  if( typeof( this.displayName ) !== "undefined" )
  {
    jQuery( "<text/>" )
      .addClass( "DefaultLayerControls_displayName" )
      .attr( "id", this.target + "_displayName" )
      .text( this.displayName )
      .click( this.checkBoxClicked.bind( this ) )
      .appendTo( "#" + this.target );
  }

  /* add the status icon -- can be used for loading, error, idle, etc. */
  jQuery( "<img/>" )
    .attr( "id", this.target + "_statusIcon" )
    .attr( "src", ral.gis.layer.control.DefaultLayerControls.idleIconUrl )
    .css( "float", "right" )
    .appendTo( "#" + this.target );

  /* create a body that can be folded up */
  var body = jQuery( "<div>" )
    .attr( "id", this.target + "_body" )
    .appendTo( "#" + this.target );

  /* add textual info if the options is set */
  if( this.showTextualInfo )
  {
    jQuery( "<div>" )
      .addClass( "DefaultLayerControls_textualInfo" )
      .attr( "id", this.target + "_textualInfo" )
      .text( "Gen Time: 02Z; Valid Time: 15Z" )
      .appendTo( body );
  }

  /* add opacity the option is set */
  if( this.showOpacitySlider )
  {
    jQuery( "<div>" )
      .addClass( "DefaultLayerControls_opacitySlider" )
      .attr( "id", this.target + "_opacitySlider" )
      .slider( { min: 0, max: 1, step: 0.01, value: this.opacity } )
      .on( "slide", this.opacityChanged.bind( this ) )
      .appendTo( body );
  }

  /* add a color legend if we have one */
  if( this.showColorLegend && typeof( this.legendUrl ) !== "undefined" )
  {
    jQuery( "<img/>" )
      .addClass( "DefaultLayerControls_colorLegend" )
      .attr( "id", this.target + "_colorLegend" )
      .attr( "src", this.legendUrl )
      .appendTo( body );
  }

  /* add a listener to the color bar if the option is set to allow it to be configurable */
  if( this.allowConfigColors && typeof( this.layer.changeColorBar ) === "function" )
  {
    /* register a listener for a double click */
    jQuery( "#" + this.target + "_colorLegend" )
      .dblclick( this.showColorScaleConfigDialog.bind( this ) );

  }

  this.updateView();
};


ral.gis.layer.control.DefaultLayerControls.prototype.setLegendUrl = function( legendUrl )
{
  this.legendUrl = legendUrl;

  jQuery( "#" + this.target + "_colorLegend" )
    .attr( "src", this.legendUrl );
};


/**
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.showColorScaleConfigDialog = function()
{
  var dialogOptions = {
    autoOpen : true,
    resizable: true,
    modal    : true,
    title    : "Modify " + this.displayName + " Range/Palette",
    height   : 400,
    width    : 400,
    buttons  : {
      "OK"    : this.updateColorScale.bind( this ),
      "Cancel": this.closeDialog.bind( this )
    }
  };

  /* Begin Dynamic Dialog Table Construction */
  var table = jQuery( "<table>" ).addClass( "DefaultLayerControls_colorPaletteTable" );
  var row   = jQuery( "<tr>" );

  jQuery( "<input>" )
    .addClass( "DefaultLayerControls_dialogMinMaxText")
    .attr( "type", "input" )
    .attr( "id", this.target + "_min" )
    .attr( "value", this.minValue )
    .attr( "maxLength", 4 )
    .attr( "size", 4 )
    .appendTo( jQuery( "<td>" ).appendTo( row ) );
  var select = jQuery( "<select>" )
    .css( "width", "200px" )
    .attr( "id", this.target + "_color_scale_list" )
    .appendTo( jQuery( "<td>" ).appendTo( row ) );
  row.appendTo( table );

  for( i = 0; i < this.paletteOptions.length; i += 1 )
  {
    var legendUrl = this.legendUrlTemplate
      .replace( "__PALETTE__", this.paletteOptions[i] )
      .replace( "__MIN_VALUE__", this.minValue )
      .replace( "__MAX_VALUE__", this.maxValue )
      .replace( "__UNITS__", "" )
      .replace( "__FONT_SIZE__", "0" );

    var option = jQuery( "<option>" )
      .val( this.paletteOptions[i] )
      .attr( "data-image", legendUrl )
      .appendTo( select );

    /* default to the current palette */
    if( this.paletteOptions[i] == this.palette )
    {
      option.attr( "selected", "selected" );
    }
  }

  jQuery( "<input>" )
    .addClass( "DefaultLayerControls_dialogMinMaxText")
    .attr( "id", this.target + "_max" )
    .val( this.maxValue )
    .attr( "maxlength", "4" )
    .attr( "size", "4" )
    .appendTo( jQuery( "<td>" ).appendTo( row ) );

  var dialogDiv = jQuery( "<div>" );
  table.appendTo( dialogDiv );
  this.colorScaleDialog = dialogDiv.dialog( dialogOptions );
  jQuery( '#' + this.target + '_color_scale_list' ).msDropDown();
  /* End Dynamic Dialog Table Construction */
};


/**
 * Updates the color display in the layer and the color scale in the Data Layers menu
 * @param me the context to use in this function
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateColorScale = function()
{
  /* get the values from the ui */
  this.palette  = jQuery('#' + this.target + '_color_scale_list').val();
  this.minValue = jQuery('#' + this.target + '_min').val();
  this.maxValue = jQuery('#' + this.target + '_max').val();

  /* change the color bar on the layer */
  this.layer.changeColorBar( this.palette, this.minValue, this.maxValue );

  /* get the new color palette URL */
  this.setLegendDetails( this.palette, this.minValue, this.maxValue );

  /* close the dialog */
  this.closeDialog();
};


/**
 * Update the legend visible on the layer controls
 * @private
 *
 * @param palette
 * @param min
 * @param max
 */
ral.gis.layer.control.DefaultLayerControls.prototype.setLegendDetails = function( palette, min, max )
{
  this.legendUrl = this.legendUrlTemplate
    .replace( "__PALETTE__", palette )
    .replace( "__MIN_VALUE__", min )
    .replace( "__MAX_VALUE__", max )
    .replace( "__UNITS__", encodeURI( this.units ) )
    .replace( "__FONT_SIZE__", "11" );

  jQuery( "#" + this.target + "_colorLegend" )
    .attr( "src", this.legendUrl );
};


/**
 * Close the color palette config dialog
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.closeDialog = function()
{
  this.colorScaleDialog.dialog( "close" );
  this.colorScaleDialog.dialog( "destroy" );
};


/**
 * Update the view to match a recently changed value
 * @private
 *
 * @param {string} hints What changed.  Specific values depend on view implementation.
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateView = function( hints )
{
  if( hints == "visibility" ) this.updateViewVisibility();
  else if( hints == "opacity" ) this.updateViewOpacity();
  else if( hints == "status" ) this.updateViewStatus();
  else if( hints == "text" ) this.updateViewText();
  else
  {
    /* no hints provided, so update all aspects */
    this.updateViewVisibility();
    this.updateViewOpacity();
    this.updateViewStatus();
    this.updateViewText();
  }
};


/**
 * Update only the visibility check box
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateViewVisibility = function()
{
  jQuery( "#" + this.target + "_checkBox" ).prop( "checked", this.visible );

  if( this.visible )
    jQuery( "#" + this.target + "_body" ).slideDown();
  else
    jQuery( "#" + this.target + "_body" ).slideUp();
};


/**
 * Update only the opacity slider
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateViewOpacity = function()
{
  jQuery( "#" + this.target + "_opacitySlider" ).slider( "option", "value", this.opacity );
  if ( this.showColorLegend === true )
  {
    jQuery( "#" + this.target + "_colorLegend" ).css( "opacity", this.opacity );
  }
};


/**
 * Update only the status icon
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateViewStatus = function()
{
  var icon = ral.gis.layer.control.DefaultLayerControls.idleIconUrl;

  if( this.status === ral.gis.layer.Layer.STATUS_LOADING )
    icon = ral.gis.layer.control.DefaultLayerControls.loadingIconUrl;
  else if( this.status === ral.gis.layer.Layer.STATUS_ERROR )
    icon = ral.gis.layer.control.DefaultLayerControls.errorIconUrl;

  jQuery( "#" + this.target + "_statusIcon" )
    .attr( "src", icon );
};


/**
 * Update only the textual information
 * @private
 */
ral.gis.layer.control.DefaultLayerControls.prototype.updateViewText = function()
{
  jQuery( "#" + this.target + "_textualInfo" )
    .text( this.textualInfo );
};


/**
 * Toggle the visibility status
 * @private
 *
 * @param {object} event Mouse event
 */
ral.gis.layer.control.DefaultLayerControls.prototype.checkBoxClicked = function( event )
{
  this.setVisible( ! this.visible );
};


/**
 * Set the opacity value from the slider
 * @private
 *
 * @param {object} event Event object (not used)
 * @param {object} ui JQuery UI slider
 */
ral.gis.layer.control.DefaultLayerControls.prototype.opacityChanged = function( event, ui )
{
  this.setOpacity( ui.value );
};


/**
 * This is called by the Layer class when there is a text changed event
 * @private
 *
 * @param {string} newText The new text to display
 */
ral.gis.layer.control.DefaultLayerControls.prototype.layerTextChanged = function( newText )
{
  this.textualInfo = newText;
  this.updateView( "text" );
};


/**
 * This is called by the Layer class when there is a status changed event
 * @private
 *
 * @param {string} newStatus The new status, one of: 'idle', 'loading', or 'error'.  Defaults to idle if nothing provided.
 */
ral.gis.layer.control.DefaultLayerControls.prototype.layerStatusChanged = function( newStatus )
{
  this.status = newStatus;
  this.updateView( "status" );
};

var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.control = ral.gis.layer.control || {};

/**
 * The LayerControlsGroup is an abstract class that can be extended to listen to events from
 * LayerControls objects and update other members of the group as needed.  For example, the
 * SingleVisibleLayerControlsGroup will only allow one member to be visible at a time.  If
 * one member turns on, it will turn all others off.
 * @constructor
 * @memberof ral.gis.layer.control
 * @abstract
 *
 * @param {object} options The options used to construct a group
 * @param {LayerControls[]} options.controls A list of LayerControls objects. Can be adjusted later with add/remove functions
 */
ral.gis.layer.control.LayerControlsGroup = function( options )
{
  this.controls      = [];
  this.disableEvents = true;

  if( typeof( options.controls ) !== "undefined" )
  {
    for( var i = 0; i < options.controls.length; i++ )
    {
      this.addLayerControls( options.controls[i] );
    }
  }

  this.disableEvents = false;
};


/**
 * Add LayerControls to the group
 * @public
 *
 * @param {LayerControls} layerControls Add these controls to the group
 */
ral.gis.layer.control.LayerControlsGroup.prototype.addLayerControls = function( layerControls )
{
  this.controls[ this.controls.length ] = layerControls;

  layerControls.addListener( this );
};


/**
 * Remove LayerControls from the group
 * @public
 *
 * @param {LayerControls} layerControls Remove these controls from the group
 */
ral.gis.layer.control.LayerControlsGroup.prototype.removeLayerControls = function( layerControls )
{
  for( var i = 0; i < this.controls.length; i++ )
  {
    if( this.controls[i] == layerControls )
    {
      this.controls[i].removeListener( this );
      this.controls.splice( i, 1 );
    }
  }
};


/**
 * Remove all of the controls currently in the group
 * @public
 */
ral.gis.layer.control.LayerControlsGroup.prototype.removeAllLayerControls = function()
{
  for( var i = 0; i < this.controls.length; i++ )
  {
    this.controls[i].removeListener( this );
  }

  this.controls = [];
};


/**
 * Set the visibility of all LayerControls
 * @public
 */
ral.gis.layer.control.LayerControlsGroup.prototype.setAllVisibility = function( visible )
{
  for( var i = 0; i < this.controls.length; i++ )
  {
    this.controls[i].setVisible( visible );
  }
};


/**
 * Listen for notifications that a group member has changed and adjust other controls accordingly
 * @private
 * @abstract
 *
 * @param {LayerControls} layerControls The controls that were changed
 */
ral.gis.layer.control.LayerControlsGroup.prototype.groupMemberVisibilityChanged = function( layerControls )
{
  log.console( "LayerControlsGroup.groupMemberVisibilityChanged() is abstract." );
};


/**
 * This is the function to listen to each of the LayerControls in the group for visiblity changes
 *
 * @param {LayerControls} layerControls The controls that fired the event
 */
ral.gis.layer.control.LayerControlsGroup.prototype.layerVisibilityChanged = function( layerControls )
{
  if( ! this.disableEvents )
  {
    this.disableEvents = true;
    this.groupMemberVisibilityChanged( layerControls );
    this.disableEvents = false;
  }
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.control = ral.gis.layer.control || {};

/**
 * The SingleVisibleLayerControlsGroup will only allow one member to be visible at a time.  If
 * one member turns on, it will turn all others off.
 * @constructor
 * @memberof ral.gis.layer.control
 * @extends ral.gis.layer.control.LayerControlsGroup
 *
 * @param {object} options The options used to construct a group
 * @param {LayerControls[]} options.controls A list of LayerControls objects. Can be adjusted later with add/remove functions
 */
ral.gis.layer.control.SingleVisibleLayerControlsGroup = function( options )
{
  ral.gis.layer.control.LayerControlsGroup.call( this, options );
};


/**
 * Inherit from the LayerControlsGroup class
 */
ral.gis.layer.control.SingleVisibleLayerControlsGroup.prototype = Object.create( ral.gis.layer.control.LayerControlsGroup.prototype );


/**
 * Listen for notifications that a group member has changed and adjust other controls accordingly
 * @private
 * @abstract
 *
 * @param {LayerControls} layerControls The controls that were changed
 */
ral.gis.layer.control.SingleVisibleLayerControlsGroup.prototype.groupMemberVisibilityChanged = function( layerControls )
{
  /* A layer was turned off, do not do anything */
  if( ! layerControls.isVisible() ) return;

  /* A layer was turned on, turn all of the others off */
  for( var i = 0; i < this.controls.length; i++ )
  {
    if( layerControls != this.controls[i] )
    {
      this.controls[i].setVisible( false );
    }
  }

  /* retrigger our visible layer */
  layerControls.setVisible( true );
};
var ral = ral || {};
ral.gis = ral.gis || {};
ral.gis.layer = ral.gis.layer || {};
ral.gis.layer.control = ral.gis.layer.control || {};

/**
 * This class creates a folding menu tree containing any number of nested submenus and
 * LayerControl objects.
 * @constructor
 * @memberof ral.gis.layer.control
 * @public
 * @requires module:jquery
 * @requires module:jquery-ui.collapsible
 *
 * @param {Object} options The options to use to configure the ral.gis.layer.control.CollapsibleLayerControlsMenu
 * @param {string} options.target The id of the DOM element that will contain this menu
 * @param {string} options.title The title of the menu
 * @param {number} options.indent The number of pixels to indent for each nested level of the menu. Default is 20
 * @param {boolean} options.showCloseAllButton Optional. If true, a button to close all windows and set all layers
 *                  visible will be added to the widget. Default is false.
 * @TODO should extend a more generalized LayerMenu
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu = function( options )
{
  this.target = options.target
  var elem = document.getElementById( this.target );
  this.layerControls = [];

  if ( elem == null )
  {
    console.error( "Could not find a DOM element with the id '" + this.target + "'" );
    return;
  }

  if( typeof( options.showCloseAllButton ) !== "undefined" && options.showCloseAllButton === true )
  {
    jQuery( "<input/>")
      .attr( "type", "button" )
      .attr( "value", "Close All" )
      .addClass( "CollapsibleLayerControlsMenu_button" )
      .click( function() { this.closeAll(); }.bind( this ) )
      .appendTo( "#" + this.target );
  }

  jQuery( "<h1/>" )
      .addClass( "CollapsibleLayerControlsMenu" )
      .text( options.title )
      .appendTo( "#" + this.target );

  jQuery( "<div/>" )
      .addClass( "CollapsibleLayerControlsMenu_main" )
      .attr( "align", "left" )
      .attr( "id", "CollapsibleLayerControlsMenu" )
      .appendTo( "#" + this.target );

  if ( 'indent' in options )
  {
    this.indentWidth = options.indent;
  }
  else
  {
    this.indentWidth = 20;
  }

  if( 'animationSpeed' in options )
  {
    this.animationSpeed = options.animationSpeed;
  }
  else
  {
    this.animationSpeed = 100;
  }
};

/**
 * Set the width of the indent width of each submenu and its contents. Each submenu will be indented by this amount
 * relative to its parent menu.
 *
 * @param {Integer} width The indent width, in pixels.
 * @public
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu.prototype.setIndentWidth = function( width )
{
  this.indentWidth = width;
};

/**
 * Add menus, submenus, and LayerControls to the menu tree. This function expects a specific input array:
 * <br/>
 * <code><pre>
 *    [
 *      {
 *        group: "The name of the_submenu",
 *        members: [
 *              {
 *               group: "This is a nested submenu",
 *               members: [
 *                {
 *                    name: "The name of the layer, used for creating an id",
 *                    controls: myLayerControlsObject
 *                },
 *                {
 *                    name: "The name of the layer, used for creating an id",
 *                    controls: myLayerControlsObject
 *                }
 *               ]
 *              }
 *        ]
 *      },
 *      {
 *        name: "The name of the layer, used for creating an id",
 *        controls: myDataLayerControlsObject
 *      },
 *    ]
 * </pre></code>
 *
 * The menu will be created according to this definition, and ids of the targets will be passed to the LayerControls
 * via the setTarget() function.
 *
 * @param {Array} layers The menu definition, including any number of nested submenus, as well as LayerControls objects
 * @public
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu.prototype.addLayers = function( layers )
{
  for (var i=0; i < layers.length; i++ )
  {
    this.addLayer( layers[ i ], 0, "", "CollapsibleLayerControlsMenu" );
  }
  $( '.collapsible' ).collapsible({
    speed: this.animationSpeed
  });
};

/**
 * Recursively build menus and submenus. Called initially by the addLayers function. This function should not be
 * called directly.
 *
 * @param {Object} layer A menu object containing either a list of group members or a DataLayerControls object
 * @param {Integer} level The indentation level
 * @param {String} group The DOM id of the group to which this layer belongs
 * @param {String} elementId The id of the DOM element that this menu object should be added to
 * @protected
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu.prototype.addLayer = function( layer, level, group, elementId )
{

  if ( "group" in layer )
  {
    var name = layer[ 'group' ];
    var id = elementId + "_" + name;
    id = id
          .replace( / /g, "_" )
          .replace( /\./g, "_" );

    jQuery( "<div/>" )
        .addClass( "collapsible" )
        .attr( "id", id + "collapsible" )
        .appendTo( "#" + elementId );
    var h2 = jQuery( "<h2/>" )
        .addClass( "CollapsibleLayerControlsMenu" )
        .css( "margin-left", ( level * this.indentWidth ) + "px" )
        .text( name )
        .appendTo( "#" + id + "collapsible" );
    jQuery( "<span/>" ).appendTo( h2 );
    jQuery( "<div/>" )
        .attr( "id" , id + "_container" )
        .appendTo( "#" + elementId );
    jQuery( "<div/>" )
        .attr( "id", id + "_content" )
        .addClass( "CollapsibleLayerControlsMenu" )
        .appendTo( "#" + id + "_container" );

    var sublayers = layer[ 'members' ];

    for ( var i = 0; i < sublayers.length; i++ )
    {
      this.addLayer( sublayers[i], level + 1, group + "_" + name, id + "_content" );
    }
  }
  else
  {
    var name = layer[ 'name' ];
    var id = group + "_" + name;
    id = id
      .replace( / /g, "_" )
      .replace( /\./g, "_" );
    jQuery( "<div></div>" )
        .attr( "id", id )
        .appendTo( "#" + elementId );

    layer[ 'controls' ].setTarget( id );
    layer[ 'controls' ].initView();
    jQuery( "#" + id + "_checkBox" ).css( "margin-left", level * this.indentWidth + "px" );

    this.layerControls.push( layer[ 'controls' ] )
  }
};

/**
 * Expand all menu items
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu.prototype.openAll = function()
{
  jQuery( ".collapsible" ).collapsible( "openAll" );
};

/**
 * Collapse all menu items AND set all data layer controls visibility to false (unchecked)
 */
ral.gis.layer.control.CollapsibleLayerControlsMenu.prototype.closeAll = function()
{
  jQuery( ".collapsible" ).collapsible( "closeAll" );
  for ( var i = 0; i < this.layerControls.length; i++ )
  {
    this.layerControls[ i ].setVisible( false );
  }
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Present an interface to the user to support time sequence operations. Implementations of
 * this interface are used by the AnimationController to manage selectable times, and by
 * various views (button controls, slider controls) to maintain state and be notified of changes.
 * @constructor
 * @memberof ral.time
 *
 * @param {Object} options The options to use to configure the TimeSelector
 * @param {number} options.frameDelayMs (required) The frame delay in milliseconds
 * @param {number} options.dwell (required) The step size in milliseconds
 * @param {Date} options.currentFrameTime (optional) The initial date to use as the current frame
 */

ral.time.TimeSequenceModel = function( options ) {

    /* set the required parameters */
    this.frameDelayMs = options.frameDelayMs;
    this.dwellMs      = options.dwellMs;

    /* set the default values on optional parameters */
    this.currentFrame = new Date(0);

    /* override default values on optional parameters if they were provided */
    if( typeof( options.currentFrameTime ) !== "undefined" ) this.currentFrame = options.currentFrameTime;

    /* initialize the listeners to be an empty list */
    if ( typeof this.listeners === "undefined" ) {
        this.listeners = [];
    }

    /* initialize other parameters */
    this.isPlaying = false;
    this.eventListeners = [];
};

/**
 * Step forward one frame. Wrap to the start if at the end.
 * @public abstract
 */
ral.time.TimeSequenceModel.prototype.stepForward = function()
{
    console.log( "TimeSequenceModel does not have a default stepForward() method and is abstract." );
};

/**
 * Step backward one frame. Wrap to the end if at the start.
 * @public abstract
 */
ral.time.TimeSequenceModel.prototype.stepBackward = function()
{
    console.log( "TimeSequenceModel does not have a default stepBackward() method and is abstract." );
};

/**
 * Change the playing state and fire playingStateChanged event.
 * @public
 *
 * @param {boolean} The playing state to apply.
 */
ral.time.TimeSequenceModel.prototype.setIsPlaying = function(isPlaying)
{
    this.isPlaying = isPlaying;
    this.firePlayingStateChangedEvent();
};

/**
 * Get the playing state.
 * @public
 *
 * @return {boolean} The current playing state.
 */
ral.time.TimeSequenceModel.prototype.getIsPlaying = function()
{
    return this.isPlaying;
};

/**
 * Set the current frame and fire frameChangedEvent. NOT TO BE CALLED BY CLIENTS -- use setCurrentFrame().
 *   This method assumes that the passed-in date is a valid frame.
 * @private
 *
 * @param {date} date The frame to set as current.
 */
ral.time.TimeSequenceModel.prototype._setCurrentFrame = function(date)
{
    this.currentFrame = date;
    this.fireFrameChangedEvent();
};

/**
 * Verify the passed-in frame is a valid frame.
 * @public
 *
 * @param {date} date The frame to test as a valid frame.
 */
ral.time.TimeSequenceModel.prototype.isValidFrame = function(date)
{
    console.log( "TimeSequenceModel does not have a default isValidFrame() method and is abstract." );
};

/**
 * Verify the passed-in frame is valid, and set it as current. If the frame is not valid, return without doing anything.
 * @public
 *
 * @param {date} date The frame to set as current, if it is a valid frame.
 */
ral.time.TimeSequenceModel.prototype.setCurrentFrame = function(date)
{
    console.log( "TimeSequenceModel does not have a default setCurrentFrame() method and is abstract." );
};

/**
 * Get the current frame.
 * @public
 *
 * @return {Date} The date of the current frame.
 */
ral.time.TimeSequenceModel.prototype.getCurrentFrame = function()
{
    return this.currentFrame;
};

/**
 * Set the first time sequence frame as the current frame.
 * @public
 */
ral.time.TimeSequenceModel.prototype.setFirstFrameCurrent = function()
{
    console.log( "TimeSequenceModel does not have a default setFirstFrameCurrent() method and is abstract." );
};

/**
 * Get the first time sequence frame.
 * @public
 *
 * @return {Date} The date of the first frame in the sequence.
 */
ral.time.TimeSequenceModel.prototype.getFirstFrame = function()
{
    console.log( "TimeSequenceModel does not have a default getFirstFrame() method and is abstract." );
};

/**
 * Set the last time sequence frame as the current frame.
 * @public
 */
ral.time.TimeSequenceModel.prototype.setLastFrameCurrent = function()
{
    console.log( "TimeSequenceModel does not have a default setLastFrameCurrent() method and is abstract." );
};

/**
 * Get the last time sequence frame.
 * @public
 *
 * @return {Date} The date of the last frame in the sequence.
 */
ral.time.TimeSequenceModel.prototype.getLastFrame = function()
{
  console.log( "TimeSequenceModel does not have a default getLastFrame() method and is abstract." );
};

/**
 * Get the array of frame times.
 * @public abstract
 *
 * @return {[Date]} An array of Date objects representing the frames of this time sequence.
 */
ral.time.TimeSequenceModel.prototype.getTimeSequenceFrames = function()
{
    console.log( "TimeSequenceModel does not have a default getTimeSequenceFrames() method and is abstract." );
    return [];
};

/**
 * Set the frame delay in milliseconds
 * @public
 *
 * @param {number} frameDelayMs The number of milliseconds to pause before advancing to the next frame in animation mode
 */
ral.time.TimeSequenceModel.prototype.setFrameDelay = function(delay)
{
    this.frameDelayMs = delay;
    this.fireFrameDelayChangedEvent();
};

/**
 * Get the frame delay, in ms.
 * @public
 *
 * @return {number} The frame delay in ms.
 */
ral.time.TimeSequenceModel.prototype.getFrameDelay = function()
{
    return this.frameDelayMs;
};

/**
 * Set the dwell in milliseconds. Dwell is the time the animation pauses before restarting the loop,
 *   or switching directions (when in SWEEP mode).
 * @public
 *
 * @param {number} dwell The number of milliseconds to pause at the end of the time sequence before restarting the loop in animation mode
 */
ral.time.TimeSequenceModel.prototype.setDwell = function(dwell)
{
    this.dwellMs = dwell;
    this.fireDwellChangedEvent();
};

/**
 * Get dwell in ms. Dwell is the time the animation pauses before restarting the loop, or switching directions (when in SWEEP mode).
 * @public
 *
 * @return {boolean} The dwell value in ms.
 */
ral.time.TimeSequenceModel.prototype.getDwell = function()
{
    return this.dwellMs;
};

/**
 * Determine whether the current frame is the first frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is first in the time sequence.
 */
ral.time.TimeSequenceModel.prototype.isCurrentFrameFirst = function() {
    console.log( "TimeSequenceModel does not have a default isCurrentFrameFirst() method and is abstract." );
};

/**
 * Determine whether the current frame is the last frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is last in the time sequence.
 */
ral.time.TimeSequenceModel.prototype.isCurrentFrameLast = function() {
    console.log( "TimeSequenceModel does not have a default isCurrentFrameLast() method and is abstract." );
};

/**
 * Add a listener. The following events are broadcast by this object. If the listener implements the associated
 *   method, it will be called when the event is broadcast. Otherwise the listener will be ignored for that event.
 * playingStateChangedEvent - playingStateChanged(boolean) is called on listeners that implement this method when
 *     the the value of isPlaying changes on this object. This is used to change the play button to a pause
 *     button, etc.
 * frameChangedEvent - frameChanged(Date) is called on listeners that implement this method when the current frame
 *     changes on this object.
 * sequenceChangedEvent - sequenceChanged([TimeSequence Object]) is called on listeners that implement this method when the set
 *     of possible frames changes on this object. This object is passed to listeners because the listener may need to
 *     call implementation-specific methods to get in sync with the advertised changes.
 * frameDelayChangedEvent - frameDelayChanged(number) is called on listeners that implement this method when the
 *     frame delay is changed on this object.
 * dwellChangedEvent - dwellChanged(number) is called on listeners that implement this method when the
 *     dwell is changed on this object.
 * @public
 *
 * @param {Object} Object to receive events.
 */
ral.time.TimeSequenceModel.prototype.addListener = function( listener )
{
    if ( typeof listener === "undefined" || listener == null ) {
        console.log("ERROR: Attempting to add bogus listener to TimeSelectorModel");
        return;
    }

    this.listeners.push( listener );
};

/**
 * Remove a listener.
 * @public
 *
 * @param {Object} Object to remove from the set of listeners.
 */
ral.time.TimeSequenceModel.prototype.removeListener = function( listener )
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( this.listeners[i] == listener ) {
            this.listeners.splice( i, 1 );
        }
    }
};

/**
 * Set the animation controller for the time sequence model.  This is useful if the app will
 * replace the time sequence model.  It will allow the new animation controller to be easily
 * transferred to the new time sequence model.
 *
 * @param animationController {ral.time.AnimationController} The animation controller
 */
ral.time.TimeSequenceModel.prototype.setAnimationController = function( animationController )
{
    this.animationController = animationController;
};

/**
 * Set the animation controller for the time sequence model.  This is useful if the app will
 * replace the time sequence model.  It will allow the new animation controller to be easily
 * transferred to the new time sequence model.
 *
 * @param animationController {ral.time.AnimationController} The animation controller
 */
ral.time.TimeSequenceModel.prototype.getAnimationController = function()
{
    return this.animationController;
};

/**
 * Fire an event to broadcast that the playing state has changed. Call
 * playingStateChanged(boolean) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.firePlayingStateChangedEvent = function()
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].playingStateChanged) == "function" ) {
            this.listeners[i].playingStateChanged( this.getIsPlaying() );
        }
    }
};

/**
 * Fire an event to broadcast that the current frame has changed. Call
 * frameChanged(Date) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.fireFrameChangedEvent = function()
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].frameChanged) == "function" ) {
            this.listeners[i].frameChanged( this.getCurrentFrame() );
        }
    }
};

/**
 * Fire an event to broadcast that the frame transition is complete. Call
 * frameTransitionComplete(Date) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.fireFrameTransitionCompleteEvent = function(newDate, newLayer)
{
    if ( newDate.getTime() != this.getCurrentFrame().getTime() ) {
        console.log("WARNING: TimeSequenceModel::fireFrameTransitionCompleteEvent is firing with newDate: " + newDate + " that does not match the currentFrame: " + this.getCurrentFrame());
    }
    
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].frameTransitionComplete) == "function" ) {
            this.listeners[i].frameTransitionComplete( newDate, newLayer );
        }
    }
};

/**
 * Fire an event to broadcast that the set of possible frames has changed. Call
 * sequenceChanged(TimeSequence Object) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.fireSequenceChangedEvent = function()
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].sequenceChanged) == "function" ) {
            this.listeners[i].sequenceChanged( this );
        }
    }
};

/**
 * Fire an event to broadcast that the frame delay has changed. Call
 * frameDelayChanged(number) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.fireFrameDelayChangedEvent = function()
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].frameDelayChanged) == "function" ) {
            this.listeners[i].frameDelayChanged( this.getFrameDelay() );
        }
    }
};

/**
 * Fire an event to broadcast that the dwell has changed. Call
 * dwellChanged(number) on all listeners that implement that method.
 * @private
 */
ral.time.TimeSequenceModel.prototype.fireDwellChangedEvent = function()
{
    for ( var i = 0; i < this.listeners.length; i++ ) {
        if ( typeof(this.listeners[i].dwellChanged) == "function" ) {
            this.listeners[i].dwellChanged( this.getDwell() );
        }
    }
};


/**
 * Transfer all of the listeners and animation controller from 'this' TSM into the
 * new TSM.  Useful if the application's TSM is changing.
 *
 * @param {ral.time.TimeSequenceModel} tsm2 The target to receive the listeners and AnimationController
 * @param {boolean} fireEvents If false, don't fire frame or sequence changed events
 */
 ral.time.TimeSequenceModel.prototype.transferListenersInto = function( tsm2, fireEvents )
{
    /* transfer the listeners */
    tsm2.listeners = this.listeners;
    this.listeners = [];

    /* set the time delays */
    tsm2.frameDelayMs = this.frameDelayMs;
    tsm2.dwellMs      = this.dwellMs;

    /* transfer the animation controller if it exists */
    var animController = this.getAnimationController();
    if( typeof( animController ) !== "undefined" )
    {
        animController.setTimeSequence( tsm2 );
        tsm2.setAnimationController( animController );
    }

    if ( fireEvents !== false ) {
        /* fire an event so that listeners know the TimeSequenceModel changed */
        tsm2.fireSequenceChangedEvent();
        tsm2.fireFrameChangedEvent();
    }
};

var ral = ral || {};
ral.time = ral.time || {};

/**
 * Present an interface to the user to allow the user to control animations.  This basic
 * implementation plays from current position, to end of range in TimeSelector, and jumps
 * back to the beginning of the range in TimeSelector; provides play/pause and step buttons;
 * and provides an animation speed slider.  This class can be extended to provide different
 * play modes; and additional controls and user configurations.
 * @constructor
 * @memberof ral.time
 *
 * @param {Object} options The options to use to configure the AnimationController
 * @param {TimeSequenceModel} options.timeSequence (required) The time sequence object that maintains state. Note that TimeSequence is
 *           abstract, and an implementation of that interface must be used instead.
 * @param {boolean} options.usesExternalPlayTimer (optional) Mode that turns off play() method calling itself recursively.
 * @param {string} options.mode (optional) String indicating the animation mode (FORWARD, BACKWARD, or SWEEP).
 */
ral.time.AnimationController = function( options )
{
    /* set the required parameters */
    this.timeSequence = options.timeSequence;
    this.timeSequence.setAnimationController( this );

    /* set the default values on optional parameters */
    this.mode = 'FORWARD';
    this.usesExternalPlayTimer = false;
    this.pendingFrameTransition = null;

    if( typeof( options.mode ) !== "undefined" )                  this.mode = options.mode;
    if( typeof( options.usesExternalPlayTimer ) !== "undefined" ) this.usesExternalPlayTimer = options.usesExternalPlayTimer;

    if ( this.mode != 'FORWARD' && this.mode != 'BACKWARD' && this.mode != 'SWEEP') {
        console.log("ERROR: Mode for Animation controller must be FORWARD, BACKWARD, or SWEEP. Got: " + this.mode);
        this.mode = 'FORWARD';
    }
};

/**
 * Set the time sequence model.
 * @public
 *
 * @param {ral.time.TimeSequenceModel} timeSequence The new time sequence model
 */
ral.time.AnimationController.prototype.setTimeSequence = function( timeSequence )
{
    this.timeSequence = timeSequence;
};

/**
 * Toggle the playing state. If the mode for this controller is 'SWEEP,' then start
 *   sweeping in the forward direction.
 * @public
 */
ral.time.AnimationController.prototype.toggleAnimation = function()
{
    var wasPlaying = this.timeSequence.getIsPlaying();



    if ( wasPlaying ) {
        this.clearPendingFrameTransition();
        this.timeSequence.setIsPlaying(false);
    }
    else {
        this.timeSequence.setIsPlaying(true);

        // If mode is sweep, start in forward direction.
        if ( this.mode == 'SWEEP' ) {
            this.sweep = 'FORWARD';
        }

        this.play();
    }
};

/**
 * Step forward to the next frame. If on the last frame, restart at
 *   the beginning of the sequence. If the animation is playing, stop
 *   the animation.
 * @public
 */
ral.time.AnimationController.prototype.stepForward = function()
{
    // Pause the animation if it's playing
    if ( this.timeSequence.getIsPlaying() ) {
        this.toggleAnimation();
    }

    if ( this.timeSequence.isCurrentFrameLast() ) {
        this.timeSequence.setFirstFrameCurrent();
    }
    else {
        this.timeSequence.stepForward();
    }
};

/**
 * Step backward to the next frame. If on the first frame, restart at
 *   the end of the sequence. If the animation is playing, stop
 *   the animation.
 * @public
 */
ral.time.AnimationController.prototype.stepBackward = function()
{
    // Pause the animation if it's playing
    if ( this.timeSequence.getIsPlaying() ) {
        this.toggleAnimation();
    }

    if ( this.timeSequence.isCurrentFrameFirst() ) {
        this.timeSequence.setLastFrameCurrent();
    }
    else {
        this.timeSequence.stepBackward();
    }
};

/**
 * Set the current frame to the passed-in Date, which must represent a valid
 *   frame in order for this method to succeed. If an invalid frame Date is provided, this
 *   method does nothing.
 * @public
 *
 * @param {Date} The date of the desired frame.
 * @return {boolean} True if the passed-in frame was a valid frame. False otherwise.
 */
ral.time.AnimationController.prototype.selectFrame = function(date)
{
    if ( !this.timeSequence.isValidFrame(date) ) {
        return false;
    }

    this.timeSequence.setCurrentFrame(date);

    return true;
};

/**
 * Set the frame delay in milliseconds, on the model.
 * @public
 *
 * @param {number} frameDelayMs The number of milliseconds to pause before advancing to the next frame in animation mode
 */
ral.time.AnimationController.prototype.setFrameDelay = function(delay)
{
   this.timeSequence.setFrameDelay(delay);
};

/**
 * Get the frame delay, in milliseconds.
 * @public
 */
ral.time.AnimationController.prototype.getFrameDelay = function()
{
    return this.timeSequence.getFrameDelay();
};

/**
 * Set the dwell in milliseconds, on the model.
 * @public
 *
 * @param {number} dwell The number of milliseconds to pause at the end of the time sequence before advancing to the next frame in animation mode
 */
ral.time.AnimationController.prototype.setDwell = function(dwell)
{
    this.timeSequence.setDwell(dwell);
};

/**
 * Get the dwell, in milliseconds.
 * @public
 */
ral.time.AnimationController.prototype.getDwell = function()
{
    return this.timeSequence.getDwell();
};

/**
 * Get the time sequence model.
 * @public
 */
ral.time.AnimationController.prototype.getTimeSequence = function()
{
    return this.timeSequence;
};

/**
 * Set the time at which the frame change was initiated. Used by external timers
 *   when they want to determine the amount of time that has passed since the
 *   frame change was initiated.
 * @public
 */
ral.time.AnimationController.prototype.setFrameChangeStartTime = function(date)
{
    this.frameChangeStartTime = date;
};

/**
 * Get the time at which the frame change was initiated. Used by external timers
 *   when they want to determine the amount of time that has passed since the
 *   frame change was initiated.
 * @public
 */
ral.time.AnimationController.prototype.getFrameChangeStartTime = function()
{
    return isNaN(this.frameChangeStartTime) ? new Date() : this.frameChangeStartTime;
};

/**
 * Set the delay for the current frame change, if a frame change is underway. Not
 *   strictly thread-safe!
 * @public
 */
ral.time.AnimationController.prototype.setCurrentFrameDelay = function(delayMs)
{
    this.currentFrameDelay = delayMs;
};

/**
 * Get the delay for the current frame change, if a frame change is underway. Not
 *   strictly thread-safe!
 * @public
 */
ral.time.AnimationController.prototype.getCurrentFrameDelay = function()
{
    return isNaN(this.currentFrameDelay) ? this.timeSequence.frameDelayMs : this.currentFrameDelay;
};

/**
 * Set the delay for the next frame change. Not thread-safe!
 * @public
 */
ral.time.AnimationController.prototype.setNextFrameDelay = function(delayMs)
{
    this.nextFrameDelay = delayMs;
};

/**
 * Get the delay for the next frame change. Not thread-safe!
 * @public
 */
ral.time.AnimationController.prototype.getNextFrameDelay = function()
{
    return isNaN(this.nextFrameDelay) ? this.timeSequence.frameDelayMs : this.nextFrameDelay;
};

/**
 * Set the mode inticating that an external play timer is used, so play() should not call itself recursively.
 * @public
 */
ral.time.AnimationController.prototype.setUsesExternalPlayTimer = function(usesExternalTimer)
{
    this.usesExternalPlayTimer = usesExternalTimer;
};


/**
 * Get the mode inticating that an external play timer is used, so play() should not call itself recursively.
 * @public
 */
ral.time.AnimationController.prototype.getUsesExternalPlayTimer = function()
{
    return this.usesExternalPlayTimer;
};

/**
 * Determine whether animation is playing.
 * @public
 */
ral.time.AnimationController.prototype.getIsPlaying = function()
{
    return this.timeSequence.getIsPlaying();
};

/**
 * Call the appropriate step method on the model and repeat while in the playing state
 * @private
 */
ral.time.AnimationController.prototype.play = function()
{
    if ( this.timeSequence.getIsPlaying() )
    {
        // Capture the time at which the frame change was initiated.
        this.setFrameChangeStartTime( new Date() );
        this.setCurrentFrameDelay(this.getNextFrameDelay());

        var delay = 0;
        if ( this.mode == 'FORWARD' ) {
            delay = this.playF();
        }
        else if ( this.mode == 'BACKWARD' ) {
            delay = this.playB();
        }
        else if ( this.mode == 'SWEEP' ) {
            if ( this.sweep == 'FORWARD' ) {
                if ( this.timeSequence.isCurrentFrameLast() ) {
                    this.sweep = 'BACKWARD';
                    delay = this.playB();
                }
                else {
                    delay = this.playF();
                }
            }
            else {
                if ( this.timeSequence.isCurrentFrameFirst() ) {
                    this.sweep = 'FORWARD';
                    delay = this.playF();
                }
                else {
                    delay = this.playB();
                }
            }
        }

        this.setNextFrameDelay(delay);
        if ( !this.getUsesExternalPlayTimer() ) {
            setTimeout( this.play.bind( this ), delay );
        }
    }
};

/**
 * Perform the appropriate step for forward play and calculate delay for the current frame (use dwell time if last frame).
 * @private
 */
ral.time.AnimationController.prototype.playF = function()
{
    if ( this.timeSequence.isCurrentFrameLast() ) {
        this.timeSequence.setFirstFrameCurrent();
    }
    else {
        this.timeSequence.stepForward();
    }

    var delay = this.timeSequence.frameDelayMs;
    if ( this.timeSequence.isCurrentFrameLast() ) {
        delay = this.timeSequence.dwellMs;
    }

    return delay;
};

/**
 * Perform the appropriate step for backward play and calculate delay for the current frame (use dwell time if first frame).
 * @private
 */
ral.time.AnimationController.prototype.playB = function()
{
    if ( this.timeSequence.isCurrentFrameFirst() ) {
        this.timeSequence.setLastFrameCurrent();
    }
    else {
        this.timeSequence.stepBackward();
    }

    var delay = this.timeSequence.frameDelayMs;
    if ( this.timeSequence.isCurrentFrameFirst() ) {
        delay = this.timeSequence.dwellMs;
    }

    return delay;
};


/** ***********************************************************************************************
 * The following methods support external control of the animation frame advance. If classes using
 *   this controller want to delay frame changes until all the tiles are loaded on the OpenLayers layer,
 *   they should:
 *     o set the usesExternalPlayTimer flag on this controller at the time of creation
 *     o start a timer to track elapsed time since the beginning of the frame change
 *     o listen for 'loadend' events from the OpenLayers layer for notification of complete time loading
 *     o issue a call to completeFrameTransition() via a setTimeout() call. The timeout should be reduced
 *         by the amount of time it took for the layer to load all of its tiles.
 *     o Register the pending frame transition with this controller to eliminate threading errors. That is
 *         accomplished by calling setPendingFrameTransition(). The same object used to register must be passed
 *         to completeFrameTranstion() when it is called. A frame transition object can be any arbitrary, unique
 *         javascript object -- it is simply used to identify a valid pending call to completeFrameTransition() -- all others are ignored.
 *
 * If the usesExternalPlayTimer flag is not set on this object, the play() method will recurse
 *   on its own.
 *
 */

/**
 * Determine whether the passed-in object matches the pending frame transition. This can be any arbitrary, unique,
 * javascript object.
 * @return True if the passed-in object matches the pending frame transition.
 */
ral.time.AnimationController.prototype.isPendingFrameTransition = function(pendingFrameTransitionRef) {
    return ( this.pendingFrameTransition != null && this.pendingFrameTransition == pendingFrameTransitionRef);
};

/**
 * Set the pending frame transtion to the passed-in object.
 */
ral.time.AnimationController.prototype.setPendingFrameTransition = function(pendingFrameTransitionRef) {
    this.pendingFrameTransition = pendingFrameTransitionRef;
};

/**
 * Clear the pending frame transtion object if it matches the passed-in object. If the passed-in object
 * does not match the pending frame transition, do not clear it.
 * @return True if the passed-in object matches the pending frame transition, and it was cleared. Otherwise false.
 */
ral.time.AnimationController.prototype.removePendingFrameTransition = function(pendingFrameTransitionRef) {
    var wasPendingFrameTransition = ( this.pendingFrameTransition == pendingFrameTransitionRef );

    if ( wasPendingFrameTransition ) {
        this.pendingFrameTransition = null;
    }

    return wasPendingFrameTransition;
};

/**
 * Clear any pending frame transition object.
 */
ral.time.AnimationController.prototype.clearPendingFrameTransition = function() {
    this.pendingFrameTransition = null;
};

/**
 * Finish the frame transition and start the next frame.
 *   Use this method if you are continuing animation from a 'loadend' event on the openlayers layer, after
 *   waiting for the layer to load all tiles.
 * @private
 */
ral.time.AnimationController.prototype.completeFrameTransition = function(newLayer, oldLayer, newDate, pendingFrameTransitionRef, desiredOpacity) {
    // console.log("            Switching from layer: " + (oldLayer ? oldLayer.name : "Unknown") );
    // console.log("                to new layer:                   " + newLayer.name);
    // console.log("                    with new date:              " + newDate);
    
    if ( typeof desiredOpacity == 'undefined' ) {
        desiredOpacity = 1.0;
    }

    if ( !this.isPendingFrameTransition(pendingFrameTransitionRef) ) {
        // console.log("                CANCELLED CANCELLED CANCELLED CANCELLED CANCELLED CANCELLED (before transition)");
        if (this.pendingFrameTransition) console.log("                Controller ref: [from: " + this.pendingFrameTransition.from + ", to: " + this.pendingFrameTransition.to +"]");
        if (pendingFrameTransitionRef) console.log("                Passed-in ref: [from: " + pendingFrameTransitionRef.from + ", to: " + pendingFrameTransitionRef.to +"]");
        return;
    }

    newLayer.setOpacity(desiredOpacity);
    if (oldLayer) {
        // oldLayer.setVisibility(false);
        oldLayer.setOpacity(0.0);
        // oldLayer.setVisibility(false);
    }

    // Notify listeners
    this.timeSequence.fireFrameTransitionCompleteEvent(newDate, newLayer);

    if ( !this.removePendingFrameTransition(pendingFrameTransitionRef) ) {
        // console.log("                CANCELLED CANCELLED CANCELLED CANCELLED CANCELLED CANCELLED (before recursion)");
        return;
    }

    // Recurse.
    setTimeout( this.play.bind( this ), 0 );
};




var ral = ral || {};
ral.time = ral.time || {};

/**
 * Manage a sequence of times, represented by a list.
 * @constructor
 * @memberof ral.time
 * @extends ral.time.TimeSequenceModel
 *
 * @param {Object} options The options to use to configure the TimeSelector
 * @param [{date}] options.frameTimes (required) The array of frame times used to initialize this TimeSequence
 * @param {date} options.frameDelayMs (required) The frame delay in milliseconds
 * @param {date} options.dwellMs (required) The step size in milliseconds
 * @param {number} options.minFrameDelay (optional) The longest possible frame delay in milliseconds on the slider
 * @param {number} options.maxFrameDelay (optional) The shortest possible frame delay in milliseconds on the slider
 */

ral.time.ListTimeSequence = function( options ) {
    /* set the required parameters */
    if ( Object.prototype.toString.call( options.frameTimes ) !== '[object Array]' || options.frameTimes.length < 1 ) {
        console.log("ERROR: ral.time.ListTimeSequence constructor called without a valid frameTimes array.");
    }
    this.frameTimes   = options.frameTimes;

    this.currentFrameIndex = 0;
    this.currentFrameTime = this.frameTimes[this.currentFrameIndex];
    this.currentFrame = this.currentFrameTime;

    options.currentFrameTime = this.currentFrameTime;
    ral.time.TimeSequenceModel.call( this, options );

    console.log("Finished ral.time.ListTimeSequence constructor.");

    // This failed miserably.
    // this._setCurrentFrame(this.currentFrameTime);
};

/**
 * Inherit from the TimeSequenceModel class...
 */
ral.time.ListTimeSequence.prototype = Object.create( ral.time.TimeSequenceModel.prototype );

/**
 * Step forward one frame. Wraps to the beginning of the time sequence list when at the end.
 * @public
 */
ral.time.ListTimeSequence.prototype.stepForward = function()
{
    var newIdx = this.currentFrameIndex + 1;
    if ( newIdx >= this.frameTimes.length ) {
        console.log("ERROR: ListTimeSequence was stepped forward off the end of the time sequence.");
    }
    else {
        this.currentFrameIndex = newIdx;
        this.currentFrameTime = this.frameTimes[this.currentFrameIndex];

        this._setCurrentFrame(this.currentFrameTime);
    }
};

/**
 * Step forward one frame. Wraps to the end of the time sequence list when at the beginning.
 * @public
 */

ral.time.ListTimeSequence.prototype.stepBackward = function()
{
    var newIdx = this.currentFrameIndex - 1;
    if ( newIdx < 0 ) {
        console.log("ERROR: ListTimeSequence was stepped backward off the beginning of the time sequence.");
    }
    else {
        this.currentFrameIndex = newIdx;
        this.currentFrameTime = this.frameTimes[this.currentFrameIndex];

        this._setCurrentFrame(this.currentFrameTime);
    }
};

/**
 * Verify the passed-in frame is a valid frame.
 * @public
 *
 * @param {date} date The frame to test as a valid frame.
 */
ral.time.ListTimeSequence.prototype.isValidFrame = function(date)
{
    // Iterate through the frame times and see if the passed-in date is one of them.
    for (var i = 0; i < this.frameTimes.length; i++) {
        var thisFrame = this.frameTimes[i];
        if ( thisFrame.getTime() == date.getTime() ) {
            return true;
        }
    }

    return false;
};

/**
 * Verify the passed-in frame is valid, and set it as current. If the frame is not valid, return without doing anything.
 * @public
 *
 * @param {date} date The frame to set as current, if it is a valid frame.
 */
ral.time.ListTimeSequence.prototype.setCurrentFrame = function(date)
{
    // Iterate through the frame times and see if the passed-in date is one of them.
    for (var i = 0; i < this.frameTimes.length; i++) {
        var thisFrame = this.frameTimes[i];
        if ( thisFrame.getTime() == date.getTime() ) {
            this.currentFrameIndex = i;
            this.currentFrameTime = this.frameTimes[this.currentFrameIndex];
            this._setCurrentFrame(this.currentFrameTime);
            return;
        }
    }

    console.log("ERROR: ral.time.ListTimeSequence.prototype.setCurrentFrame() was passed an invalid frame: " + date);
};

/**
 * Set the first time sequence frame as the current frame.
 * @public
 */
ral.time.ListTimeSequence.prototype.setFirstFrameCurrent = function()
{
    this.currentFrameIndex = 0;
    this.currentFrameTime = this.frameTimes[this.currentFrameIndex];

    this._setCurrentFrame(this.currentFrameTime);
};

/**
 * Set the last time sequence frame as the current frame.
 * @public
 */
ral.time.ListTimeSequence.prototype.setLastFrameCurrent = function()
{
    this.currentFrameIndex = this.frameTimes.length - 1;
    this.currentFrameTime = this.frameTimes[this.currentFrameIndex];

    this._setCurrentFrame(this.currentFrameTime);
};

ral.time.ListTimeSequence.prototype.setTimeSequenceFrames = function(dates)
{
    if ( Object.prototype.toString.call( dates ) !== '[object Array]' || dates.length < 1 ) {
        console.log("ERROR: ral.time.ListTimeSequence setTimeSequenceFrames() called with invalid frameTimes array.");
    }

    this.frameTimes   = dates;

    // Pick the closest new frame to the previously-visible frame
    var prevCurrentFrame = this.currentFrameTime || this.frameTimes[0];
    var closestFrame = this.frameTimes[0];
    var closestFrameIdx = this.currentFrameIndex;
    for (var j = 0; j < dates.length; j++) {
        var thisDate = dates[j];
        if ( thisDate.getTime() <= prevCurrentFrame.getTime() ) {
            closestFrame = thisDate;
            closestFrameIdx = j;
        }
    }

    this.currentFrameIndex = closestFrameIdx;
    this.currentFrameTime = this.frameTimes[this.currentFrameIndex];
    this.currentFrame = this.currentFrameTime;

    this.fireSequenceChangedEvent();





    //   TODO: Is this correct? Change the frame without notifying?


    // The following code resulted in a *SECOND* animation thread running consecutively, due to
    //     the fact that it results in a frameChanged() notification outside of the normal animation loop.

    // // Only call _setCurrentFrame if playing, because it notifies the animation controller.
    // if ( this.getIsPlaying() ) {
        // this._setCurrentFrame(this.currentFrameTime);
    // }
    // else {
        // // Reset the current frame manually, without notifying.
        // //   TODO: Perhaps perform this action with a method on the superclass, since it's superclass data
        // this.currentFrameTime = this.currentFrameTime;
    // }
};

ral.time.ListTimeSequence.prototype.getTimeSequenceFrames = function()
{
    return this.frameTimes;
};

/**
 * Determine whether the current frame is the first frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is first in the time sequence.
 */
ral.time.ListTimeSequence.prototype.isCurrentFrameFirst = function() {
    return (this.currentFrameIndex == 0);
};

/**
 * Determine whether the current frame is the last frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is last in the time sequence.
 */
ral.time.ListTimeSequence.prototype.isCurrentFrameLast = function() {
    return (this.currentFrameIndex == (this.frameTimes.length - 1));
};


/**
 * Get the first time sequence frame.
 * @public
 *
 * @return {Date} The date of the first frame in the sequence.
 */
ral.time.ListTimeSequence.prototype.getFirstFrame = function()
{
  return this.frameTimes[0];
};

/**
 * Get the last time sequence frame.
 * @public
 *
 * @return {Date} The date of the last frame in the sequence.
 */
ral.time.ListTimeSequence.prototype.getLastFrame = function()
{
  return this.frameTimes[this.frameTimes.length - 1];
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Manage a sequence of times, represented by start date, end date, and interval.
 * @constructor
 * @extends ral.time.TimeSequenceModel
 * @memberof ral.time
 *
 * @param {Object} options The options to use to configure the TimeSelector
 * @param {string} mode (optional) Must be either "fixed" or "real-time", defaults to "fixed"
 * @param {date|number} options.minTime (required) The earliest time that is allowed to be selected; or if number, the number of ms before "now"
 * @param {date|number} options.maxTime (required) The latest time that is allowed to be selected; or if number, the number of ms after "now"
 * @param {number} options.updateInterval (optional) Used only in "real-time" mode, updates the time selector's range every X milliseconds, defaults to 60000
 * @param {number} options.intervalMs (required) The time sequence interval, or step size
 * @param {number} options.roundMs (required) Round the selected time to the nearest number in milliseconds (e.g., 300000
 *     to round to nearest 5 minute interval.  Hint: use 1 or undefined for no rounding)
 */

ral.time.RangeIntervalTimeSequence = function( options )
{
    ral.time.TimeSequenceModel.call( this, options );

    /* save required parameters */
    this.minTime    = options.minTime;
    this.maxTime    = options.maxTime;
    this.intervalMs = options.intervalMs;
    this.roundMs    = options.roundMs;

    /* set default values on optional parameters */
    this.mode           = "fixed";
    this.updateInterval = 60000;

    /* save the optional parameters if provided */
    if( "mode" in options ) this.mode = options.mode;
    if( "updateInterval" in options ) this.updateInterval = options.updateInterval;

    /* if real-time mode was set, start updating */
    if( this.mode == "real-time" )
    {
        this.updateForRealTime();
    }

    console.log("Finished ral.time.RangeIntervalTimeSequence constructor.");
};

/**
 * Inherit from the TimeSequenceModel class...
 */
ral.time.RangeIntervalTimeSequence.prototype = Object.create( ral.time.TimeSequenceModel.prototype );

/**
 * Step forward one frame. Wraps to the beginning of the time range when at the end.
 * @public
 */
ral.time.RangeIntervalTimeSequence.prototype.stepForward = function()
{
    var time  = this.getCurrentFrame();
    var time2 = new Date( time.getTime() + this.intervalMs );
    var range = this.getTimeRange();

    if ( time2 > range.maxTime )
    {
        time2 = range.minTime;
    }

    this._setCurrentFrame( time2 );
};

/**
 * Step forward one frame. Wraps to the end of the time range when at the beginning.
 * @public
 */
ral.time.RangeIntervalTimeSequence.prototype.stepBackward = function()
{
    var time  = this.getCurrentFrame();
    var time2 = new Date( time.getTime() - this.intervalMs );
    var range = this.getTimeRange();

    if ( time2 < range.minTime )
    {
        time2 = range.maxTime;
    }

    this._setCurrentFrame( time2 );
};

/**
 * Verify the passed-in frame is a valid frame.
 * @public
 *
 * @param {date} date The frame to test as a valid frame.
 */
ral.time.RangeIntervalTimeSequence.prototype.isValidFrame = function(date)
{
    /* check that the date is within range */
    if( this.minTime.getTime() > date.getTime() || date.getTime() > this.maxTime.getTime() )
    {
        return false;
    }

    /* check that the time is rounded to the nearest provided ms */
    if( date.getTime() % this.roundMs == 0 )
    {
        return true;
    }
    else {
        return false;
    }
};

/**
 * Verify the passed-in frame is valid, and set it as current. If the frame is not valid, return without doing anything.
 * @public
 *
 * @param {date} date The frame to set as current, if it is a valid frame.
 */
ral.time.RangeIntervalTimeSequence.prototype.setCurrentFrame = function(date)
{
    if ( this.isValidFrame(date) )
    {
        // Set the selected frame to the desired time.
        this._setCurrentFrame(date);
    }
    else {
        // Set the selected frame to the nearest frame to the desired time.
        // Be sure to take into account that operations are in UTC, so need to adjust for the current timezone offset
        var rounded = new Date( Math.round( (date.getTime() - date.getTimezoneOffset()*60000) / this.roundMs ) * this.roundMs
            + date.getTimezoneOffset()*60000);
        this._setCurrentFrame(rounded);
    }
};

/**
 * Set the first time sequence frame as the current frame.
 * @public
 */
ral.time.RangeIntervalTimeSequence.prototype.setFirstFrameCurrent = function()
{
    var range = this.getTimeRange();
    this._setCurrentFrame( range.minTime );
};

/**
 * Set the last time sequence frame as the current frame.
 * @public
 */
ral.time.RangeIntervalTimeSequence.prototype.setLastFrameCurrent = function()
{
    var range = this.getTimeRange();
    this._setCurrentFrame( range.maxTime );
};

ral.time.RangeIntervalTimeSequence.prototype.getTimeSequenceFrames = function()
{
    // TODO: IMPLEMENT THIS!!!
};

/**
 * Determine whether the current frame is the first frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is first in the time sequence.
 */
ral.time.RangeIntervalTimeSequence.prototype.isCurrentFrameFirst = function() {
     return ( this.getCurrentFrame().getTime() == this.minTime.getTime() );
};

/**
 * Determine whether the current frame is the last frame in the time sequence
 * @public
 *
 * @return {boolean} Whether the current frame is last in the time sequence.
 */
ral.time.RangeIntervalTimeSequence.prototype.isCurrentFrameLast = function() {
   return ( this.getCurrentFrame().getTime() == this.maxTime.getTime() );
};

/**
 * Set a new interval for this sequence
 * @public
 *
 * @param {Number} newInterval The new interval. in milliseconds
 */
ral.time.RangeIntervalTimeSequence.prototype.setIntervalMs = function( newInterval )
{
  this.intervalMs = newInterval;
}

//
// ============================================================================
// Methods not part of the TimeSequenceModel interface -- impl-specific methods.
// ============================================================================
//

/**
 * Take a date object and return a new date rounded to the nearest time that is evenly divisible by 'roundMs' parameter
 * @private
 *
 * @param {date} dateObj round the value of this date object, but return a new object and leave it unmodified
 */
ral.time.RangeIntervalTimeSequence.prototype.roundTime = function( dateObj )
{
    // If round is not set, then ignore
    if( ! this.roundMS ) return dateObj;

    // Pull out some params for easy access
    var min   = this.minTime.getTime();
    var time  = dateObj.getTime();
    var round = this.roundMS;
    var max   = this.maxTime.getTime();

    // Round the value
    var rounded = Math.round( time / round ) * round;

    // Make sure that the rounded time is not greater than max
    while( rounded > max )
    {
        rounded -= round;
    }

    return new Date( rounded );
};

/**
 * Set the time range to define the range of allowable selected times and update the UI
 * @public
 *
 * @param {date} minTime The minimum time that may be selected
 * @param {date} maxTime The maximum time that may be selected
 */
ral.time.RangeIntervalTimeSequence.prototype.setTimeRange = function( minTime, maxTime )
{
    // If setting the same time range, do nothing
    if ( this.mode == "fixed" && this.minTime.getTime() == minTime.getTime() && this.maxTime.getTime() == maxTime.getTime() )
    {
        return;
    }

    this.minTime = new Date( minTime );
    this.maxTime = new Date( maxTime );

    this.fireSequenceChangedEvent();
};

/**
 * Get the current time range for the TimeSequence
 * @public
 *
 * @returns {object} Contains object.minTime and object.maxTime
 */
ral.time.RangeIntervalTimeSequence.prototype.getTimeRange = function()
{
    return { minTime: new Date( this.minTime ), maxTime: new Date( this.maxTime ) };
};

/**
 * Get the first time sequence frame.
 * @public
 *
 * @return {Date} The date of the first frame in the sequence.
 */
ral.time.RangeIntervalTimeSequence.prototype.getFirstFrame = function()
{
  return this.minTime;
};

/**
 * Get the last time sequence frame.
 * @public
 *
 * @return {Date} The date of the last frame in the sequence.
 */
ral.time.RangeIntervalTimeSequence.prototype.getLastFrame = function()
{
  return this.maxTime;
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Manage a sequence of times, represented by start date, end date, and interval.
 * @constructor
 * @memberof ral.time
 * @extends ral.time.TimeSequenceModel
 *
 * @param {Object} options The options to use to configure the TimeSequence
 * @param {date|number} options.msBefore (required) The number of ms before "now"
 * @param {date|number} options.msAfter (required) The number of ms after "now"
 * @param {number} options.updateInterval (optional) Updates the time selector's range every X milliseconds, defaults to 60 secs
 */

ral.time.RealTimeRangeIntervalTimeSequence = function( options )
{
    ral.time.TimeSequenceModel.call( this, options );

    /* save required parameters */
    this.msBefore   = options.msBefore;
    this.msAfter    = options.msAfter;

    /* set default values on optional parameters */
    this.updateInterval = 60000;

    /* save the optional parameters if provided */
    if( "updateInterval" in options ) this.updateInterval = options.updateInterval;

    /* set the min and max time */
    options.minTime = new Date( new Date().getTime() + this.msBefore );
    options.maxTime = new Date( new Date().getTime() + this.msAfter );
    ral.time.RangeIntervalTimeSequence.call( this, options );

    /* start to update */
    this.start();
};

/**
 * Inherit from the TimeSequenceModel class...
 */
ral.time.RealTimeRangeIntervalTimeSequence.prototype = Object.create( ral.time.RangeIntervalTimeSequence.prototype );

/**
 * Start real-time updates on this TimeSequenceModel
 */
ral.time.RealTimeRangeIntervalTimeSequence.prototype.start = function()
{
    this.running = true;
    this.updateForRealTime();
};

/**
 * Stop real-time updates on this TimeSequenceModel
 */
ral.time.RealTimeRangeIntervalTimeSequence.prototype.stop = function()
{
    this.running = false;
};

ral.time.RealTimeRangeIntervalTimeSequence.prototype.updateForRealTime = function()
{
    if( this.running )
    {
        /* set the min and max time */
        var minTime = new Date( new Date().getTime() - this.msBefore );
        var maxTime = new Date( new Date().getTime() + this.msAfter );
        this.setTimeRange( minTime, maxTime );

        setTimeout( this.updateForRealTime.bind( this ), this.updateInterval );
    }
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Present an interface to the user to display the selected time.  This class should listen to a TimeSelector.
 * @constructor
 * @memberof ral.time
 * @requires module:jquery
 *
 * @param {Object} options The options to use to configure the TimeLabel
 * @param {string} options.target (required) The target div ID to use for the UI components - For default view, DIV must contain IMG elements with IDs: step_back, play_pause, and step_forward; AND additional inner DIV with ID: speed-control
 * @param {string} options.dateFormat (required) The date format for the label (see https://github.com/mbostock/d3/wiki/Time-Formatting for details)
 * @param {date} options.currentTime (optional) The currently selected time, defaults to 1970-JAN-01 00:00:00 UTC
 * @param {date} options.fontFamily (optional) The font family for the label (can also change in TimeLabel.css)
 * @param {date} options.fontSize (optional) The font size for the label (can also change in TimeLabel.css)
 * @param {date} options.fontColor (optional) The font color for the label (can also change in TimeLabel.css)
 * @param {boolean} options.useUTCTime (optional) If true, display in UTC time instead of the client localtime (default is true)
 */
ral.time.TimeLabel = function( options )
{
  /* get required parameters */
  this.target     = options.target;
  this.fontFamily = options.fontFamily;
  this.fontSize   = options.fontSize;
  this.fontColor  = options.fontColor;
  this.dateFormat = options.dateFormat;

  /* set default values for optional parameters */
  this.currentTime = new Date( 0 );
  this.useUTCTime = true;

  /* set values for optional parameters if provided */
  if( typeof( options.currentTime ) !== "undefined" ) this.currentTime = options.currentTime;
  if( typeof( options.useUTCTime ) !== "undefined" ) this.useUTCTime = options.useUTCTime;

  /* initialize the view */
  this.initView();

  /* set the initial time */
  this.frameChanged( this.currentTime );
};


/**
 * Empty out the div element
 * @private
 */
ral.time.TimeLabel.prototype.initView = function()
{
  jQuery( "#" + this.target ).empty();

  jQuery( "#" + this.target )
    .addClass( "TimeLabel" );

  if( typeof( this.fontFamily ) !== "undefined" )
    jQuery( "#" + this.target )
      .css( "font-family", this.fontFamily );

  if( typeof( this.fontSize ) !== "undefined" )
    jQuery( "#" + this.target )
      .css( "font-size", this.fontSize )

  if( typeof( this.fontColor ) !== "undefined" )
    jQuery( "#" + this.target )
      .css( "color", this.fontColor );
};


/**
 * Update the text in the target div - also allows this class to be a listener to a TimeSelector
 * @public
 *
 * @param {date} selectedTime the new time to display
 */
ral.time.TimeLabel.prototype.frameChanged = function( selectedTime )
{
  var timeStr = "";
  if ( this.useUTCTime === true )
  {
    timeStr = d3.time.format.utc( this.dateFormat )( selectedTime );
  }
  else
  {
    timeStr = d3.time.format( this.dateFormat )( selectedTime );
  }

  jQuery( "#" + this.target ).text( timeStr );
};

var ral = ral || {};
ral.time = ral.time || {};

/**
 * Present an interface to the user to view and modify the selected time.  Send time change notifications to all listeners.
 * @constructor
 * @memberof ral.time
 *
 * @param {Object} options - The options to use to configure the TimeSelector
 * @param {string} options.target (required) The target div ID to use for the UI components
 * @param {ral.time.TimeSequenceModel} options.timeSequence (required) The TimeSequenceModel to use for setting and events
 * @param {boolean} options.userConfigurable (optional) Tells this class if the user should have the option to configure the time selector or not.
 *                  Defaults to false. May be true or may contain configuration hints that will be passed to the TimeSelectorConfiguration.
 */
ral.time.TimeSelector = function( options )
{
  this.target       = options.target;
  this.timeSequence = options.timeSequence;

  /* set the default parameters */
  this.userConfigurable = false;

  /* set the optional parameters if provided */
  if( "userConfigurable" in options ) this.userConfigurable = options.userConfigurable;

  /* listen to the TimeSequenceModel */
  this.timeSequence.addListener( this );
};


/**
 * Initialize the UI components of the view
 * @abstract
 */
ral.time.TimeSelector.prototype.initView = function()
{
  console.log( "ral.time.TimeSelector does not have a default view and is abstract." );
};


/**
 * This is called after the selected time is changed to allow the UI to update and reflect the change
 * @abstract
 */
ral.time.TimeSelector.prototype.updateView = function()
{
  console.log( "ral.time.TimeSelector does not have a default view and is abstract." );
};


/**
 * Get the selected time
 * @public
 *
 * @returns {date} The selected time
 */
ral.time.TimeSelector.prototype.getSelectedTime = function()
{
  return this.timeSequence.getCurrentFrame();
};


/**
 * Set the currently selected time
 * @public
 *
 * @param {date} selectedTime Set the selected time to this new value
 */
ral.time.TimeSelector.prototype.setSelectedTime = function( selectedTime )
{
  /* if setting the same time, do nothing */
  if( this.getSelectedTime().getTime() == selectedTime.getTime() )
    return;

  /* set the time on the TimeSequenceModel */
  this.timeSequence.setCurrentFrame( selectedTime );

  /* update the view */
  this.updateView();
};


/**
 * Get the time range that is currently set
 * @public
 *
 * @returns {object} Contains object.minTime and object.maxTime
 */
ral.time.TimeSelector.prototype.getTimeRange = function()
{
  //TODO: Get min(max)Time from this.timeSequence
  return { minTime: new Date( this.minTime ), maxTime: new Date( this.maxTime ) };
};


/**
 * Set the time sequence model
 * @public
 *
 * @param {ral.time.TimeSequence} timeSequence The time sequence model to use for choosing times
 */
ral.time.TimeSelector.prototype.setTimeSequence = function( timeSequence )
{
  this.timeSequence = timeSequence;

  this.initView();
};


/**
 * Get the time sequence model
 * @public
 *
 * @returns {ral.time.TimeSequenceModel}
 */
ral.time.TimeSelector.prototype.getTimeSequence = function()
{
  return this.timeSequence;
};


/**
 * Listen to the TimeSequenceModel for time change events
 *
 * @param {date} selectedTime The new selected time frame
 */
ral.time.TimeSelector.prototype.frameChanged = function( selectedTime )
{
  /* update the view */
  this.updateView();
};


/**
 * Listen to the TimeSequenceModel for time range change events
 *
 * @param {ral.time.TimeSequenceModel} timeSequenceModel Unused since we already have a reference
 */
ral.time.TimeSelector.prototype.sequenceChanged = function( timeSequenceModel )
{
  /* initialize the view since the range has changed */
  this.initView();
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Implementation of a specific timeline view of a TimeSelector using the D3JS library.
 * @constructor
 * @memberof ral.time
 * @requires module:jquery
 *
 * @param options TODO:
 */
ral.time.TimeSelectorConfiguration = function( options )
{
  this.timeSelector = options.timeSelector;
  this.configModes = "realtime,fixed,event"; // Default to all modes

  /* replace defaults with any values provided */
  if( typeof( options.userConfigurable ) === "string"
          && options.userConfigurable.toLowerCase().trim() != 'true' ) {
    this.configModes = options.userConfigurable.toLowerCase().trim();
  }

  this.useUtc = ( 'useUtc' in options ) ? options.useUtc : false;
  this.dateFormat = ( 'dateFormat' in options ) ? options.dateFormat : "%Y/%m/%d %H:%M";
};


ral.time.TimeSelectorConfiguration.prototype.openUserConfiguration = function()
{
  this.dialog = jQuery( "<div>" ).dialog(
    {
      autoOpen: true,
      height: 500,
      width: 700,
      modal: true,
      title: "Time Selector Configuration",
      buttons:
      {
        "OK": this.closeUserConfiguration.bind( this ),
        Cancel: function() { this.dialog.dialog( "close" ); this.dialog.remove(); }.bind( this )
      },
      close: function() { this.dialog.dialog( "close" ); this.dialog.remove(); }.bind( this )
    }
  );

  if( this.configModes.indexOf("realtime") != -1 ) {
    jQuery( "<input>" )
            .addClass( "D3JSTimeSelector-RadioButton" )
            .attr( "id", "D3JSTimeSelector-RadioButton-realtime" )
            .attr( "type", "radio" )
            .attr( "name", "mode" )
            .attr( "value", "realtime" )
            .appendTo( this.dialog );
    jQuery( "<text>" )
            .text( "Real-time" )
            .appendTo( this.dialog );
  }

  if( this.configModes.indexOf("fixed") != -1 ) {
    jQuery( "<input>" )
            .addClass( "D3JSTimeSelector-RadioButton" )
            .attr( "id", "D3JSTimeSelector-RadioButton-fixed" )
            .attr( "type", "radio" )
            .attr( "name", "mode" )
            .attr( "value", "fixed" )
            .appendTo( this.dialog );
    jQuery( "<text>" )
            .text( "Fixed Period" )
            .appendTo( this.dialog );
  }

  if( this.configModes.indexOf("event") != -1 ) {
    jQuery( "<input>" )
            .addClass( "D3JSTimeSelector-RadioButton" )
            .attr( "id", "D3JSTimeSelector-RadioButton-event" )
            .attr( "type", "radio" )
            .attr( "name", "mode" )
            .attr( "value", "event" )
            .appendTo( this.dialog );
    jQuery( "<text>" )
            .text( "Event" )
            .appendTo( this.dialog );
  }

  jQuery( "<div>" )
    .addClass( "D3JSTimeSelector-ConfigDetails" )
    .attr( "id", "configDetails" )
    .appendTo( this.dialog );

  jQuery( "input[type=radio][name=mode]" )
    .change( this.radioChange.bind( this ) );

  if( typeof( this.mode ) === "undefined" )
  {
    var separatorIndex = this.configModes.indexOf( "," );
    this.mode = this.configModes.substring( 0, separatorIndex == -1 ? this.configModes.length : separatorIndex );
  }
  this.setMode( this.mode );
};


ral.time.TimeSelectorConfiguration.prototype.radioChange = function( event )
{
  if( typeof( event.target.value ) === "undefined" ) return;

  this.setMode( event.target.value );
};


ral.time.TimeSelectorConfiguration.prototype.setMode = function( mode )
{
  this.mode = mode;

  jQuery( "#D3JSTimeSelector-RadioButton-" + this.mode )
    .attr( "checked", "checked" );

  jQuery.ajax( "form-"+this.mode+".html", { dataType: "html", cache: false } )
    .done( this.initDetails.bind( this ) );
};


ral.time.TimeSelectorConfiguration.prototype.initDetails = function( html, success, responseObj )
{
  console.log( "loaded..." + success );

  if( success )
    jQuery( "#configDetails").html( html );

  jQuery( ".TimeSelectorConfiguration-DateChooser" )
    .datetimepicker();

  if( this.mode == "fixed" )
  {
    var startDate = this.timeSelector.getTimeSequence().getFirstFrame();
    var endDate   = this.timeSelector.getTimeSequence().getLastFrame();
    var startStr  = this.formatDate( startDate );
    var endStr    = this.formatDate( endDate );
    jQuery( "#startDate" ).val( startStr );
    jQuery( "#endDate" ).val( endStr );
  }
};


ral.time.TimeSelectorConfiguration.prototype.formatDate = function( date )
{
  if ( this.useUtc === true )
  {
    return d3.time.format.utc( this.dateFormat )( date );
  }
  else
  {
    return d3.time.format( this.dateFormat )( date );
  }
  //var y = date.getFullYear();
  //var m = ( "0" + ( date.getMonth() + 1 ) ).slice( -2 );
  //var d = ( "0" + date.getDate() ).slice( -2 );
  //var h = ( "0" + date.getHours() ).slice( -2 );
  //var i = ( "0" + date.getMinutes() ).slice( -2 );
  //
  //return y + "/" + m + "/" + d + " " + h + ":" + i;
};


ral.time.TimeSelectorConfiguration.prototype.closeUserConfiguration = function()
{
  if( this.mode == "realtime" )
  {
    this.updateRealTimeParams();
  }
  else if( this.mode == "fixed" )
  {
    this.updateFixedParams();
  }
  else if( this.mode == "event" )
  {
    this.updateEventParams();
  }

  this.dialog.dialog( "close" );
  this.dialog.remove();
};


ral.time.TimeSelectorConfiguration.prototype.updateFixedParams = function()
{
  var utcStr = ( this.useUtc ) ? " UTC" : "";
  var startDate = new Date( Date.parse( jQuery( "#startDate").val() + utcStr ) );

  var endDate   = new Date( Date.parse( jQuery( "#endDate").val() + utcStr ) );


  /* preserve settings from the old sequence model */
  var oldTSM = this.timeSelector.getTimeSequence();
  var timeSequenceModel = new ral.time.RangeIntervalTimeSequence(
    {
      minTime: startDate,
      maxTime: endDate,
      intervalMs: oldTSM.intervalMs,
      roundMs: oldTSM.roundMs
    }
  );
  timeSequenceModel.setCurrentFrame( startDate );

  /* transfer the listeners to the new time sequence model */
  this.timeSelector.setTimeSequence( timeSequenceModel );
  oldTSM.transferListenersInto( timeSequenceModel, true );

  /* fire a new event to update all listeners */
  timeSequenceModel.setCurrentFrame( startDate );
};


ral.time.TimeSelectorConfiguration.prototype.updateRealTimeParams = function()
{
  var unitsToMs = [];
  unitsToMs[ "d" ] = 86400000;
  unitsToMs[ "h" ] = 3600000;
  unitsToMs[ "m" ] = 60000;

  var reference = [];
  reference[ "b" ] = -1;
  reference[ "a" ] = 1;

  var startValue = jQuery( "#start-value" ).val();
  var startUnits = jQuery( "#start-units" ).val();
  var startRef   = jQuery( "#start-reference" ).val();
  var startRelMs = startValue * unitsToMs[ startUnits ] * reference[ startRef ] * -1;

  var endValue = jQuery( "#end-value" ).val();
  var endUnits = jQuery( "#end-units" ).val();
  var endRef   = jQuery( "#end-reference" ).val();
  var endRelMs = endValue * unitsToMs[ endUnits ] * reference[ endRef ];

  var selectValue = jQuery( "#select-value" ).val();
  var selectUnits = jQuery( "#select-units" ).val();
  var selectRef   = jQuery( "#select-reference" ).val();
  var selectRelMs = selectValue * unitsToMs[ selectUnits ] * reference[ selectRef ];

  var refreshValue = jQuery( "#refresh-value" ).val();
  var refreshUnits = jQuery( "#refresh-units" ).val();
  var refreshMs    = refreshValue * unitsToMs[ refreshUnits ];

  /* get the current/old/about-to-be-replaced TimeSequenceModel */
  var oldTSM = this.timeSelector.getTimeSequence();

  /* create the new TimeSequenceModel */
  var timeSequenceModel = new ral.time.RealTimeRangeIntervalTimeSequence(
    {
      msBefore      : startRelMs,
      msAfter       : endRelMs,
      updateInterval: refreshMs,
      intervalMs    : oldTSM.intervalMs,
      roundMs       : oldTSM.roundMs
    }
  );

  /* transfer the listeners to the new time sequence model */
  this.timeSelector.setTimeSequence( timeSequenceModel );
  oldTSM.transferListenersInto( timeSequenceModel, true );

  /* set the current time */
  timeSequenceModel.setCurrentFrame( new Date( new Date().getTime() + selectRelMs ) );
};

ral.time.TimeSelectorConfiguration.prototype.updateEventParams = function()
{
  var event = $("input[type='radio'][name='event']:checked").val();
  var startDate;
  var endDate;

  var toks = event.split("___");

  if (toks.length != 3) { return; }

  var startDate = new Date( toks[1].replace(" ", "T") + "+0000" );
  var endDate = new Date( toks[2].replace(" ", "T") + "+0000" );

  if ( isNaN( startDate.getTime() ) || isNaN( endDate.getTime() ) ) { return; }  

  /* get the current/old/about-to-be-replaced TimeSequenceModel */
  var oldTSM = this.timeSelector.getTimeSequence();

  /* create a new time sequence model with the right times */
  var timeSequenceModel = new ral.time.RangeIntervalTimeSequence(
    {
      minTime: startDate,
      maxTime: endDate,
      intervalMs: oldTSM.intervalMs,
      roundMs: oldTSM.roundMs,
      currentFrameTime: startDate
    }
  );

  /* transfer the listeners to the new time sequence model */
  this.timeSelector.setTimeSequence( timeSequenceModel );
  oldTSM.transferListenersInto( timeSequenceModel, true );

};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Implementation of a specific Calendar-based view of a TimeSelector using the datetimepicker JQueryUI extension.
 * @constructor
 * @extends ral.time.TimeSelector
 * @memberof ral.time
 * @requires module:jquery
 * @requires module:jquery-ui.datetimepicker
 *
 * @param {Object} options - The options to use to configure the CalendarTimeSelector (See ral.time.TimeSelector for additional parameters)
 * @param {number} options.interval - The interval (in minutes) between selectable times (default = 60)
 * @param {boolean} options.useUtc - Use UTC time instead of client local time (default = false);
 */
ral.time.CalendarTimeSelector = function( options )
{
  /* call the super constructor */
  ral.time.TimeSelector.call( this, options );

  /* set default values for optional parameters */
  this.interval = 60;
  this.useUtc = false;

  /* set optional parameters that were provided */
  if( options.interval !== "undefined" ) this.interval = options.interval;

  if( options.useUtc !== "undefined") this.useUtc = options.useUtc;

  this.listeners = [];

  /* initialize the view */
  this.initView();
};


/**
 * Inherit from the TimeSelector class
 */
ral.time.CalendarTimeSelector.prototype = Object.create( ral.time.TimeSelector.prototype );


/**
 * Create the date/time picker
 * @private
 */
ral.time.CalendarTimeSelector.prototype.initView = function()
{
  var date = new Date( this.getSelectedTime().getTime() + 1 );
  if ( this.useUtc === true )
  {
    var offset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date( this.getSelectedTime().getTime() + offset );
  }

  this.datetimepicker =
    jQuery( "#" + this.target )
      .datetimepicker(
        {
          format: "d.m.Y H:i",
          inline: true,
          step: this.interval,
          lang: "en",
          onChangeDateTime: this.calendarTimeChange.bind( this ),
          value: date
        }
      );
};


/**
 * Update the view with the currently selected time
 * @private
 */
ral.time.CalendarTimeSelector.prototype.updateView = function()
{
  console.log( "ral.time.CalendarTimeSelector is not capable of setting the date in the view." );
};


/**
 * Listener function to handle when the time was changed through the UI
 * @private
 *
 * @param {date} date The date object with the new time
 * @param {object} ui [not used]
 */
ral.time.CalendarTimeSelector.prototype.calendarTimeChange = function( date, ui )
{
  if ( this.useUtc === true )
  {
    var offset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date( date.getTime() - offset );
  }
  this.setSelectedTime( date );
  this.fireUserSelectedTimeChanged( date );
};

/**
 * Add a listener to this widget
 * @public
 *
 * @param {object} listener The listener to add
 */
ral.time.CalendarTimeSelector.prototype.addListener = function( listener )
{
  if( typeof( this.listeners ) === "undefined" )
    this.listeners = [];

  this.listeners[ this.listeners.length ] = listener;
}


/**
 * Remove a listener if it is found
 * @public
 *
 * @param {object} listener The listener object to remove
 */
ral.time.CalendarTimeSelector.prototype.removeListener = function( listener )
{
  if( typeof( this.listeners ) === "undefined" )
    return;

  /* find the listener */
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( listener == this.listeners[i] )
    {
      /* remove the listener */
      this.listeners.splice( i, 1 );
    }
  }
}

/**
 * Remove all listeners
 * @public
 */
ral.time.CalendarTimeSelector.prototype.removeAllListeners = function()
{
  this.listeners = [];
}

/**
 * Notify listeners that a new time was selected by the calendar widget
 * @param {date} date The date object with the new time
 * @private
 */
ral.time.CalendarTimeSelector.prototype.fireUserSelectedTimeChanged = function( date )
{
  /* call all of the listeners that implement the function: 'userSelectedTimeChanged' */
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].userSelectedTimeChanged ) != "function" )
      continue;

    this.listeners[i].userSelectedTimeChanged( date );
  }
}
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Implementation of a specific timeline view of a TimeSelector using the D3JS library.
 * @constructor
 * @extends ral.time.TimeSelector
 * @memberof ral.time
 * @requires module:jquery
 * @requires module:d3
 *
 * @param {Object} options - The options to use to configure the D3JSTimeSelector -- See ral.time.TimeSelector for additional parameters
 * @param {number} options.markerHeight (required) The height of the selection indicator in the UI
 * @param {number} options.markerWidth (required) The width of the selection indicator in the UI
 * @param {number} options.tickMarks (required) The desired number of tick marks on the timeline
 * @param {string} options.dateFormat (requried) How to display the date (see https://github.com/mbostock/d3/wiki/Time-Formatting for details)
 * @param {number} options.tickFormat (optional) Can be a formatting function for tick mark labels
 * @param {string} options.fontFamily (optional) Can also be set with CSS (see D3JSTimeSelector.css)
 * @param {string} options.fontSize (optional) Can also be set with CSS (see D3JSTimeSelector.css)
 * @param {string} options.fontColor (optional) Can also be set with CSS (see D3JSTimeSelector.css)
 * @param {string} options.selectorColor (optional) Can also be set with CSS (see D3JSTimeSelector.css)
 * @param {string} options.padding (optional) Can also be set with CSS (see D3JSTimeSelector.css)
 * @param {string} options.useUtc (optional) If true, force UTC time
 */
ral.time.D3JSTimeSelector = function( options )
{
  /* call the super constructor */
  ral.time.TimeSelector.call( this, options );

  /* get the vales for the required parameters */
  this.markerHeight = options.markerHeight;
  this.markerWidth  = options.markerWidth;
  this.tickMarks    = options.tickMarks;
  this.dateFormat   = options.dateFormat;

  /* set default values for optional parameters */
  this.tickFormat    = d3.time.format( this.dateFormat );
  this.fontFamily    = "avenir";
  this.fontSize      = "10pt";
  this.fontColor     = "#333333";
  this.selectorColor = "orange";
  this.padding       = 10;
  this.useUtc        = false;

  /* replace defaults with any values provided */
  if( typeof( options.fontFamily ) !== "undefined" ) this.fontFamily = options.fontFamily;
  if( typeof( options.fontSize ) !== "undefined" ) this.fontSize = options.fontSize;
  if( typeof( options.fontColor ) !== "undefined" ) this.fontColor = options.fontColor;
  if( typeof( options.selectorColor ) !== "undefined" ) this.selectorColor = options.selectorColor;
  if( typeof( options.padding ) !== "undefined" ) this.padding = options.padding;
  if( typeof( options.useUtc ) !== "undefined" ) this.useUtc = options.useUtc;

  this.tickFormat    = ( this.useUtc ) ? d3.time.format.utc( this.dateFormat ) : d3.time.format( this.dateFormat );
  if( typeof( options.tickFormat ) !== "undefined" ) this.tickFormat = options.tickFormat;
  /* create the view */
  this.initView();
};


/**
 * Inherit from the TimeSelector class
 */
ral.time.D3JSTimeSelector.prototype = Object.create( ral.time.TimeSelector.prototype );


/**
 * A configure gear icon
 */
ral.time.D3JSTimeSelector.CONFIGURE_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAaCAYAAABCfffNAAAD8GlDQ1BJQ0MgUHJvZmlsZQAAOI2NVd1v21QUP4lvXKQWP6Cxjg4Vi69VU1u5GxqtxgZJk6XpQhq5zdgqpMl1bhpT1za2021Vn/YCbwz4A4CyBx6QeEIaDMT2su0BtElTQRXVJKQ9dNpAaJP2gqpwrq9Tu13GuJGvfznndz7v0TVAx1ea45hJGWDe8l01n5GPn5iWO1YhCc9BJ/RAp6Z7TrpcLgIuxoVH1sNfIcHeNwfa6/9zdVappwMknkJsVz19HvFpgJSpO64PIN5G+fAp30Hc8TziHS4miFhheJbjLMMzHB8POFPqKGKWi6TXtSriJcT9MzH5bAzzHIK1I08t6hq6zHpRdu2aYdJYuk9Q/881bzZa8Xrx6fLmJo/iu4/VXnfH1BB/rmu5ScQvI77m+BkmfxXxvcZcJY14L0DymZp7pML5yTcW61PvIN6JuGr4halQvmjNlCa4bXJ5zj6qhpxrujeKPYMXEd+q00KR5yNAlWZzrF+Ie+uNsdC/MO4tTOZafhbroyXuR3Df08bLiHsQf+ja6gTPWVimZl7l/oUrjl8OcxDWLbNU5D6JRL2gxkDu16fGuC054OMhclsyXTOOFEL+kmMGs4i5kfNuQ62EnBuam8tzP+Q+tSqhz9SuqpZlvR1EfBiOJTSgYMMM7jpYsAEyqJCHDL4dcFFTAwNMlFDUUpQYiadhDmXteeWAw3HEmA2s15k1RmnP4RHuhBybdBOF7MfnICmSQ2SYjIBM3iRvkcMki9IRcnDTthyLz2Ld2fTzPjTQK+Mdg8y5nkZfFO+se9LQr3/09xZr+5GcaSufeAfAww60mAPx+q8u/bAr8rFCLrx7s+vqEkw8qb+p26n11Aruq6m1iJH6PbWGv1VIY25mkNE8PkaQhxfLIF7DZXx80HD/A3l2jLclYs061xNpWCfoB6WHJTjbH0mV35Q/lRXlC+W8cndbl9t2SfhU+Fb4UfhO+F74GWThknBZ+Em4InwjXIyd1ePnY/Psg3pb1TJNu15TMKWMtFt6ScpKL0ivSMXIn9QtDUlj0h7U7N48t3i8eC0GnMC91dX2sTivgloDTgUVeEGHLTizbf5Da9JLhkhh29QOs1luMcScmBXTIIt7xRFxSBxnuJWfuAd1I7jntkyd/pgKaIwVr3MgmDo2q8x6IdB5QH162mcX7ajtnHGN2bov71OU1+U0fqqoXLD0wX5ZM005UHmySz3qLtDqILDvIL+iH6jB9y2x83ok898GOPQX3lk3Itl0A+BrD6D7tUjWh3fis58BXDigN9yF8M5PJH4B8Gr79/F/XRm8m241mw/wvur4BGDj42bzn+Vmc+NL9L8GcMn8F1kAcXgSteGGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAABdlJREFUSA2VVn1IVWcYP+d+3+u9fkZYq+69u+lSSzNrSckyvcWkrFkaGyv7gtoHyRRCusSwGEEIIv0TDdn6Y25RZkEwFhZug/7QaTC3uRhMxka5lt3Y0nL33HPe/X7vPfdmRht74Zz3fZ/3+X5/z3OOovzHaGtrsyRZhBBpQ0NDnlu3bvlm0NTk+nnzvzI0NDRYL1y4oHd0dLx+7fr1ZsMwXrgfjSrpXq8V6wm/33/x7NmzbVBOPeJ5RmbT1crKSlvSe6xdZKiqqjqNiUqeetZVVkYRnZc8bUIwYhWyNjpH2jMjqXjGgS25rm9oGMJaZGVnx9xpaXp6RkYce6No6dLpy5cvLzT5Zit+ej/DgGPnzp2vIe/zKNjd3f3Krt27+/3BICMwXB6PYXM6hd3lEorNZqR5vaI6HB5tjUQaTUPK4cOHNyO9K829NKQiXBVD5rNm06bem8PDdSXFxfcUVe178ODBjm8GBxmRgAHyKhbwSouQi8XjQtE0NbR4sbKyrKwf/J6fx8ZWL1yw4HFjY+PSffv2jcnUlZWV2Wn14MGDLf5AgPIxKk0+Trdbg8cGZ9CYJp7pqsMh6R6vl7QknWd/k2fb9u2DmJ8MpCVreWlpFBSR5vPpUKrDcw35Nzx4QNd59mIoJAoLC0VhUZFQrFbpCIyQV4CX/HFfero0lJefL44fP/4OrcicQfGRwYGBV6c1jd7aNF1XdcOw2K1W5dHUlIoI1ZWrVl0pKy19f+vWrR2BQOCif9GiqMvtXvXL2JjF7nDoMU2zGUAYdCg+n08Zv3PHkpmVFfpxdPRDGlLq6uq+w8S8x3ipvFxGAZq+pKBAHD16tJV8s8fnV69WQVamx5eRoVsdDoE0iozMTMqK8vJy0dXV9bKUO3Xq1LrNtbX3eOBwuXSH240btmiIULx76NDHpnLbgQMH7LxI1gJoTtLb29s3vbRkCVMk0ef1+WjAQOSiubk5Qh4O2TauDQzkBILBX7HnvciLpCd9fX3LyGQq5lIOohILKQsHB7AWuA8Jjnnz54tjx469neAEE5jphRKcMyeem5sr2wxhShru5adwOPwD1zDCy08NE/aSf+7cuaNOj0fRCGlEkZ2drUzHYpNkPnPmjF16wk0oFPrzMQbXUC6NPEpspSKQJY3nM4Y8m5ycFHAsSVbR1xSr3T5Fwvj4uIqzxOHprq61OMzlAWgSdVoslt/a2ppPGiJxcE4OM10yutu3b694PDWl2KxWOq1OTEwof0WjK8gLOdadonR2djavraigp0SYbqJL3sv2+vorkgmvoqIiBxuoWcCyt31w4sR7BUAgjjXWC+pGopJgAFB6zp8/n3AuvHHjMA0AGTEr4EsjFKAgi+pIJHIJnruxf2qgT70RysuTEAbkUxBGA5UIKy4pEQigWAq1tLQ0AVlUGgOEpRHO8Io0GRGK8Pf9+/e3B4PB2r179zavX7/+CxO6rCmd9SUbp90u0DGIMlG3bduXmBMDXuagqO5jJ7JzcuKIgopjQAxbTMoQ6yYjK4s8pPHRmR7Q6bnG2kIh8p60ZcXLRCQSqcFaUZhjzidPnty1OC9PCmIriHXOeGJUhFTqVIKHDmjwWpP5t9ul1zRuRi7l9uzZcwl8HCncEU16U1PT6ZGRkbfQk74qLCj4emh4eNfwzZuBqYcPFXRhgd5EKPIlIRnTdYH+ppaWlCjh6uqPxtDHvh0ZebNk+fLxz7q7i4DSSaArUSbJBdKW1tPTs5rmOfr7+zPrd+xoQ+7l5SKNiY+W08nWT4+N2i1bLvb29lZIAbzOnTuXf+PGDT/3z3yGk4aSzGBI1QXaxlXQmY5pNEG2dGLfwOdhcsafC/ll6qljtj7S5GCBAddMnUxH0lD1hg2d6ZmZMteEuAlvsaai4jfI8GdDfmGpxGygqU5CWsoyN2Y/SvUoFF8cv0TKxpqaT9GPHH/cvbvg+9HR+JycHMua8nKL0+n8BDLTCdFEv+MvFGX+13hu2E+0yKifbJ9d/QMiCIfRWUWjWwAAAABJRU5ErkJggg==";

/**
 * Set the desired number of tick marks on the timeline
 * @param tickMarks
 */
ral.time.D3JSTimeSelector.prototype.setTickMarks = function( tickMarks )
{
  this.tickMarks = tickMarks;
}

/**
 * Get the desired number of tick marks on the timeline
 */
ral.time.D3JSTimeSelector.prototype.getTickMarks = function( )
{
  return this.tickMarks;
}

/**
 * Draw the initial time slider
 */
ral.time.D3JSTimeSelector.prototype.initView = function()
{
  /* get the min/max time */
  this.minTime = this.timeSequence.getFirstFrame();
  this.maxTime = this.timeSequence.getLastFrame();

  /* clear the plot */
  this.clearPlot();

  var div     = d3.select( "#" + this.target ).classed( "D3JSTimeSelector", true );
  var element = d3.select( "#" + this.target )[0][0];
  var width   = element.clientWidth - this.getNumPixels(element.style.paddingLeft) - this.getNumPixels(element.style.paddingRight);
  var height  = element.clientHeight - this.getNumPixels(element.style.paddingTop) - this.getNumPixels(element.style.paddingBottom);

  var timeLineWidth = width - this.padding - this.padding;

  if ( this.useUtc === true ) {
    this.timeScale = d3.time.scale.utc();
  } else {
    this.timeScale = d3.time.scale();
  }
  this.timeScale.range([0, timeLineWidth])
        .domain([this.minTime, this.maxTime]);

  this.timeAxis = d3.svg.axis()
      .scale( this.timeScale )
      .ticks( this.tickMarks )
      .tickFormat( this.tickFormat )
      .orient( "bottom" );

  /* clean up */
  this.clearPlot();

  this.timeLineTranslateX = this.getNumPixels(element.style.paddingLeft) + this.padding;
  this.timeLineTranslateY = this.getNumPixels(element.style.paddingTop) + this.padding;

  this.timeLineSVG = div.append( "svg" )
    .attr( "width", timeLineWidth )
    .attr( "height", height )
    .on( "click", this.mouseClicked.bind( this ) );

  this.timeLineSVG
    .append( "g" )
      .attr( "transform", "translate( 0," + (this.timeLineTranslateY+3) + " )" )
      .append( "g" )
        .attr( "class", "x axis" )
        .style( "font-size", this.fontSize )
        .style( "fill", this.fontColor )
        .style( "font-family", this.fontFamily )
        .call( this.timeAxis );

  this.timeMarker = this.timeLineSVG.append( "rect" )
    .attr( "width", this.markerWidth )
    .attr( "height", this.markerHeight )
    .attr( "transform", "translate( " + ( this.timeLineTranslateX - (this.markerWidth/2) )  + "," + ( this.timeLineTranslateY ) + " )" )
    .style( "fill", this.selectorColor );

  this.timeMarkerLine = this.timeLineSVG.append( "line" )
      .attr( "x1", 0 )
      .attr( "y1", 0 )
      .attr( "x2", 0 )
      .attr( "y2", this.markerHeight )
      .style("stroke", "black")
      .style("stroke-width", 1);

  if( this.userConfigurable )
  {
    this.configurator = new ral.time.TimeSelectorConfiguration( {
      timeSelector: this,
      userConfigurable: this.userConfigurable,
      useUtc: this.useUtc }
    );

    jQuery( "<img>" )
      .attr( "src", ral.time.D3JSTimeSelector.CONFIGURE_ICON )
      .css( "position", "absolute" )
      .css( "left", "95%" )
      .css( "top", "60%" )
      .click( this.configurator.openUserConfiguration.bind( this.configurator ) )
      .appendTo( "#" + this.target );
  }

  this.drawRangeBars();

  this.updateView();
};

/**
 * Utility method to convert css length string to pixel units
 */
ral.time.D3JSTimeSelector.prototype.getNumPixels = function( string )
{
  if( string.trim().length == 0 ) {
    return 0;
  }
  if( string.indexOf("px") == -1 ) {
    console.log("D3JSTimeSelector cannot have CSS \"padding\" specified in units other than \"px\"!");
  }

  return parseInt( string.replace("px","") );
}

/**
 * Event handler for a mouse click on the timeline SVG element
 * @private
 */
ral.time.D3JSTimeSelector.prototype.mouseClicked = function()
{
  /* get the mouse click position relative to the time line SVG element (immediate container) */
  var mouse = d3.mouse( this.timeLineSVG[0][0] );

  /* get the selected time */
  var selectedTime = this.timeScale.invert( mouse[0] );
  this.setSelectedTime( selectedTime );
};


/**
 * Move the time selector to match the selected time
 * @private
 */
ral.time.D3JSTimeSelector.prototype.updateView = function()
{
  /* move the selector box to this x,y */
  var x = this.timeScale( this.timeSequence.getCurrentFrame() );
  var y = this.timeLineTranslateY - this.markerHeight;
  this.timeMarker.attr( "transform", "translate( " + (x-(this.markerWidth/2)) + "," + y + ")" );
  this.timeMarkerLine.attr( "transform", "translate( " + x + "," + y + ")" );
};


/**
 * Remove everything from the slider div
 * @private
 */
ral.time.D3JSTimeSelector.prototype.clearPlot = function()
{
  d3.select( "#" + this.target )
    .selectAll( "*" )
    .remove();

  d3.select( "#"+this.target )
    .selectAll( "svg" )
    .data( [] )
      .exit()
      .remove();
};


ral.time.D3JSTimeSelector.prototype.addRangeBar = function( start, end, color )
{
  if( typeof( this.rangeBars ) === "undefined" )
    this.rangeBars = [];

  this.rangeBars[ this.rangeBars.length ] = [ start, end, color ];
  this.drawRangeBar( start, end, color );
};


ral.time.D3JSTimeSelector.prototype.drawRangeBars = function()
{
  if( typeof( this.rangeBars ) === "undefined" )
    return;

  for( var i = 0; i < this.rangeBars.length; i++ )
  {
    this.drawRangeBar( this.rangeBars[i][0], this.rangeBars[i][1], this.rangeBars[i][2], i );
  }
};


ral.time.D3JSTimeSelector.prototype.drawRangeBar = function( start, end, color, index )
{
  var x1 = this.timeScale( start ) + 20;
  var x2 = this.timeScale( end ) + 20;
  var height = 3;

  this.rangeBarAtmos = this.timeLineSVG.append( "rect" )
    .attr( "width", x2-x1 )
    .attr( "height", 3 )
    .attr( "transform", "translate( " + x1  + "," + (index*3) + " )" )
    .style( "fill", color );
};


ral.time.D3JSTimeSelector.prototype.domainChanged = function( domain )
{
  this.domain = domain.id;
  this.updateRangeBars();
};


ral.time.D3JSTimeSelector.prototype.rcpChanged = function( rcp )
{
  this.rcp = rcp.id;
  this.updateRangeBars();
};

ral.time.D3JSTimeSelector.prototype.anomalyChanged = function( anom )
{
  this.anomaly = anom.state;
  this.updateRangeBars();
};

ral.time.D3JSTimeSelector.prototype.updateRangeBars = function()
{
  var oceanColor = "#ccccff";
  var skyColor   = "#88ff88";

  if( this.anomaly )
  {
    if( this.rcp == "20THC" && ( this.domain == "d01" || this.domain == "d02" ) )
      this.rangeBars = [[Date.parse( "1986-01-01T00:00:00+0000"), Date.parse( "2005-12-31T23:59:59+0000"), skyColor ],[Date.parse( "2000-01-01T00:00:00+0000"), Date.parse( "2019-12-31T23:59:59+0000"), oceanColor ] ];
    else if( this.rcp == "20THC" && this.domain == "d03" )
      this.rangeBars = [ [Date.parse( "2000-01-01T00:00:00+0000"), Date.parse( "2019-12-31T23:59:59+0000"), oceanColor ] ];
    else if( ( this.rcp == "RCP45" || this.rcp == "RCP85" ) && ( this.domain == "d01" || this.domain == "d02" ) )
      this.rangeBars = [ [Date.parse( "2060-01-01T00:00:00+0000"), Date.parse( "2079-12-31T23:59:59+0000"), skyColor ],[Date.parse( "2080-01-01T00:00:00+0000"), Date.parse( "2099-12-31T23:59:59+0000"), oceanColor ] ];
    else if( this.domain == "d03" && ( this.rcp == "RCP45" || this.rcp == "RCP85" ) )
      this.rangeBars = [ [Date.parse( "2080-01-01T00:00:00+0000"), Date.parse( "2099-12-31T23:59:59+0000"), oceanColor ] ];
    else
      this.rangeBars = [];
  }
  else
  {
    if( this.rcp == "20THC" && ( this.domain == "d01" || this.domain == "d02" ) )
      this.rangeBars = [[Date.parse( "1986-01-01T00:00:00+0000"), Date.parse( "2005-12-31T23:59:59+0000"), skyColor ],[Date.parse( "2000-01-01T00:00:00+0000"), Date.parse( "2019-12-31T23:59:59+0000"), oceanColor ] ];
    else if( this.rcp == "20THC" && this.domain == "d03" )
      this.rangeBars = [ [Date.parse( "1990-01-01T00:00:00+0000"), Date.parse( "1999-12-31T23:59:59+0000"), skyColor ],[Date.parse( "2000-01-01T00:00:00+0000"), Date.parse( "2019-12-31T23:59:59+0000"), oceanColor ] ];
    else if( ( this.rcp == "RCP45" || this.rcp == "RCP85" ) && ( this.domain == "d01" || this.domain == "d02" ) )
      this.rangeBars = [ [Date.parse( "2060-01-01T00:00:00+0000"), Date.parse( "2079-12-31T23:59:59+0000"), skyColor ],[Date.parse( "2080-01-01T00:00:00+0000"), Date.parse( "2099-12-31T23:59:59+0000"), oceanColor ] ];
    else if( this.domain == "d03" && ( this.rcp == "RCP45" || this.rcp == "RCP85" ) )
      this.rangeBars = [ [Date.parse( "2080-01-01T00:00:00+0000"), Date.parse( "2099-12-31T23:59:59+0000"), oceanColor ] ];
    else
      this.rangeBars = [];
  }
  this.initView();
};
var ral = ral || {};
ral.time = ral.time || {};

/**
 * Present an interface to the user to allow the user to control animations.  This basic
 * implementation plays from current position, to end of range in TimeSelector, and jumps
 * back to the beginning of the range in TimeSelector; provides play/pause and step buttons;
 * and provides an animation speed slider.  This class can be extended to provide different
 * play modes; and additional controls and user configurations.
 * @constructor
 * @extends ral.time.AnimationController
 * @memberof ral.time
 * @requires module:jquery
 *
 * @param {Object} options See AnimationController for additional options
 * @param {string} options.target (required) The div id to use for the UI
 * @param {number} options.slowest (optional) The longest possible frame delay in milliseconds on the slider
 * @param {number} options.fastest (optional) The shortest possible frame delay in milliseconds on the slider
 * @param {string} options.playIconUrl (optional) The URL the the play button icon
 * @param {string} options.pauseIconUrl (optional) The URL the the pause button icon
 * @param {string} options.stepBackIconUrl (optional) The URL the the back button icon
 * @param {string} options.stepForwardIconUrl (optional) The URL the the next button icon
 */
ral.time.BasicAnimationController = function( options )
{
  /* set the values for required parameters */
  this.target = options.target;

  /* set the default values on optional parameters */
  this.slowest            = 1000;
  this.fastest            = 150;
  this.stepBackIconUrl    = ral.time.BasicAnimationController.stepBackIconUrl;
  this.playIconUrl        = ral.time.BasicAnimationController.playIconUrl;
  this.pauseIconUrl       = ral.time.BasicAnimationController.pauseIconUrl;
  this.stepForwardIconUrl = ral.time.BasicAnimationController.stepForwardIconUrl;

  /* override default values on optional parameters if they were provided */
  if( typeof( options.slowest ) !== "undefined" ) this.slowest = options.slowest;
  if( typeof( options.fastest ) !== "undefined" ) this.fastest = options.fastest;
  if( typeof( options.stepBackIconUrl ) !== "undefined" ) this.stepBackIconUrl = options.stepBackIconUrl;
  if( typeof( options.playIconUrl ) !== "undefined" ) this.playIconUrl = options.playIconUrl;
  if( typeof( options.pauseIconUrl ) !== "undefined" ) this.pauseIconUrl = options.pauseIconUrl;
  if( typeof( options.stepForwardIconUrl ) !== "undefined" ) this.stepForwardIconUrl = options.stepForwardIconUrl;

  /* initialize other parameters */
  this.playing = false;

  /* call the super constructor */
  ral.time.AnimationController.call( this, options );

  /* initialize the view */
  this.initView();

  /* add this as a listener to the TimeSequenceModel */
  this.getTimeSequence().addListener( this );
};


/**
 * Inherit from the AnimationController class
 */
ral.time.BasicAnimationController.prototype = Object.create( ral.time.AnimationController.prototype );



/**
 * Default "step backward" icon in BASE64
 */
ral.time.BasicAnimationController.stepBackIconUrl = "data:image/png;base64,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";


/**
 * Default "step forward" icon in BASE64
 */
ral.time.BasicAnimationController.stepForwardIconUrl = "data:image/png;base64,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";


/**
 * Default "play" icon in BASE64
 */
ral.time.BasicAnimationController.playIconUrl = "data:image/png;base64,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";


/**
 * Default "pause" icon in BASE64
 */
ral.time.BasicAnimationController.pauseIconUrl = "data:image/png;base64,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";


/**
 * Initialize the view components in the target div ID
 * @private
 */
ral.time.BasicAnimationController.prototype.initView = function()
{
  /* create the step backward button and add listener */
  jQuery( "<img/>" )
    .attr( "src", this.stepBackIconUrl )
    .attr( "title", "Step back")
    .on( "click", this.stepBackward.bind( this ) )
    .addClass( "AnimationController_button" )
    .appendTo( "#" + this.target );

  /* create the play/pause button and add listener */
  jQuery( "<img/>" )
    .attr( "id", this.target + "_playButton" )
    .attr( "src", this.playIconUrl )
    .attr( "title", "Play/Pause")
    .on( "click", this.toggleAnimation.bind( this ) )
    .addClass( "AnimationController_button" )
    .appendTo( "#" + this.target );

  /* create the step forward button and add listener */
  jQuery( "<img/>" )
    .attr( "src", this.stepForwardIconUrl )
    .on( "click", this.stepForward.bind( this ) )
    .attr( "title", "Step forward")
    .addClass( "AnimationController_button" )
    .appendTo( "#" + this.target );

  /* calculate the slider position */
  var sliderValue = 1 - ( (this.getFrameDelay() - this.fastest ) / (this.slowest - this.fastest) );

  /* create the speed control slider */
  var slider = jQuery( "<div></div>" )
    .addClass( "AnimationController_slider" )
    .slider( { min: 0, max: 1, step: 0.01, value: sliderValue, change: this.speedControlChanged.bind( this ) } )
    .appendTo( "#" + this.target );

  /* add the 'slow' label to the slider */
  jQuery( "<label></label>" )
    .text( "slow" )
    .addClass( "AnimationController_label" )
    .css( "left", "0%" )
    .css( "margin-top", "20px" )
    .appendTo( slider );

  /* add the 'fast' label to the slider */
  jQuery( "<label></label>" )
    .text( "fast" )
    .addClass( "AnimationController_label" )
    .css( "left", "80%" )
    .css( "margin-top", "20px" )
    .appendTo( slider );

  jQuery( "#" + this.target ).addClass( "AnimationController" );
};


/**
 * Toggle the animation state between playing and paused
 * @public
 */
ral.time.BasicAnimationController.prototype.playingStateChanged = function( isPlaying )
{
  /* set the play/pause icon appropriately */
  if( isPlaying )
  {
    jQuery( "#" + this.target + "_playButton" ).attr( "src", this.pauseIconUrl );
  }
  else
  {
    jQuery( "#" + this.target + "_playButton" ).attr( "src", this.playIconUrl );
  }
};


/**
 * Set the frame delay from the UI controls
 * @private
 *
 * @param {object} event The JQuery UI event [not used]
 * @param {JQueryUI-Slider} ui The UI slider component
 */
ral.time.BasicAnimationController.prototype.speedControlChanged = function( event, ui )
{
  var val = 1 - ui.value;
  var delayMs = ( this.slowest - this.fastest ) * val + this.fastest;

  this.setFrameDelay( delayMs );
};

var ral = ral || {};
ral.time = ral.time || {};

/**
 * Adds a pulldown menu for user-selectable time steps, and a range slider for adjusting the desired range of the
 * animation. Requires jquery-ui plugin jQDateRangeSlider http://ghusse.github.io/jQRangeSlider/documentation.html
 * Also requires a RangeIntervalTimeSequence model
 * @extends ral.time.BasicAnimationController
 * @constructor
 * @memberof ral.time
 * @requires module:jquery
 * @requires module:jquery-ui.jqrangeslider
 *
 * @param options See BasicAnimationController for additional options.
 * @param {[{name, numMs}]} options.steps (required) A list of kvps with the label and amount of each selectable step
 * @param {number} options.defaultStepMs (required) The default step size from the list, in milliseconds.
 * @param {Number} options.defaultMinSecs (optional) The absolute minimum number of seconds relative to selected time that the range can be set to
 * @param {Number} options.defaultMaxSecs (optional) The absolute maximum number of seconds relative to selected time that the range can be set to
 * @param {Number} options.defaultRangeMinSecs (optional) The minimum seconds after current that we set our time sequence to when the user chooses a new time
 * @param {Number} options.defaultRangeMaxSecs (optional) The maximum seconds before current that we set our time sequence to when the user chooses a new time
 * @param {[Layer]} options.layers (optional) The animator will wait for all visible Layers in this list to complete loading before advancing
 */
ral.time.SelectableRangeAnimationController = function( options )
{
  this.steps = options['steps'];
  this.defaultStepMs = options['defaultStepMs'];

  this.defaultMinSecs = 36 * 3600;
  this.defaultMaxSecs = 36 * 3600;
  this.defaultRangeMinSecs = 0;
  this.defaultRangeMaxSecs = 24 * 3600;
  this.layers = [];
  this.currentMin = null;
  this.currentMax = null;

  if ( typeof(options['defaultMinSecs']) !== "undefined" ) { this.defaultMinSecs = options['defaultMinSecs']; }
  if ( typeof(options['defaultMinSecs']) !== "undefined" ) { this.defaultMaxSecs = options['defaultMinSecs']; }
  if ( typeof(options['defaultRangeMinSecs']) !== "undefined" ) { this.defaultRangeMinSecs = options['defaultRangeMinSecs']; }
  if ( typeof(options['defaultRangeMaxSecs']) !== "undefined" ) { this.defaultRangeMaxSecs = options['defaultRangeMaxSecs']; }
  if ( typeof(options['layers']) !== "undefined" ) { this.layers = options['layers']; }

  /* call the super constructor */
  ral.time.BasicAnimationController.call( this, options );
}

/**
 * Inherit from the BasicAnimationController class
 */
ral.time.SelectableRangeAnimationController.prototype = Object.create( ral.time.BasicAnimationController.prototype );

/**
 * Add components to
 * @private
 */
ral.time.SelectableRangeAnimationController.prototype.initView = function()
{
  ral.time.BasicAnimationController.prototype.initView.call( this );

  var options = [];
  for ( var i = 0; i < this.steps.length; i++ ) {
    var step = this.steps[ i ];
    var opt = '<option value="' + step['numMs'] + '">' + step['name'] + "</option>"
    options.push( opt );
  }

  // Step size select menu
  jQuery( "<select/>" )
    .attr( "id", this.target + "_step" )
    .attr( "title" , "Interval step size")
    .addClass( "AnimationController_select")
    .on( "change", this.setStep.bind( this ) )
    .html( options.join( '' ) )
    .val( this.defaultStepMs )
    .appendTo( "#" + this.target );

  // Adjustable range slider
  jQuery( "#" + this.target ).append("<div id=\"" + this.target + "_rangeSlider\"></div>");
  jQuery( "#" + this.target + "_rangeSlider" ).dateRangeSlider(
    {
      formatter: function(val) {
        var month = ( val.getUTCMonth() < 9 ) ? "0" + (val.getUTCMonth() + 1 ) : (val.getUTCMonth() + 1);
        var date = ( val.getUTCDate() < 10 ) ? "0" + val.getUTCDate() : val.getUTCDate();
        var hour = ( val.getUTCHours() < 10 ) ? "0" + val.getUTCHours() : val.getUTCHours();
        var minute = ( val.getUTCMinutes() < 10 ) ? "0" + val.getUTCMinutes() : val.getUTCMinutes();
        var timeStr = month + "/" + date + " " + hour + ":" + minute;
        return timeStr;
      },
      arrows: false,
      defaultValues: { min: new Date(), max: new Date() }
    });

  jQuery( "#" + this.target + "_rangeSlider").bind( "valuesChanged", function (e, data) {
    this.timeSequence.setTimeRange( data.values.min, data.values.max );
  }.bind( this ) );

  // current time marker
  this.currentPos = jQuery( "<div>^</div>" )
      .attr( "id", this.target + "_current" )
      .addClass("AnimationController_current")
      .css( "float", "left" )
      .appendTo( "#" + this.target );
}

/**
 * Set the interval step size based on the selected value.
 * @private
 */
ral.time.SelectableRangeAnimationController.prototype.setStep = function( )
{
  var value = jQuery( "#" + this.target + "_step" ).val();
  this.timeSequence.setIntervalMs( parseInt(value) );
}

/**
 * If the selected time changed, update our slider with the new range
 * @param {date} date the new selected time
 */
ral.time.SelectableRangeAnimationController.prototype.userSelectedTimeChanged = function( date )
{
  this.currentMin = new Date( date.getTime() - ( this.defaultMinSecs * 1000 ) );
  this.currentMax = new Date( date.getTime() + ( this.defaultMaxSecs * 1000 ) );
  var min = new Date( date.getTime() - ( this.defaultRangeMinSecs * 1000 ) );
  var max = new Date( date.getTime() + ( this.defaultRangeMaxSecs * 1000 ) );

  jQuery( "#" + this.target + "_rangeSlider" ).dateRangeSlider("bounds",  this.currentMin, this.currentMax );
  jQuery( "#" + this.target + "_rangeSlider" ).dateRangeSlider("values", min, max );

  this.drawCurrent();
}

/**
 * Call the appropriate step method on the model and repeat while in the playing state
 * @private
 */
ral.time.SelectableRangeAnimationController.prototype.play = function()
{
  if ( this.timeSequence.getIsPlaying() )
  {
    // make sure all layers have finished loading
    var isLoading = false;

    for (var i=0;i<this.layers.length;i++)
    {
      var l = this.layers[i];
      if (typeof(l.getStatus) !== "undefined") {
        if ( l.getStatus() == ral.gis.layer.Layer.STATUS_LOADING)
        {
          isLoading = true;
          break;
        }
      }
    }

    if ( !isLoading )
    {
      // Capture the time at which the frame change was initiated.
      this.setFrameChangeStartTime( new Date() );
      this.setCurrentFrameDelay(this.getNextFrameDelay());

      var delay = 0;
      if ( this.mode == 'FORWARD' ) {
        delay = this.playF();
      }
      else if ( this.mode == 'BACKWARD' ) {
        delay = this.playB();
      }
      else if ( this.mode == 'SWEEP' ) {
        if ( this.sweep == 'FORWARD' ) {
          if ( this.timeSequence.isCurrentFrameLast() ) {
            this.sweep = 'BACKWARD';
            delay = this.playB();
          }
          else {
            delay = this.playF();
          }
        }
        else {
          if ( this.timeSequence.isCurrentFrameFirst() ) {
            this.sweep = 'FORWARD';
            delay = this.playF();
          }
          else {
            delay = this.playB();
          }
        }
      }

      this.setNextFrameDelay(delay);
      if ( !this.getUsesExternalPlayTimer() ) {
        setTimeout( this.play.bind( this ), delay );
      }
    }
    else
    {
      if ( !this.getUsesExternalPlayTimer() ) {
        setTimeout( this.play.bind( this ), 10 );
      }
    }
  }
};

ral.time.SelectableRangeAnimationController.prototype.drawCurrent = function()
{
  if ( this.currentMin === null )
  {
    return;
  }
  var width = parseInt( jQuery( "#" + this.target + "_rangeSlider" ).css( "width" ) );
  var rangeMs = this.currentMax.getTime() - this.currentMin.getTime();
  var currentPos = width * ( this.timeSequence.getCurrentFrame().getTime() - this.currentMin.getTime() ) / rangeMs;

  this.currentPos.css("margin-left", ( currentPos - 8 ) + "px" );

}

ral.time.SelectableRangeAnimationController.prototype.frameChanged = function()
{
  this.drawCurrent();
}
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

  if( "dataLinks" in options ) this.dataLinks = options.dataLinks;
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
 * a format that the TimeSeriesPlot implementation can read.
 * @param {string} data The data to parse
 * @return {object} The parsed data
 * @abstract
 */
ral.timeSeries.TimeSeriesDataSource.prototype.parseData = function( data )
{
  console.log( "ral.timeSeries.TimeSeriesDataSource.parseData() is abstract" );
  return null;
};

/**
 * Get the data URL. Child classes should construct the getData URL string using the supplied start/end times
 * @param {Date} start The start time for the series
 * @param {Date} end The end time for the series
 * @abstract
 * @return {string} The url for the plot data
 */
ral.timeSeries.TimeSeriesDataSource.prototype.getDataUrl = function( start, end )
{
  console.log( "ral.timeSeries.TimeSeriesDataSource.getDataUrl() is abstract" );
  return null;
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
        if( Array.isArray( sourceData ) && Array.isArray( sourceSeriesOpts )
                && sourceData.length == sourceSeriesOpts.length ) {
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

  var ylabels = this.getYAxisLabels();

  var renderOptions = (this.legendPosition === "inside") ? { numberRows: 1 } : { numberColumns: 1 };

  /* add other styling options */
  var axesDefaults   = { tickOptions: { fontFamily: "avenir" /* TODO: put in css */ }, autoscale: true };
  var grid           = { background: "#f9f9f9", shadow: false };
  var cursor         = { style: "crosshair", show: true, showTooltip: true, tooltipLocation: "se", tooltipOffset: 6, showVerticalLine: true, showHorizontalLine: true, zoom: true };
  var seriesDefaults = { shadow: false, fill: false, lineWidth: 1.5, breakOnNull: true };
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
    if ( minY == maxY ) { maxY += 1 }
  }

  var axes           = {
                         xaxis: {
                            autoscale: false,
                            renderer    : jQuery.jqplot.DateAxisRenderer,
                            tickOptions : { formatString: this.dateFormat },
                            tickInterval: this.tickInterval,
                            numberTicks: 16,
                            // pad: 0,
                            min: start
                            // max: end
                         },
                         yaxis: {
                             label: ylabels.yAxisLabel,
                             labelRenderer: jQuery.jqplot.CanvasAxisLabelRenderer,
                             // pad: 0,
                             min: (typeof this.yRange !== "undefined") ? this.yRange[0] : null,
                             max: (typeof this.yRange !== "undefined") ? this.yRange[1] : null
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

 var plotOptions     = { title         : title,
                         axesDefaults  : axesDefaults,
                         axes          : axes,
                         grid          : grid,
                         cursor        : cursor,
                         seriesDefaults: seriesDefaults,
                         series        : seriesOpts,
                         highlighter   : highlighter,
                         legend        : legend
                       };

  try {
    if (data.length == 0) data[0] = [[0, 0]];

    this.plot = jQuery.jqplot(this.target, data, plotOptions);

    // replot - hack to make sure time labels are spaced correctly (and not too crowded)
    this.plot.replot({
      resetAxes: true, axes: {
        // xaxis: {renderer: jQuery.jqplot.CategoryAxisRenderer, min: start, max: end},
        xaxis: {min: start, max: end, numberTicks: 16, tickInterval: this.tickInterval},
        yaxis: {min: minY, max: maxY}
      }
    });

  }
  catch( error )
  {
    console.log( error );
  }

  this.drawDataDownloadLinks();

};

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
    markerOptions: this.markerOptions };
  if( typeof( this.renderer ) !== "undefined" ) {
    options.fill = true;
  }
  return options;
};
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


ral = ral || {};
ral.indiaWBG = ral.indiaWBG || {};
ral.indiaWBG.time = ral.indiaWBG.time || {};

/**
 *
 * @constructor
 *
 * @param {Object} options The options to use to configure the ForecastSelector
 * @param {string} options.target (required) The div ID to use for this component
 * @param {string} options.servletUrl (required) The URL to the Hydro servlet
 * @param {ral.time.TimeSequenceModel} options.timeSequenceModel (required) The application's time model
 * @param {ral.time.TimeSelector} options.timeSelector (required) The application's time selector
 */
ral.indiaWBG.time.ForecastSelector = function( options )
{
  this.target            = options.target;
  this.servletUrl        = options.servletUrl;
  this.timeSequenceModel = options.timeSequenceModel;
  this.region            = options.region;
  this.timeSelector      = options.timeSelector;

  this.listeners = [];
};


/**
 * Initialize the view
 */
ral.indiaWBG.time.ForecastSelector.prototype.init = function()
{
  var target = jQuery( "#" + this.target );

  /* add a title */
  jQuery( "<h1>" )
    .text( "Forecast Cycle" )
    .addClass( "ForecastSelector_title" )
    .css( "width", "100%" )
    .appendTo( target );

  /* create a select element */
  var select = jQuery( "<select>")
    .attr( "id", "forecastSelector" )
    .addClass( "ForecastSelector_choice" )
    .appendTo( target );

  /* fire an event when changed */
  select.change( this.fireForecastCycleChangedEvent.bind( this ) );

  /* request available times from the server and populate */
  this.updateForecastCycleList();
};


/**
 * Request available forecast times from the server and call function to populate 'select' element when done
 */
ral.indiaWBG.time.ForecastSelector.prototype.updateForecastCycleList = function()
{
  var url = this.servletUrl +
      "?requestType=getForecastCycleTimes" +
      "&region=" + this.region;

  jQuery.getJSON( url ).success( this.populateForecastCycleList.bind( this ) );
};


/**
 * Update the 'select' element when the query returns
 *
 * @param data Results from the query
 */
ral.indiaWBG.time.ForecastSelector.prototype.populateForecastCycleList = function( data )
{
  /* get the select element and remove all options */
  var select = jQuery( "#forecastSelector" );
  select.empty();

  /* add the default analysis option */
  jQuery( "<option>" )
    .attr( "value", "analysis" )
    .text( "Analysis" )
    .appendTo( select );

  /* add each available forecast cycle as an option */
  for( var i = 0; i < data.forecastTimes.length; i++ )
  {
    jQuery( "<option>" )
      .attr( "value", data.forecastTimes[i] )
      .text( this.makeHumanReadableDate( data.forecastTimes[i] ) )
      .appendTo( select );
  }

  /* save the forecast length */
  this.forecastLengthSeconds = data.forecastLengthSeconds;

  /* fire an event to listeners */
  this.fireForecastCycleChangedEvent();
};


/**
 * Add a listener.  Listeners may implement:
 *   updateSelectedForecastTime( pathElement: string ): void
 *
 * @param listener A new listener object
 */
ral.indiaWBG.time.ForecastSelector.prototype.addListener = function( listener )
{
  this.listeners[ this.listeners.length ] = listener;
};


/**
 * Fire an event with the currently selected forecast cycle
 */
ral.indiaWBG.time.ForecastSelector.prototype.fireForecastCycleChangedEvent = function()
{
  /* get the select element's current value */
  var value = jQuery( "#forecastSelector").val();

  /* if a non-analysis cycle was chosen, update the time selector et al */
  if( value != "analysis" )
  {
    /* build dates */
    var yyyy  = value.substring( 0, 4 );
    var MM    = value.substring( 4, 6 );
    var dd    = value.substring( 6, 8 );
    var HH    = value.substring( 8, 10 );
    var start = new Date( yyyy + "-" + MM + "-" + dd + "T" + HH + ":00:00.000Z" );
    var end   = new Date( start.getTime() + ( this.forecastLengthSeconds * 1000 ) );

    /* create a new TimeSequenceModel (fixed) for the selected forecast cycle period */
    var tsm = new ral.time.RangeIntervalTimeSequence(
      {
        minTime: start,
        maxTime: end,
        intervalMs: 360000,
        roundMs: 360000
      }
    );

    /* replace the application's TimeSequenceModel */
    this.timeSequenceModel.transferListenersInto( tsm );
    this.timeSequenceModel = tsm;

    /* set the current frame to the first time */
    tsm.setCurrentFrame( start );

    /* set the application's TimeSelector's TimeSequenceModel */
    this.timeSelector.setTimeSequence( tsm );

    /* fire event to signify the sequence changed */
    tsm.fireSequenceChangedEvent();
  }

  /* loop and notify the listeners */
  for( var i = 0; i < this.listeners.length; i++ )
  {
    if( typeof( this.listeners[i].updateSelectedForecastTime ) === "function" )
    {
      this.listeners[i].updateSelectedForecastTime( value );
    }
  }
};


/**
 * Create a human readable date from a date string
 *
 * @param yyyyMMddHH Date string in that format
 * @returns {string} A human readable version of the same
 */
ral.indiaWBG.time.ForecastSelector.prototype.makeHumanReadableDate = function( yyyyMMddHH )
{
  var MON  = [];
  MON["01"] = "JAN";
  MON["02"] = "FEB";
  MON["03"] = "MAR";
  MON["04"] = "APR";
  MON["05"] = "MAY";
  MON["06"] = "JUN";
  MON["07"] = "JUL";
  MON["08"] = "AUG";
  MON["09"] = "SEP";
  MON["10"] = "OCT";
  MON["11"] = "NOV";
  MON["12"] = "DEC";
  var yyyy = yyyyMMddHH.substring( 0, 4 );
  var MM   = MON[ yyyyMMddHH.substring( 4, 6 ) ];
  var dd   = yyyyMMddHH.substring( 6, 8 );
  var HH   = yyyyMMddHH.substring( 8, 10 );

  return yyyy+"-"+MM+"-"+dd+" "+HH+" UTC";
};var globalMap;
var windows = [];

function run()
{
  console.log( ral );

  var disclaimer = jQuery( "#disclaimer" );
  disclaimer.dialog( { title: "Disclaimer", width: 800, height: 250, modal: true } );

    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
    var indiaTimeZoneOffset = - 5.5 * 60 * 60 * 1000;

  /* data urls */
  var basinUrl = "GBM_Major_Sub.topo.json";
  // var subbasinUrl = "http://gis-maps.rap.ucar.edu/arcgis/services/India_WBG/CWC_Station_Basins/MapServer/WMSServer";
  var cwcStageUrl = "getCWCObs.php";
  var ffwcStageUrl = "getFFWCObs.php";
  var cwcPlotUrl = "../data/timeSeriesPlots";
  var cwcPlotUrlQC = "../data/TimeSeriesPlotsQC";
  var noDataAvailable = "noDataAvailable.png";
  var arcGISBasemapTemplate = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  //                           https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/7/55/91
  // var natMap1Url = "http://services.nationalmap.gov/arcgis/services/nhd/MapServer/WMSServer";

  /* legend urls */
  // var legendUrl    = servletUrl + "?requestType=getColorScale&width=160&height=35&nColors=253";
  //var legendAcrain = legendUrl + "&palette=unknown&min=1&max=350&units=mm&logarithmic=false";
  //var legendEvap   = legendUrl + "&palette=landsurfacetemperature&min=0.1&max=20&units=mm&logarithmic=false";
  //var legendSnow   = legendUrl + "&palette=snow&min=0.5&max=500&units=mm&logarithmic=false";
  //var legendRadar  = legendUrl + "&palette=reflectivity&min=-30&max=75&units=dBZ&logarithmic=false";
  //var legendSoil   = legendUrl + "&palette=soilmoisture&min=0.05&max=0.45&units=m^3/m^3&logarithmic=false";
  //var legendFlow   = legendUrl + "&palette=rainbow&min=0&max=300&units=m^3/sec&logarithmic=true";
  //var legendCWCstage   = legendUrl + "&palette=rainbow&min=0&max=300&units=m^3/sec&logarithmic=false";
  //var legendStage  = legendUrl + "&palette=rainbow&min=0&max=3&units=meters&logarithmic=false";

  /* geojson styles */
    var basinStyle = function (feature, resolution) {
        var style = [new ol.style.Style({
            stroke: new ol.style.Stroke({color: 'blue', width: 1}),
            fill: new ol.style.Fill({color: "rgba(0,0,0,0)"})
        })];
        if (resolution < 1500) {

            // This is used to calculate the largest of the many polygons, so we can place the label at its center
            var getMaxPoly = function(polys) {
                var polyObj = [];
                //now need to find which one is the greater and so label only this
                for (var b = 0; b < polys.length; b++) {
                    polyObj.push({poly: polys[b], area: polys[b].getArea()});
                }
                polyObj.sort(function (a, b) {
                    return a.area - b.area
                });

                return polyObj[polyObj.length - 1].poly;
            }

           style[1] = new ol.style.Style({
                text: new ol.style.Text({
                    font: '12px Verdana',
                    text: feature.get('Subbasin'),
                    fill: new ol.style.Fill({color: 'blue'}),
                    stroke: new ol.style.Stroke({color: 'blue', width: 0.5})
                }),
               geometry: function (feature) {
                   var retPoint;
                   if (feature.getGeometry().getType() === 'MultiPolygon') {
                       retPoint = getMaxPoly( feature.getGeometry().getPolygons() ).getInteriorPoint();
                   } else if (feature.getGeometry().getType() === 'Polygon') {
                       retPoint = feature.getGeometry().getInteriorPoint();
                   }
                   console.log(retPoint)
                   return retPoint;
               }
            });
        }
        return style;
    };
    // var subbasinStyle = [new ol.style.Style( { stroke: new ol.style.Stroke( {color: 'darkblue', width: 2} ), fill: new ol.style.Fill( {color: "rgba(0,0,0,0)"} ) } )];
    var makeObsTextStyle = function() {
        return new ol.style.Text({
            textAlign: 'left',
            textBaseline: 'middle',
            font: 'normal 12px sans-serif',
            text: 'Unk',
            fill: new ol.style.Fill({color: '#0000FF'}),
            stroke: new ol.style.Stroke({color: 'white', width: 1}),
            offsetX: 4,
            offsetY: 0,
            rotation: 0
        });
    };
    var obsStyles = {
        stale: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: '#666666'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            })
        }),
        normal: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 3,
                fill: new ol.style.Fill({
                    color: '#0000FF'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            }),
            text: makeObsTextStyle()
        }),
        warning: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#ff7f00'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            }),
            text: makeObsTextStyle()
        }),
        alert: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: '#ff0000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            }),
            text: makeObsTextStyle()
        })
    };
    /**
     * Computes the obs style based on the values in the feature
     * @param feature
     * @param resolution
     * @returns {*}
     */
    var obsStyleFunc = function (feature, resolution) {
        var date = feature.get('valid_date')
        var dangerLevel = feature.get('danger_level');
        var currentLevel = feature.get('level');
        var style;
        if (typeof currentLevel == 'undefined' || currentLevel == null || typeof date == 'undefined' || date == null
            || timeSelector.getSelectedTime().getTime()-((new Date(date)).getTime()+timezoneOffset-indiaTimeZoneOffset) > 86400 ) {
            style = obsStyles.stale;
        } else if (typeof dangerLevel == 'undefined' || dangerLevel == null ) {
            style = obsStyles.normal;
        } else if ( currentLevel > dangerLevel ) {
            style = obsStyles.alert;
        } else if ( (dangerLevel-currentLevel)/dangerLevel < 0.1 ) {
            style = obsStyles.warning;
        } else {
            style = obsStyles.stale;
        }
        // Add a label to any valid stations
        if( style.getText() != null ) {
            style.getText().setOffsetX( style.getImage().getRadius()+1);
            style.getText().setText( feature.get('site_name') );
        }
        return [style];
    };

    var dataProj = new ol.proj.Projection( {code: "EPSG:4326", global: true} );
    var mapProj = new ol.proj.Projection( {code: "EPSG:3857", global: true} );  // EPSG:3857

    /* Step 1: create the map */
    // var view = new ol.View( { center: ol.proj.transform( [84.5, 25.9], "EPSG:4326", "EPSG:3857" ), zoom: 6 } );
    var view = new ol.View( { center: ol.proj.transform( [86, 25.75], "EPSG:4326", "EPSG:3857" ), zoom: 8 } );
    var controls = ol.control.defaults();
    controls.forEach(
        function(ctrl) {
            if( ctrl instanceof ol.control.Attribution ) {
              controls.remove(ctrl);
            }
        });
    var map = new ol.Map( {target: "map", view: view, controls: controls } );

  /* Step 2: create the layers */
    // The Base Layer
    var layerBase = new ol.layer.Tile( {
        source: new ol.source.XYZ( {
            url: arcGISBasemapTemplate,
            tileUrlFunction: function ( tileCoord ) {
                return arcGISBasemapTemplate.replace( '{z}', (tileCoord[0]) )
                        .replace( '{x}', (tileCoord[1]) )
                        .replace( '{y}', (tileCoord[2]) );
            },
            projection: 'EPSG:3857',
            maxZoom: 16
        } )
    } );
    //var layerAcrain = new ral.indiaWBG.gis.layer.HydroDiffWMSLayer( { baseUrl: wmsDiffProxyUrl, layerName: "ACCPRCP", domain: domain, filePattern: hydroFilePattern, region: region, forecastCycle: defaultForecastCycle, abovemaxcolor: "extend", dataSet: "grid", servletUrl: servletUrl } );
    //var layerEvap   = new ral.indiaWBG.gis.layer.HydroDiffWMSLayer( { baseUrl: wmsDiffProxyUrl, layerName: "ACCEVAP", domain: domain, filePattern: hydroFilePattern, region: region, forecastCycle: defaultForecastCycle, abovemaxcolor: "extend", dataSet: "grid", servletUrl: servletUrl } );
    //var layerSnow   = new ral.indiaWBG.gis.layer.HydroWMSLayer( { baseUrl: fullTdsUrl, layerName: "SNEQV", domain: domain, filePattern: hydroFilePattern, region: region, forecastCycle: defaultForecastCycle, abovemaxcolor: "extend", dataSet: "grid", servletUrl: servletUrl } );
    //var layerSoil   = new ral.indiaWBG.gis.layer.HydroWMSLayer( { baseUrl: fullTdsUrl, layerName: "SOIL_M_0", domain: domain, filePattern: hydroFilePattern, region: region, forecastCycle: defaultForecastCycle, abovemaxcolor: "extend", dataSet: "grid", servletUrl: servletUrl } );
    //var layerRadar  = new ral.indiaWBG.gis.layer.HydroWMSLayer( { baseUrl: fullTdsUrl, layerName: "DBZ", filePattern: radarFilePattern, region: region, forecastCycle: "observations", abovemaxcolor: "extend", dataSet: "radar", servletUrl: servletUrl } );
    //var layerNatMap = new ral.gis.layer.ol3.OL3WMSLayer( { baseUrl: natMap1Url, cors: true, layerName: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15" } );
    //var layerBasin  = new ral.gis.layer.ol3.OL3GeoJSONLayer( { dataUrl: basinUrl, style: basinStyle, dataProjection: dataProj, mapProjection: mapProj } );
    //var layerUnkn   = new ral.gis.layer.ol3.OL3GeoJSONLayer( { dataUrl: "NHDFLowline_FRNG1k_json.geojson", style: basinStyle, dataProjection: dataProj, mapProjection: mapProj } );
    //var layerFlow   = new ral.indiaWBG.gis.layer.HydroFlowLayer( { dataUrl: servletUrl, region: region, domain: domain, variable: "streamflow", scaleMin: 0, scaleMax: 300, refreshOnMapViewChanged: true, dataProjection: dataProj, mapProjection: mapProj, plot: plotStream, forecastCycle: defaultForecastCycle, additionalReqParam: "&logarithmic=true" } );
    var layerCWCstage  = new ral.gis.layer.ol3.OL3GeoJSONLayer( { dataUrl: cwcStageUrl, style: obsStyleFunc , dataProjection: dataProj, mapProjection: mapProj } );
    var layerFFWCstage  = new ral.gis.layer.ol3.OL3GeoJSONLayer( { dataUrl: ffwcStageUrl, style: obsStyleFunc , dataProjection: dataProj, mapProjection: mapProj } );
    // var layerAhpsF  = new ral.indiaWBG.gis.layer.AHPSFlowLayer( { dataUrl: servletUrl, variable: "flowrate", scaleMin: 0, scaleMax: 2, refreshOnMapViewChanged: true, dataProjection: dataProj, mapProjection: mapProj } );
    var layerBasin  = new ral.gis.layer.ol3.OL3GeoJSONLayer( { dataUrl: basinUrl, isTopoJSON: true, style: basinStyle, dataProjection: dataProj, mapProjection: mapProj} );
    layerBasin.refreshData();

    // var layerSubbasin  = new ral.gis.layer.ol3.OL3WMSLayer( { baseUrl: subbasinUrl, layerName: "0", style: subbasinStyle} );
    // var layerPaddy  = new ral.gis.layer.ol3.OL3WMSLayer( { baseUrl: "http://weather.aero/mm-ncWMS/wms", layerName: "CREF%2FCREF" } );

  /* Step 3: add the layers to the map */
  map.addLayer( layerBase );
  layerBasin.addToMap( map );
  // layerSubbasin.addToMap( map );
  //layerAcrain.addToMap( map );
  //layerEvap.addToMap( map );
  //layerSnow.addToMap( map );
  //layerSoil.addToMap( map );
  //layerRadar.addToMap( map );
  //layerNatMap.addToMap( map );
  //layerUnkn.addToMap( map );
  //layerFlow.addToMap( map );
  //layerStage.addToMap( map );
  layerCWCstage.addToMap( map );
  layerFFWCstage.addToMap( map );
  // layerPaddy.addToMap( map );
  ral.gis.layer.ol3.MarkerManager.getSingleton().setMap( map );

  // Create popup contents functions
    var makeObsPopupContent = function( feature ) {
        var html = '<b>' + feature.get('site_name') + ' (' + feature.get('site_code_') + ')</b><BR>';
        html += '<hr><table>';
        if( typeof( feature.get('valid_date') ) != 'undefined' && typeof( feature.get('level') ) != 'undefined') {
            html += '<tr><td align="right">Valid Date: </td><td align="left"> ' + feature.get( 'valid_date' ) + '</td></tr>';
            html += '<tr><td align="right">Stage: </td><td align="left"> ' + feature.get( 'level' ) + 'm</td></tr>';
            if( typeof( feature.get('danger_level') ) != 'undefined' && feature.get('danger_level') != null ) {
                html += '<tr><td align="right">Danger Level: </td><td align="left"> ' + feature.get('danger_level') + 'm</td></tr>';
            } else {
                html += '<tr><td align="right">Danger Level: </td><td align="left"> UNKNOWN</td></tr>';
            }
        } else {
            html += '<tr><td align="center">No observations available<BR> at selected time</td></tr>';
        }
        html += '</table>';
        return html;
    };

    // Create an obs popup
    var popupElement = document.getElementById('popup');
    var popup = new ol.Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        stopEvent: false
    });
    map.addOverlay(popup);

    // Show the popup when user mouses over a point
    map.on('pointermove', function (evt) {
        var popUpFeature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                return feature;
            });
        if (popUpFeature) {
            var geometry = popUpFeature.getGeometry();
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);
            popupElement.innerHTML = makeObsPopupContent(popUpFeature);
            popupElement.style.background = "#FFFFFF";
            popupElement.style.display = "block";
        } else {
            popupElement.style.display = "none";
        }
    });

  /* Step 4: create the layer controls */
  var controlsCWCstage  = new ral.gis.layer.control.DefaultLayerControls( { layer: layerCWCstage, displayName: "CWC River Stage Gages", legendUrl: null, showColorLegend: false } );
  var controlsFFWCstage  = new ral.gis.layer.control.DefaultLayerControls( { layer: layerFFWCstage, displayName: "FFWC River Stage Gages", legendUrl: null, showColorLegend: false } );
  var controlsBasin  = new ral.gis.layer.control.DefaultLayerControls( { layer: layerBasin, displayName: "Basins", showOpacitySlider: true } );

  /* Step 5: Add the layer controls to a menu */
  var menu = new ral.gis.layer.control.CollapsibleLayerControlsMenu( { target: "menu", title: "Data Layers", animationSpeed: 250 } );
  menu.addLayers( [
    { group: "Map Data", members: [ { name: "basin", controls: controlsBasin }
                                    // { name: "subbasin", controls: controlsSubbasin }
                                    // { name: "unkn", controls: controlsUnkn },
                                    // { name: "natmap", controls: controlsNatMap }
                                  ] },
    { group: "Observation and Forecast Locations", members: [ { name: "Central Water Commission Stage", controls: controlsCWCstage },
                                                              { name: "Flood Forecasting and Warning Centre Stage", controls: controlsFFWCstage }] }
                  ] );
  menu.openAll();

  /* Step 6: create the layer controls group to only allow one visible at a time
  var gridControls        = [ controlsAcrain, controlsEvap, controlsSnow, controlsSoil ];
  var gridControlsGroup   = new ral.gis.layer.control.SingleVisibleLayerControlsGroup( { controls: gridControls } );
  var streamControls      = [ controlsFlow, controlsStage ];
  var streamControlsGroup = new ral.gis.layer.control.SingleVisibleLayerControlsGroup( { controls: streamControls } );
  var ahpsControls        = [ controlsAhpsF ];
  var obsControlsGroup    = new ral.gis.layer.control.SingleVisibleLayerControlsGroup( { controls: controlsAhpsF } ); */

  /* 7: create the time sequence model */
  var now        = new Date();
  // now.setFullYear(2015);
  // now.setMonth(8);
  // now.setDate(1);
  // now.setHours( -now.getTimezoneOffset()/60, 0, 0, 0 );
  now.setHours( 0, 0, 0, 0 );
  var minTime    = new Date( now.getTime() - 86400000*61 );
  var maxTime    = new Date( now.getTime() + 86400000 );
  var timeModel = new ral.time.RangeIntervalTimeSequence( {
      minTime         : minTime,
      maxTime         : maxTime,
      currentFrameTime: now,
      intervalMs      : 86400000,
      roundMs         : 86400000,
      frameDelayMs    : 500,
      dwell           : 2000
    }
  );


  var timeLabel = new ral.time.TimeLabel( { target: "timeLabel", dateFormat: "%b %d, %Y", useUTCTime: false } );
  timeModel.addListener( timeLabel );

  /* Step 8: create the time selector */
  var tsListeners  = [ layerCWCstage, layerFFWCstage ];
  var labelDayFormat = d3.time.format( "%-d" );
  var labelMonthFormat = d3.time.format( "%b" );
  var timeSelector = new ral.time.D3JSTimeSelector(
    {
      target          : "timeSelector",
      timeSequence    : timeModel,
      markerHeight    : 20,
      markerWidth     : 20,
      padding         : 10,
      tickMarks       : d3.time.day,
      dateFormat      : "%b %d",
      useUtc          : false,
      tickFormat      : function(d) {
        day = d.getDate();
        if( day == 1 ) {
          // First day of month
          return labelMonthFormat( d ) + " " + labelDayFormat( d );
        } else if( day == 5 || day == 10 || day == 15 || day == 20 || day == 25  ) {
          // every 10 days
          return labelDayFormat( d );
        } else {
          // don't label anything else
          return ""
        }
      },
      userConfigurable: "fixed,realtime"
    }
  );

  for( var i = 0; i < tsListeners.length; i++ ) timeModel.addListener( tsListeners[i] );
  timeModel.addListener( {
    frameChanged: function () {
      if( plotFeature ) {
        updatePlot( plotFeature )
      }
    }
  } )
  timeModel.fireSequenceChangedEvent();
  timeModel.fireFrameChangedEvent();
//  timeModel.updateFrameTimes();

  /* Step 9: create the animation controls */
  var animControls = new ral.time.BasicAnimationController(
    {
      target      : "animationControls",
      steps       : [ { name: "1 Day", numMs: 86400000 }, { name: "30 minutes", numMs: 1800000 }, { name: "15 minutes", numMs: 900000 } ],
      timeSequence: timeModel,
      slowest     : 1500,
      fastest     : 100,
      mode        : "FORWARD"
    }
  );

  /* Step 10: create the time series plots */
  var plotFeature;
  var plotElement1 = document.getElementById('plot1Img');
  var plotElement2 = document.getElementById('plot2Img');
  var plotError1 = document.getElementById('plot1Error');
  var plotError2 = document.getElementById('plot2Error');
  var plotText1 = document.getElementById('plot1Text');
  var plotText2 = document.getElementById('plot2Text');
  plotElement1.onclick = function() { window.open( this.getAttribute('src'),'Image','') };
  plotElement2.onclick = function() { window.open( this.getAttribute('src'),'Image','') };
  // Update the graphs when user clicks on a point
  map.on('click', function(evt) {
      plotFeature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
    if( plotFeature && plotFeature.get( 'site_code_' ) ) {
      if( typeof( plotFeature.get('level') ) != 'undefined' ) {
          plotElement1.src =
                  cwcPlotUrl + "/" + plotFeature.get( 'site_code_' ) + ".png?nocache=" + Math.random();
          plotElement2.src =
                  cwcPlotUrlQC + "/" + plotFeature.get( 'site_code_' ) + ".png?nocache=" + Math.random();
          plotElement1.style.display = "block";
          plotElement2.style.display = "block";
          plotElement1.style.cursor = "pointer";
          plotElement2.style.cursor = "pointer";
          plotError1.style.display = "none";
          plotError2.style.display = "none";
          plotText1.style.display = "none";
          plotText2.style.display = "none";
      } else {
          plotElement1.style.display = "none";
          plotElement2.style.display = "none";
          plotElement1.style.cursor = "auto";
          plotElement2.style.cursor = "auto";
          plotError1.style.display = "block";
          plotError2.style.display = "block";
          plotText1.style.display = "none";
          plotText2.style.display = "none";
      }
      $('#plot3Text').get(0).style.display = "none";
      $('#plot3Div').get(0).style.display = "block";
      $('#plot3Download').get(0).style.display = "block";
      updatePlot(plotFeature);
    } else {
      plotElement1.style.display = "none";
      plotElement2.style.display = "none";
      plotElement1.style.cursor = "auto";
      plotElement2.style.cursor = "auto";
      plotError1.style.display = "none";
      plotError2.style.display = "none";
      plotText1.style.display = "block";
      plotText2.style.display = "block";
      $('#plot3Text').get(0).style.display = "block";
      $('#plot3Div').get(0).style.display = "none";
      $('#plot3Download').get(0).style.display = "none";
    }
  });

  var stageFcstPlot = new ral.timeSeries.jqplot.JQPlotTimeSeries( {
    target: "plotStageFcst",
    title: "Channel Output",
    useUtc: false,
    dateFormat: "%b %d %H:%M",
    // ticks: 14,
    tickInterval: 86400000,
    blankMessage: "Click a stream data point in the map to plot data",
    dataDownloadLinkTarget: "plotStreamLinks"
  } );

  var updatePlot = function ( /*plotWindow,*/ feature ) {
    var plot = new ral.timeSeries.jqplot.JQPlotTimeSeries(
            {
              target: 'plot3Div',
              title: 'Forecasted Stage at ' + feature.get( 'site_name' ),
              dateFormat: "%b %d",
              useUtc: false,
              tickInterval: 86400000,
              // ticks: 14,
              start: new Date(),
              end: new Date( new Date().getMilliseconds() + 86400000 ),
              // yRange: [0, null ],
              blankMessage: "Loading data...",
              legendPosition: "outsideGrid"
              // dataDownloadLinkTarget: "plot3Download"
            } );

    var date = timeSelector.getSelectedTime();
    var tsUrl = encodeURI( "../data/Forecast_tfq_CSV/" + feature.get('site_code_')
         + "/Stfq_" + feature.get('site_code_') + "_in" + date.getFullYear()
         + ( '0' + (date.getMonth()+1) ).slice(-2) + ( '0' + date.getDate() ).slice(-2) + "00Z.csv" );
    $('#plot3Download' ).attr("href", tsUrl );
    var dataSource = new ral.indiaWBG.timeSeries.FcstTimeSeriesEnsembleDataSource(
            {
              dataUrl: tsUrl,
              name: name,
              label: 'Flood Forecast',
              color: 'blue',
              yaxisLabel: 'Stage (m)',
              min: 0.0,
              badValue: -9999.00,
              convertToLocaltime: false,
              dataStartLineNumber: 1,
              plot: plot
              // dataFieldRange: [0,n]
            }
    );

    plot.addDataSource( dataSource );
    plot.sequenceChanged(timeSelector.getTimeSequence()); // Triggers re-retrieval of data sources
    // plot.redraw();
  };

  /* Step 9: add listener to export map image button */
  globalMap = map;
  var exportButton = jQuery( "#exportMapImageButton" ).on( "click", exportMapImage );
};


function exportMapImage( e )
{
  globalMap.once( 'postcompose', function( event )
    {
      try
      {
        var canvas = event.context.canvas;
        jQuery( "#exportMapImageButton" )
          .attr( "href", canvas.toDataURL('image/png') );
      }
      catch( SecurityError )
      {
        alert( "Map image cannot be exported because it contains layers with CORS disabled.  Turn off those layers and try again." );
      }
    }
  );
  globalMap.renderSync();
}
