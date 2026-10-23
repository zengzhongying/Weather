import { useState, useEffect } from 'react'
import './App.css'
import Thunderstorm from './assets/雷雨.png'
import Sunny from './assets/晴朗.png'
import Snowing from './assets/下雪.png'
import Rainfall from './assets/下雨.png'
import Haze from './assets/雾霾.png'

import { getWeather, getCityLngLat } from './service/weather'
import { useRequest } from 'ahooks';
import { message, Card, Input, Form, Row, Col, Button, Descriptions } from 'antd';
const { Meta } = Card;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const renderWeatherImg = (code) => {
  let codeNum = Number(code);
  // 无降雨
  if (codeNum < 300) {
    return Sunny;
  }
  // 有降雨  为了方便就不区分雷雨了，只标注降雨即可
  if (codeNum >= 300 && codeNum < 400) {
    return Rainfall;
  }
  // 降雪
  if (codeNum >= 400 && codeNum < 500) {
    return Snowing
  }
  // 雾霾、浓雾、可见度低
  if (codeNum >= 500 && codeNum < 900) {
    return Haze
  }

  return Sunny;  //默认返回晴朗图片
}

function App() {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getWeatherService = useRequest(getWeather, {
    manual: true,
    onSuccess: (res) => {
      setWeatherInfo(res);
    }
  })
  const getCityLngLatService = useRequest(getCityLngLat, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === '200') {
        const city = res?.location?.[0] || {};
        const cityLngLat = !!Object.keys(city)?.length ? [city?.lon, city?.lat] : [];
        // console.log(cityLngLat);
        // 当搜索到对应的城市的经纬度之后，直接发起查询天气的请求
        if (!!cityLngLat?.length) {
          getWeatherService.run(cityLngLat);
        }

      } else {
        message.error('请求错误，请重试')
      }

    }
  })

  useEffect(() => {
    getCityLngLatService.run('深圳');
  }, [])

  const [form] = Form.useForm();

  return (
    <div style={{ padding: 20 }}>
      <Form layout={'inline'} form={form} initialValues={{ city: '深圳' }} {...layout} style={{width: '100%'}}>
        <Row style={{width: '100%'}} gutter={8}>
          <Col span={20}>
            <Form.Item name="city" label="城市" rules={[{ required: true, message: '请输入城市名称' }]} required={false}>
              <Input placeholder='请输入城市名称' style={{width: '100%'}}/>
            </Form.Item>
          </Col>
          <Col span={4} style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              // style={{ marginLeft: 20 }}
              type='primary'
              loading={getWeatherService?.loading || getCityLngLatService?.loading}
              onClick={() => {
                form.validateFields().then((values, err) => {
                  if (!err) {
                    getCityLngLatService.run(values?.city);
                  }
                })
              }}>搜索</Button>
          </Col>
        </Row>

      </Form>
      <Card
        loading={getWeatherService?.loading || getCityLngLatService?.loading}
        hoverable
        variant="borderless"
        style={{ width: '100%' }}
        cover={
          <img
            draggable={false}
            alt="example"
            src={renderWeatherImg(weatherInfo?.condition?.code)}
          />
        }
      >
        <Meta description={
          <>
            <Descriptions column={2}>
              <Descriptions.Item label="当前">{weatherInfo?.condition?.text}</Descriptions.Item>
              <Descriptions.Item label="气温">{weatherInfo?.temperature?.value}{weatherInfo?.temperature?.unit}</Descriptions.Item>
              <Descriptions.Item label="最低气温">{weatherInfo?.dewPoint?.value}{weatherInfo?.dewPoint?.unit}</Descriptions.Item>
              <Descriptions.Item label="体感温度">{weatherInfo?.feelsLike?.value}{weatherInfo?.feelsLike?.unit}</Descriptions.Item>
              <Descriptions.Item label="湿度">{weatherInfo?.humidity}</Descriptions.Item>

              <Descriptions.Item label="大气压">{weatherInfo?.pressure?.value}{weatherInfo?.pressure?.unit}</Descriptions.Item>
              <Descriptions.Item label="降水量">{weatherInfo?.precipitation?.amount?.value}{weatherInfo?.precipitation?.amount?.unit}</Descriptions.Item>
              <Descriptions.Item label="降水强度">{weatherInfo?.precipitation?.intensity?.value}{weatherInfo?.precipitation?.intensity?.unit}</Descriptions.Item>
              <Descriptions.Item label="能见度">
                {weatherInfo?.visibility?.value}{weatherInfo?.visibility?.unit}
              </Descriptions.Item>
            </Descriptions>
          </>
        } />
      </Card>
    </div>
  )
}

export default App
