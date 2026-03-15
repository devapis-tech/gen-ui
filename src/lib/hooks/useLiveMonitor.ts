"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LiveMonitorState, VitalsData, VitalAlert, MonitorConnection } from "@/types/vitals";

// Mock data generator for demonstration
const generateMockVitals = (): VitalsData => ({
  heartRate: {
    value: 72 + Math.floor(Math.random() * 20) - 10,
    unit: 'bpm',
    status: 'normal',
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    normalRange: { min: 60, max: 100 }
  },
  bloodPressure: {
    systolic: 120 + Math.floor(Math.random() * 20) - 10,
    diastolic: 80 + Math.floor(Math.random() * 10) - 5,
    unit: 'mmHg',
    status: 'normal',
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    normalRange: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } }
  },
  spo2: {
    value: 98 + Math.floor(Math.random() * 4) - 2,
    unit: '%',
    status: 'normal',
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    normalRange: { min: 95, max: 100 }
  },
  temperature: {
    value: 98.6 + (Math.random() * 2 - 1),
    unit: '°F',
    status: 'normal',
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    normalRange: { min: 97.0, max: 99.5 }
  },
  respiratoryRate: {
    value: 16 + Math.floor(Math.random() * 4) - 2,
    unit: 'bpm',
    status: 'normal',
    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    normalRange: { min: 12, max: 20 }
  }
});

const generateMockAlerts = (vitals: VitalsData): VitalAlert[] => {
  const alerts: VitalAlert[] = [];
  
  if (vitals.heartRate.value > vitals.heartRate.normalRange.max) {
    alerts.push({
      id: `alert-${Date.now()}-hr`,
      patientId: 'mock-patient',
      timestamp: new Date(),
      type: 'heart_rate',
      severity: 'warning',
      message: 'Heart rate elevated',
      currentValue: vitals.heartRate.value,
      normalRange: `${vitals.heartRate.normalRange.min}-${vitals.heartRate.normalRange.max} bpm`,
      acknowledged: false
    });
  }
  
  return alerts;
};

export function useLiveMonitor(patientId?: string) {
  const [state, setState] = useState<LiveMonitorState>({
    vitals: generateMockVitals(),
    alerts: [],
    connection: {
      status: 'disconnected',
      lastUpdate: new Date(),
      method: 'polling'
    },
    loading: true,
    error: undefined
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateVitals = useCallback((newVitals: VitalsData) => {
    setState(prev => {
      const newAlerts = generateMockAlerts(newVitals);
      return {
        ...prev,
        vitals: newVitals,
        alerts: [...newAlerts, ...prev.alerts].slice(0, 50), // Keep only last 50 alerts
        connection: {
          ...prev.connection,
          lastUpdate: new Date(),
          status: 'connected'
        },
        loading: false,
        error: undefined
      };
    });
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!patientId) return;

    try {
      // In production, this would be a real WebSocket connection
      // const ws = new WebSocket(`ws://localhost:3000/ws/monitor/${patientId}`);
      
      // For demo, we'll simulate WebSocket with polling
      setState(prev => ({
        ...prev,
        connection: {
          ...prev.connection,
          status: 'connected',
          method: 'websocket'
        }
      }));
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      fallbackToPolling();
    }
  }, [patientId]);

  const fallbackToPolling = useCallback(() => {
    setState(prev => ({
      ...prev,
      connection: {
        ...prev.connection,
        status: 'connected',
        method: 'polling'
      }
    }));

    // Start polling every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      updateVitals(generateMockVitals());
    }, 30000);

    // Initial update
    updateVitals(generateMockVitals());
  }, [updateVitals]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setState(prev => ({
      ...prev,
      connection: {
        ...prev.connection,
        status: 'disconnected'
      }
    }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date(), acknowledgedBy: 'current-user' }
          : alert
      )
    }));
  }, []);

  useEffect(() => {
    if (!patientId) {
      disconnect();
      return;
    }

    // Start connection
    connectWebSocket();

    // For demo, start with immediate update and then polling
    setTimeout(() => {
      updateVitals(generateMockVitals());
    }, 1000);

    pollingIntervalRef.current = setInterval(() => {
      updateVitals(generateMockVitals());
    }, 5000); // Update every 5 seconds for demo

    return () => {
      disconnect();
    };
  }, [patientId, connectWebSocket, disconnect, updateVitals]);

  return {
    ...state,
    acknowledgeAlert,
    disconnect,
    reconnect: connectWebSocket
  };
}
