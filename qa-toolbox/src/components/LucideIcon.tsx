import React from 'react';
import {
  User,
  Minimize2,
  ShieldAlert,
  Braces,
  CreditCard,
  Globe,
  Calendar,
  Wrench,
  Search,
  Sun,
  Moon,
  Star,
  History,
  Copy,
  Check,
  Download,
  Terminal,
  Trash2,
  Info,
  X,
  ExternalLink,
  Zap,
  Hash,
  Menu,
  ChevronRight,
  BookOpen,
  Keyboard,
  Compass
} from 'lucide-react';

const icons = {
  User,
  Minimize2,
  ShieldAlert,
  Braces,
  CreditCard,
  Globe,
  Calendar,
  Wrench,
  Search,
  Sun,
  Moon,
  Star,
  History,
  Copy,
  Check,
  Download,
  Terminal,
  Trash2,
  Info,
  X,
  ExternalLink,
  Zap,
  Hash,
  Menu,
  ChevronRight,
  BookOpen,
  Keyboard,
  Compass
};

export type IconName = keyof typeof icons;

interface LucideIconProps extends React.ComponentProps<'svg'> {
  name: IconName | string;
  size?: number;
  className?: string;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, size = 18, className, ...props }) => {
  const IconComponent = icons[name as IconName] || Terminal;
  return <IconComponent size={size} className={className} {...props} />;
};
