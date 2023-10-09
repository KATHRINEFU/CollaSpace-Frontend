import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  DatePicker,
  TimePicker
} from 'antd';
import { useState } from 'react';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 8,
        },
    },
};

  

export function Component() {
    const [form] = Form.useForm();
    const {Option} = Select;

    const [eventType, setEventType] = useState("");

    const handleChangeEventType = (value: string) => {
        setEventType(value);
        form.setFieldValue("type", value);
    }

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
      };

    return(
        <>
        <Form
            {...formItemLayout}
            form={form}
            onFinish={onFinish}
            scrollToFirstError
        >
            <div className='relative flex flex-col flex-auto min-w-0 p-4 mt-6 mx-3 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border'>
                <h2 className='text-xl font-bold m-auto'> New Event</h2>
                <div className='h-px mx-6 my-4 justify-center bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent'></div>
                <Row gutter={24}>
                    <Col span={2}/>
                    <Col span={10}>
                    <div>
                        <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Event Title</p>
                        
                        <Form.Item
                            name="title"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your event title',
                            },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div>
                        <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Event Description</p>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: 'Please input description' }]}
                        >
                            <Input.TextArea rows={4} showCount maxLength={200} />
                        </Form.Item>
                    </div>

                    <div>
                        <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Within Team</p>
                        <Form.Item
                            name="creationTeam"
                            rules={[
                            {
                                required: true,
                                message: 'Please select the creation team',
                            },
                            ]}
                        >
                            <Select placeholder="Select a team">
                                <Option value="teamA">Team A</Option>
                                <Option value="teamB">Team B</Option>
                                <Option value="teamC">Team C</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div>
                        <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Event Type</p>
                        <Form.Item
                            name="type"
                            rules={[
                            {
                                required: true,
                                message: 'Please select the event type',
                            },
                            ]}
                        >
                            <Select placeholder="Select an event type" onChange={handleChangeEventType}>
                            <Option value="document">Document</Option>
                            <Option value="meeting">Meeting</Option>
                            <Option value="activity">Activity</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    </Col>

                    <Col span={10}>

                    {eventType === 'document' && (
                        <>
                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Link</p>
                            <Form.Item name="link">
                                <Input />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Deadline</p>
                            <Form.Item name="deadlineDate">
                                <DatePicker  
                                    className="w-full" 
                                />
                            </Form.Item>
                        </div>
                        
                        
                        </>
                    )}

                    {eventType === 'meeting' && (
                        <>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Virtual</p>
                            <Form.Item name="virtual" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Location</p>
                            <Form.Item name="location">
                                <Input />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Link</p>
                            <Form.Item name="link">
                                <Input />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Date</p>
                            <Form.Item name="date">
                                <DatePicker className='w-full'/>
                            </Form.Item>
                        </div>

                        <div className='flex w-full'>
                            <div>
                                <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Start Time</p>
                                <Form.Item name="startTime">
                                    <TimePicker format="HH:mm"/>
                                </Form.Item>
                            </div>

                            <div>
                                <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>End Time</p>
                                <Form.Item name="endTime">
                                    <TimePicker format="HH:mm" />
                                </Form.Item>
                            </div>
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Note Link</p>
                            <Form.Item name="noteLink">
                                <Input />
                            </Form.Item>
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Agenda Link</p>
                            <Form.Item name="agendaLink">
                                <Input />
                            </Form.Item>
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Meeting Type</p>
                            <Form.Item name="meetingType">
                            <Select placeholder="Select a meeting type">
                                <Option value="document">Business</Option>
                                <Option value="meeting">Internal</Option>
                                <Option value="activity">Casual</Option>
                            </Select>
                            </Form.Item>
                        </div>
                        </>
                    )}

                    {eventType === 'activity' && (
                        <>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Virtual</p>
                            <Form.Item name="virtual" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Location</p>
                            <Form.Item name="location">
                                <Input />
                            </Form.Item>
                        
                        </div>

                        <div>
                            <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Date</p>
                            <Form.Item name="date">
                                <DatePicker className='w-full'/>
                            </Form.Item>
                        </div>

                        <div className='flex w-full'>
                            <div>
                                <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>Start Time</p>
                                <Form.Item name="startTime">
                                    <TimePicker format="HH:mm"/>
                                </Form.Item>
                            </div>

                            <div>
                                <p className='inline-block mb-1 ml-1 text-base font-semibold text-slate-700'>End Time</p>
                                <Form.Item name="endTime">
                                    <TimePicker format="HH:mm" />
                                </Form.Item>
                            </div>
                        </div>
                        </>
                    )}
                    </Col>

                    <Col span={2}/>
                </Row>
                
            

            
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Create
                </Button>
            </Form.Item>
            </div>

      
    </Form>
        </>
    )
}