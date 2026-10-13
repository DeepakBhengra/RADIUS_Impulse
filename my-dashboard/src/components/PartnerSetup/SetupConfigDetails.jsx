import { useState, useRef, useCallback } from "react";
import {
  BadgeCheck,
  Database,
  FileText,
  Globe,
  Hash,
  Send,
  Settings,
} from "lucide-react";
import { createPortal } from "react-dom";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

import {
  normalizeSetupRecord,
  statusColor,
} from "./setupDetailsUtils";
import { PARTNER_SETUP_FIELD_GROUPS } from "./setupFieldConfig";

import "./SetupConfigDetails.css";

const TABLE_COLUMNS = [
  { key: "srceSysKeyId", label: "Source System Key", icon: Hash, className: "partner-col-key" },
  { key: "srceSysId", label: "Source System", icon: Globe, className: "partner-col-source" },
  { key: "formatId", label: "Format", icon: FileText, className: "partner-col-format" },
  { key: "docId", label: "Document ID", icon: FileText, className: "partner-col-doc" },
  { key: "commuId", label: "Communication ID", icon: Send, className: "partner-col-communication" },
  { key: "dirFlgCd", label: "Direction", icon: BadgeCheck, className: "partner-col-direction" },
  { key: "internetAddrTxt", label: "Internet Address", icon: Globe, className: "partner-col-address" },
  { key: "sendThruId", label: "Send Thru", icon: Database, className: "partner-col-send" },
  { key: "activeStatus", label: "Status", icon: Settings, className: "partner-col-status" },
];

function isEmptyValue(value) {
  return value === null || value === undefined || value === "" || value === "—";
}

function formatFieldValue(field, value) {
  if (isEmptyValue(value)) return "—";
  if (field.type === "date") return formatDateTime(value);
  return String(value);
}

// ── The hover card: every field from PARTNER_SETUP_FIELD_GROUPS, grouped
// and scrollable, shown next to whichever key the mouse is over. This is
// the entire replacement for the old "click a row -> open a new page" flow.
function SetupHoverCard({ record }) {
  return (
    <div className="partner-hover-card">
      <div className="partner-hover-card-header">
        <span className="partner-hover-card-title">{record.srceSysKeyId}</span>
        <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge>
      </div>
      <div className="partner-hover-card-body">
        {PARTNER_SETUP_FIELD_GROUPS.map((group) => (
          <div key={group.id} className="partner-hover-group">
            <div className="partner-hover-group-label">{group.label}</div>
            {group.fields.map((field) => (
              <div key={field.key} className="partner-hover-row">
                <span className="partner-hover-field-label">{field.label}</span>
                <span className="partner-hover-field-value">
                  {formatFieldValue(field, record[field.key])}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SetupTableCell({ column, value }) {
  if (isEmptyValue(value)) {
    return <span className="partner-table-empty">—</span>;
  }

  if (column.key === "activeStatus") {
    return <Badge color={statusColor(value)}>{value}</Badge>;
  }

  if (column.key === "srceSysKeyId" || column.key === "srceSysId") {
    const Icon = column.key === "srceSysKeyId" ? Hash : Globe;
    return (
      <div className="partner-source-key">
        <span className="partner-source-key-icon">
          {/* <Icon size={12} /> */}
        </span>
        <span
          className={column.key === "srceSysKeyId" ? "partner-source-key-value" : "partner-table-value"}
          title={String(value)}
        >
          {String(value)}
        </span>
      </div>
    );
  }

  return (
    <span className="partner-table-value" title={String(value)}>
      {String(value)}
    </span>
  );
}

function SetupTableHeader() {
  return (
    <div className="partner-table-header">
      {TABLE_COLUMNS.map((column) => {
        const Icon = column.icon;
        return (
          <div key={column.key} className={`partner-table-header-cell ${column.className}`}>
            <div className="partner-table-header-content">
              <Icon size={11} className="partner-table-header-icon" />
              <span>{column.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Row is now hover-only: no click, no navigation. Hovering ANY cell in
// the row reveals the full-detail card, anchored to the Source Key column.
function SetupTableRow({ record }) {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const anchorRef = useRef(null);
  const closeTimer = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openCard = useCallback(() => {
    clearCloseTimer();
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
    }
    setHovered(true);
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setHovered(false), 150);
  }, []);

  return (
    <div className="partner-table-row" onMouseLeave={scheduleClose}>
      {TABLE_COLUMNS.map((column) => (
        <div key={column.key} className={`partner-table-cell ${column.className}`}>
          {column.key === "srceSysKeyId" ? (
            <div ref={anchorRef} className="partner-hover-anchor" onMouseEnter={openCard}>
              <SetupTableCell column={column} value={record[column.key]} />
            </div>
          ) : (
            <SetupTableCell column={column} value={record[column.key]} />
          )}
        </div>
      ))}

      {hovered &&
        createPortal(
          <div
            className="partner-hover-card"
            style={{ position: "fixed", top: coords.top, left: coords.left }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
          >
            <div className="partner-hover-card-header">
              <span className="partner-hover-card-title">{record.srceSysKeyId}</span>
              <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge>
            </div>
            <div className="partner-hover-card-body">
              {PARTNER_SETUP_FIELD_GROUPS.map((group) => (
                <div key={group.id} className="partner-hover-group">
                  <div className="partner-hover-group-label">{group.label}</div>
                  {group.fields.map((field) => (
                    <div key={field.key} className="partner-hover-row">
                      <span className="partner-hover-field-label">{field.label}</span>
                      <span className="partner-hover-field-value">
                        {formatFieldValue(field, record[field.key])}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function SetupConfigDetails({ config }) {
  const records = (() => {
    if (Array.isArray(config)) {
      return config
        .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
        .map((entry) => normalizeSetupRecord(entry));
    }
    if (config && typeof config === "object" && !Array.isArray(config)) {
      return [normalizeSetupRecord(config)];
    }
    return [];
  })();

  const fallbackRecord = { ...normalizeSetupRecord({}), activeStatus: "—" };
  const displayRecords = records.length > 0 ? records : [fallbackRecord];

  return (
    <SectionCard icon={Settings} title="Partner Setup Details">
      <div className="partner-setup-table-wrapper">
        <div className="partner-table">
          <SetupTableHeader />
          <div className="partner-table-body">
            {displayRecords.map((record, index) => (
              <SetupTableRow key={`${record.srceSysKeyId || "setup"}-${index}`} record={record} />
            ))}
          </div>
        </div>
      </div>

      {records.length > 0 && (
        <div className="partner-table-footer">
          <div className="partner-table-record-count">
            <span className="partner-record-count-dot" />
            <span>
              {records.length} Source System Key{records.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="partner-table-footer-hint">Hover a source key to view full setup details</span>
        </div>
      )}
    </SectionCard>
  );
}

export default SetupConfigDetails;