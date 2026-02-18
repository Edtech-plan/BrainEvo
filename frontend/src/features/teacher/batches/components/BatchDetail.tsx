import React, { useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useBatchDetails } from "../hooks/useBatchDetails";
import { useBatchStudents } from "../hooks/useBatchStudents";
import { useBatchResources } from "../hooks/useBatchResources";
import {
  BatchHeader,
  BatchTabs,
  StudentTable,
  ResourceManager,
  AddStudentModal,
} from "./detail";
import { theme } from "../../../../../styles/theme";

// 1. Define the Props Interface
interface BatchDetailProps {
  batchId: string;
  onBack: () => void;
}

export const BatchDetail: React.FC<BatchDetailProps> = ({
  batchId,
  onBack,
}) => {
  const [tab, setTab] = useState<"roster" | "resources" | "attendance">(
    "roster",
  );

  const { user } = useAuth();
  const { batch, stats, loading, refetch: refetchBatch } = useBatchDetails(batchId);
  const { students, loading: loadingS, addStudent, removeStudent } = useBatchStudents(batchId);

  const handleAddStudent = async (studentId: string) => {
    await addStudent(studentId);
    refetchBatch();
  };

  const handleRemoveStudent = async (studentId: string) => {
    await removeStudent(studentId);
    refetchBatch();
  };

  const { resources, deleteResource, uploadFile, isUploading } =
    useBatchResources(batchId);

  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

  if (loading || !batch) {
    return (
      <div className="p-12 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 mx-auto"></div>
        <div className="h-64 w-full bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Pass the onBack prop to the Header */}
      <BatchHeader batch={batch} stats={stats} onBack={onBack} />

      <BatchTabs activeTab={tab} onChange={setTab} />

      <div className="min-h-[400px]">
        {tab === "roster" &&
          (loadingS ? (
            <div className="p-4" style={{ color: theme.colors.textSecondary }}>
              Loading roster...
            </div>
          ) : (
            <>
              <StudentTable
                students={students}
                onAddStudent={() => setAddStudentModalOpen(true)}
                onRemoveStudent={handleRemoveStudent}
              />
              <AddStudentModal
                isOpen={addStudentModalOpen}
                onClose={() => setAddStudentModalOpen(false)}
                onAdd={handleAddStudent}
                organizationId={
                  typeof user?.organizationId === "string"
                    ? user.organizationId
                    : (user?.organizationId as { id?: string })?.id ?? ""
                }
                existingStudentIds={students.map((s) => s.id)}
              />
            </>
          ))}

        {tab === "resources" && (
          // FIX: Pass the new props to ResourceManager
          <ResourceManager
            resources={resources}
            onDelete={deleteResource}
            onUpload={uploadFile}
            isUploading={isUploading}
          />
        )}

        {tab === "attendance" && (
          <div
            className="p-12 text-center border-2 border-dashed rounded-xl"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.textSecondary,
            }}
          >
            Attendance Module Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};
