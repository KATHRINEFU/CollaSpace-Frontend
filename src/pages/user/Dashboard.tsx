import "../../muse.main.css";
import "../../muse.responsive.css";
import { Breadcrumb, Button , Layout} from "antd"

export function Component() {
    const { Content } = Layout;
    return (
        <>
        <Breadcrumb style={{ margin: '24px 16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="rounded-lg" style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}>
            <div className="w-full flex items-center justify-center gap-6">
                <Button type="primary" style={{width: '140px'}}>Create Event</Button>
                <Button type="primary" style={{width: '140px'}}>Create Ticket</Button>
                <Button type="primary" style={{width: '140px'}}>Create Team</Button>
                <Button type="primary" style={{width: '140px'}}>My Calendar</Button>
                <Button type="primary" style={{width: '140px'}}>My Report</Button>
            </div>

          </div>
        </Content>
        </>
    )
}