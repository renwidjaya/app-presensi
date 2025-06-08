import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicTableLaporan from "../../components/laporan/BasicTableLaporan";

export default function ListLaporan() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Laporan" />
      <div className="space-y-6">
        <ComponentCard title="Data Laporan">
          <BasicTableLaporan />
        </ComponentCard>
      </div>
    </>
  );
}
