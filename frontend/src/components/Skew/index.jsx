import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { Button, ButtonToolbar, Panel, Table } from "react-bootstrap";
import NVD3Chart from "react-nvd3";
import d3 from 'd3';
import CodebookLabelMenu from '../CodebookLabelMenu';

const columns = [
    {
        Header: "id",
        accessor: "id",
        show: false
    },
    {
        Header: "Unlabeled Data",
        accessor: "data",
        filterMethod: (filter, row) => {
            if(String(row["data"]).toLowerCase().includes(filter.value.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }
    }
];

class Skew extends React.Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {
        this.props.getUnlabeled();
        this.props.getLabelCounts();
    }


    render() {

        const { unlabeled_data, labels, skewLabel, label_counts } = this.props;


        var label_data = [];
        if(label_counts) {
            label_data = label_counts;
        }

        if(unlabeled_data) {
            var table_data = unlabeled_data
        } else {
            table_data = []
        }

        return (
            <div>
                <Table id="skew_table">
                    <tbody>
                        <tr>
                            <td className="col-md-4">
                                <h3>Instructions</h3>
                                <p>This page allows an admin to manually search for and annotate data in the case of a particularly bad data skew.</p>
                                <p>To the left is a chart that shows the distribution of labels in the project. Below is all of the unlabeled data that are not in a queue.</p>
                                <p>To annotate, click on a data entry below and select the label from the expanded list of labels. As you label data the chart to the left will update.</p>
                            </td>
                            <td className="col-md-4">
                                <Panel id="chart_panel">
                                    <NVD3Chart
                                        id="label_counts"
                                        type="multiBarChart"
                                        datum={label_data}
                                        duration={300}
                                        groupSpacing={0.1}
                                        stacked={true}
                                        height={300}
                                        yAxis={{
                                            axisLabel: "Number of Data Annotated",
                                            axisLabelDistance: -5,
                                            tickFormat: d3.format(',.01f')
                                        }}
                                        xAxis={{
                                            axisLabel: "Label",
                                            axisLabelDistance: 15,
                                            showMaxMin: false
                                        }}
                                        noData="Insufficient labeled data"
                                        margin={{
                                            bottom: 20,
                                            left: 70
                                        }}
                                    />
                                </Panel>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <CodebookLabelMenu
                    labels={labels}
                />
                <ReactTable
                    data={table_data}
                    columns={columns}
                    filterable={true}
                    showPageSizeOptions={false}
                    pageSize={(table_data.length < 50) ? table_data.length : 50}
                    SubComponent={row => {
                        return (
                            <div className="sub-row">
                                <p id="skew_text">{row.row.data}</p>
                                <div id="skew_buttons">
                                    <ButtonToolbar bsClass="btn-toolbar pull-right">
                                        {labels.map( (label) => (
                                            <Button key={label.pk.toString() + "_" + row.row.id.toString()}
                                                onClick={() => skewLabel(row.row.id, label.pk)}
                                                bsStyle="primary"
                                            >{label.name}</Button>
                                        ))}
                                    </ButtonToolbar>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
        )
    }

}


//This component will have
//data for the table
//data for the graph
//accessors for both
Skew.propTypes = {
    getUnlabeled: PropTypes.func.isRequired,
    unlabeled_data: PropTypes.arrayOf(PropTypes.object),
    labels: PropTypes.arrayOf(PropTypes.object),
    skewLabel: PropTypes.func.isRequired,
    getLabelCounts: PropTypes.func.isRequired,
    label_counts: PropTypes.arrayOf(PropTypes.object)
};

export default Skew;
