"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface VitalSignsCardProps {
  title: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  normalRange?: string;
  icon?: React.ReactNode;
  lastUpdate?: Date;
  patientId?: string;
  vitalType?: string;
  onFlagAsAE?: (patientId: string, vitalType: string, value: string) => void;
}

export function VitalSignsCard({
  title,
  value,
  unit,
  status,
  trend,
  normalRange,
  icon,
  lastUpdate,
  patientId,
  vitalType,
  onFlagAsAE
}: VitalSignsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatValue = () => {
    if (typeof value === 'number') {
      if (unit === '°F') {
        return value.toFixed(1);
      }
      return value.toString();
    }
    return value;
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue()}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {normalRange && (
        <div className="text-xs text-gray-600 mb-1">
          Normal: {normalRange}
        </div>
      )}

      {lastUpdate && (
        <div className="text-xs text-gray-500">
          Last: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Flag as AE Button */}
      {patientId && vitalType && onFlagAsAE && (
        <button
          onClick={() => onFlagAsAE(patientId, vitalType, `${formatValue()}${unit}`)}
          className="mt-2 w-full px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
        >
          ⚠️ Flag as Adverse Event
        </button>
      )}
    </div>
  );
}

// Specialized blood pressure card
interface BloodPressureCardProps {
  systolic: number;
  diastolic: number;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  normalRange: { systolic: { min: number; max: number }; diastolic: { min: number; max: number } };
  lastUpdate?: Date;
  patientId?: string;
  onFlagAsAE?: (patientId: string, vitalType: string, value: string) => void;
}

export function BloodPressureCard({
  systolic,
  diastolic,
  status,
  trend,
  normalRange,
  lastUpdate,
  patientId,
  onFlagAsAE
}: BloodPressureCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Blood Pressure</h3>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {systolic}/{diastolic}
        </span>
        <span className="text-sm text-gray-500">mmHg</span>
      </div>

      <div className="text-xs text-gray-600 mb-1">
        Normal: {normalRange.systolic.min}-{normalRange.systolic.max}/{normalRange.diastolic.min}-{normalRange.diastolic.max} mmHg
      </div>

      {lastUpdate && (
        <div className="text-xs text-gray-500">
          Last: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Flag as AE Button */}
      {patientId && onFlagAsAE && (
        <button
          onClick={() => onFlagAsAE(patientId, 'blood_pressure', `${systolic}/${diastolic} mmHg`)}
          className="mt-2 w-full px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
        >
          ⚠️ Flag as Adverse Event
        </button>
      )}
    </div>
  );
}
