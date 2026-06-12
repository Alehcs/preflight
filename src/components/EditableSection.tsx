"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

export default function EditableSection({
  value,
  onChange,
  multiline = true,
  bold = false,
}: {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  bold?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function save() {
    onChange(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  const valueClassName = `text-gray-900 text-sm leading-relaxed ${
    bold ? "font-semibold text-base" : "text-gray-700"
  }`;

  return (
    <div>
      <div className="print-hidden">
        {editing ? (
          <div className="space-y-2">
            {multiline ? (
              <textarea
                autoFocus
                rows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full border border-indigo-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            ) : (
              <input
                autoFocus
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full border border-indigo-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={save}
                className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Done
              </button>
              <button
                onClick={cancel}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <p className={valueClassName}>{value}</p>
            <button
              onClick={() => {
                setDraft(value);
                setEditing(true);
              }}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 shadow-sm"
              aria-label="Edit"
              title="Edit"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      <p className={`print-only ${valueClassName}`}>{value}</p>
    </div>
  );
}
