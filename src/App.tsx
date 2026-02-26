import EmailRecipientsManagementScreen from './views/EmailRecipientsManagementScreen';
import ManagerApprovalWorkspace from './views/ManagerApprovalWorkspace';
import PdfReportGenerationDashboardOne from './views/PdfReportGenerationDashboardOne';
import SecurityLockoutSettings from './views/SecurityLockoutSettings';
import StaffInvoiceUploadDashboard from './views/StaffInvoiceUploadDashboard';
import SystemAuditLogsDashboardOne from './views/SystemAuditLogsDashboardOne';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/recipients" replace />} />
          <Route path="recipients" element={<EmailRecipientsManagementScreen />} />
          <Route path="upload" element={<StaffInvoiceUploadDashboard />} />
          <Route path="approvals" element={<ManagerApprovalWorkspace />} />
          <Route path="reports" element={<PdfReportGenerationDashboardOne />} />
          <Route path="logs" element={<SystemAuditLogsDashboardOne />} />
          <Route path="security" element={<SecurityLockoutSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
