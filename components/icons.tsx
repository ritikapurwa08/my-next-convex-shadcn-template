// components/icons.tsx
import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export const DashboardIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    dashboard
  </span>
);

export const QuizIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    quiz
  </span>
);

export const HistoryIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    history
  </span>
);

export const SettingsAppIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    settings_applications
  </span>
);

export const AnalyticsIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    analytics
  </span>
);

export const AccountCircleIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    account_circle
  </span>
);

export const SettingsIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    settings
  </span>
);

export const LogoutIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    logout
  </span>
);

export const HistoryEduIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    history_edu
  </span>
);

export const PaletteIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    palette
  </span>
);

export const LandscapeIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    landscape
  </span>
);

export const AccountBalanceIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    account_balance
  </span>
);

export const MapIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    map
  </span>
);

export const PsychologyIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    psychology
  </span>
);

export const ArrowForwardIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    arrow_forward
  </span>
);

export const CheckCircleIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    check_circle
  </span>
);

export const BookmarkIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    bookmark
  </span>
);

export const EmojiEventsIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    emoji_events
  </span>
);

// components/icons.tsx (इनको मौजूदा फाइल में नीचे जोड़ें)

export const FileUploadIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    cloud_upload
  </span>
);

export const AddIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    add
  </span>
);

export const CategoryIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    category
  </span>
);

export const AutoAwesomeIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    auto_awesome
  </span>
);

export const RocketLaunchIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    rocket_launch
  </span>
);

export const ContentCopyIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    content_copy
  </span>
);

export const PublishIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    publish
  </span>
);

export const VisibilityIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    visibility
  </span>
);

export const JsonIcon = ({ className = "", ...props }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>
    data_object
  </span>
);
