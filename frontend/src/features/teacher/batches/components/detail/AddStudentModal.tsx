import React, { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { theme } from "../../../../../shared/components/ui/theme";
import type { User } from "../../../../../shared/types";
import organizationService from "../../../../../modules/organization/organization.service";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (studentId: string) => Promise<void>;
  organizationId: string;
  existingStudentIds: string[];
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  organizationId,
  existingStudentIds,
}) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen && organizationId && organizationId.trim()) {
      setLoading(true);
      setError(null);
      organizationService
        .getMembers(organizationId)
        .then((res: { members?: User[]; data?: User[] }) => {
          const list = res?.members ?? res?.data ?? [];
          const learners = list.filter(
            (u) => u.role === "learner" && !existingStudentIds.includes(u.id ?? (u as { _id?: string })._id ?? "")
          );
          setMembers(
            learners.map((u) => ({
              ...u,
              id: (u as { _id?: string })._id ?? u.id,
            }))
          );
        })
        .catch(() => setError("Failed to load members"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, organizationId, existingStudentIds.join(",")]);

  if (!isOpen) return null;

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (studentId: string) => {
    try {
      setSubmitting(true);
      setError(null);
      await onAdd(studentId);
      setMembers((prev) => prev.filter((m) => (m.id ?? (m as { _id?: string })._id) !== studentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add student");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgMain,
    outline: "none",
    color: theme.colors.textMain,
    fontSize: "14px",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        style={{ backgroundColor: theme.colors.bgSurface }}
      >
        <div
          className="p-5 md:p-6 border-b flex justify-between items-center shrink-0"
          style={{ borderColor: theme.colors.border }}
        >
          <h2 className="text-lg md:text-xl font-bold" style={{ color: theme.colors.textMain }}>
            Add Student
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} color={theme.colors.textSecondary} />
          </button>
        </div>

        <div className="p-5 md:p-6 flex-1 overflow-hidden flex flex-col">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
            className="mb-4"
          />

          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{ backgroundColor: theme.colors.errorBg, color: theme.colors.error }}
            >
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="py-8 text-center" style={{ color: theme.colors.textSecondary }}>
                Loading learners...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center" style={{ color: theme.colors.textSecondary }}>
                {!organizationId || !organizationId.trim()
                  ? "You need to be in an organization to add students."
                  : "No learners available to add. All org members may already be in this batch."}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((m) => {
                  const id = m.id ?? (m as { _id?: string })._id;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: theme.colors.bgMain,
                        borderColor: theme.colors.border,
                      }}
                    >
                      <div>
                        <div className="font-semibold" style={{ color: theme.colors.textMain }}>
                          {m.name}
                        </div>
                        <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {m.email}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdd(id!)}
                        disabled={submitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: "#fff",
                        }}
                      >
                        <UserPlus size={14} /> Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
