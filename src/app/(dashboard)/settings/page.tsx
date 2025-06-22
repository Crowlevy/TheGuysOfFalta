"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  badges: boolean;
};

type DisplaySettings = {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en';
  timeFormat: '12h' | '24h';
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    badges: true,
  });
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: 'system',
    language: 'pt-BR',
    timeFormat: '24h',
  });

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleDisplaySettingChange = (
    setting: keyof DisplaySettings,
    value: string
  ) => {
    setDisplaySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: notificationSettings,
          display: displaySettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Configurações</h1>
        <p className="text-neutral-600">Personalize sua experiência no sistema</p>
      </div>

      <div className="grid gap-8">
        {/* Notificações */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900">Notificações</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Gerencie como você deseja receber notificações do sistema
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Notificações por Email</h3>
                <p className="text-sm text-neutral-600">
                  Receba atualizações importantes por email
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                  notificationSettings.email ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.email ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Notificações Push</h3>
                <p className="text-sm text-neutral-600">
                  Receba notificações em tempo real no navegador
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                  notificationSettings.push ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.push ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Notificações de Conquistas</h3>
                <p className="text-sm text-neutral-600">
                  Seja notificado quando ganhar novas conquistas
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange('badges')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                  notificationSettings.badges ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notificationSettings.badges ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Exibição */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-medium text-neutral-900">Exibição</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Personalize como o sistema é exibido para você
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-neutral-900">
                Tema
              </label>
              <select
                id="theme"
                value={displaySettings.theme}
                onChange={(e) => handleDisplaySettingChange('theme', e.target.value)}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-neutral-900">
                Idioma
              </label>
              <select
                id="language"
                value={displaySettings.language}
                onChange={(e) => handleDisplaySettingChange('language', e.target.value)}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-neutral-900">
                Formato de Hora
              </label>
              <select
                id="timeFormat"
                value={displaySettings.timeFormat}
                onChange={(e) => handleDisplaySettingChange('timeFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="12h">12 horas (AM/PM)</option>
                <option value="24h">24 horas</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 