import DashboardSidebar from '../component/dashboardSidebar';

const DashboardLayout = ({children}) => {
    return (
        <div>
            <div>
                <DashboardSidebar></DashboardSidebar>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;