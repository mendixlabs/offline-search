# Offline search

Add an interactive search box to all of your grids, even offline!
It supports searching on single field similar to the built-in list view search capabilities.

## Features
* Search through a single field
* Open search in default
* Hide / Show search bar

## Limitations
Supports only list views
The following data types are supported:
 - String
 - Integer
 - Long
 - Decimal
 - Enumeration
 - AutoNumber

Due to current platform constraints, the offline widget cannot search on multiple fields or over associations.


## Dependencies
Mendix 7.3

## Demo project

[https://offlinesearch.mxapps.io/](https://offlinesearch.mxapps.io/)

![Not Searching](/assets/LV_Normal_Offline.jpg)

![Searching](/assets/LV_Searching_Offline.jpg)

## Usage
![Data source](/assets/Datasource.png)
![Appearance](/assets/Appearance.png)

 ### Data source configuration
 - On the `Grid name` option of the `Data source` tab, input the "name" property of the list widget you want to search in.
 - On the `Search method` option of the `Data source` tab, select the search name that you will to
to use to constrain the data on the grid.
 - On the `Grid entity` option of the `Data source` tab, input the name of the entity to be used in the filter.
 the entity shown in the list widget. You must enter the value as: `ModuleName.EntityName`
 - On the `Search attribute` option of the `Data source` tab, input the name of the field or attribute on the list widget entity to be searched.
 You must enter the name of the attribute manually, exactly as it appears in the domain model.
 - On the `Default query` option of the `Data source` tab, input the name of default query to be used when the when the
 widget is first launched for the first time.

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/offline-search/issues](https://github.com/mendixlabs/offline-search/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone https://github.com/mendixlabs/offline-search.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/mendixlabs/offline-search/releases/latest](https://github.com/mendixlabs/offline-search/latest)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
