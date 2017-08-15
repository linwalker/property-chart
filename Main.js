import React from 'react';
import { Row, Col, Table, Form, Input, Button } from 'antd';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

const property_columns = [
  { title: '项目', dataIndex: 'name', key: 'name' },
  { title: '投资额', dataIndex: 'num', key: 'num' },
  { title: '利率', dataIndex: 'interest', key: 'interest' },
  { title: '投资期限', dataIndex: 'time', key: 'time' },
]
const data = [
  { name: '有金所', num: 7000, interest: '7.5%', time: '2017-10-12', earn: 262.5 },
  { name: '苏宁金融', num: 5154.76, interest: '4.4%', time: '--', earn: '--' },
  { name: '网商银行', num: 10252.32, interest: '4.1%', time: '--', earn: '--' },
  { name: '微众银行', num: 18732.2, interest: '4.3%', time: '--', earn: '--' },
  { name: '点融网', num: 6000, interest: '7%', time: '--', earn: '--' },
  { name: '基金', num: 2284.73, interest: '--', time: '--', earn: '--' },
  { name: '微众金', num: 1328.54, interest: '--', time: '--', earn: '--' },
];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finance: []
    }
  }
  renderChart = () => {
    var G2 = require('g2');
    var Stat = G2.Stat;
    var chart = new G2.Chart({
      id: 'chart',
      forceFit: true,
      height: 450
    });
    if (!this.state.finance) {
      return;
    }
    chart.source(this.state.finance);
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
        value: 'num'
      }
    });
    chart.intervalStack()
      .position(Stat.summary.percent('num'))
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
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const finance = this.state.finance;
        finance.push(values);
        this.setState({
          finance:  finance
        })
        console.log(this.state.finance)
      }
    });
  }
  componentDidMount() {
    this.renderChart();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { finance } = this.state;
    console.log(this.state);
    console.log(finance)
    return (
      <div>
        <div className="gutter-example">
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <h3>来，少年，输入你的理财项目！</h3>
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="理财项目"
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入理财项目!',
                    }],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="投资额"
                >
                  {getFieldDecorator('num', {
                    rules: [{
                      required: true, message: '请输入理财资金!',
                    }],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="利率"
                >
                  {getFieldDecorator('interest', {
                    rules: [{
                      required: true, message: '请输入收益率!',
                    }],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="投资期限"
                >
                  {getFieldDecorator('time')(
                    <Input />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
              </Form>
            </Col>
            <Col className="gutter-row" span={12}>
              <div id="chart"></div>
              <Table dataSource={finance} columns={property_columns} paginatio={false} />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
const WrapApp = Form.create()(App);
export default WrapApp;