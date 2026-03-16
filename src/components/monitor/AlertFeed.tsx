"use client";

import { useState } from 'react';
import { AlertTriangle, XCircle, CheckCircle, Clock, User } from 'lucide-react';
import { VitalAlert } from '@/types/vitals';

interface AlertFeedProps {
  alerts: VitalAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  maxAlerts?: number;
}

export function AlertFeed({ alerts, onAcknowledgeAlert, maxAlerts = 10 }: AlertFeedProps) {
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'critical'>('all');
  
  const filteredAlerts = alerts
    .filter(alert => {
      if (filter === 'unacknowledged') return !alert.acknowledged;
      if (filter === 'critical') return alert.severity === 'critical';
      return true;
    })
    .slice(0, maxAlerts);

  const getSeverityIcon = (severity: 'warning' | 'critical') => {
    return severity === 'critical' 
      ? <XCircle className="w-4 h-4 text-red-600" />
      : <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const getSeverityColor = (severity: 'warning' | 'critical') => {
    return severity === 'critical'
      ? 'border-l-red-500 bg-red-50'
      : 'border-l-yellow-500 bg-yellow-50';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Alert Feed</h2>
          <span className="text-sm text-gray-500">
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unacknowledged')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === 'unacknowledged'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Unacknowledged
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === 'critical'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Critical
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">No alerts</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-l-4 transition-all ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-medium text-gray-900 capitalize">
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                      
                      <div>
                        Value: {alert.currentValue} (Normal: {alert.normalRange})
                      </div>
                    </div>
                    
                    {alert.acknowledged && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                        <User className="w-3 h-3" />
                        <span>
                          Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt?.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="ml-4 px-3 py-1 text-xs bg-accent text-white rounded-md bg-accent-hover transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
