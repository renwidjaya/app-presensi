import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BasicTableKaryawan from "../../components/karyawan/BasicTableKaryawan";

export default function ListKaryawan() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Karyawan" />
      <div className="space-y-6">
        <ComponentCard title="Data Karyawan">
          <BasicTableKaryawan />
        </ComponentCard>
      </div>
    </>
  );
}
