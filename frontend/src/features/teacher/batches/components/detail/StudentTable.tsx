import React from "react";
import { Mail, MoreVertical, Trash2, UserPlus } from "lucide-react";
import { BatchStudent } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../../styles/theme";

interface StudentTableProps {
  students: BatchStudent[];
  onAddStudent?: () => void;
  onRemoveStudent?: (studentId: string) => void;
}

export const StudentTable = ({ students, onAddStudent, onRemoveStudent }: StudentTableProps) => {
  const thStyle = {
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: 700,
    color: theme.colors.textSecondary,
    textTransform: "uppercase" as const,
    backgroundColor: theme.colors.bgMain,
    borderBottom: `1px solid ${theme.colors.border}`,
    whiteSpace: "nowrap" as const,
  };
  const tdStyle = {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.colors.bgHover}`,
    fontSize: "14px",
    color: theme.colors.textMain,
    whiteSpace: "nowrap" as const,
  };

  return (
    <div
      className="rounded-xl border shadow-sm overflow-hidden"
      style={{
        backgroundColor: theme.colors.bgSurface,
        borderColor: theme.colors.border,
      }}
    >
      {onAddStudent && (
        <div
          className="flex justify-end p-4 border-b"
          style={{ borderColor: theme.colors.border }}
        >
          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: theme.colors.primary,
              color: "#fff",
            }}
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th style={thStyle}>Student</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Joined</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Attendance</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Status</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition">
                <td style={tdStyle}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm"
                      style={{
                        backgroundColor: theme.colors.primaryLight,
                        color: theme.colors.primary,
                      }}
                    >
                      {s.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm md:text-base">
                        {s.name}
                      </div>
                      <div
                        className="text-xs flex items-center gap-1 mt-0.5"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        <Mail size={10} /> {s.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {s.joinDate}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: theme.colors.bgMain,
                      borderColor: theme.colors.border,
                    }}
                  >
                    {s.attendanceRate}%
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <span
                    className="px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold uppercase"
                    style={{
                      backgroundColor:
                        s.status === "at_risk"
                          ? theme.colors.errorBg
                          : theme.colors.successBg,
                      color:
                        s.status === "at_risk"
                          ? theme.colors.error
                          : theme.colors.successText,
                    }}
                  >
                    {s.status.replace("_", " ")}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {onRemoveStudent ? (
                    <button
                      onClick={() => onRemoveStudent(s.id)}
                      className="p-1.5 rounded hover:bg-red-50 transition"
                      style={{ color: theme.colors.error }}
                      title="Remove from batch"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <MoreVertical size={16} color={theme.colors.textSecondary} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
