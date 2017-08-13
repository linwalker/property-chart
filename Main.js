import React from 'react';
import { Row, Col, Table } from 'antd';
const property_columns = [
  { title: '项目', dataIndex: 'name', key: 'name' },
  { title: '投资额', dataIndex: 'value', key: 'value' },
  { title: '利率', dataIndex: 'profit', key: 'profit' },
  { title: '投资到期', dataIndex: 'complete_data', key: 'complete_data' },
  { title: '预期收入', dataIndex: 'earn', key: 'earn' },
]
const data = [
  { name: '有金所', value: 7000, profit: '7.5%', complete_data: '2017-10-12', earn: 262.5 },
  { name: '苏宁金融', value: 5154.76, profit: '4.4%', complete_data: '--', earn: '--' },
  { name: '网商银行', value: 10252.32, profit: '4.1%', complete_data: '--', earn: '--' },
  { name: '微众银行', value: 18732.2, profit: '4.3%', complete_data: '--', earn: '--' },
  { name: '点融网', value: 6000, profit: '7%', complete_data: '--', earn: '--' },
  { name: '基金', value: 2284.73, profit: '--', complete_data: '--', earn: '--' },
  { name: '微众金', value: 1328.54, profit: '--', complete_data: '--', earn: '--' },
];
export default class App extends React.Component {
  componentDidMount() {
    var G2 = require('g2');
    var Stat = G2.Stat;
    var chart = new G2.Chart({
      id: 'chart',
      forceFit: true,
      height: 450
    });
    chart.source(data);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    chart.coord('theta', {
      radius: 0.8 // 设置饼图的大小
    });
    chart.legend('name', {
      position: 'bottom',
      itemWrap: true,
      formatter: function (val) {
        for (var i = 0, len = data.length; i < len; i++) {
          var obj = data[i];
          if (obj.name === val) {
            return val + ': ' + obj.value;
          }
        }
      }
    });
    chart.tooltip({
      title: null,
      map: {
        value: 'value'
      }
    });
    chart.intervalStack()
      .position(Stat.summary.percent('value'))
      .color('name')
      .label('name*..percent', function (name, percent) {
        percent = (percent * 100).toFixed(2) + '%';
        return name + ' ' + percent;
      });
    chart.render();
    // 设置默认选中
    var geom = chart.getGeoms()[0]; // 获取所有的图形
    var items = geom.getData(); // 获取图形对应的数据
    geom.setSelected(items[1]); // 设置选中
  }
  render() {
    return (
      <div>
        <div className="gutter-example">
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">col-6</div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div id="chart">col-6</div>
              <Table dataSource={data} columns={property_columns} paginatio={false}/>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">col-6</div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}