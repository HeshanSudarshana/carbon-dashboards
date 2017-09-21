/*
 *  Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
import React from 'react';

import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import WidgetInfoAPIS from './utils/widget-info-apis';
import {widgetLoadingComponent, dashboardLayout} from './WidgetLoadingComponent';
import WidgetListThumbnail from './WidgetListThumbnail';

const styles = {
    open: {
    },
    close: {
        display: 'none'
    }
};

var widgets = [];
var isDashboardLoaded = false;

class WidgetsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widgets: [],
            show: this.props.show
        }

        this.searchWidget = this.searchWidget.bind(this);
        // this.isDisplayed = this.isDisplayed.bind(this);
        this.setWidgets = this.setWidgets.bind(this);
    }

    // searchWidget(event, value) {
    //     let filteredWidgetList = this.props.widgetList.filter(function (widget) {
    //         return widget.name.toLowerCase().includes(value.toLowerCase());
    //     });
    //     this.state.filteredWidgetSet = new Set(filteredWidgetList.map((widget) => {
    //         return widget.name
    //     }));
    //     this.setState({widgetList: filteredWidgetList});
    // }

    searchWidget(event, value) {
        let filteredWidgetList = widgets.filter(function (widget) {
            return widget.name.toLowerCase().includes(value.toLowerCase());
        });
        this.setState({widgets: filteredWidgetList});
    }

    // componentWillReceiveProps(props) {
    //     this.state = {
    //         widgetList: this.props.widgetList,
    //         filteredWidgetSet: new Set(props.widgetList.map((widget) => {
    //             return widget.name
    //         }))
    //     }
    // }

    // isDisplayed(widgetId) {
    //     if (this.state.filteredWidgetSet.has(widgetId)) {
    //         return "block";
    //     } else {
    //         return "none";
    //     }
    // }

    componentDidMount() {
        let widgetInfoAPIS = new WidgetInfoAPIS();
        let promisedWidgetInfo = widgetInfoAPIS.getWidgetsInfo();
        promisedWidgetInfo
            .then(this.setWidgets)
            .catch(function (error) {
            //TODO Need to use proper notification library to show the error
        });
        widgetLoadingComponent.setfinishedRegisteringCallback(this.initializeWidgetList);
        widgetLoadingComponent.onStateChanged(function(config) {
            console.log('>>>>>>>>>>>>');
            console.log(config);
        })
    }

    setWidgets(response) {
        widgets = response.data;
        this.setState({
            widgets: widgets
        }, this.initializeWidgetList);
    }

    initializeWidgetList(isWidgetsLoaded, initDashboardFlag) {
        let newItemConfig;
        if (isWidgetsLoaded) {
            isDashboardLoaded = true;
        }
        if (!(widgets.length === 0) && isDashboardLoaded) {
            widgets.map(widget => {
                newItemConfig = {
                    title: widget.name,
                    type: 'react-component',
                    component: widget.name
                };
                widgetLoadingComponent.createDragSource(document.getElementById(widget.name), newItemConfig);
                widgetLoadingComponent.loadWidget(widget.name);
            });
            if (initDashboardFlag) {
                widgetLoadingComponent.initializeDashboard();
            }
        }
    }

    render() {
        return (
            <div style={this.props.show ? styles.open : styles.close}>
                <div className="widget-list-header">WIDGETS LIST</div>
                <div className="widget-search-div">
                    <TextField onChange={this.searchWidget} hintText="Search.." />
                </div>
                <Divider/>
                {
                    this.state.widgets.map(widget => {
                        return <WidgetListThumbnail widgetID={widget.name} isDisplayed="block" widgetName={widget.name} />;
                    })
                }
        </div>);
    }
}

export default WidgetsList;