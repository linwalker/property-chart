import React from 'react';
import { Row, Col, Table, Form, Input, Button, InputNumber } from 'antd';
import './Main.css';
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
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finance: []
    }
    this.chart1 = null;
  }
  renderChart = () => {
    const G2 = require('g2');
    const Stat = G2.Stat;
    if (this.chart1) {
      this.chart1.clear()
    } else {
      this.chart1 = new G2.Chart({
        id: 'chart',
        forceFit: true,
        height: 450
      });
    }

    const data = this.state.finance;
    console.log(data);
    if (!data) {
      return;
    }
    this.chart1.source(data);
    // 重要：绘制饼图时，必须声明 theta 坐标系
    this.chart1.coord('theta', {
      radius: 0.8 // 设置饼图的大小
    });
    this.chart1.legend('name', {
      position: 'bottom',
      itemWrap: true,
      formatter: function (val) {
        for (let i = 0, len = data.length; i < len; i++) {
          const obj = data[i];
          if (obj.name === val) {
            return val + ': ' + obj.value;
          }
        }
      }
    });
    this.chart1.tooltip({
      title: null,
      map: {
        value: 'num'
      }
    });
    this.chart1.intervalStack()
      .position(Stat.summary.percent('num'))
      .color('name')
      .label('name*..percent', function (name, percent) {
        percent = (percent * 100).toFixed(2) + '%';
        return name + ' ' + percent;
      });
    this.chart1.render();
    // 设置默认选中
    const geom = this.chart1.getGeoms()[0]; // 获取所有的图形
    const items = geom.getData(); // 获取图形对应的数据
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
          finance: finance
        })
        console.log(this.state.finance);
        this.renderChart()
      }
    });
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.renderChart();
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    console.log('this.state', this.state);
    console.log('nextState', nextState);
    return true;
  }
  componentWillUpdate() {
    console.log('componentWillUpdate')
    this.renderChart();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { finance } = this.state;
    console.log('render');
    return (
      <div>
        <div className="gutter-example">
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <h3 className="inputTitle">来，少年，输入你的理财项目！</h3>
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
                    rules: [
                      { required: true, message: '请输入投资额!' },
                    ],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="利率"
                >
                  {getFieldDecorator('interest', {
                    rules: [
                      { required: true, message: '请输入利率!' },
                    ],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="投资期限"
                >
                  {getFieldDecorator('time', { initialValue: 12 })(
                    <InputNumber min={1} max={120} />
                  )}
                  <span className="ant-form-text"> 个月</span>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
              </Form>
            </Col>
            <Col className="gutter-row" span={12}>
              <h3 className="inputTitle">资产情况</h3>
              <Table
                dataSource={finance}
                columns={property_columns}
                paginatio={false} />
              <div id="chart"></div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
const WrapApp = Form.create()(App);
export default WrapApp;