# offline-search

Add an interactive search box to all of your grids, even offline!

The online widgets supports searching across multiple fields (including associations), similar to the built-in list view search capabilities. The offline widget supports searching on a single field.

## Description

Adds a single-field search box to list views!

![Not Searching](/assets/LV_Normal_Offline.jpg)

![Searching](/assets/LV_Searching_Offline.jpg)

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Configuration

To use this widget, simply drop it on a page with a data grid, template grid, or list view and set up a few properties:

* Grid Name: the "name" property of the list widget you want to search in
* Grid Entity: the entity show in the data grid. NOTE: this is a text field in the offline widget. You must enter the value as: ModuleName.EntityName
* Search Attribute: the attribute on the grid entity to be searched. NOTE: this is a text field in the offline widget. You must enter the name of the attribute manually, exactly as it appears in the domain model.

## Supported Data Types

The following data types are supported:
 - String
 - Integer
 - Long
 - Decimal
 - Enumeration
 - AutoNumber

## Supported Mendix versions and browsers

Testing was completed in Mendix 6.10.3, and Mendix 7.3 on Chrome, IE, Firefox, Edge, and Safari on iOS but it should
support even lower mendix versions up to Mendix 5.21.4.

## Limitations

Due to current platform constraints, the offline widget cannot search on multiple fields or over associations.
