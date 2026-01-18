"use client";

import React, { useState } from 'react';
import { Plus, Calendar, Target, CheckCircle, Circle, Flame, Trophy, BarChart3, Settings, Home, Search, MoreHorizontal, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HabitFlow() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: 'Boire 2L d\'eau', 
      description: 'Hydratation quotidienne', 
      category: 'health', 
      streak: 12, 
      completed: false, 
      color: 'bg-blue-500',
      timeSlot: '08:00',
      duration: 30,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      timerEnabled: false
    },
    { 
      id: 2, 
      name: 'Faire 30 min d\'exercice', 
      description: 'Sport quotidien', 
      category: 'fitness', 
      streak: 8, 
      completed: true, 
      color: 'bg-green-500',
      timeSlot: '07:00',
      duration: 30,
      selectedDays: [1, 2, 3, 4, 5],
      timerEnabled: true
    },
    { 
      id: 3, 
      name: 'Méditer 10 minutes', 
      description: 'Pleine conscience', 
      category: 'wellness', 
      streak: 15, 
      completed: false, 
      color: 'bg-purple-500',
      timeSlot: '09:00',
      duration: 10,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      timerEnabled: true
    },
    { 
      id: 4, 
      name: 'Lire 20 pages', 
      description: 'Lecture quotidienne', 
      category: 'learning', 
      streak: 6, 
      completed: false, 
      color: 'bg-orange-500',
      timeSlot: '20:00',
      duration: 30,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      timerEnabled: false
    },
    { 
      id: 5, 
      name: 'Écrire dans mon journal', 
      description: 'Réflexion quotidienne', 
      category: 'wellness', 
      streak: 4, 
      completed: false, 
      color: 'bg-pink-500',
      timeSlot: '21:00',
      duration: 15,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      timerEnabled: false
    },
    { 
      id: 6, 
      name: 'Prendre mes vitamines', 
      description: 'Suppléments quotidiens', 
      category: 'health', 
      streak: 20, 
      completed: true, 
      color: 'bg-yellow-500',
      timeSlot: '08:30',
      duration: 5,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
      timerEnabled: false
    }
  ]);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Réviser le projet', 
      category: 'work', 
      priority: 'high', 
      completed: false,
      timeSlot: '10:00',
      duration: 60,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: true
    },
    { 
      id: 2, 
      title: 'Appeler le médecin', 
      category: 'personal', 
      priority: 'medium', 
      completed: false,
      timeSlot: '14:00',
      duration: 15,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: false
    },
    { 
      id: 3, 
      title: 'Préparer la présentation', 
      category: 'work', 
      priority: 'high', 
      completed: false,
      timeSlot: '15:00',
      duration: 90,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: true
    },
    { 
      id: 4, 
      title: 'Faire les courses', 
      category: 'personal', 
      priority: 'low', 
      completed: true,
      timeSlot: '18:00',
      duration: 45,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: false
    },
    { 
      id: 5, 
      title: 'Répondre aux emails', 
      category: 'work', 
      priority: 'medium', 
      completed: false,
      timeSlot: '11:00',
      duration: 30,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: false
    },
    { 
      id: 6, 
      title: 'Réserver le restaurant', 
      category: 'personal', 
      priority: 'low', 
      completed: false,
      timeSlot: '16:00',
      duration: 10,
      dueDate: new Date().toISOString().split('T')[0],
      timerEnabled: false
    }
  ]);
  
  // Timer states
  const [activeTimer, setActiveTimer] = useState<any>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInterval, setClockInterval] = useState<NodeJS.Timeout | null>(null);
  const [notifiedItems, setNotifiedItems] = useState<Set<string>>(new Set());
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [analyticsView, setAnalyticsView] = useState('month');
  
  // View states
  const [resumeView, setResumeView] = useState<'week' | 'month'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'habit' | 'task'>('habit');
  const [modalType, setModalType] = useState<'habit' | 'task'>('habit');

  const toggleHabit = (habitId: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = !habit.completed;
        return {
          ...habit,
          completed: isCompleted,
          streak: isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Fonctions spécifiques pour marquer comme terminé depuis le timer
  const completeHabit = (habitId: number) => {
    console.log('📋 Marking habit as completed:', habitId);
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === habitId) {
        console.log('✅ Found habit, updating:', habit.name);
        return {
          ...habit,
          completed: true,
          streak: habit.completed ? habit.streak : habit.streak + 1
        };
      }
      return habit;
    }));
  };

  const completeTask = (taskId: number) => {
    console.log('✅ Marking task as completed:', taskId);
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        console.log('✅ Found task, updating:', task.title);
        return {
          ...task,
          completed: true
        };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getCompletionRate = () => {
    const completedHabits = habits.filter(h => h.completed).length;
    return habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  };

  const getTotalStreak = () => {
    return habits.reduce((sum, habit) => sum + habit.streak, 0);
  };

  // Fonctions pour les statistiques annuelles
  const getYearlyData = () => {
    const currentYear = new Date().getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(currentYear, month).toLocaleDateString('fr-FR', { month: 'long' });
      
      // Simulation de données pour l'exemple - dans une vraie app, ces données viendraient d'une base de données
      const scheduledHabits = habits.length * Math.floor(new Date(currentYear, month + 1, 0).getDate()); // nombre de jours dans le mois
      const completedHabits = Math.floor(scheduledHabits * (0.6 + Math.random() * 0.3)); // taux de réussite simulé
      
      const scheduledTasks = Math.floor(10 + Math.random() * 20); // nombre de tâches simulé
      const completedTasks = Math.floor(scheduledTasks * (0.5 + Math.random() * 0.4));
      
      const habitSuccessRate = scheduledHabits > 0 ? (completedHabits / scheduledHabits) * 100 : 0;
      const taskSuccessRate = scheduledTasks > 0 ? (completedTasks / scheduledTasks) * 100 : 0;
      
      months.push({
        month: monthName,
        monthIndex: month,
        habits: {
          scheduled: scheduledHabits,
          completed: completedHabits,
          successRate: habitSuccessRate
        },
        tasks: {
          scheduled: scheduledTasks,
          completed: completedTasks,
          successRate: taskSuccessRate
        },
        overallSuccessRate: (habitSuccessRate + taskSuccessRate) / 2
      });
    }
    
    return months;
  };

  const getProgressionTrend = (data: any[]) => {
    if (data.length < 2) return 'stable';
    
    const recentAverage = data.slice(-3).reduce((sum, item) => sum + item.overallSuccessRate, 0) / 3;
    const previousAverage = data.slice(-6, -3).reduce((sum, item) => sum + item.overallSuccessRate, 0) / 3;
    
    if (recentAverage > previousAverage + 5) return 'progression';
    if (recentAverage < previousAverage - 5) return 'regression';
    return 'stable';
  };

  // Fonctions pour le timer et les sons
  const playSound = (type: string) => {
    // Création des sons marins avec Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const createMarineSound = (frequency: number, duration: number, type: string) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(type) {
        case 'start': // Son de corne de brume - démarrage
          oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          break;
        case 'tick': // Son de cloche marine - validation
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          break;
        case 'end': // Son de sirène - fin de timer
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2);
          oscillator.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 0.4);
          oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.6);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          duration = 0.8;
          break;
        case 'complete': // Son de corne grave - validation finale
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          break;
      }
      
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch(type) {
      case 'start':
        createMarineSound(120, 1.2, 'start');
        break;
      case 'tick':
        createMarineSound(800, 0.3, 'tick');
        break;
      case 'end':
        createMarineSound(400, 0.8, 'end');
        break;
      case 'complete':
        createMarineSound(200, 1.0, 'complete');
        break;
    }
  };

  const showNotification = (title: string, body: string, options: any = {}) => {
    console.log('🔔 Attempting to show notification:', title, body);
    console.log('🔍 Notification permission:', Notification.permission);
    
    if (!('Notification' in window)) {
      console.log('❌ Notifications not supported by this browser');
      return;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Permission granted, creating notification');
      try {
        const notification = new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="80">🎉</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="80">⏰</text></svg>',
          ...options
        });
        console.log('🎉 Notification created successfully:', notification);
        
        // Auto-fermer après 5 secondes
        setTimeout(() => {
          notification.close();
        }, 5000);
        
      } catch (error) {
        console.error('❌ Error creating notification:', error);
      }
    } else if (Notification.permission === 'denied') {
      console.log('❌ Notifications are denied');
      // Fallback: utiliser une alerte simple
      alert(`${title}\n${body}`);
    } else {
      console.log('🤔 Requesting notification permission');
      Notification.requestPermission().then(permission => {
        console.log('📝 Permission response:', permission);
        if (permission === 'granted') {
          console.log('✅ Permission granted after request, retrying notification');
          showNotification(title, body, options); // Retry
        } else {
          console.log('❌ Permission denied after request');
          // Fallback: utiliser une alerte simple
          alert(`${title}\n${body}`);
        }
      }).catch(error => {
        console.error('❌ Error requesting permission:', error);
        alert(`${title}\n${body}`);
      });
    }
  };

  const startTimer = (item: any) => {
    if (isTimerRunning) {
      stopTimer();
    }

    const duration = (item.duration || 30) * 60; // Conversion en secondes
    setActiveTimer(item);
    setTimeRemaining(duration);
    setIsTimerRunning(true);
    
    // Son de démarrage
    playSound('start');
    
    // Notification de démarrage
    showNotification(
      `🏁 Timer démarré`,
      `${item.name || item.title} - ${item.duration || 30} minutes`,
      { tag: 'timer-start' }
    );

    // Intervalle du timer
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer terminé
          clearInterval(interval);
          setIsTimerRunning(false);
          
          // Série de notifications et sons d'alerte
          const triggerAlertSeries = () => {
            let alertCount = 0;
            const maxAlerts = 5; // 5 notifications répétées
            
            const alertInterval = setInterval(() => {
              alertCount++;
              
              // Son d'alerte de plus en plus insistant
              playSound('end');
              
              // Notification avec urgence croissante
              showNotification(
                `🚨 TIMER TERMINÉ ! (${alertCount}/${maxAlerts})`,
                `${item.name || item.title} est terminé ! Cliquez pour marquer comme fait.`,
                { 
                  tag: `timer-alert-${alertCount}`,
                  requireInteraction: true,
                  silent: false,
                  vibrate: [200, 100, 200, 100, 200], // Vibration si supportée
                  actions: [
                    { action: 'complete', title: '✅ Marquer comme terminé' },
                    { action: 'restart', title: '🔄 Recommencer' },
                    { action: 'snooze', title: '😴 Reporter 5min' }
                  ]
                }
              );
              
              // Arrêter après 5 alertes ou si plus de timer actif
              if (alertCount >= maxAlerts || !item) {
                clearInterval(alertInterval);
                setActiveTimer(null);
              }
            }, 10000); // Une alerte toutes les 10 secondes
          };
          
          // Démarrer la série d'alertes
          triggerAlertSeries();
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
    setActiveTimer(null);
    setTimeRemaining(0);
    
    // Son d'arrêt
    playSound('tick');
  };

  const completeTimer = () => {
    if (activeTimer) {
      console.log('🏁 Completing timer for:', activeTimer.name || activeTimer.title);
      console.log('🔍 Active timer object:', activeTimer);
      
      // Marquer comme terminé avec les fonctions spécifiques
      if (activeTimer.streak !== undefined) {
        // C'est une habitude
        console.log('📋 Completing habit:', activeTimer.id);
        completeHabit(activeTimer.id);
      } else {
        // C'est une tâche
        console.log('✅ Completing task:', activeTimer.id);
        completeTask(activeTimer.id);
      }
      
      // Son de validation
      playSound('complete');
      
      // Notification de validation visible
      showNotification(
        `🎉 Bravo !`,
        `${activeTimer.name || activeTimer.title} marquée comme terminée !`,
        { 
          tag: 'timer-complete',
          requireInteraction: false,
          icon: '🎉'
        }
      );
      
      // Feedback visuel supplémentaire (toast interne)
      console.log('✅ Activity completed successfully!');
    } else {
      console.log('❌ No active timer to complete');
    }
    
    // Arrêter le timer
    stopTimer();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fonctions pour la surveillance des heures programmées
  const getCurrentTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const getTodayKey = () => {
    return new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const getTodayFormatted = () => {
    const today = new Date();
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  const getItemKey = (item: any, type: string) => {
    return `${type}-${item.id}-${getTodayKey()}`;
  };

  const isTimeForActivity = (timeSlot: string) => {
    const currentTimeStr = getCurrentTimeString();
    return currentTimeStr === timeSlot;
  };

  const shouldNotifyHabit = (habit: any) => {
    if (!habit.timeSlot) return false;
    
    const today = new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const isScheduledToday = habit.selectedDays && habit.selectedDays.includes(today);
    
    if (!isScheduledToday) return false;
    if (!isTimeForActivity(habit.timeSlot)) return false;
    
    const itemKey = getItemKey(habit, 'habit');
    return !notifiedItems.has(itemKey);
  };

  const shouldNotifyTask = (task: any) => {
    if (!task.timeSlot) return false;
    
    const todayStr = getTodayKey();
    const isScheduledToday = task.dueDate === todayStr;
    
    if (!isScheduledToday) return false;
    if (!isTimeForActivity(task.timeSlot)) return false;
    
    const itemKey = getItemKey(task, 'task');
    return !notifiedItems.has(itemKey);
  };

  const triggerScheduledNotification = (item: any, type: string) => {
    const itemKey = getItemKey(item, type);
    
    // Marquer comme notifié pour éviter les doublons
    setNotifiedItems(prev => new Set([...prev, itemKey]));
    
    const isHabit = type === 'habit';
    const name = isHabit ? item.name : item.title;
    const emoji = isHabit ? '🎯' : '📋';
    const sound = isHabit ? 'start' : 'tick';
    
    // Son d'alerte
    playSound(sound);
    
    if (item.timerEnabled) {
      // Avec timer activé
      showNotification(
        `⏰ ${emoji} Il est ${item.timeSlot} !`,
        `Temps pour ${name} (${item.duration || 30} min)`,
        {
          tag: `scheduled-${itemKey}`,
          requireInteraction: true,
          actions: [
            { action: 'start-timer', title: '▶️ Démarrer le timer' },
            { action: 'mark-done', title: '✅ Marquer comme fait' },
            { action: 'snooze-15', title: '😴 Reporter 15 min' }
          ],
          data: { item, type } // Passer les données pour les actions
        }
      );
    } else {
      // Sans timer
      showNotification(
        `⏰ ${emoji} Il est ${item.timeSlot} !`,
        `N'oubliez pas : ${name}`,
        {
          tag: `scheduled-${itemKey}`,
          requireInteraction: true,
          actions: [
            { action: 'mark-done', title: '✅ Marquer comme fait' },
            { action: 'snooze-15', title: '⏰ Reporter 15 min' },
            { action: 'dismiss', title: '❌ Ignorer' }
          ],
          data: { item, type }
        }
      );
    }
    
    console.log(`⏰ Scheduled notification sent for ${type}: ${name} at ${item.timeSlot}`);
  };

  const checkScheduledActivities = () => {
    // Vérifier les habitudes
    habits.forEach(habit => {
      if (shouldNotifyHabit(habit)) {
        console.log(`🎯 Time for habit: ${habit.name} at ${(habit as any).timeSlot}`);
        triggerScheduledNotification(habit, 'habit');
      }
    });

    // Vérifier les tâches
    tasks.forEach(task => {
      if (shouldNotifyTask(task)) {
        console.log(`📋 Time for task: ${task.title} at ${(task as any).timeSlot}`);
        triggerScheduledNotification(task, 'task');
      }
    });
  };

  const snoozeActivity = (item: any, type: string, minutes: number = 15) => {
    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + minutes);
    const newTimeSlot = `${newTime.getHours().toString().padStart(2, '0')}:${newTime.getMinutes().toString().padStart(2, '0')}`;
    
    if (type === 'habit') {
      setHabits(prev => prev.map(h => 
        h.id === item.id ? { ...h, timeSlot: newTimeSlot } : h
      ));
    } else {
      setTasks(prev => prev.map(t => 
        t.id === item.id ? { ...t, timeSlot: newTimeSlot } : t
      ));
    }
    
    // Retirer de la liste des notifiés pour permettre la re-notification
    const oldItemKey = getItemKey(item, type);
    setNotifiedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(oldItemKey);
      return newSet;
    });
    
    showNotification(
      '😴 Activité reportée',
      `${item.name || item.title} reportée à ${newTimeSlot}`,
      { tag: 'snooze-confirm' }
    );
  };

  // Système de stockage robuste
  const STORAGE_VERSION = '1.0';
  const STORAGE_KEYS = {
    habits: 'habitflow_habits_v1',
    tasks: 'habitflow_tasks_v1',
    backup: 'habitflow_backup',
    version: 'habitflow_version'
  };

  // Fonction de sauvegarde robuste
  const saveToStorage = (key: string, data: any) => {
    try {
      const dataWithMeta = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data: data
      };
      
      localStorage.setItem(key, JSON.stringify(dataWithMeta));
      console.log(`💾 Saved ${key}:`, data.length, 'items');
      
      // Backup de sécurité (gardé séparément)
      if (key === STORAGE_KEYS.habits || key === STORAGE_KEYS.tasks) {
        const backupKey = `${key}_backup`;
        localStorage.setItem(backupKey, JSON.stringify(dataWithMeta));
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error);
      
      // Essayer de nettoyer le localStorage si plein
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.log('🧹 Storage full, cleaning old data...');
        try {
          const dataWithMeta = {
            version: STORAGE_VERSION,
            timestamp: Date.now(),
            data: data
          };
          
          // Nettoyer les anciennes versions
          Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.includes('habitflow') && !storageKey.includes('_v1')) {
              localStorage.removeItem(storageKey);
            }
          });
          
          // Réessayer la sauvegarde
          localStorage.setItem(key, JSON.stringify(dataWithMeta));
          return true;
        } catch (retryError) {
          console.error('❌ Failed to save even after cleanup:', retryError);
          return false;
        }
      }
      return false;
    }
  };

  // Fonction de chargement robuste
  const loadFromStorage = (key: string) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Vérifier si c'est le nouveau format avec métadonnées
      if (parsed.version && parsed.data) {
        console.log(`📱 Loaded ${key} (v${parsed.version}):`, parsed.data.length, 'items');
        return parsed.data;
      } else {
        // Ancien format, migrer
        console.log(`🔄 Migrating ${key} to new format...`);
        saveToStorage(key, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Error loading ${key}:`, error);
      
      // Essayer de charger le backup
      try {
        const backupKey = `${key}_backup`;
        const backup = localStorage.getItem(backupKey);
        if (backup) {
          const parsedBackup = JSON.parse(backup);
          console.log(`🔧 Restored from backup ${backupKey}:`, parsedBackup.data?.length || 0, 'items');
          return parsedBackup.data || parsedBackup;
        }
      } catch (backupError) {
        console.error(`❌ Backup also failed for ${key}:`, backupError);
      }
      
      return null;
    }
  };

  // Charger les données depuis localStorage au démarrage avec robustesse
  React.useEffect(() => {
    console.log('📱 Loading data with robust storage system...');
    
    const savedHabits = loadFromStorage(STORAGE_KEYS.habits);
    const savedTasks = loadFromStorage(STORAGE_KEYS.tasks);
    
    // Charger uniquement si des données existent ET ne sont pas vides
    if (savedHabits && Array.isArray(savedHabits) && savedHabits.length > 0) {
      setHabits(savedHabits);
    }
    
    if (savedTasks && Array.isArray(savedTasks) && savedTasks.length > 0) {
      setTasks(savedTasks);
    }
    
    // Nettoyer les anciennes versions si elles existent
    const oldKeys = ['habitflow_habits', 'habitflow_tasks'];
    oldKeys.forEach(oldKey => {
      if (localStorage.getItem(oldKey)) {
        console.log(`🧹 Removing old storage key: ${oldKey}`);
        localStorage.removeItem(oldKey);
      }
    });
    
    // Sauvegarder la version
    localStorage.setItem(STORAGE_KEYS.version, STORAGE_VERSION);
    
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent (avec debounce)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.habits, habits);
    }, 500); // Attendre 500ms avant de sauvegarder

    return () => clearTimeout(timeoutId);
  }, [habits]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(STORAGE_KEYS.tasks, tasks);
    }, 500); // Attendre 500ms avant de sauvegarder

    return () => clearTimeout(timeoutId);
  }, [tasks]);

  // Sauvegarde automatique toutes les 5 minutes
  React.useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      console.log('💾 Auto-save triggered (5 min interval)');
      saveToStorage(STORAGE_KEYS.habits, habits);
      saveToStorage(STORAGE_KEYS.tasks, tasks);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [habits, tasks]);

  // Fonction d'export pour backup manuel
  const exportData = () => {
    const exportData = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      habits: habits,
      tasks: tasks
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📦 Data exported successfully');
  };

  // Fonction d'import pour restore
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        if (imported.habits && Array.isArray(imported.habits)) {
          setHabits(imported.habits);
          console.log('✅ Imported habits:', imported.habits.length);
        }
        
        if (imported.tasks && Array.isArray(imported.tasks)) {
          setTasks(imported.tasks);
          console.log('✅ Imported tasks:', imported.tasks.length);
        }
        
        alert('✅ Données importées avec succès !');
      } catch (error) {
        console.error('❌ Error importing data:', error);
        alert('❌ Erreur lors de l\'import des données');
      }
    };
    reader.readAsText(file);
  };

  // Demander la permission pour les notifications au chargement
  React.useEffect(() => {
    console.log('🔔 Initializing notifications...');
    
    if (!('Notification' in window)) {
      console.log('❌ This browser does not support notifications');
      return;
    }

    console.log('📋 Current notification permission:', Notification.permission);
    
    if (Notification.permission === 'default') {
      console.log('🤔 Requesting notification permission...');
      Notification.requestPermission().then(permission => {
        console.log('📝 Permission result:', permission);
        if (permission === 'granted') {
          console.log('✅ Notifications enabled!');
          // Test notification
          showNotification(
            '🎉 Notifications activées !',
            'Vous recevrez des alertes quand vos timers se terminent.',
            { tag: 'init-test' }
          );
        } else {
          console.log('❌ Notifications disabled by user');
        }
      }).catch(error => {
        console.error('❌ Error requesting notification permission:', error);
      });
    } else if (Notification.permission === 'granted') {
      console.log('✅ Notifications already enabled');
    } else {
      console.log('❌ Notifications are denied');
    }

    // Gestionnaire d'événements pour les actions de notification
    const handleNotificationAction = (event: any) => {
      console.log('🔔 Notification action triggered:', event.action, event.data);
      
      // Actions du timer existant
      if (event.action === 'complete') {
        completeTimer();
      } else if (event.action === 'restart') {
        if (activeTimer) {
          startTimer(activeTimer);
        }
      } else if (event.action === 'snooze') {
        if (activeTimer) {
          const extendedItem = { ...activeTimer, duration: 5 };
          startTimer(extendedItem);
          showNotification(
            '😴 Timer reporté',
            'Activité reportée de 5 minutes',
            { tag: 'timer-snooze' }
          );
        }
      }
      
      // Nouvelles actions pour les notifications programmées
      else if (event.action === 'start-timer' && event.data) {
        const { item } = event.data;
        console.log('▶️ Starting timer from notification for:', item.name || item.title);
        startTimer(item);
      } else if (event.action === 'mark-done' && event.data) {
        const { item, type } = event.data;
        console.log('✅ Marking as done from notification:', item.name || item.title);
        if (type === 'habit') {
          completeHabit(item.id);
        } else {
          completeTask(item.id);
        }
        showNotification(
          '✅ Activité terminée !',
          `${item.name || item.title} marquée comme terminée`,
          { tag: 'scheduled-complete' }
        );
      } else if (event.action === 'snooze-15' && event.data) {
        const { item, type } = event.data;
        console.log('😴 Snoozing activity for 15 min:', item.name || item.title);
        snoozeActivity(item, type, 15);
      } else if (event.action === 'dismiss') {
        console.log('❌ Notification dismissed');
        // Rien à faire, juste ignorer
      }
    };

    // Écouter les événements de notification (si supportés)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('notificationclick', handleNotificationAction);
    }

    // Nettoyage
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('notificationclick', handleNotificationAction);
      }
    };
  }, [activeTimer]);

  // Surveillance de l'horloge pour les notifications programmées
  React.useEffect(() => {
    console.log('⏰ Starting clock surveillance...');
    
    // Nettoyer les notifiés du jour précédent à minuit
    const resetNotificationsAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log('🌅 New day! Resetting notifications...');
        setNotifiedItems(new Set());
        resetNotificationsAtMidnight(); // Programmer le prochain reset
      }, timeUntilMidnight);
    };
    
    resetNotificationsAtMidnight();
    
    // Vérifier chaque minute s'il y a des activités programmées
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
      checkScheduledActivities();
    }, 60000); // Vérifier chaque minute
    
    setClockInterval(clockTimer);
    
    // Vérification immédiate au démarrage
    checkScheduledActivities();
    
    // Nettoyage
    return () => {
      if (clockTimer) {
        clearInterval(clockTimer);
      }
      setClockInterval(null);
    };
  }, [habits, tasks, notifiedItems]); // Re-exécuter si habits/tasks changent

  // Composant Timer flottant
  const TimerWidget = () => {
    if (!activeTimer || !isTimerRunning) return null;

    const progress = ((activeTimer.duration * 60 - timeRemaining) / (activeTimer.duration * 60)) * 100;

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${activeTimer.color} flex items-center justify-center mr-3`}>
                {activeTimer.streak !== undefined ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {activeTimer.name || activeTimer.title}
                </h3>
                <p className="text-xs text-gray-500">Timer en cours</p>
              </div>
            </div>
            <button
              onClick={stopTimer}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <Circle className="w-5 h-5" />
            </button>
          </div>

          {/* Temps restant */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.floor(timeRemaining / 60)} min restantes
            </div>
          </div>

          {/* Barre de progression circulaire */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${progress * 0.88} 88`}
                  className="text-blue-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-2">
            <button
              onClick={stopTimer}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              ⏸️ Pause
            </button>
            <button
              onClick={completeTimer}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
            >
              ✅ Terminé
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ((task as any).description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Fonctions pour le Résumé
  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const currentWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset * 7);
    const monday = new Date(currentWeek);
    monday.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthWeeks = (offset = 0) => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const firstDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1);
    
    const weeks = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getMonth() === targetMonth.getMonth()) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
      
      if (currentDate.getMonth() !== targetMonth.getMonth() && week[6].getMonth() !== targetMonth.getMonth()) {
        break;
      }
    }
    
    return { weeks, monthName: targetMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) };
  };

  const dayNames: { [key: number]: string } = {
    0: 'Dim',
    1: 'Lun',
    2: 'Mar',
    3: 'Mer',
    4: 'Jeu',
    5: 'Ven',
    6: 'Sam'
  };
  
  const dayColors: { [key: number]: string } = {
    0: 'bg-red-500',
    1: 'bg-yellow-500',
    2: 'bg-blue-500',
    3: 'bg-green-500',
    4: 'bg-purple-500',
    5: 'bg-pink-500',
    6: 'bg-orange-500'
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    // Filtrer les habitudes qui ont un timeSlot et qui sont programmées pour ce jour
    const habitItems = habits.filter((h: any) => {
      if (!h.timeSlot) return false;
      if (!h.selectedDays || !Array.isArray(h.selectedDays)) return true; // Si pas de selectedDays, afficher tous les jours
      return h.selectedDays.includes(dayOfWeek);
    }).map((h: any) => ({ ...h, type: 'habit' }));
    
    const taskItems = tasks.filter((t: any) => t.timeSlot && t.dueDate === dateStr).map((t: any) => ({ ...t, type: 'task' }));
    
    return [...habitItems, ...taskItems].sort((a: any, b: any) => a.timeSlot.localeCompare(b.timeSlot));
  };

  const getTaskIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Calendar': Calendar,
      'CheckCircle': CheckCircle,
      'Circle': Circle,
      'Target': Target,
      'BarChart3': BarChart3,
      'Clock': Clock,
      'Settings': Settings,
      'Search': Search,
      'Plus': Plus
    };
    const IconComponent = iconMap[iconName] || CheckCircle;
    return React.createElement(IconComponent, { className: "w-5 h-5 text-white" });
  };

  const getItemIcon = (item: any) => {
    if (item.type === 'habit') {
      return React.createElement(Target, { className: "w-5 h-5 text-white" });
    }
    return getTaskIcon(item.icon || 'CheckCircle');
  };

  // Composant Résumé
  const ResumeView = () => {
    const weekDates = getWeekDates(currentWeekOffset);
    const { weeks, monthName } = getMonthWeeks(currentMonthOffset);
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Résumé - {resumeView === 'week' 
                  ? `Semaine du ${weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${weekDates[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : monthName
                }
              </h2>
              <p className="text-gray-600 mt-1">
                {resumeView === 'week' ? 'Vue hebdomadaire des habitudes et tâches' : 'Vue mensuelle par semaines'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setResumeView('week')}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center ${
                  resumeView === 'week' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hebdo
              </button>
              <button
                onClick={() => setResumeView('month')}
                className={`px-4 py-2 rounded-xl transition-colors flex items-center ${
                  resumeView === 'month' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mois
              </button>
            </div>
          </div>
        </div>

        {resumeView === 'week' ? (

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Calendrier de la semaine</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {weekDates.map((date, index) => (
                  <div key={index} className="space-y-3">
                    <div className={`${dayColors[date.getDay()]} text-white p-3 rounded-xl text-center`}>
                      <div className="font-bold">{dayNames[date.getDay()]}</div>
                      <div className="text-sm">{date.getDate()}</div>
                    </div>
                    
                    <div className="space-y-2 min-h-[200px]">
                      {getItemsForDate(date).map((item, itemIndex) => {
                        const itemColor = item.type === 'habit' ? item.color : 
                          (item.priority === 'high' ? 'bg-red-500' : 
                           item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500');
                        
                        return (
                          <div key={itemIndex} className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <div className={`w-3 h-3 rounded-full ${itemColor}`}></div>
                              <span className="text-xs text-gray-500">{item.timeSlot}</span>
                            </div>
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {item.type === 'habit' ? item.name : item.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.duration || 30}min
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Vue mensuelle</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Semaine {weekIndex + 1} - {week[0].getDate()}/{week[0].getMonth() + 1} au {week[6].getDate()}/{week[6].getMonth() + 1}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {week.map((date, dayIndex) => (
                        <div key={dayIndex} className="text-center">
                          <div className={`${dayColors[date.getDay()]} text-white p-2 rounded text-xs font-medium mb-2`}>
                            {dayNames[date.getDay()]} {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {getItemsForDate(date).slice(0, 3).map((item, itemIndex) => {
                              const itemColor = item.type === 'habit' ? item.color : 
                                (item.priority === 'high' ? 'bg-red-500' : 
                                 item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500');
                              
                              return (
                                <div key={itemIndex} className={`w-4 h-4 rounded-full ${itemColor} mx-auto`}
                                     title={item.type === 'habit' ? item.name : item.title}>
                                </div>
                              );
                            })}
                            {getItemsForDate(date).length > 3 && (
                              <div className="text-xs text-gray-500">+{getItemsForDate(date).length - 3}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DailyPlanningView = () => {
    const today = new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    const todayItems = [
      ...habits.filter(h => {
        // Vérifier si l'habitude a un timeSlot et si elle est programmée pour aujourd'hui
        if (!h.timeSlot) return false;
        if (!h.selectedDays || !Array.isArray(h.selectedDays)) return false;
        return h.selectedDays.includes(today);
      }).map(h => ({ ...h, type: 'habit' })),
      ...tasks.filter(t => t.timeSlot && t.dueDate === getTodayKey()).map(t => ({ ...t, type: 'task' }))
    ].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    const getTimeFromSlot = (timeSlot: string, duration: number = 30) => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const startTime = timeSlot;
      const endHour = Math.floor((hour * 60 + minute + duration) / 60);
      const endMinute = (hour * 60 + minute + duration) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      return { startTime, endTime };
    };

    const getItemColor = (item: any) => {
      if (item.type === 'habit') {
        return item.color;
      }
      // Pour les tâches, utiliser la couleur personnalisée si elle existe, sinon utiliser la couleur basée sur la priorité
      if (item.color) {
        return item.color;
      }
      switch (item.priority) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    const toggleItem = (item: any) => {
      if (item.type === 'habit') {
        toggleHabit(item.id);
      } else {
        toggleTask(item.id);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Planning du jour</h2>
              <p className="text-gray-600 mt-1">Votre journée organisée par créneaux horaires</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setModalType('habit'); setShowAddModal(true); }}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Habitude
              </button>
              <button 
                onClick={() => { setModalType('task'); setShowAddModal(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tâche
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline de la journée</h3>
            
            <div className="space-y-1">
              {todayItems.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun élément planifié pour aujourd'hui</p>
                  <p className="text-sm text-gray-400 mt-1">Ajoutez des habitudes ou des tâches avec des horaires</p>
                </div>
              ) : (
                todayItems.map((item, index) => {
                  const { startTime, endTime } = getTimeFromSlot(
                    item.timeSlot, 
                    item.type === 'task' ? item.duration : (item.duration || 30)
                  );
                  const itemColor = getItemColor(item);
                  
                  return (
                    <div key={`${item.type}-${item.id}`} className="relative">
                      {index < todayItems.length - 1 && (
                        <div className="absolute left-16 top-20 w-0.5 h-6 bg-gray-200"></div>
                      )}
                      
                      <div className={`flex items-start p-4 rounded-xl hover:bg-gray-50 transition-colors ${
                        item.completed ? 'opacity-75' : ''
                      }`}>
                        <div className="w-24 flex-shrink-0">
                          <div className="text-sm font-semibold text-gray-900">{startTime}</div>
                          <div className="text-xs text-gray-500">{endTime}</div>
                        </div>

                        <div className={`w-8 h-8 rounded-full ${itemColor} flex items-center justify-center mr-4 flex-shrink-0`}>
                          {getItemIcon(item)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold text-gray-900 ${
                              item.completed ? 'line-through text-gray-500' : ''
                            }`}>
                              {item.type === 'habit' ? (item as any).name : (item as any).title}
                            </h4>
                            
                            <button
                              onClick={() => toggleItem(item)}
                              className={`p-1.5 rounded-full transition-colors ${
                                item.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                              }`}
                            >
                              {item.completed ? 
                                <CheckCircle className="w-4 h-4" /> : 
                                <Circle className="w-4 h-4" />
                            }
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{(item as any).description}</p>
                          
                          <div className="flex items-center mt-2 space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${ 
                              item.type === 'habit' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.type === 'habit' ? 'Habitude' : 'Tâche'}
                            </span>
                            
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                            
                            {item.type === 'habit' && (
                              <div className="flex items-center text-orange-500">
                                <Flame className="w-3 h-3 mr-1" />
                                <span className="text-xs font-semibold">{(item as any).streak}</span>
                              </div>
                            )}
                            
                            {item.type === 'task' && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor((item as any).priority)}`}>
                                {(item as any).priority}
                              </span>
                            )}
                            
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.type === 'task' ? `${(item as any).duration}min` : `${(item as any).duration || 30}min`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Habitudes</p>
                <p className="font-semibold">{habits.filter(h => h.timeSlot).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tâches du jour</p>
                <p className="font-semibold">{tasks.filter(t => t.dueDate === getTodayKey()).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Complétées</p>
                <p className="font-semibold">{todayItems.filter(item => item.completed).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps total</p>
                <p className="font-semibold">
                  {todayItems.reduce((total, item) => {
                    return total + (item.type === 'task' ? item.duration : (item.duration || 30));
                  }, 0)}min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Taux de réussite</p>
              <p className="text-3xl font-bold">{getCompletionRate()}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Série totale</p>
              <p className="text-3xl font-bold">{getTotalStreak()}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Tâches complétées</p>
              <p className="text-3xl font-bold">{tasks.filter(t => t.completed).length}/{tasks.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Habitudes du jour</h2>
          <button 
            onClick={() => { setModalType('habit'); setShowAddModal(true); }}
            className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`mr-4 p-2 rounded-full transition-colors ${
                  habit.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border-2 border-gray-300 text-transparent hover:border-green-500'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              
              <div className={`w-4 h-4 rounded-full ${habit.color} mr-4`}></div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${habit.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {habit.name}
                </h3>
                <p className="text-sm text-gray-600">{habit.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{habit.category}</span>
                  <div className="flex items-center text-orange-500">
                    <Flame className="w-4 h-4 mr-1" />
                    <span className="text-sm font-semibold">{habit.streak}</span>
                  </div>
                  {habit.timeSlot && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {habit.timeSlot}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{habit.duration || 30}min</span>
                  </div>
                  {habit.timerEnabled && (
                    <button
                      onClick={() => startTimer(habit)}
                      disabled={isTimerRunning}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isTimerRunning 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {isTimerRunning ? '⏳' : '▶️'} Timer
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => openEditModal(habit, 'habit')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tâches récentes</h2>
          <button 
            onClick={() => { setModalType('task'); setShowAddModal(true); }}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mr-4 transition-colors ${
                  task.completed 
                    ? 'text-green-500' 
                    : 'text-gray-400 hover:text-green-500'
                }`}
              >
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500">{task.category}</span>
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.dueDate}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{task.duration || 30}min</span>
                  </div>
                  {task.timerEnabled && (
                    <button
                      onClick={() => startTimer(task)}
                      disabled={isTimerRunning}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isTimerRunning 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {isTimerRunning ? '⏳' : '▶️'} Timer
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => openEditModal(task, 'task')}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Travail">Travail</option>
            <option value="Personnel">Personnel</option>
            <option value="Famille">Famille</option>
          </select>
          <button 
            onClick={() => { setModalType('task'); setShowAddModal(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle tâche
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Toutes les tâches</h2>
        
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
              <button
                onClick={() => toggleTask(task.id)}
                className={`mr-4 transition-colors ${
                  task.completed 
                    ? 'text-green-500' 
                    : 'text-gray-400 hover:text-green-500'
                }`}
              >
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <div className={`w-4 h-4 rounded-full ${(task as any).color || 'bg-gray-500'} mr-4`}></div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{(task as any).description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{task.category}</span>
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.dueDate}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{task.duration || 30}min</span>
                  </div>
                  {task.timerEnabled && (
                    <button
                      onClick={() => startTimer(task)}
                      disabled={isTimerRunning}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isTimerRunning 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {isTimerRunning ? '⏳' : '▶️'} Timer
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => openEditModal(task, 'task')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const HabitsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mes Habitudes</h2>
          <button 
            onClick={() => { setModalType('habit'); setShowAddModal(true); }}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle habitude
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <div key={habit.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${habit.color} flex items-center justify-center`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-2 rounded-full transition-colors ${
                      habit.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white border-2 border-gray-300 text-transparent hover:border-green-500'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(habit, 'habit')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-2">{habit.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-500">
                  <Flame className="w-5 h-5 mr-2" />
                  <span className="font-bold">{habit.streak} jours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{habit.category}</span>
                  {habit.timerEnabled && (
                    <button
                      onClick={() => startTimer(habit)}
                      disabled={isTimerRunning}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isTimerRunning 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {isTimerRunning ? '⏳' : '▶️'} Timer
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                {habit.timeSlot && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {habit.timeSlot}
                  </div>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  <span>{habit.duration || 30}min</span>
                </div>
              </div>
              
              {habit.selectedDays && habit.selectedDays.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">Jours prévus:</span>
                  </div>
                  <div className="flex space-x-1">
                    {[
                      { day: 0, name: 'D' },
                      { day: 1, name: 'L' },
                      { day: 2, name: 'M' },
                      { day: 3, name: 'M' },
                      { day: 4, name: 'J' },
                      { day: 5, name: 'V' },
                      { day: 6, name: 'S' }
                    ].map(({ day, name }) => (
                      <div
                        key={day}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          habit.selectedDays.includes(day)
                            ? `${habit.color} text-white`
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AddModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      color: 'bg-purple-500',
      icon: 'CheckCircle',
      timeSlot: '',
      duration: 30,
      selectedDays: [1, 2, 3, 4, 5], // Lundi à Vendredi par défaut
      timerEnabled: true // Timer activé par défaut
    });

    // Effet pour préremplir le formulaire lors de l'édition
    React.useEffect(() => {
      if (showEditModal && editingItem) {
        if (editType === 'habit') {
          setFormData({
            name: editingItem.name,
            title: '',
            description: editingItem.description,
            category: editingItem.category,
            priority: 'medium',
            dueDate: '',
            color: editingItem.color,
            icon: 'Target',
            timeSlot: editingItem.timeSlot || '',
            duration: editingItem.duration || 30,
            selectedDays: editingItem.selectedDays || [1, 2, 3, 4, 5],
            timerEnabled: editingItem.timerEnabled !== undefined ? editingItem.timerEnabled : true
          });
        } else {
          setFormData({
            name: '',
            title: editingItem.title,
            description: editingItem.description,
            category: editingItem.category,
            priority: editingItem.priority,
            dueDate: editingItem.dueDate || '',
            color: editingItem.color || 'bg-blue-500',
            icon: editingItem.icon || 'CheckCircle',
            timeSlot: editingItem.timeSlot || '',
            duration: editingItem.duration || 30,
            selectedDays: [1, 2, 3, 4, 5], // Pas applicable aux tâches
            timerEnabled: editingItem.timerEnabled !== undefined ? editingItem.timerEnabled : true
          });
        }
      } else {
        setFormData({
          name: '',
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          dueDate: '',
          color: 'bg-purple-500',
          icon: 'CheckCircle',
          timeSlot: '',
          duration: 30,
          selectedDays: [1, 2, 3, 4, 5], // Lundi à Vendredi par défaut
          timerEnabled: true // Timer activé par défaut
        });
      }
    }, [showEditModal, editingItem, editType]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Form validation
      const currentTitle = modalType === 'habit' ? formData.name : formData.title;
      if (!currentTitle || currentTitle.trim().length === 0) {
        alert('Veuillez entrer un nom/titre');
        return;
      }
      
      if (modalType === 'habit' && (!formData.selectedDays || formData.selectedDays.length === 0)) {
        alert('Veuillez sélectionner au moins un jour');
        return;
      }
      
      if (modalType === 'task' && !formData.dueDate) {
        alert('Veuillez sélectionner une date d\'échéance');
        return;
      }
      
      // Generate unique ID with timestamp and random component to avoid collisions
      const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
      };
      
      if (showEditModal && editingItem) {
        // Mode édition
        if (editType === 'habit') {
          const updatedHabit = {
            ...editingItem,
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            color: formData.color,
            timeSlot: formData.timeSlot,
            duration: formData.duration,
            selectedDays: formData.selectedDays,
            timerEnabled: formData.timerEnabled
          };
          updateItem(updatedHabit, 'habit');
        } else {
          const updatedTask = {
            ...editingItem,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            priority: formData.priority,
            dueDate: formData.dueDate,
            color: formData.color,
            icon: formData.icon,
            timeSlot: formData.timeSlot,
            duration: formData.duration,
            timerEnabled: formData.timerEnabled
          };
          updateItem(updatedTask, 'task');
        }
      } else {
        // Mode création
        if (modalType === 'habit') {
          const newHabit = {
            id: generateUniqueId(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            color: formData.color,
            streak: 0,
            completed: false,
            timeSlot: formData.timeSlot,
            duration: formData.duration,
            selectedDays: formData.selectedDays,
            timerEnabled: formData.timerEnabled
          };
          setHabits(prev => [...prev, newHabit]);
        } else {
          const newTask = {
            id: generateUniqueId(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            priority: formData.priority,
            dueDate: formData.dueDate,
            completed: false,
            tags: [],
            color: formData.color,
            icon: formData.icon,
            timeSlot: formData.timeSlot,
            duration: formData.duration,
            timerEnabled: formData.timerEnabled
          };
          setTasks(prev => [...prev, newTask]);
        }
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingItem(null);
    };

    if (!showAddModal && !showEditModal) return null;

    const isEditing = showEditModal && editingItem;
    const currentType = isEditing ? editType : modalType;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">
            {isEditing 
              ? (currentType === 'habit' ? 'Modifier l\'Habitude' : 'Modifier la Tâche')
              : (currentType === 'habit' ? 'Nouvelle Habitude' : 'Nouvelle Tâche')
            }
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentType === 'habit' ? 'Nom de l\'habitude' : 'Titre de la tâche'}
              </label>
              <input
                type="text"
                value={currentType === 'habit' ? formData.name : formData.title}
                onChange={(e) => setFormData({
                  ...formData,
                  [currentType === 'habit' ? 'name' : 'title']: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            {currentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            )}
            
            {currentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horaire</label>
              <input
                type="time"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="5"
                step="5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Timer automatique</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, timerEnabled: !formData.timerEnabled })}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    formData.timerEnabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      formData.timerEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {formData.timerEnabled 
                    ? '✅ Timer activé - Bouton de démarrage affiché'
                    : '❌ Timer désactivé - Pas de bouton de démarrage'
                  }
                </span>
              </div>
            </div>
            
            {currentType === 'habit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Jours de la semaine</label>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: 0, name: 'Dim', fullName: 'Dimanche' },
                    { day: 1, name: 'Lun', fullName: 'Lundi' },
                    { day: 2, name: 'Mar', fullName: 'Mardi' },
                    { day: 3, name: 'Mer', fullName: 'Mercredi' },
                    { day: 4, name: 'Jeu', fullName: 'Jeudi' },
                    { day: 5, name: 'Ven', fullName: 'Vendredi' },
                    { day: 6, name: 'Sam', fullName: 'Samedi' }
                  ].map(({ day, name, fullName }) => {
                    const isSelected = formData.selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const newSelectedDays = isSelected
                            ? formData.selectedDays.filter(d => d !== day)
                            : [...formData.selectedDays, day].sort();
                          setFormData({ ...formData, selectedDays: newSelectedDays });
                        }}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={fullName}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {formData.selectedDays.length === 0 && 'Sélectionnez au moins un jour'}
                  {formData.selectedDays.length === 7 && 'Tous les jours sélectionnés'}
                  {formData.selectedDays.length > 0 && formData.selectedDays.length < 7 && 
                    `${formData.selectedDays.length} jour${formData.selectedDays.length > 1 ? 's' : ''} sélectionné${formData.selectedDays.length > 1 ? 's' : ''}`
                  }
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
              <div className="flex space-x-2">
                {['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-gray-800' : ''}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {isEditing ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Ajouter ces nouvelles fonctions après les fonctions existantes
  const openEditModal = (item: any, type: 'habit' | 'task') => {
    setEditingItem(item);
    setEditType(type);
    setShowEditModal(true);
  };

  const updateItem = (updatedItem: any, type: 'habit' | 'task') => {
    if (type === 'habit') {
      setHabits(habits.map(habit => 
        habit.id === updatedItem.id ? updatedItem : habit
      ));
    } else {
      setTasks(tasks.map(task => 
        task.id === updatedItem.id ? updatedItem : task
      ));
    }
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HabitFlow
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Aujourd'hui</p>
                <p className="text-xs text-gray-500">{getTodayFormatted()}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="lg:w-64 w-full lg:flex-shrink-0">
            <nav className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-8 w-full">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Tableau de bord
                </button>
                
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'resume' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Résumé
                </button>
                
                <button
                  onClick={() => setActiveTab('planning')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'planning' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Planning du jour
                </button>
                
                <button
                  onClick={() => setActiveTab('habits')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'habits' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Target className="w-5 h-5 mr-3" />
                  Habitudes
                </button>
                
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'tasks' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Tâches
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'analytics' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Statistiques
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Paramètres
                </button>
              </div>
            </nav>
          </div>

          <div className="flex-1 w-full min-w-0">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'resume' && <ResumeView />}
            {activeTab === 'planning' && <DailyPlanningView />}
            {activeTab === 'habits' && <HabitsView />}
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* En-tête des statistiques */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Statistiques détaillées</h2>
                      <p className="text-gray-600 mt-1">
                        {analyticsView === 'month' ? 'Analyse mensuelle de vos performances' : 'Progression annuelle par mois'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setAnalyticsView('month')}
                          className={`px-4 py-2 rounded-xl transition-colors ${
                            analyticsView === 'month' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Mensuel
                        </button>
                        <button
                          onClick={() => setAnalyticsView('year')}
                          className={`px-4 py-2 rounded-xl transition-colors ${
                            analyticsView === 'year' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Annuel
                        </button>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vue mensuelle */}
                {analyticsView === 'month' && (
                  <>
                    {/* Métriques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <Target className="w-6 h-6 text-purple-600" />
                          </div>
                          <span className="text-2xl font-bold text-purple-600">{getCompletionRate()}%</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Taux de réussite</h3>
                        <p className="text-sm text-gray-600">Habitudes complétées aujourd'hui</p>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-orange-100 p-3 rounded-lg">
                            <Flame className="w-6 h-6 text-orange-600" />
                          </div>
                          <span className="text-2xl font-bold text-orange-600">{getTotalStreak()}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Série totale</h3>
                        <p className="text-sm text-gray-600">Jours consécutifs cumulés</p>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="text-2xl font-bold text-blue-600">
                            {tasks.filter(t => t.completed).length}/{tasks.length}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Tâches complétées</h3>
                        <p className="text-sm text-gray-600">Sur le total des tâches</p>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {habits.reduce((total, h) => total + (h.duration || 30), 0) + 
                             tasks.reduce((total, t) => total + (t.duration || 30), 0)}min
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Temps planifié</h3>
                        <p className="text-sm text-gray-600">Total des activités</p>
                      </div>
                    </div>

                    {/* Graphiques de progression */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Progression des habitudes */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Progression des habitudes</h3>
                        <div className="space-y-4">
                          {habits.map(habit => {
                            const progressPercent = Math.min((habit.streak / 30) * 100, 100);
                            return (
                              <div key={habit.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                                  <span className="text-sm text-gray-500">{habit.streak}/30 jours</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${habit.color}`}
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Répartition des tâches par priorité */}
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des tâches</h3>
                        <div className="space-y-4">
                          {['high', 'medium', 'low'].map(priority => {
                            const priorityTasks = tasks.filter(t => t.priority === priority);
                            const completedTasks = priorityTasks.filter(t => t.completed);
                            const progressPercent = priorityTasks.length > 0 ? (completedTasks.length / priorityTasks.length) * 100 : 0;
                            const priorityLabel = priority === 'high' ? 'Haute' : priority === 'medium' ? 'Moyenne' : 'Basse';
                            const priorityColor = priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
                            
                            return (
                              <div key={priority} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Priorité {priorityLabel}</span>
                                  <span className="text-sm text-gray-500">{completedTasks.length}/{priorityTasks.length}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${priorityColor}`}
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Aperçu des catégories */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Aperçu par catégories</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Catégories d'habitudes */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Habitudes par catégorie</h4>
                          <div className="space-y-2">
                            {Array.from(new Set(habits.map(h => h.category))).map(category => {
                              const categoryHabits = habits.filter(h => h.category === category);
                              const completedHabits = categoryHabits.filter(h => h.completed);
                              return (
                                <div key={category} className="flex justify-between items-center py-2">
                                  <span className="text-sm text-gray-600">{category}</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {completedHabits.length}/{categoryHabits.length}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Catégories de tâches */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Tâches par catégorie</h4>
                          <div className="space-y-2">
                            {Array.from(new Set(tasks.map(t => t.category))).map(category => {
                              const categoryTasks = tasks.filter(t => t.category === category);
                              const completedTasks = categoryTasks.filter(t => t.completed);
                              return (
                                <div key={category} className="flex justify-between items-center py-2">
                                  <span className="text-sm text-gray-600">{category}</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {completedTasks.length}/{categoryTasks.length}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Résumé global */}
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">Résumé global</h4>
                          <div className="space-y-3">
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <div className="text-sm text-purple-600 mb-1">Habitudes actives</div>
                              <div className="text-lg font-bold text-purple-700">{habits.length}</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm text-blue-600 mb-1">Tâches créées</div>
                              <div className="text-lg font-bold text-blue-700">{tasks.length}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="text-sm text-green-600 mb-1">Éléments complétés</div>
                              <div className="text-lg font-bold text-green-700">
                                {habits.filter(h => h.completed).length + tasks.filter(t => t.completed).length}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conseils et insights */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights et conseils</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl">
                          <h4 className="font-medium text-gray-800 mb-2">🎯 Habitude la plus réussie</h4>
                          <p className="text-sm text-gray-600">
                            {habits.sort((a, b) => b.streak - a.streak)[0]?.name || 'Aucune habitude'} 
                            ({habits.sort((a, b) => b.streak - a.streak)[0]?.streak || 0} jours)
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                          <h4 className="font-medium text-gray-800 mb-2">⚡ Temps moyen par activité</h4>
                          <p className="text-sm text-gray-600">
                            {Math.round((habits.reduce((total, h) => total + (h.duration || 30), 0) + 
                                       tasks.reduce((total, t) => total + (t.duration || 30), 0)) / 
                                       (habits.length + tasks.length))} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Vue annuelle */}
                {analyticsView === 'year' && (
                  <>
                    {/* Résumé annuel */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">Progression annuelle 2025</h3>
                      
                      {/* Indicateurs de tendance */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-green-600 text-sm font-medium">Progression</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">Tendance générale</h4>
                          <p className="text-sm text-gray-600">+12% par rapport au trimestre précédent</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-blue-600 text-sm font-medium">Performance</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">Meilleur mois</h4>
                          <p className="text-sm text-gray-600">Octobre avec 89% de réussite</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                              <Flame className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-purple-600 text-sm font-medium">Constance</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">Série la plus longue</h4>
                          <p className="text-sm text-gray-600">45 jours consécutifs en été</p>
                        </div>
                      </div>

                      {/* Graphique de progression mensuelle */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4">Courbe de progression mensuelle</h4>
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <div className="grid grid-cols-12 gap-2 mb-4">
                            {getYearlyData().map((monthData, index) => {
                              const height = Math.max(20, (monthData.overallSuccessRate / 100) * 120);
                              const isCurrentMonth = index === new Date().getMonth();
                              
                              return (
                                <div key={index} className="flex flex-col items-center">
                                  <div className="text-xs text-gray-500 mb-2 font-medium">
                                    {monthData.month.slice(0, 3)}
                                  </div>
                                  <div className="relative w-full bg-gray-200 rounded-t-lg" style={{ height: '120px' }}>
                                    <div 
                                      className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${
                                        isCurrentMonth ? 'bg-purple-500' : 
                                        monthData.overallSuccessRate >= 70 ? 'bg-green-500' : 
                                        monthData.overallSuccessRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ height: `${height}px` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-700 mt-2 font-medium">
                                    {Math.round(monthData.overallSuccessRate)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center items-center space-x-6 text-xs text-gray-600">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                              Excellence (≥70%)
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                              Bon (50-69%)
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                              À améliorer (&lt;50%)
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                              Mois actuel
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comparaison habitudes vs tâches par mois */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Comparaison Habitudes vs Tâches</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-purple-50 p-6 rounded-xl">
                            <h5 className="font-medium text-purple-900 mb-4">📅 Habitudes - Progression mensuelle</h5>
                            <div className="space-y-3">
                              {getYearlyData().slice(0, 6).map((monthData, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">{monthData.month}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${monthData.habits.successRate}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-purple-700">
                                      {Math.round(monthData.habits.successRate)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-blue-50 p-6 rounded-xl">
                            <h5 className="font-medium text-blue-900 mb-4">✅ Tâches - Progression mensuelle</h5>
                            <div className="space-y-3">
                              {getYearlyData().slice(0, 6).map((monthData, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">{monthData.month}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${monthData.tasks.successRate}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-blue-700">
                                      {Math.round(monthData.tasks.successRate)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analyse détaillée par trimestre */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {[
                        { name: 'T1 2025', months: 'Jan-Mar', color: 'bg-blue-500', performance: 72 },
                        { name: 'T2 2025', months: 'Avr-Juin', color: 'bg-green-500', performance: 78 },
                        { name: 'T3 2025', months: 'Juil-Sep', color: 'bg-orange-500', performance: 84 },
                        { name: 'T4 2025', months: 'Oct-Déc', color: 'bg-purple-500', performance: 76 }
                      ].map((quarter, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${quarter.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                              <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{quarter.performance}%</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{quarter.name}</h4>
                          <p className="text-sm text-gray-600">{quarter.months}</p>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${quarter.color}`}
                                style={{ width: `${quarter.performance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Insights annuels */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analyse annuelle et recommandations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-xl">
                          <h4 className="font-medium text-gray-800 mb-3">🎯 Points forts</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Excellente constance en été</li>
                            <li>• Progression continue sur l'année</li>
                            <li>• Habitudes mieux suivies que les tâches</li>
                          </ul>
                        </div>
                        <div className="bg-white p-5 rounded-xl">
                          <h4 className="font-medium text-gray-800 mb-3">⚠️ Points d'amélioration</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Baisse en période hivernale</li>
                            <li>• Gestion des tâches urgentes</li>
                            <li>• Régularité en début d'année</li>
                          </ul>
                        </div>
                        <div className="bg-white p-5 rounded-xl">
                          <h4 className="font-medium text-gray-800 mb-3">🚀 Objectifs 2026</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Maintenir 80% de réussite</li>
                            <li>• Améliorer la gestion hivernale</li>
                            <li>• Équilibrer habitudes et tâches</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Paramètres & Sauvegarde</h2>
                      <p className="text-gray-600 mt-1">Gérez vos données et préférences</p>
                    </div>
                    <Settings className="w-8 h-8 text-purple-600" />
                  </div>

                  {/* Section Données */}
                  <div className="space-y-6">
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">💾 Gestion des données</h3>
                      
                      {/* Informations sur le stockage */}
                      <div className="bg-blue-50 p-4 rounded-xl mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium text-blue-900">Stockage local actif</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                          <div>
                            <span className="font-medium">Habitudes:</span> {habits.length}
                          </div>
                          <div>
                            <span className="font-medium">Tâches:</span> {tasks.length}
                          </div>
                        </div>
                        <p className="text-xs text-blue-700 mt-2">
                          ✅ Sauvegarde automatique avec backup de sécurité
                        </p>
                      </div>

                      {/* Boutons d'action */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={exportData}
                          className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Exporter mes données
                        </button>
                        
                        <label className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Importer des données
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) importData(file);
                            }}
                          />
                        </label>
                      </div>

                      {/* Informations techniques */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2">🔧 Informations techniques</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Version du stockage: {STORAGE_VERSION}</div>
                          <div>Sauvegarde: Automatique avec debounce (500ms)</div>
                          <div>Backup: Système de récupération intégré</div>
                          <div>Capacité: ~5MB (localStorage)</div>
                        </div>
                      </div>
                    </div>

                    {/* Section Actions dangereuses */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Actions dangereuses</h3>
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <button
                          onClick={() => {
                            if (confirm('⚠️ ATTENTION: Cette action supprimera TOUTES vos données (habitudes et tâches). Cette action est irréversible.\n\nÊtes-vous absolument certain(e) ?')) {
                              if (confirm('🚨 DERNIÈRE CONFIRMATION: Toutes vos données seront perdues définitivement. Continuez-vous ?')) {
                                // Nettoyer toutes les données
                                Object.values(STORAGE_KEYS).forEach(key => {
                                  localStorage.removeItem(key);
                                  localStorage.removeItem(key + '_backup');
                                });
                                
                                // Réinitialiser l'état
                                setHabits([]);
                                setTasks([]);
                                
                                alert('🧹 Toutes les données ont été supprimées.');
                                console.log('🧹 All data cleared by user');
                              }
                            }
                          }}
                          className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                        >
                          🗑️ Supprimer toutes mes données
                        </button>
                        <p className="text-xs text-red-700 mt-2">
                          Cette action supprime définitivement toutes vos habitudes et tâches.
                        </p>
                      </div>
                    </div>

                    {/* Section À propos */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 À propos</h3>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">HabitFlow</h4>
                            <p className="text-sm text-gray-600">Version 1.0.0</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Application de gestion d'habitudes et de tâches avec timer intégré et analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddModal />
      <TimerWidget />
    </div>
  );
}